import JSZip from "jszip";

import {
    SimRenderServer,
    flexEngineFileSystem,
    flexEngineRenderPage
} from "./flexEngine.js";
import { BUILDER_CONFIG } from './utils/config.js';

const SITE_ORIGIN = "https://raysite-export.local";
const ASSET_PREFIX = `/${BUILDER_CONFIG.classPrefix}assets`;

function assertResult(result, label) {
    if (!result || result.code === 1) {
        throw new Error(`${label}: ${result?.error || "unknown error"}`);
    }

    return result.data;
}

function routeToHtmlPath(route) {
    if (route === "/") return "index.html";
    if (route === "404" || route === "/404") return "404.html";

    return `${route.replace(/^\/+|\/+$/g, "")}/index.html`;
}

function routeToPageStylesPath(route) {
    if (route === "/") return `${ASSET_PREFIX}/styles/_.css`;
    if (route === "404" || route === "/404") return `${ASSET_PREFIX}/styles/404.css`;

    const slug = route.replace(/^\/+|\/+$/g, "").replace(/\//g, "_");
    return `${ASSET_PREFIX}/styles/${slug}.css`;
}

function normalizeRoute(pathname) {
    const cleanPath = pathname.replace(/\/+$/, "") || "/";

    if (cleanPath === "/404.html") return "404";
    if (cleanPath.endsWith("/index.html")) {
        const route = cleanPath.slice(0, -"/index.html".length);
        return route || "/";
    }

    return cleanPath;
}

function getHrefInventory(html, route) {
    const documentHTML = new DOMParser().parseFromString(html, "text/html");
    const basePath = route === "/" ? "/" : `${route.replace(/\/$/, "")}/`;
    const links = [];

    documentHTML.querySelectorAll("a[href]").forEach(anchor => {
        const rawHref = anchor.getAttribute("href")?.trim();
        if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) return;

        let url;
        try {
            url = new URL(rawHref, `${SITE_ORIGIN}${basePath}`);
        } catch {
            return;
        }

        links.push({
            source: route,
            href: rawHref,
            target: url.href,
            internal: url.origin === SITE_ORIGIN,
            route: url.origin === SITE_ORIGIN ? normalizeRoute(url.pathname) : null
        });
    });

    return links;
}

function getAssetReferences(html) {
    const documentHTML = new DOMParser().parseFromString(html, "text/html");
    const references = new Set();
    const selectors = [
        "link[href]",
        "script[src]",
        "img[src]",
        "source[src]",
        "video[poster]",
        "audio[src]"
    ];

    documentHTML.querySelectorAll(selectors.join(",")).forEach(element => {
        ["href", "src", "poster"].forEach(attribute => {
            const value = element.getAttribute(attribute);
            if (!value || !value.startsWith(`${ASSET_PREFIX}/`)) return;
            references.add(value.split("#")[0].split("?")[0]);
        });
    });

    return references;
}

async function fetchVirtualAsset(path) {
    const request = new Request(`${SITE_ORIGIN}${path}`);
    const response = await SimRenderServer.fetch(request);

    if (!response.ok) {
        throw new Error(`Simulation failed for ${path}: HTTP ${response.status}`);
    }

    return response.arrayBuffer();
}

async function listProjectAssetPaths() {
    const paths = [];

    for (const category of ["img", "audio", "video"]) {
        const result = await flexEngineFileSystem.listAssets(category);
        const assets = assertResult(result, `Could not list ${category} assets`);

        for (const assetPath of assets) {
            paths.push(`${ASSET_PREFIX}/${category}${assetPath}`);
        }
    }

    return paths;
}

async function renderAndSimulatePage(route) {
    const result = await flexEngineRenderPage(route, null, true, {
        includePageStylesheet: true,
        preserveRuntimeAttributes: false
    });

    if (!Array.isArray(result) || typeof result[0] !== "string" || typeof result[1] !== "string") {
        throw new Error(`Simulation failed for page ${route}: invalid render result`);
    }

    const html = result[0];
    const pageCss = result[1];
    const documentHTML = new DOMParser().parseFromString(html, "text/html");

    if (!documentHTML.querySelector("body") || !documentHTML.title) {
        throw new Error(`Simulation failed for page ${route}: incomplete HTML document`);
    }

    return {
        route,
        html,
        pageCss,
        links: getHrefInventory(html, route),
        assets: getAssetReferences(html)
    };
}

function createManifest({ pages, links, files }) {
    return {
        generator: "RaySite static website exporter",
        generatedAt: new Date().toISOString(),
        pages: pages.map(page => ({
            route: page.route,
            file: routeToHtmlPath(page.route),
            indexable: page.indexable
        })),
        links,
        files
    };
}

export async function inspectWebsiteLinks() {
    const routes = [...new Set(assertResult(
        await flexEngineFileSystem.listPages(),
        "Could not list website pages"
    ))].sort((a, b) => a.localeCompare(b));

    const pages = [];
    const links = [];
    const assets = new Set();

    for (const route of routes) {
        const page = await flexEngineFileSystem.readPage(route);
        const pageData = assertResult(page, `Could not read page ${route}`);
        const rendered = await renderAndSimulatePage(route);

        pages.push({
            ...rendered,
            indexable: pageData.doNotIndex !== true
        });
        links.push(...rendered.links);
        rendered.assets.forEach(path => assets.add(path));
    }

    return {
        pages,
        links,
        assetReferences: assets,
        projectAssets: await listProjectAssetPaths()
    };
}

export async function exportWebsite() {
    const inspection = await inspectWebsiteLinks();
    const knownRoutes = new Set(inspection.pages.map(page => page.route));
    const missingRoutes = inspection.links
        .filter(link => link.internal && !link.route.startsWith(`${ASSET_PREFIX}/`))
        .filter(link => !knownRoutes.has(link.route) && link.route !== "404")
        .map(link => `${link.source} -> ${link.href}`);

    if (missingRoutes.length > 0) {
        throw new Error(`Website has links to missing pages: ${missingRoutes.join(", ")}`);
    }

    const zip = new JSZip();
    const files = new Set();

    const addText = (path, value, type = "text/plain") => {
        zip.file(path.replace(/^\//, ""), value, { binary: false, compression: "DEFLATE" });
        files.add(path.replace(/^\//, ""));
    };

    for (const page of inspection.pages) {
        addText(routeToHtmlPath(page.route), page.html, "text/html");
        addText(routeToPageStylesPath(page.route), page.pageCss, "text/css");
    }

    const requiredAssets = new Set([
        `${ASSET_PREFIX}/styles/main.css`,
        `${ASSET_PREFIX}/styles/theme.css`,
        `${ASSET_PREFIX}/styles/animation.css`,
        `${ASSET_PREFIX}/script/global.js`,
        ...inspection.assetReferences,
        ...inspection.projectAssets
    ]);

    for (const assetPath of requiredAssets) {
        const data = await fetchVirtualAsset(assetPath);
        zip.file(assetPath.replace(/^\//, ""), data, { binary: true, compression: "DEFLATE" });
        files.add(assetPath.replace(/^\//, ""));
    }

    const manifest = createManifest({
        pages: inspection.pages,
        links: inspection.links,
        files: [...files].sort()
    });
    addText("raysite-export-manifest.json", JSON.stringify(manifest, null, 2), "application/json");

    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    const linkSummary = inspection.links.map(link => `${link.source} -> ${link.href}`);
    console.info("[RaySite] Website export link inventory:", linkSummary);

    return {
        blob,
        filename: `raysite_website_${Date.now()}.zip`,
        pages: inspection.pages.map(page => page.route),
        links: inspection.links,
        files: [...files]
    };
}
