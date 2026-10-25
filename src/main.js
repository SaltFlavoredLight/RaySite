import {
    flexEngineFileSystem,
    flexEngineRenderPage
} from "./flexEngine.js";

import { initFiles } from "./init.js";
import { canvas } from "./element.js";

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

    // 1. Register the service worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
        type: "module",
        scope: "/"
    });


    // 2. Wait until the service worker is ready
    await navigator.serviceWorker.ready; // wait for await.
    debugger;

    // 3. THE CATCH: If this initial load wasn't controlled, reload once 
    // so the active service worker intercepts everything from the start.
    if (!navigator.serviceWorker.controller) {
        console.log("[RaySite] Service Worker active. Reloading to take full control...");
        window.location.reload();
        // Return a pending promise to halt further execution during reload
        return new Promise(() => {});
    }

    // 4. Once controlled, establish your MessageChannel connection
    const channel = new MessageChannel();

    const registered = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            channel.port1.close();
            reject(new Error("Engine registration timed out"));
        }, 5000);

        channel.port1.onmessage = ({ data }) => {
            clearTimeout(timeout);
            channel.port1.close();

            if (data?.type === "ENGINE_REGISTERED") {
                resolve();
            } else {
                reject(new Error("Unexpected registration response"));
            }
        };
    });

    navigator.serviceWorker.controller.postMessage(
        { type: "REGISTER_ENGINE" },
        [channel.port2]
    );

    await registered;
    console.log("[RaySite] Engine registered successfully");
}


async function initialize() {
    try {
        // Program 1: Initialize database and project files.
        await initFiles();

        // Program 2: Set up global application variables.
        await initCurrent();

        await initConnection();
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