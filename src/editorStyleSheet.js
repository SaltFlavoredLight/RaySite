import { extractBuilderStyles } from "./flexEngine.js";

let cleanupEditorStyleSheet = null;

export function initEditorStyleSheet(iframe) {
    cleanupEditorStyleSheet?.();

    const frameDocument = iframe.contentDocument;
    if (!frameDocument) {
        throw new Error("Editor canvas document is unavailable.");
    }

    const frameWindow = frameDocument.defaultView;
    if (!frameWindow) {
        throw new Error("Editor canvas window is unavailable.");
    }

    const stylePrefixes = ["rs-styles-", "rs-appearance-"];
    let disposed = false;

    let styleElement = frameDocument.getElementById(
        "rs-editor-element-styles"
    );
    if (!styleElement) {
        styleElement = frameDocument.createElement("style");
        styleElement.id = "rs-editor-element-styles";
        frameDocument.head.appendChild(styleElement);
    }

    function refreshStyles() {
        if (disposed) return;

        const [, css] = extractBuilderStyles(frameDocument, {
            preserveStyleAttributes: true
        });
        styleElement.textContent = css;
    }

    function reloadStylesheets() {
        if (disposed) return;

        const timestamp = Date.now();
        const links = Array.from(
            frameDocument.querySelectorAll('link[rel="stylesheet"]')
        );

        for (const link of links) {
            const nextURL = new URL(link.href, frameWindow.location.href);
            nextURL.searchParams.set("rs-hmr", String(timestamp));

            const replacement = link.cloneNode(false);
            replacement.href = nextURL.href;

            replacement.addEventListener("load", () => {
                if (link.isConnected) link.replaceWith(replacement);
            }, { once: true });
            replacement.addEventListener("error", () => {
                replacement.remove();
            }, { once: true });

            link.after(replacement);
        }
    }

    function hasStyleAttributes(node) {
        if (!(node instanceof frameWindow.Element)) return false;

        if (Array.from(node.attributes).some(attribute =>
            stylePrefixes.some(prefix =>
                attribute.name.toLowerCase().startsWith(prefix)
            )
        )) {
            return true;
        }

        return Array.from(node.querySelectorAll("*")).some(element =>
            Array.from(element.attributes).some(attribute =>
                stylePrefixes.some(prefix =>
                    attribute.name.toLowerCase().startsWith(prefix)
                )
            )
        );
    }

    const observer = new frameWindow.MutationObserver(records => {
        const styleChanged = records.some(record => {
            if (
                record.type === "attributes" &&
                stylePrefixes.some(prefix =>
                    record.attributeName?.toLowerCase().startsWith(prefix)
                )
            ) {
                return true;
            }

            return Array.from(record.addedNodes)
                .concat(Array.from(record.removedNodes))
                .some(hasStyleAttributes);
        });

        if (styleChanged) refreshStyles();
    });

    refreshStyles();
    observer.observe(frameDocument.documentElement, {
        attributes: true,
        childList: true,
        subtree: true
    });

    function cleanup() {
        disposed = true;
        observer.disconnect();
        if (globalThis.Current?.refreshEditorStyles === refreshStyles) {
            delete globalThis.Current.refreshEditorStyles;
        }
        if (globalThis.Current?.reloadEditorStyles === reloadStylesheets) {
            delete globalThis.Current.reloadEditorStyles;
        }
        cleanupEditorStyleSheet = null;
    }

    if (globalThis.Current) {
        globalThis.Current.refreshEditorStyles = refreshStyles;
        globalThis.Current.reloadEditorStyles = reloadStylesheets;
    }
    cleanupEditorStyleSheet = cleanup;

    return cleanup;
}
