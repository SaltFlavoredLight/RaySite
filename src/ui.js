
import { flexEngineFileSystem } from "./flexEngine.js";

function initRayHooks(root = document) {
    function getPanel(name) {
        return root.querySelector(
            `[data-hook-react="${CSS.escape(name)}"]`
        );
    }

    function closePanel(name) {
        const panel = getPanel(name);
        if (!panel) return;

        panel.classList.remove("opened");
        panel.classList.add("closed");
        panel.setAttribute("aria-hidden", "true");

        const status = panel.querySelector(".status");
        if (status) status.textContent = "CLOSED";

        root.querySelectorAll("button").forEach(button => {
            const buttonName =
                button.getAttribute("data-hook-triggler") ||
                button.getAttribute("data-hook-open") ||
                button.getAttribute("data-hook-close");

            if (buttonName === name) {
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    function setPanel(name, shouldOpen) {
        const panel = getPanel(name);
        if (!panel) return;

        const separator = name.indexOf("-");
        const group = separator > 0
            ? name.slice(0, separator)
            : null;

        // Opening one panel closes others in its group.
        if (shouldOpen && group) {
            root.querySelectorAll("[data-hook-react]").forEach(other => {
                const otherName =
                    other.getAttribute("data-hook-react");

                const otherSeparator = otherName.indexOf("-");
                const otherGroup = otherSeparator > 0
                    ? otherName.slice(0, otherSeparator)
                    : null;

                if (otherGroup === group && otherName !== name) {
                    closePanel(otherName);
                }
            });
        }

        panel.classList.toggle("opened", shouldOpen);
        panel.classList.toggle("closed", !shouldOpen);
        panel.setAttribute("aria-hidden", String(!shouldOpen));

        const status = panel.querySelector(".status");
        if (status) {
            status.textContent = shouldOpen ? "OPENED" : "CLOSED";
        }

        root.querySelectorAll("button").forEach(button => {
            const buttonName =
                button.getAttribute("data-hook-triggler") ||
                button.getAttribute("data-hook-open") ||
                button.getAttribute("data-hook-close");

            if (buttonName === name) {
                button.setAttribute(
                    "aria-expanded",
                    String(shouldOpen)
                );
            }
        });

        if (shouldOpen && panel.matches('[role="dialog"]')) {
            panel.querySelector("button")?.focus();
        }
    }

    function handleClick(event) {
        const button = event.target.closest("button");
        if (!button || !root.contains(button)) return;

        const closeName = button.getAttribute("data-hook-close");
        const openName = button.getAttribute("data-hook-open");
        const toggleName = button.getAttribute("data-hook-triggler");

        if (closeName) {
            setPanel(closeName, false);
        } else if (openName) {
            setPanel(openName, true);
        } else if (toggleName) {
            const panel = getPanel(toggleName);
            if (!panel) return;

            setPanel(
                toggleName,
                !panel.classList.contains("opened")
            );
        }

        const action = button.getAttribute("data-ui-action");
        if (action === "preview") {
            void togglePreview();
        } else if (action === "exit-preview") {
            exitPreview();
        } else if (action === "export") {
            void exportProject();
        } else if (action === "import") {
            root.querySelector("[data-ui-file-import]")?.click();
        }
    }

    function togglePreview() {
        if (document.body.classList.contains("rsapp-preview-mode")) {
            exitPreview();
            return;
        }

        const route = globalThis.Current?.pageURL;
        if (typeof route !== "string" || !route) {
            window.alert("Preview is unavailable until a page has loaded.");
            return;
        }

        try {
            const frame = root.querySelector("#render-preview");
            if (!(frame instanceof HTMLIFrameElement)) {
                throw new Error("RenderServer preview iframe is unavailable.");
            }

            const exitButton = root.querySelector('[data-ui-action="exit-preview"]');
            if (!(exitButton instanceof HTMLButtonElement)) {
                throw new Error("Preview exit button is unavailable.");
            }

            const previewURL = new URL("/rs-build/index.html", window.location.origin);
            previewURL.searchParams.set("page", route);
            frame.src = previewURL.toString();
            document.body.classList.add("rsapp-preview-mode");
            exitButton.hidden = false;
            exitButton.focus();
            setPreviewButtonLabel("Exit Preview");
        } catch (error) {
            console.error("[RaySite] Preview rendering failed:", error);
            window.alert(`Preview rendering failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    function exitPreview() {
        document.body.classList.remove("rsapp-preview-mode");
        const exitButton = root.querySelector('[data-ui-action="exit-preview"]');
        if (exitButton instanceof HTMLButtonElement) exitButton.hidden = true;
        setPreviewButtonLabel("Preview");
        root.querySelector('[data-ui-action="preview"]')?.focus();
    }

    function setPreviewButtonLabel(label) {
        root.querySelectorAll('[data-ui-action="preview"]').forEach(button => {
            button.textContent = label;
        });
    }

    async function exportProject() {
        try {
            const result = await flexEngineFileSystem.exportFile();
            if (result.code === 1) {
                throw new Error(result.error || "Project export failed.");
            }

            const { blob, filename } = result.data;
            const download = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);
            download.href = objectUrl;
            download.download = filename;
            download.click();
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
        } catch (error) {
            console.error("[RaySite] Project export failed:", error);
            window.alert(`Project export failed: ${error.message}`);
        }
    }

    async function importProject(file) {
        if (!window.confirm(
            "Import this project archive? Files with matching paths will be replaced; other current files will be kept."
        )) {
            return;
        }

        try {
            const result = await flexEngineFileSystem.zipManager.importZip(file);
            if (result.code === 1) {
                throw new Error(result.error || "Project import failed.");
            }

            window.alert(`Imported ${result.data.importedCount} project files. The builder will reload now.`);
            window.location.reload();
        } catch (error) {
            console.error("[RaySite] Project import failed:", error);
            window.alert(`Project import failed: ${error.message}`);
        }
    }

    const fileInput = root.querySelector("[data-ui-file-import]");
    const handleFileChange = event => {
        const [file] = event.target.files;
        if (file) void importProject(file);
        event.target.value = "";
    };
    if (fileInput) fileInput.addEventListener("change", handleFileChange);

    const handleKeydown = event => {
        if (event.key !== "Escape") return;
        root.querySelectorAll('[data-hook-react].opened').forEach(panel => {
            closePanel(panel.getAttribute("data-hook-react"));
        });
        if (document.body.classList.contains("rsapp-preview-mode")) exitPreview();
    };
    root.addEventListener("keydown", handleKeydown);

    root.addEventListener("click", handleClick);

    // Return controls for programmatic use and cleanup.
    return {
        open: name => setPanel(name, true),
        close: name => setPanel(name, false),
        toggle: name => {
            const panel = getPanel(name);
            if (panel) {
                setPanel(name, !panel.classList.contains("opened"));
            }
        },
        destroy: () => {
            root.removeEventListener("click", handleClick);
            root.removeEventListener("keydown", handleKeydown);
            if (fileInput) fileInput.removeEventListener("change", handleFileChange);
        }
    };
}

const rayHooks = initRayHooks();
