'use strict';
import { BUILDER_CONFIG } from './utils/config';

/**
 * Create an header, which is <head>...</head> in HTML, and fill it with the data from dataArray and mainArray.
 * @param {*} documentHTML the document object to manipulate
 * @param {*} dataArray the page's data, including title, description, coverIMG, doNotIndex, etc.
 * @param {*} mainArray main site data, including domain, websiteKeywords, favicon, etc.
 * @returns {Document} the modified documentHTML with updated <head> content
 */
export const flexEngineRenderHTMLHeader = function (
    documentHTML,
    dataArray = {},
    mainArray = {}
) {
    // 1. Validate the document.
    if (!documentHTML?.head ||
        typeof documentHTML.createElement !== "function") {
        throw new TypeError(
            "documentHTML must be a DOM Document with a head element."
        );
    }

    // 2. Safe object fallbacks.
    if (!dataArray || typeof dataArray !== "object") {
        dataArray = {};
    }

    if (!mainArray || typeof mainArray !== "object") {
        mainArray = {};
    }

    const config = typeof BUILDER_CONFIG === "object" && BUILDER_CONFIG !== null
        ? BUILDER_CONFIG
        : {};

    const classPrefix = typeof config.classPrefix === "string"
        ? config.classPrefix.trim()
        : "";

    const domain = typeof mainArray.domain === "string"
        ? mainArray.domain.trim()
        : "";

    const title = typeof dataArray.title === "string" && dataArray.title.trim()
        ? dataArray.title.trim()
        : "Untitled Page";

    const description = typeof dataArray.description === "string"
        ? dataArray.description.trim()
        : "";

    const keywords = Array.isArray(mainArray.websiteKeywords)
        ? mainArray.websiteKeywords.filter(
            value => typeof value === "string" && value.trim()
        )
        : [];

    const coverIMG = typeof dataArray.coverIMG === "string" &&
        dataArray.coverIMG.trim()
        ? dataArray.coverIMG.trim()
        : "";

    const doNotIndex = dataArray.doNotIndex === true;

    // 3. URL helpers.
    const getAbsoluteURL = (path) => {
        if (typeof path !== "string" || !path.trim()) {
            return "";
        }

        return domain + "/" + path;
    };

    // 4. Metadata helper: update an existing tag or create it.
    const setMeta = (attribute, key, content) => {
        if (content === undefined || content === null) {
            content = "";
        }

        const selector = attribute === "property"
            ? `meta[property="${key}"]`
            : `meta[name="${key}"]`;

        let element = documentHTML.head.querySelector(selector);

        if (!element) {
            element = documentHTML.createElement("meta");
            element.setAttribute(attribute, key);
            documentHTML.head.appendChild(element);
        }

        element.setAttribute("content", String(content));
        return element;
    };

    const setLink = (rel, href, id = "") => {
        if (!href) return null;

        let element = id
            ? documentHTML.head.querySelector(`#${id}`)
            : documentHTML.head.querySelector(
                `link[rel="${rel}"]`
            );

        if (!element) {
            element = documentHTML.createElement("link");
            element.setAttribute("rel", rel);

            if (id) {
                element.id = id;
            }

            documentHTML.head.appendChild(element);
        }

        element.setAttribute("href", href);
        return element;
    };

    // 5. Document title.
    documentHTML.title = title;

    // 6. Charset.
    let metaCharset = documentHTML.head.querySelector('meta[charset]');

    if (!metaCharset) {
        metaCharset = documentHTML.createElement("meta");
        documentHTML.head.prepend(metaCharset);
    }

    metaCharset.setAttribute("charset", "UTF-8");

    // 7. Viewport.
    setMeta(
        "name",
        "viewport",
        "width=device-width, initial-scale=1"
    );

    // 8. Description and keywords.
    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords.join(", "));

    // 9. Robots / search indexing.
    setMeta(
        "name",
        "robots",
        doNotIndex ? "noindex, nofollow" : "index, follow"
    );

    // 10. Canonical URL.
    if (domain) {
        const pagePath = typeof dataArray.path === "string"
            ? dataArray.path
            : documentHTML.location?.pathname || "/";

        const canonicalURL = getAbsoluteURL(pagePath);

        if (canonicalURL) {
            setLink("canonical", canonicalURL);
        }
    }

    // 11. Open Graph metadata.
    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);

    if (domain) {
        const pagePath = typeof dataArray.path === "string"
            ? dataArray.path
            : documentHTML.location?.pathname || "/";

        const pageURL = getAbsoluteURL(pagePath);

        if (pageURL) {
            setMeta("property", "og:url", pageURL);
        }
    }

    if (coverIMG) {
        const imageURL = getAbsoluteURL(coverIMG);

        if (imageURL) {
            setMeta("property", "og:image", imageURL);
        }
    }

    // 12. Twitter metadata.
    setMeta(
        "name",
        "twitter:card",
        coverIMG ? "summary_large_image" : "summary"
    );

    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    if (coverIMG) {
        const imageURL = getAbsoluteURL(coverIMG);

        if (imageURL) {
            setMeta("name", "twitter:image", imageURL);
        }
    }

    // 13. Favicon.
    const faviconPath = typeof mainArray.favicon === "string"
        ? mainArray.favicon.trim()
        : "";

    if (faviconPath) {
        const faviconURL = getAbsoluteURL(faviconPath);

        if (faviconURL) {
            setLink("icon", faviconURL);
        }
    }

    // 14. CSS imports.
    const cssList = [
        "/rs-assets/styles/main.css",
        "/rs-assets/styles/theme.css",
        "/rs-assets/styles/animation.css"
    ];

    cssList.forEach(path => {
        const href = path;
        if (!href) return;

        const id = `rs-css-${path
            .replace(/[^a-z0-9]+/gi, "-")
            .replace(/^-|-$/g, "")}`;

        let link = documentHTML.head.querySelector(`#${id}`);

        if (!link) {
            link = documentHTML.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            link.href = href;
            documentHTML.head.appendChild(link);
        }
    });

    // 15. Return the document for optional chaining.
    return documentHTML;
};
