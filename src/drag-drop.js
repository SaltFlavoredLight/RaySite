'use strict';

import Sortable from 'sortablejs';

import {
    flexEngineDefaultElements,
    flexEngineRootElement,
    flexEngineCreateNode
} from './flexEngine.js';
import { BUILDER_CONFIG } from './utils/config.js';

const sortableSlots = new WeakMap();

function registryEntries() {
    const entries = [];

    for (const [category, registry] of Object.entries(flexEngineDefaultElements || {})) {
        for (const [key, element] of Object.entries(registry?.elements || {})) {
            if (element && typeof element === 'object') {
                entries.push({
                    mode: `${category}/${key}`,
                    category,
                    key,
                    element,
                    categoryRegistry: registry
                });
            }
        }
    }

    for (const [key, element] of Object.entries(flexEngineRootElement || {})) {
        if (element && typeof element === 'object') {
            entries.push({
                mode: `@root/${element.className || key}`,
                category: '@root',
                key,
                element,
                categoryRegistry: flexEngineRootElement
            });
        }
    }

    return entries;
}

const entries = registryEntries();

function setting(entry, name) {
    const elementSettings = entry?.element?.settings || {};
    if (Object.prototype.hasOwnProperty.call(elementSettings, name)) {
        return elementSettings[name];
    }

    const categorySettings = entry?.category === '@root'
        ? entry.categoryRegistry?.[entry.key]?.setting
        : entry.categoryRegistry?.setting;

    return categorySettings?.[name];
}

export function isSortableEditorElement(element) {
    const entry = entryForElement(element);
    return Boolean(
        entry &&
        Array.isArray(setting(entry, 'allowedSortTo'))
    );
}

function entryForElement(element) {
    if (!element || element.nodeType !== 1) return null;

    return entries.find(entry => {
        const className = entry.element.className;
        return typeof className === 'string' &&
            element.classList.contains(`${BUILDER_CONFIG.classPrefix}${className}`);
    }) || null;
}

function entryForMode(mode) {
    return entries.find(entry => entry.mode === mode) || null;
}

function elementMode(element) {
    return entryForElement(element)?.mode || null;
}

function allowedTarget(allowedSortTo, targetMode) {
    if (!targetMode || !Array.isArray(allowedSortTo)) return false;

    return allowedSortTo.some(target => {
        if (target === targetMode) return true;
        if (targetMode.startsWith(`${target}/`)) return true;
        return targetMode.startsWith(`${target}/`) && target.startsWith('@root/');
    });
}

function targetElementForSlot(slot) {
    let element = slot;

    while (element && element.nodeType === 1) {
        if (sortableSlots.has(element)) return sortableSlots.get(element).owner;
        element = element.parentElement;
    }

    return null;
}

function canDrop(draggedElement, targetSlot) {
    const draggedEntry = entryForElement(draggedElement);
    const targetElement = targetElementForSlot(targetSlot);
    const targetEntry = entryForElement(targetElement);

    if (!draggedEntry || !targetEntry) return false;
    if (draggedElement.contains(targetSlot)) return false;
    if (setting(targetEntry, 'allowedSortIn') !== true) return false;

    return allowedTarget(setting(draggedEntry, 'allowedSortTo'), targetEntry.mode);
}

function clearDropHighlight(documentHTML) {
    documentHTML?.querySelectorAll(
        '.rs-editor-drop-target, .rs-editor-drop-slot'
    ).forEach(element => {
        element.classList.remove(
            'rs-editor-drop-target',
            'rs-editor-drop-slot'
        );
    });
}

function highlightDropTarget(targetSlot, accepted) {
    const documentHTML = targetSlot?.ownerDocument;
    clearDropHighlight(documentHTML);

    if (!accepted || !targetSlot) return;

    const targetElement = targetElementForSlot(targetSlot);
    targetElement?.classList.add('rs-editor-drop-target');
    targetSlot.classList.add('rs-editor-drop-slot');
}

function createElementFromLibrary(item, documentHTML) {
    const category = item.dataset.category;
    const key = item.dataset.element;
    const entry = category === '@root'
        ? entryForMode(`@root/${key}`)
        : entryForMode(`${category}/${key}`);

    if (!entry) return null;

    const data = {
        type: entry.mode,
        content: [],
        layout: {},
        appearance: {},
        animation: {}
    };
    const node = flexEngineCreateNode(data, documentHTML, true);
    node.__raySiteData = data;
    return node;
}

function pageNodesById(page, documentHTML) {
    const byId = new Map();

    const visit = value => {
        if (!value || typeof value !== 'object') return;
        if (typeof value.type === 'string' && value.id !== undefined) {
            byId.set(String(value.id), value);
        }
        Object.values(value).forEach(visit);
    };
    visit(page);

    documentHTML.querySelectorAll('*').forEach(node => {
        for (const className of node.classList) {
            const match = className.match(
                new RegExp(`^${BUILDER_CONFIG.classPrefix}(\\d+)$`)
            );
            if (match && !byId.has(match[1]) && node.__raySiteData) {
                byId.set(match[1], node.__raySiteData);
            }
        }
    });

    return byId;
}

function domNodesById(documentHTML) {
    const byId = new Map();
    documentHTML.querySelectorAll('*').forEach(node => {
        for (const className of node.classList) {
            const match = className.match(
                new RegExp(`^${BUILDER_CONFIG.classPrefix}(\\d+)$`)
            );
            if (match) byId.set(match[1], node);
        }
    });
    return byId;
}

function contentHost(node) {
    const entry = entryForElement(node);
    const elementPart = setting(entry, 'elementPart');
    if (typeof elementPart !== 'function') return node;

    const parts = elementPart(node);
    const firstPart = Object.keys(parts || {})
        .filter(part => /^\\d+$/.test(part))
        .sort((a, b) => Number(a) - Number(b))[0];

    return parts?.[firstPart] || node;
}

function syncPageNode(data, node, nodesById, dataById) {
    if (!data || typeof data !== 'object' || !node) return data;

    const next = { ...data };
    const content = data.content;

    // Arrays with typed entries are child-node arrays. Other arrays are
    // element payloads (for example Quill Delta operations) and must remain
    // untouched.
    if (Array.isArray(content) && content.some(item => item?.type)) {
        const host = contentHost(node);
        const children = Array.from(host?.children || [])
            .filter(child => entryForElement(child));

        next.content = children
            .map(child => {
                const id = Array.from(child.classList)
                    .map(className => className.match(
                        new RegExp(`^${BUILDER_CONFIG.classPrefix}(\\d+)$`)
                    ))
                    .find(Boolean)?.[1];
                const childData = child.__raySiteData ||
                    (id ? dataById.get(id) : null);
                return childData
                    ? syncPageNode(childData, child, nodesById, dataById)
                    : null;
            })
            .filter(Boolean);
    } else if (content && typeof content === 'object' && !Array.isArray(content)) {
        next.content = { ...content };
        for (const [key, childData] of Object.entries(content)) {
            if (!childData?.type) continue;
            const childNode = childData.id === undefined
                ? null
                : nodesById.get(String(childData.id));
            if (childNode) {
                next.content[key] = syncPageNode(
                    childData,
                    childNode,
                    nodesById,
                    dataById
                );
            }
        }
    }

    return next;
}

/** Reconcile the rendered iframe tree back into the page JSON model. */
export function syncPageFromDocument(page, documentHTML) {
    if (!page || !documentHTML) return page;

    const dataById = pageNodesById(page, documentHTML);
    const nodesById = domNodesById(documentHTML);
    const bodyData = page.body;
    const bodyNode = bodyData?.id === undefined
        ? documentHTML.body
        : nodesById.get(String(bodyData.id));

    return bodyData && bodyNode
        ? { ...page, body: syncPageNode(bodyData, bodyNode, nodesById, dataById) }
        : page;
}

function installSlot(slot, owner, config) {
    if (!slot || slot.nodeType !== 1 || sortableSlots.has(slot)) return;

    const sortable = new Sortable(slot, {
        ...config,
        onStart(event) {
            clearDropHighlight(event.item?.ownerDocument);
            config.onStart?.(event);
        },
        onMove(event, originalEvent) {
            if (typeof config.onMove === 'function' &&
                config.onMove(event, originalEvent) === false) {
                highlightDropTarget(event.to, false);
                return false;
            }

            const accepted = canDrop(event.dragged, event.to);
            highlightDropTarget(event.to, accepted);
            return accepted;
        },
        onAdd(event) {
            if (event.item?.dataset?.category && event.item?.dataset?.element) {
                const created = createElementFromLibrary(
                    event.item,
                    slot.ownerDocument
                );

                if (created) {
                    event.item.replaceWith(created);
                }
            }

            config.onAdd?.(event);
        },
        onEnd(event) {
            clearDropHighlight(event.item?.ownerDocument);
            config.onEnd?.(event);
        }
    });

    sortableSlots.set(slot, { owner, sortable });
    config.instances?.push(sortable);
    config.slots?.push(slot);
}

function installOwnerSlots(owner, config) {
    const entry = entryForElement(owner);
    if (!entry || setting(entry, 'allowedSortIn') !== true) return;

    const parts = setting(entry, 'elementPart');
    if (typeof parts !== 'function') return;

    const slots = parts(owner);
    if (!slots || typeof slots !== 'object') return;

    for (const [part, slot] of Object.entries(slots)) {
        if (/^\d+$/.test(part) && slot?.nodeType === 1) {
            installSlot(slot, owner, config);
        }
    }
}

function installDocumentSlots(documentHTML, config) {
    const candidates = [documentHTML.documentElement, ...documentHTML.querySelectorAll('*')];
    candidates.forEach(owner => installOwnerSlots(owner, config));
}

/**
 * Connect the content library to the editor iframe with registry-aware nested sorting.
 *
 * @param {object} options
 * @param {Element} [options.library] Library container or its grid.
 * @param {HTMLIFrameElement} [options.iframe] Editor iframe.
 * @returns {{destroy: Function}|null}
 */
export default function initDragDrop(options = {}) {
    const library = options.library || document.querySelector(
        '[data-ui-panel="contentLibrary"] .rs-content-library-grid'
    );
    const iframe = options.iframe || document.querySelector('iframe#canvas');

    if (!library || !iframe) return null;

    const groupName = options.groupName || 'raysite-builder';
    const shared = {
        name: groupName,
        pull: 'clone',
        put: false
    };

    const source = new Sortable(library, {
        group: shared,
        sort: false,
        delay: 0,
        fallbackTolerance: 3,
        animation: 150
    });

    let observer = null;
    let frameInstances = [];
    let frameSlots = [];
    const initializeFrame = () => {
        const documentHTML = iframe.contentDocument;
        if (!documentHTML?.documentElement) return;

        observer?.disconnect();
        frameInstances.forEach(sortable => sortable.destroy());
        frameSlots.forEach(slot => sortableSlots.delete(slot));
        frameInstances = [];
        frameSlots = [];

        const config = {
            group: { name: groupName, pull: true, put: true },
            delay: 0,
            fallbackTolerance: 3,
            animation: 150,
            swapThreshold: 0.4,
            invertSwap: true,
            dragoverBubble: true,
            fallbackOnBody: true,
            document: documentHTML,
            emptyInsertThreshold: 20,
            instances: [],
            slots: []
        };

        config.onEnd = () => {
            if (!globalThis.Current?.page) return;
            globalThis.Current.page = syncPageFromDocument(
                globalThis.Current.page,
                documentHTML
            );
            options.onChange?.(globalThis.Current.page);
        };

        installDocumentSlots(documentHTML, config);
        frameInstances = config.instances;
        frameSlots = config.slots;

        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    installOwnerSlots(node, config);
                    node.querySelectorAll('*').forEach(owner => {
                        installOwnerSlots(owner, config);
                    });
                }
            }
        });

        observer.observe(documentHTML.documentElement, {
            childList: true,
            subtree: true
        });
    };

    if (iframe.contentDocument?.readyState === 'complete') {
        initializeFrame();
    } else {
        iframe.addEventListener('load', initializeFrame, { once: true });
    }

    return {
        destroy() {
            source.destroy();
            observer?.disconnect();
            frameInstances.forEach(sortable => sortable.destroy());
            frameSlots.forEach(slot => sortableSlots.delete(slot));
            frameInstances = [];
            frameSlots = [];
        },
        refresh() {
            initializeFrame();
        }
    };
}

export {
    canDrop,
    elementMode,
    entryForElement,
    installDocumentSlots
};
