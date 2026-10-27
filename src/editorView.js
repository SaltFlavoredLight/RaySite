import Quill from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

const TEXT_SELECTOR = ".rs-text, .rs-title, .rs-heading";

function cloneDelta(ops) {
    return Array.isArray(ops)
        ? ops.map(op => ({
            ...op,
            attributes: op.attributes ? { ...op.attributes } : undefined
        }))
        : [{ insert: "\n" }];
}

function findTextNode(target, documentHTML) {
    const element = target?.nodeType === 1 ? target : target?.parentElement;
    return element?.ownerDocument === documentHTML
        ? element.closest(TEXT_SELECTOR)
        : null;
}

/**
 * Owns the one rich-text editor shown in the builder toolbar.
 * Quill itself is headless: its toolbar module and theme are disabled and the
 * controls below the canvas call the active instance directly.
 */
export class EditorView {
    constructor({ documentHTML, getCurrent = () => globalThis.Current }) {
        this.documentHTML = documentHTML;
        this.toolbar = null;
        this.getCurrent = getCurrent;
        this.quill = null;
        this.node = null;
        this.lastRange = null;
        this.onTextChange = null;
        this.onSelectionChange = null;
        this.selectionCleanup = null;

        this.installEditorStyles();

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleToolbarClick = this.handleToolbarClick.bind(this);
        this.handleToolbarChange = this.handleToolbarChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);

        documentHTML.addEventListener("dblclick", this.handleDoubleClick, true);
        documentHTML.addEventListener("keydown", this.handleKeyDown, true);
        documentHTML.addEventListener("click", this.handleDocumentClick, true);
    }

    installEditorStyles() {
        if (this.documentHTML.getElementById("rs-editor-quill-style")) return;
        const style = this.documentHTML.createElement("style");
        style.id = "rs-editor-quill-style";
        style.textContent = `
            .ql-editor { box-sizing: border-box; min-height: 1.5em; outline: none; white-space: pre-wrap; }
            .ql-editor p { margin: 0; }
            .ql-editor h1, .ql-editor h2, .ql-editor h3 { margin: 0; }
            .ql-editor ol, .ql-editor ul { padding-left: 1.5em; }
            .ql-editor pre.ql-syntax { background: #23241f; color: #f8f8f2; overflow: visible; padding: 5px 10px; }
            .rs-editor-quill-toolbar {
                align-items: center; background: #fff; border: 1px solid #d7dce2;
                border-radius: 18px; box-shadow: 0 4px 14px rgb(15 23 42 / 18%);
                display: flex; gap: 3px; padding: 4px 6px; position: fixed; z-index: 2147483647;
            }
            .rs-editor-quill-toolbar button, .rs-editor-quill-toolbar select {
                background: transparent; border: 0; border-radius: 12px;
                color: #334155; cursor: pointer; font: 13px sans-serif; min-height: 26px; padding: 4px 8px;
            }
            .rs-editor-quill-toolbar label { align-items: center; color: #0f172a; display: flex; font: 12px sans-serif; gap: 3px; white-space: nowrap; }
            .rs-editor-quill-toolbar button:hover,
            .rs-editor-quill-toolbar button[aria-pressed="true"] { background: #e8f0ff; color: #1d4ed8; }
        `;
        this.documentHTML.head?.appendChild(style);
    }

    createToolbar() {
        const toolbar = this.documentHTML.createElement("div");
        toolbar.className = "rs-editor-quill-toolbar ql-toolbar ql-bubble";
        toolbar.hidden = true;
        toolbar.setAttribute("aria-hidden", "true");
        toolbar.setAttribute("aria-label", "Text formatting");
        toolbar.innerHTML = `
            <button type="button" data-quill-format="bold" title="Bold"><strong>B</strong></button>
            <button type="button" data-quill-format="italic" title="Italic"><em>I</em></button>
            <button type="button" data-quill-format="underline" title="Underline"><u>U</u></button>
            <button type="button" data-quill-format="list" data-quill-value="bullet" title="Bulleted list">Li</button>
            <button type="button" data-quill-format="list" data-quill-value="ordered" title="Numbered list">Ol</button>
            <label>Font <select data-quill-format="font" aria-label="Font">
                <option value="false">Default</option><option value="serif">Serif</option><option value="monospace">Mono</option>
            </select></label>
            <label>Normal <select data-quill-style aria-label="Text style">
                <option value="title">Title (H1)</option><option value="h1">H1</option>
                <option value="h2">H2</option><option value="h3">H3</option>
                <option value="text">Text</option><option value="text2">Text 2</option><option value="small">Small</option>
            </select></label>
            <button type="button" data-quill-format="code-block" title="Code">code</button>
        `;
        toolbar.addEventListener("click", this.handleToolbarClick);
        toolbar.addEventListener("change", this.handleToolbarChange);
        this.documentHTML.body.appendChild(toolbar);
        this.toolbar = toolbar;
    }

    bridgeQuillDocument() {
        const selection = this.quill.selection;
        const editorDocument = this.node.ownerDocument;
        const toTextPosition = (node, offset) => {
            while (node?.nodeType !== 3 && node?.childNodes?.length) {
                if (node.childNodes.length > offset) {
                    node = node.childNodes[offset];
                    offset = 0;
                } else {
                    node = node.lastChild;
                    offset = node?.nodeType === 3 ? node.data.length : node?.childNodes?.length || 0;
                }
            }
            return { node, offset };
        };

        selection.getNativeRange = () => {
            const nativeSelection = editorDocument.getSelection();
            if (!nativeSelection?.rangeCount) return null;
            const native = nativeSelection.getRangeAt(0);
            if (!this.node.contains(native.startContainer) ||
                !this.node.contains(native.endContainer)) return null;
            return {
                start: toTextPosition(native.startContainer, native.startOffset),
                end: toTextPosition(native.endContainer, native.endOffset),
                native: {
                    collapsed: native.collapsed,
                    startContainer: native.startContainer,
                    startOffset: native.startOffset,
                    endContainer: native.endContainer,
                    endOffset: native.endOffset
                }
            };
        };
        selection.hasFocus = () => editorDocument.activeElement === selection.root ||
            Boolean(editorDocument.activeElement && selection.root.contains(editorDocument.activeElement));
        selection.setNativeRange = (startNode, startOffset, endNode = startNode, endOffset = startOffset) => {
            const nativeSelection = editorDocument.getSelection();
            if (!nativeSelection) return;
            if (startNode == null) {
                nativeSelection.removeAllRanges();
                selection.root.blur();
                return;
            }
            selection.root.focus({ preventScroll: true });
            const range = editorDocument.createRange();
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            nativeSelection.removeAllRanges();
            nativeSelection.addRange(range);
        };

        const updateSelection = () => selection.update("user");
        editorDocument.addEventListener("selectionchange", updateSelection);
        editorDocument.addEventListener("mouseup", updateSelection);
        this.selectionCleanup = () => {
            editorDocument.removeEventListener("selectionchange", updateSelection);
            editorDocument.removeEventListener("mouseup", updateSelection);
        };
    }

    handleDoubleClick(event) {
        const node = findTextNode(event.target, this.documentHTML);
        if (!node) return;

        event.preventDefault();
        event.stopPropagation();
        this.activate(node);
    }

    handleDocumentClick(event) {
        if (!this.quill) return;
        const target = event.target?.nodeType === 1
            ? event.target
            : event.target?.parentElement;
        if (target && (this.node?.contains(target) || this.toolbar?.contains(target))) {
            return;
        }
        this.destroy();
    }

    activate(node) {
        if (this.node === node && this.quill) {
            this.quill.focus();
            return;
        }

        this.destroy();
        const current = this.getCurrent();
        const delta = cloneDelta(current?.object?.content);

        // Remove the rendered HTML before Quill takes ownership of the node.
        node.replaceChildren();
        node.classList.add("rs-editor-quill-active");

        this.quill = new Quill(node, {
            theme: null,
            modules: { toolbar: false, keyboard: {} },
            placeholder: "Start writing..."
        });
        this.quill.setContents(delta, "silent");
        this.node = node;
        this.bridgeQuillDocument();
        this.createToolbar();
        this.setToolbarVisible(true);
        this.positionToolbar();
        this.syncCurrent();

        this.onTextChange = (_delta, _oldDelta, source) => {
            if (source === "user") this.syncCurrent();
        };
        this.quill.on("text-change", this.onTextChange);
        this.onSelectionChange = range => {
            if (range) this.lastRange = range;
            this.refreshToolbarState();
            this.positionToolbar();
        };
        this.quill.on("selection-change", this.onSelectionChange);
        this.refreshToolbarState();
        // Focus can restore the browser's old selection. Set the caret after
        // focus so the first typed character is inserted at the left edge.
        this.quill.focus();
        window.setTimeout(() => {
            if (!this.quill || this.node !== node) return;
            this.quill.focus();
            this.quill.setSelection(0, 0, "silent");
            this.lastRange = { index: 0, length: 0 };
        }, 0);
    }

    syncCurrent() {
        const current = this.getCurrent();
        if (!current?.object || !this.quill) return;

        // Keep the JSON tree live and independent from Quill's mutable Delta.
        current.object.content = cloneDelta(this.quill.getContents().ops);
    }

    handleToolbarClick(event) {
        const button = event.target.closest("button[data-quill-format]");
        if (!button || !this.quill) return;

        event.preventDefault();
        const format = button.dataset.quillFormat;
        const value = button.dataset.quillValue || true;
        this.restoreSelection();
        this.quill.format(format, value, "user");
        this.syncCurrent();
    }

    handleToolbarChange(event) {
        const styleSelect = event.target.closest("select[data-quill-style]");
        if (styleSelect && this.quill) {
            this.applyStyle(styleSelect.value);
            return;
        }

        const select = event.target.closest("select[data-quill-format]");
        if (!select || !this.quill) return;

        const format = select.dataset.quillFormat;
        const value = select.value === "false" ? false : select.value;
        this.restoreSelection();
        this.quill.format(format, value, "user");
        this.syncCurrent();
        this.refreshToolbarState();
    }

    applyStyle(style) {
        if (!this.quill) return;
        const range = this.lastRange || this.quill.getSelection() || { index: 0, length: 0 };
        this.restoreSelection(range);
        const header = ["title", "h1"].includes(style) ? 1 :
            ["h2", "h3"].includes(style) ? Number(style.slice(1)) : false;
        const size = style === "small" ? "small" : style === "text2" ? "large" : false;
        // Quill applies header formats to the line terminator. This is why the
        // Title control must format the line, not the selected text characters.
        this.quill.formatLine(range.index, Math.max(range.length, 1), "header", header, "user");
        this.quill.formatLine(range.index, Math.max(range.length, 1), "size", size, "user");
        this.syncCurrent();
        this.refreshToolbarState();
    }

    restoreSelection(range = this.lastRange) {
        this.quill.focus();
        if (range) this.quill.setSelection(range, "silent");
    }

    handleKeyDown(event) {
        if (!this.quill || !this.node?.contains(event.target)) return;
        if (event.key === "Escape") {
            event.preventDefault();
            this.destroy();
            return;
        }
        if (event.ctrlKey || event.metaKey) {
            if (event.shiftKey && event.key === "7") {
                event.preventDefault();
                this.quill.format("list", "ordered", "user");
            } else if (event.shiftKey && event.key === "8") {
                event.preventDefault();
                this.quill.format("list", "bullet", "user");
            }
            this.syncCurrent();
        }
    }

    refreshToolbarState() {
        if (!this.toolbar || !this.quill) return;
        const range = this.quill.getSelection();
        if (!range) return;

        const formats = this.quill.getFormat(range);
        this.toolbar.querySelectorAll("button[data-quill-format]").forEach(button => {
            const value = button.dataset.quillValue || true;
            const active = formats[button.dataset.quillFormat] === value;
            button.setAttribute("aria-pressed", String(active));
        });

        const font = this.toolbar.querySelector("select[data-quill-format=font]");
        if (font) font.value = formats.font || "false";

        const style = this.toolbar.querySelector("select[data-quill-style]");
        if (style) {
            style.value = formats.header === 1 ? "h1" :
                formats.header === 2 ? "h2" :
                formats.header === 3 ? "h3" :
                formats.size === "small" ? "small" :
                formats.size === "large" ? "text2" : "text";
        }
    }

    setToolbarVisible(visible) {
        if (!this.toolbar) return;
        this.toolbar.hidden = !visible;
        this.toolbar.setAttribute("aria-hidden", String(!visible));
    }

    positionToolbar() {
        if (!this.toolbar || !this.node || this.toolbar.hidden) return;
        const rect = this.node.getBoundingClientRect();
        const width = this.toolbar.offsetWidth;
        const left = Math.max(8, Math.min(rect.left, this.documentHTML.defaultView.innerWidth - width - 8));
        const top = rect.top >= this.toolbar.offsetHeight + 12
            ? rect.top - this.toolbar.offsetHeight - 8
            : rect.bottom + 8;
        this.toolbar.style.left = `${left}px`;
        this.toolbar.style.top = `${Math.max(8, top)}px`;
    }

    destroy() {
        const activeNode = this.node;
        const finalDelta = this.quill?.getContents().ops;

        if (activeNode && finalDelta) {
            this.syncCurrent();
            const converter = new QuillDeltaToHtmlConverter(finalDelta, {
                classPrefix: activeNode.classList.contains("rs-heading") ||
                    activeNode.classList.contains("rs-title")
                    ? "rs-content-text"
                    : "rs-text"
            });
            activeNode.innerHTML = converter.convert();
        }

        if (this.quill && this.onTextChange) {
            this.quill.off("text-change", this.onTextChange);
        }
        if (this.quill && this.onSelectionChange) {
            this.quill.off("selection-change", this.onSelectionChange);
        }
        this.selectionCleanup?.();
        this.selectionCleanup = null;
        this.quill = null;
        this.onTextChange = null;
        this.onSelectionChange = null;
        activeNode?.classList.remove(
            "rs-editor-quill-active",
            "ql-container",
            "ql-snow",
            "ql-bubble"
        );
        activeNode?.removeAttribute("contenteditable");
        this.node = null;
        this.lastRange = null;
        this.toolbar?.remove();
        this.toolbar = null;
        this.setToolbarVisible(false);
    }

    destroyForDocument(documentHTML) {
        this.destroy();
        documentHTML?.removeEventListener("dblclick", this.handleDoubleClick, true);
        documentHTML?.removeEventListener("keydown", this.handleKeyDown, true);
        documentHTML?.removeEventListener("click", this.handleDocumentClick, true);
    }
}
