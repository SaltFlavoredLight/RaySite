
import { flexEngineFileSystem } from "./flexEngine.js";

import { initFiles } from "./init.js";


function initCurrent() {
    globalThis.Current = {
        pageURL: "/",
        page: null,
        object: null,
        elementID: null
    };

    console.log("[RaySite] Global Current initialized:", Current);
}


async function initialize() {
    try {
        // Program 1: Initialize database and project files.
        await initFiles();

        // Program 2: Set up global application variables.
        initCurrent();

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
