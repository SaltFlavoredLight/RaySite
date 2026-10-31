'use strict';
import { BUILDER_CONFIG } from './utils/config';

/**
 * Create action for a node based on the clickable configuration.
 * @param {document} documentHTML document object to create elements
 * @param {*} clickable clickable settings containing action details
 * @param {*} nodeStyleDefault node style to use if no action is specified
 * @returns {HTMLElement} the created node with action applied
 */


export const flexEngineCreateAction = function (documentHTML, clickable, nodeStyleDefault) {
    let node = documentHTML.createElement(nodeStyleDefault);
    if (!clickable || clickable.enable !== true || !clickable.action) {
        return node;
    }
    const action = clickable.action;
    if (action.mode === "a") {
        node = documentHTML.createElement("a");
        node.href = action.url || "";
        if (action.newPage === true) {
            node.target = "_blank";
        }
    }
    if (action.mode === "download") {
        node = documentHTML.createElement("a");
        node.href = action.url || "";
        node.target = "_blank";
        node.download = "";
        if (action.forceDownload === true) {
            node.setAttribute("download", action.forceDownload);
        }
    }
    if (action.mode === "openPopup") {
        node = documentHTML.createElement("button");
        node.setAttribute(`data-${BUILDER_CONFIG.classPrefix}popup-id`, action.popupID || "");
    }
    if (action.mode === "closeThisPopup") {
        node = documentHTML.createElement("button");
        node.setAttribute(`data-${BUILDER_CONFIG.classPrefix}popup-id`, "0");
    }
    if (action.mode === "runJS") {
        node = documentHTML.createElement("button");
        node.setAttribute("onclick", action.JS || "");
    }
    return node;
};
