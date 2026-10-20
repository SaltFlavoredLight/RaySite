import {
    flexEngineFileSystem,
    flexEngineRenderPage
} from "./flexEngine.js";

import { initFiles } from "./init.js";
import { canvas } from "./element.js";




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

        // Program 2: Clear the canvas iframe.
        const doc = canvas.contentDocument;

        if (!doc) {
            throw new Error("Canvas iframe document is unavailable.");
        }

        doc.open();
        doc.write("");
        doc.close();

        // Program 3: Render the requested page.
        await flexEngineRenderPage(url, doc, false);

        // Program 4: Update the current page URL.
        Current.pageURL = url;

        console.log("[RaySite] Page switched successfully:", url);
    } catch (error) {
        console.error("[RaySite] Page switch failed:", error);
    }
}


async function initConnection() {
    if (!("serviceWorker" in navigator)) {
        throw new Error("Service Workers are not supported");
    }

await navigator.serviceWorker.register("/ws.js", {
    type: "module"
});

    await navigator.serviceWorker.ready;

    if (!navigator.serviceWorker.controller) {
        await new Promise(resolve => {
            navigator.serviceWorker.addEventListener(
                "controllerchange",
                resolve,
                { once: true }
            );
        });
    }

    navigator.serviceWorker.controller.postMessage({
        type: "REGISTER_ENGINE"
    });
}

initConnection().catch(console.error);

async function initialize() {
    try {
        // Program 1: Initialize database and project files.
        await initFiles();

        // Program 2: Set up global application variables.
        initCurrent();

        initConnection();


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