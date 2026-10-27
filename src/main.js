import {
    flexEngineFileSystem,
    flexEngineRenderPage,
    flexEngineCreateNode,
    flexEngineDefaultElements,
    flexEngineRootElement,
    BUILDER_CONFIG
} from "./flexEngine.js";

import { initFiles } from "./filerename.js";
import { canvas } from "./element.js";
import { initEditorStyleSheet } from "./editorStyleSheet.js";
import "./ui.js";

import { renderContentLibrary } from './contentLibrary.js';
import initDragDrop, { isSortableEditorElement } from './drag-drop.js';
import { exportWebsite } from './siteExporter.js';
import { EditorView } from './editorView.js';

let editorView = null;

const CURRENT_PAGE_BACKUP_PATH = "/.raysite/current-page-backup.json";
const CURRENT_PAGE_BACKUP_INTERVAL_MS = 10_000;
let currentPageBackupTimer = null;
let currentPageSavePromise = Promise.resolve();

function elementDefinition(type) {
    if (typeof type !== "string") return null;

    const separator = type.indexOf("/");
    if (separator < 1) return null;

    const category = type.slice(0, separator);
    const key = type.slice(separator + 1);

    if (category === "@root") {
        return flexEngineRootElement?.[key] || null;
    }

    return flexEngineDefaultElements?.[category]?.elements?.[key] || null;
}

function elementSettings(data) {
    const definition = elementDefinition(data?.type);
    const separator = data?.type?.indexOf("/");
    const category = separator > 0
        ? data.type.slice(0, separator)
        : null;
    const categorySettings = category === "@root"
        ? null
        : flexEngineDefaultElements?.[category]?.setting;

    return {
        ...(categorySettings || {}),
        ...(definition?.settings || {})
    };
}

function canContainElements(data) {
    return Boolean(
        data &&
        Array.isArray(data.content) &&
        elementSettings(data).allowedSortIn === true
    );
}

function pageObjectNode(documentHTML, data) {
    if (!data || data.id === undefined || data.id === null) return null;

    return documentHTML.querySelector(
        `.${BUILDER_CONFIG.classPrefix}${CSS.escape(String(data.id))}`
    );
}

function elementContentHost(documentHTML, data) {
    const node = pageObjectNode(documentHTML, data);
    if (!node) return null;

    const part = elementSettings(data).elementPart;
    if (typeof part !== "function") return node;

    const parts = part(node);
    const firstPart = Object.keys(parts || {})
        .filter(key => /^\d+$/.test(key))
        .sort((a, b) => Number(a) - Number(b))[0];

    return parts?.[firstPart] || node;
}

function findMainObject(value) {
    if (!value || typeof value !== "object") return null;
    if (value.type === "@root/main") return value;

    for (const child of Object.values(value)) {
        const match = findMainObject(child);
        if (match) return match;
    }

    return null;
}

function addElementFromLibrary(element) {
    const documentHTML = canvas.contentDocument;
    if (!documentHTML || !element?.category || !element?.key) return false;

    const type = `${element.category}/${element.key}`;
    const data = {
        type,
        content: [],
        layout: {},
        appearance: {},
        animation: {}
    };

    const selected = globalThis.Current?.object;
    const parent = globalThis.Current?.parentObject;
    const targetData = canContainElements(selected)
        ? selected
        : canContainElements(parent)
            ? parent
            : findMainObject(globalThis.Current?.page);
    const host = elementContentHost(documentHTML, targetData);

    if (!targetData || !host || !Array.isArray(targetData.content)) {
        console.warn("[RaySite] Select a container before adding an element.");
        return false;
    }

    const node = flexEngineCreateNode(data, documentHTML, true);
    if (!node) return false;

    node.__raySiteData = data;
    host.appendChild(node);
    targetData.content.push(data);
    globalThis.Current.object = data;
    globalThis.Current.parentObject = targetData;
    globalThis.Current.elementID = String(data.id);

    refreshEditorVisuals(documentHTML);
    globalThis.editorDragDrop?.refresh?.();
    void globalThis.saveCurrentPageBackup?.();
    return true;
}


function initializeContentLibrary() {
    return renderContentLibrary({
        target: '[data-ui-panel="contentLibrary"]',

        onSelect(element) {
            addElementFromLibrary(element);
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
        parentObject: null,
        elementID: null
    };

    console.log("[RaySite] Global Current initialized:", Current);
}

/**
 * Keep a small crash-recovery copy of the page currently being edited.
 * Callers intentionally use this as fire-and-forget persistence.
 */
async function saveCurrentPageBackup() {
    const current = globalThis.Current;
    if (!current?.page || Object.keys(current.page).length === 0) return;

    const snapshot = JSON.stringify({
        pageURL: typeof current.pageURL === "string" ? current.pageURL : "/",
        page: current.page,
        savedAt: Date.now()
    });

    // Serialize writes so rapid editor changes cannot overwrite a newer
    // snapshot with an older transaction that finishes later.
    currentPageSavePromise = currentPageSavePromise
        .catch(() => {})
        .then(async () => {
            const backupResult = await flexEngineFileSystem.updateFile(
                CURRENT_PAGE_BACKUP_PATH,
                new Blob([snapshot], { type: "application/json" })
            );

            if (!backupResult || backupResult.code === 1) {
                throw new Error(backupResult?.error || "IndexedDB backup failed.");
            }
        })
        .catch(error => {
            console.warn("[RaySite] Current page backup failed:", error);
        });

    return currentPageSavePromise;
}

function startCurrentPageBackup() {
    if (currentPageBackupTimer !== null) {
        window.clearInterval(currentPageBackupTimer);
    }

    currentPageBackupTimer = window.setInterval(() => {
        void saveCurrentPageBackup();
    }, CURRENT_PAGE_BACKUP_INTERVAL_MS);
}

/** Replace the persisted page file with the last local recovery snapshot. */
async function restoreCurrentPageBackup() {
    try {
        const backupResult = await flexEngineFileSystem.readFile(
            CURRENT_PAGE_BACKUP_PATH
        );
        if (!backupResult || backupResult.code === 1 || !backupResult.data) {
            return null;
        }

        const rawBackup = backupResult.data instanceof Blob
            ? await backupResult.data.text()
            : String(backupResult.data);
        const backup = JSON.parse(rawBackup);
        const page = backup?.page ?? backup;
        const route = typeof backup?.pageURL === "string"
            ? backup.pageURL
            : "/";

        if (!page || typeof page !== "object" || Array.isArray(page)) {
            throw new Error("The current page backup is not a page object.");
        }

        const replaceResult = await flexEngineFileSystem.updatePage(
            route,
            JSON.stringify(page)
        );

        if (!replaceResult || replaceResult.code === 1) {
            throw new Error(
                replaceResult?.error || "The page file replacement failed."
            );
        }

        await flexEngineFileSystem.deleteFile(CURRENT_PAGE_BACKUP_PATH);
        console.info(`[RaySite] Restored the local page backup to ${route}.`);
        return route;
    } catch (error) {
        console.warn("[RaySite] Current page backup was not restored:", error);
        return null;
    }
}

/** Make output operations see the newest editor state. */
async function flushCurrentPageBeforeOutput() {
    await saveCurrentPageBackup();
    const restoredRoute = await restoreCurrentPageBackup();

    // The current page is already written directly to IndexedDB above. This
    // fallback only handles a missing recovery snapshot.
    if (!restoredRoute) {
        const current = globalThis.Current;
        if (current?.page && Object.keys(current.page).length > 0) {
            const saveResult = await flexEngineFileSystem.updatePage(
                current.pageURL,
                JSON.stringify(current.page)
            );

            if (!saveResult || saveResult.code === 1) {
                throw new Error(
                    saveResult?.error || "Failed to save the current page before output."
                );
            }
        }
    }

    return restoredRoute;
}

globalThis.saveCurrentPageBackup = saveCurrentPageBackup;
globalThis.restoreCurrentPageBackup = restoreCurrentPageBackup;
globalThis.flushCurrentPageBeforeOutput = flushCurrentPageBeforeOutput;

async function publishWebsite() {
    try {
        await waitForCanvasLoad();

        await flushCurrentPageBeforeOutput();

        const result = await exportWebsite();
        const { blob, filename } = result;
        const download = document.createElement("a");
        const objectUrl = URL.createObjectURL(blob);
        download.href = objectUrl;
        download.download = filename;
        download.click();
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);

        document.dispatchEvent(new CustomEvent("RAYSITE_PUBLISH_COMPLETE", {
            detail: {
                pages: result.pages,
                links: result.links,
                files: result.files
            }
        }));
    } catch (error) {
        console.error("[RaySite] Website publish failed:", error);
        window.alert(`Website publish failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

globalThis.publishWebsite = publishWebsite;

function findPageObjectById(value, elementID, visited = new WeakSet()) {
    if (!value || typeof value !== "object") return null;
    if (visited.has(value)) return null;
    visited.add(value);

    if (value.type && value.id !== undefined && String(value.id) === elementID) {
        return value;
    }

    for (const child of Object.values(value)) {
        const match = findPageObjectById(child, elementID, visited);
        if (match) return match;
    }

    return null;
}

const editorVisualStyle = `
    .rs-editor-selected,
    .rs-editor-parent {
        position: relative !important;
        z-index: 1;
        pointer-events: auto;
    }

    .rs-editor-selected {
        outline: 2px solid #2563eb !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgb(37 99 235 / 18%) !important;
    }

    .rs-editor-parent {
        outline: 2px dashed #f59e0b !important;
        outline-offset: 4px !important;
    }

    .rs-editor-drop-target {
        outline: 3px solid #16a34a !important;
        outline-offset: 5px !important;
        box-shadow: 0 0 0 6px rgb(22 163 74 / 22%) !important;
    }

    .rs-editor-drop-slot {
        outline: 2px dashed #16a34a !important;
        outline-offset: 2px !important;
    }

    .rs-editor-blank {
        width: 100% !important;
        min-height: 55px !important;
        position: relative !important;
        align-self: stretch !important;
        background: #e5e7eb !important;
    }

    .rs-editor-blank::after {
        content: "Blank Container Area";
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 8px;
        color: #4b5563;
        font: 12px/1.2 sans-serif;
        text-align: center;
        pointer-events: none;
    }
`;

function isBlankEditorElement(element) {
    if (!element || element.nodeType !== 1) return false;
    if (["HTML", "HEAD", "BODY", "SCRIPT", "STYLE", "LINK", "META"].includes(element.tagName)) {
        return false;
    }

    if (element.children.length === 0) {
        return element.textContent?.trim() === "";
    }

    return /^<(br\s*\/?)>$/i.test(element.innerHTML.trim());
}

function refreshEditorVisuals(documentHTML) {
    if (!documentHTML?.documentElement) return;

    if (!documentHTML.getElementById("rs-editor-visual-style")) {
        const style = documentHTML.createElement("style");
        style.id = "rs-editor-visual-style";
        style.textContent = editorVisualStyle;
        documentHTML.head?.appendChild(style);
    }

    documentHTML.querySelectorAll(".rs-editor-blank").forEach(element => {
        if (!isBlankEditorElement(element)) {
            element.classList.remove("rs-editor-blank");
        }
    });

    documentHTML.querySelectorAll("body *").forEach(element => {
        if (isSortableEditorElement(element) && isBlankEditorElement(element)) {
            element.classList.add("rs-editor-blank");
        }
    });
}

function bindEditorSelection(documentHTML) {
    if (!documentHTML?.documentElement) return;

    refreshEditorVisuals(documentHTML);

    if (editorView) {
        editorView.destroyForDocument(editorView.documentHTML);
    }
    editorView = new EditorView({
        documentHTML
    });

    const visualObserver = new MutationObserver(() => {
        refreshEditorVisuals(documentHTML);
    });
    visualObserver.observe(documentHTML.documentElement, {
        childList: true,
        subtree: true
    });

    const handleClick = event => {
        let node = event.target?.nodeType === 1
            ? event.target
            : event.target?.parentElement;

        // Quill owns focus, selection, and toolbar clicks while editing.
        // Do not cancel their native events or overwrite Current.object.
        if (node?.closest?.(".ql-editor, .ql-bubble, .rs-editor-quill-toolbar")) {
            return;
        }

        if (node?.closest?.("a")) {
            event.preventDefault();
        }

        let selectedElement = null;

        while (node && node !== documentHTML.documentElement) {
            const idClass = Array.from(node.classList || [])
                .find(className => /^rs-\d+$/.test(className));

            if (idClass) {
                selectedElement = node;
                break;
            }

            node = node.parentElement;
        }

        documentHTML.querySelectorAll(
            ".rs-editor-selected, .rs-editor-parent"
        ).forEach(element => {
            element.classList.remove(
                "rs-editor-selected",
                "rs-editor-parent"
            );
        });

        let parentElement = null;
        if (selectedElement) {
            parentElement = selectedElement.parentElement;
            while (parentElement && parentElement !== documentHTML.documentElement) {
                if (Array.from(parentElement.classList || [])
                    .some(className => /^rs-\d+$/.test(className))) {
                    break;
                }
                parentElement = parentElement.parentElement;
            }

            selectedElement.classList.add("rs-editor-selected");
            parentElement?.classList.add("rs-editor-parent");
        }

        const elementID = selectedElement
            ? Array.from(selectedElement.classList)
                .find(className => /^rs-\d+$/.test(className))
                ?.slice(3)
            : null;
        const parentID = parentElement
            ? Array.from(parentElement.classList)
                .find(className => /^rs-\d+$/.test(className))
                ?.slice(3)
            : null;

        const object = elementID === null || elementID === undefined
            ? null
            : findPageObjectById(globalThis.Current?.page, elementID);
        const parentObject = parentID === null || parentID === undefined
            ? null
            : findPageObjectById(globalThis.Current?.page, parentID);

        if (globalThis.Current) {
            globalThis.Current.object = object;
            globalThis.Current.parentObject = parentObject;
            globalThis.Current.elementID = elementID === null || elementID === undefined
                ? null
                : Number(elementID);
        }

        console.log("[RaySite] Editor selection:", {
            object,
            parentObject,
            elementID: globalThis.Current?.elementID ?? null
        });
    };

    documentHTML.addEventListener("click", handleClick, true);
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

        // Bind before rendering. The rendered editor installs its own anchor
        // handler, so this capture listener must run first and prevent links
        // from navigating away before selection is resolved.
        bindEditorSelection(doc);

        // Program 3: Render the requested page.
        await flexEngineRenderPage(url, doc, false, {
            includePageStylesheet: false,
            editorMode: true
        });
        initEditorStyleSheet(canvas);
        refreshEditorVisuals(doc);

        // Program 4: Update the current page URL.
        Current.pageURL = url;
        Current.page = pageResult.data;
        Current.object = {};
        Current.parentObject = null;
        Current.elementID = null;
        canvas.style.setProperty("visibility", "visible", "important");
        globalThis.editorDragDrop?.refresh?.();

        console.log("[RaySite] Page switched successfully:", url);
        return true;
    } catch (error) {
        console.error("[RaySite] Page switch failed:", error);
        return false;
    }
}

async function switchPageWithRetry(url, attempts = 3) {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        if (await switchPage(url) && Current.page?.type) return true;

        if (attempt < attempts) {
            await new Promise(resolve =>
                window.setTimeout(resolve, 250 * attempt)
            );
        }
    }

    throw new Error(`Could not render page ${url} after ${attempts} attempts.`);
}

window.addEventListener("message", event => {
    if (event.origin !== window.location.origin) return;
    if (event.source !== canvas.contentWindow) return;
    if (event.data?.type !== "RAYSITE_EDITOR_NAVIGATE") return;

    const nextPath = typeof event.data.path === "string"
        ? event.data.path
        : "";
    if (!nextPath.startsWith("/")) return;

    void switchPageWithRetry(nextPath).catch(error => {
        console.error("[RaySite] Navigation failed:", error);
    });
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

function waitForServiceWorkerReady(timeoutMs = 8000) {
    return Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => {
            window.setTimeout(() => {
                reject(new Error(
                    `Service Worker activation timed out after ${timeoutMs}ms.`
                ));
            }, timeoutMs);
        })
    ]);
}

function waitForServiceWorkerController(timeoutMs = 8000) {
    if (navigator.serviceWorker.controller) {
        return Promise.resolve(navigator.serviceWorker.controller);
    }

    return new Promise(resolve => {
        let settled = false;
        const finish = controller => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeout);
            navigator.serviceWorker.removeEventListener(
                "controllerchange",
                onControllerChange
            );
            resolve(controller || null);
        };
        const onControllerChange = () => {
            finish(navigator.serviceWorker.controller);
        };
        const timeout = window.setTimeout(() => finish(null), timeoutMs);

        navigator.serviceWorker.addEventListener(
            "controllerchange",
            onControllerChange
        );

        // The worker may have claimed the page between the initial check and
        // listener registration. Check once more after subscribing.
        if (navigator.serviceWorker.controller) {
            finish(navigator.serviceWorker.controller);
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
                scope: "/",
                updateViaCache: "none"
            }
        );

    await waitForServiceWorkerReady();

    console.log(
        "[RaySite] SW ready",
        registration.scope
    );

    const controller = await waitForServiceWorkerController();

    if (!controller) {
        throw new Error("Service Worker could not control the page.");
    }

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
        const library = initializeContentLibrary();

        // Program 1: Initialize database and project files.
        await initFiles();

        // Program 2: Set up global application variables.
        await initCurrent();

        // Recover before the first page read/render. A successful replacement
        // consumes the backup; a failed one leaves it available for retry.
        const restoredRoute = await restoreCurrentPageBackup();

        const connected = await initConnection();

        if (!connected) {
            return;
        }

        await switchPageWithRetry(restoredRoute || "/");
        globalThis.editorDragDrop = initDragDrop({
            library: library?.container,
            iframe: canvas
        });

        startCurrentPageBackup();


        console.log("[RaySite] Startup complete:", Current);
    } catch (error) {
        console.error("[RaySite] Initialization failed:", error);

        if (canvas.contentDocument?.body?.children.length) {
            canvas.style.setProperty("visibility", "visible", "important");
        }
    } finally {
        document
            .querySelector(".rsapp-loading-cover")
            ?.classList.add("rsapp-loading-cover--hidden");

    }
}

document.addEventListener("DOMContentLoaded", initialize, {
    once: true
});
