import {
    flexEngineFileSystem,
    flexEngineRenderPage
} from "./flexEngine.js";

import { initFiles } from "./filerename.js";
import { canvas } from "./element.js";
import { initEditorStyleSheet } from "./editorStyleSheet.js";
import "./ui.js";

import { renderContentLibrary } from './contentLibrary.js';

function initializeContentLibrary() {
    renderContentLibrary({
        target: '[data-ui-panel="contentLibrary"]',

        onSelect(element) {
            console.log('Selected element:', element.key);
            console.log('Category:', element.category);
            console.log('Definition:', element.definition);
        }
    });
}


function waitForCanvasLoad() {
    if (canvas.contentDocument?.readyState === "complete") {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        canvas.addEventListener("load", resolve, { once: true });
        canvas.addEventListener("error", reject, { once: true });
    });
}


function initCurrent() {
    globalThis.Current = {
        pageURL: "/",
        page: {},
        object: {},
        elementID: null
    };

    console.log("[RaySite] Global Current initialized:", Current);
}

async function switchPage(url) {
    try {

        await waitForCanvasLoad();


        // Program 1: Save the current page to its existing route.
        if (Current.page && Object.keys(Current.page).length > 0) {
            const pageJSON = JSON.stringify(Current.page);

            const saveResult = await flexEngineFileSystem.updatePage(
                Current.pageURL,
                pageJSON
            );

            if (!saveResult || saveResult.code === 1) {
                throw new Error("Failed to save the current page.");
            }
        }

        const pageResult = await flexEngineFileSystem.readPage(url);

        if (
            !pageResult ||
            pageResult.code === 1 ||
            !pageResult.data
        ) {
            throw new Error(
                pageResult?.error ||
                `Failed to read page: ${url}`
            );
        }

        // Program 2: Clear the canvas iframe.
        const doc = canvas.contentDocument;

        if (!doc) {
            throw new Error("Canvas iframe document is unavailable.");
        }

        doc.open();
        doc.write("");
        doc.close();

        // Program 3: Render the requested page.
        await flexEngineRenderPage(url, doc, false, {
            includePageStylesheet: false,
            editorMode: true
        });
        initEditorStyleSheet(canvas);

        // Program 4: Update the current page URL.
        Current.pageURL = url;
        Current.page = pageResult.data;
        Current.object = {};
        Current.elementID = null;
        canvas.style.visibility = "visible";

        console.log("[RaySite] Page switched successfully:", url);
    } catch (error) {
        console.error("[RaySite] Page switch failed:", error);
    }
}

window.addEventListener("message", event => {
    if (event.origin !== window.location.origin) return;
    if (event.source !== canvas.contentWindow) return;
    if (event.data?.type !== "RAYSITE_EDITOR_NAVIGATE") return;

    const nextPath = typeof event.data.path === "string"
        ? event.data.path
        : "";
    if (!nextPath.startsWith("/")) return;

    void switchPage(nextPath);
});

// Mirror Vite's CSS HMR behavior for the editor iframe. Stylesheets are
// swapped after load, so the existing document and editor selection survive.
if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", payload => {
        const hasCSSUpdate = payload?.updates?.some(update =>
            typeof update.path === "string" &&
            update.path.toLowerCase().endsWith(".css")
        );

        if (!hasCSSUpdate) return;

        globalThis.Current?.refreshEditorStyles?.();
        canvas.contentWindow?.postMessage(
            { type: "RAYSITE_RELOAD_STYLESHEETS" },
            window.location.origin
        );
    });
}


function registerEngine(worker) {
    const channel = new MessageChannel();

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            channel.port1.close();

            reject(new Error(
                "Engine registration timed out"
            ));
        }, 10000);

        channel.port1.onmessage = ({ data }) => {
            clearTimeout(timeout);
            channel.port1.close();

            if (data?.type === "ENGINE_REGISTERED") {
                console.log(
                    "[RaySite] Engine registered",
                    data.clientId
                );

                resolve();
                return;
            }

            reject(new Error(
                data?.error ||
                "Unexpected registration response"
            ));
        };

        channel.port1.onmessageerror = () => {
            clearTimeout(timeout);
            channel.port1.close();

            reject(new Error(
                "Unreadable registration response"
            ));
        };

        try {
            worker.postMessage(
                { type: "REGISTER_ENGINE" },
                [channel.port2]
            );
        } catch (err) {
            clearTimeout(timeout);
            channel.port1.close();
            reject(err);
        }
    });
}

async function initConnection() {
    if (!("serviceWorker" in navigator)) {
        throw new Error(
            "Service Workers are not supported"
        );
    }

    const registration =
        await navigator.serviceWorker.register(
            "/sw.js",
            {
                type: "module",
                scope: "/"
            }
        );

    await navigator.serviceWorker.ready;

    console.log(
        "[RaySite] SW ready",
        registration.scope
    );

    let controller = navigator.serviceWorker.controller;

    if (!controller) {
        controller = await new Promise(resolve => {
            const timeout = setTimeout(() => {
                cleanup();
                resolve(null);
            }, 5000);

            function cleanup() {
                clearTimeout(timeout);

                navigator.serviceWorker.removeEventListener(
                    "controllerchange",
                    onChange
                );
            }

            function onChange() {
                const next =
                    navigator.serviceWorker.controller;

                if (!next) return;

                cleanup();
                resolve(next);
            }

            navigator.serviceWorker.addEventListener(
                "controllerchange",
                onChange
            );
        });
    }

    if (!controller) {
        const reloadKey = "raysite-sw-reloaded";

        if (sessionStorage.getItem(reloadKey) === "1") {
            throw new Error(
                "Service Worker could not control the page"
            );
        }

        sessionStorage.setItem(reloadKey, "1");
        window.location.reload();
        return false;
    }

    sessionStorage.removeItem("raysite-sw-reloaded");
    await registerEngine(controller);

    navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
            const next =
                navigator.serviceWorker.controller;

            if (next) {
                registerEngine(next).catch(err => {
                    console.error(
                        "[RaySite] Engine re-registration failed",
                        err
                    );
                });
            }
        }
    );

    return true;
}


async function initialize() {
    try {
        initializeContentLibrary();

        // Program 1: Initialize database and project files.
        await initFiles();

        // Program 2: Set up global application variables.
        await initCurrent();

        const connected = await initConnection();

        if (!connected) {
            return;
        }

        await switchPage("/");


        console.log("[RaySite] Startup complete:", Current);
    } catch (error) {
        console.error("[RaySite] Initialization failed:", error);
    } finally {
        document
            .querySelector(".rsapp-loading-cover")
            ?.classList.add("rsapp-loading-cover--hidden");

    }
}

document.addEventListener("DOMContentLoaded", initialize, {
    once: true
});
