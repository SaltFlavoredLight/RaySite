'use strict';
/**
 * Decode Unicode
 * @param {string} code your unicode
 * @returns {string} the code that returns the correct symbol
 */
export function decodeUnicode(code) {

    if (!/^x[0-9A-Fa-f]{6}$/.test(code)) {
        return null;
    }

    const hex = code.slice(1);

    const codePoint = parseInt(hex, 16);

    /*
     * Unicode currently ends at U+10FFFF.
     */
    if (codePoint > 0x10FFFF) {
        return null;
    }

    try {
        return String.fromCodePoint(codePoint);
    }
    catch {
        return null;
    }
}
