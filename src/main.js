
import { flexEngineFileSystem } from "./flexEngine.js";
import { initProject } from "./app.js";

async function initialize() {
    try {
        // #region Init database and project 
        // Step 1: Initialize the database FIRST.
        const initResult = await flexEngineFileSystem.init();

        console.log("[RaySite] Filesystem init result:", initResult);

        if (initResult.code === 1) {
            throw new Error(
                initResult.error || "Filesystem initialization failed."
            );
        }

        // Step 2: Only check pages after the database is initialized.
        const result = await flexEngineFileSystem.listPages();

        console.log("[RaySite] Pages result:", result);

        if (result.code === 1) {
            throw new Error(
                result.error || "Failed to list pages."
            );
        }

        const pages = result.data;

        // Step 3: Create the default project if no pages exist.
        if (!Array.isArray(pages) || pages.length === 0) {
            console.log("[RaySite] No pages found; calling initProject()");

            await initProject();

            console.log("[RaySite] initProject() completed");
        } else {
            console.log("[RaySite] Pages already exist:", pages.length);
        }


        // #endregion

        /* #region global current state */

        globalThis.Current = {
            pageURL: "/",
            page: null,
            object: null,
            elementID: null
        };

        /* #endregion global current state */



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
