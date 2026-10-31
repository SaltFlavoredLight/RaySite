'use strict';
/**
 * Extracts an HTML document into a complete HTML string.
 *
 * Includes the document type declaration when present,
 * followed by the document's root HTML element.
 *
 * @param {Document} dom - The DOM document to serialize.
 * @returns {string} The serialized HTML document.
 *
 * @throws {TypeError}
 * If the provided value is not a DOM Document.
 *
 * @throws {Error}
 * If the document has no root element.
 *
 * @example
 * const html = extractHTMLString(document);
 * console.log(html);
 * // "<!DOCTYPE html>\n<html>...</html>"
 */
function extractHTMLString(dom) {
    if (!dom || dom.nodeType !== 9) {
        throw new TypeError("Expected a DOM Document.");
    }

    if (!dom.documentElement) {
        throw new Error("Document has no root element.");
    }

    let doctype = "";

    if (dom.doctype) {
        const { name, publicId, systemId } = dom.doctype;

        if (publicId) {
            doctype = `<!DOCTYPE ${name} PUBLIC "${publicId}" "${systemId}">`;
        } else if (systemId) {
            doctype = `<!DOCTYPE ${name} SYSTEM "${systemId}">`;
        } else {
            doctype = `<!DOCTYPE ${name}>`;
        }
    }

    return (
        (doctype ? `${doctype}\n` : "") +
        dom.documentElement.outerHTML
    );
}
