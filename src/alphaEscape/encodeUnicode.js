'use strict';
/**
 * encode the unicode
 *
 * @param {string} character original code
 * @returns {string} returned Unicode
 */
export function encodeUnicode(character) {

    const codePoint = character.codePointAt(0);

    const hex = codePoint
        .toString(16)
        .toUpperCase()
        .padStart(6, "0");

    return "_x" + hex + "_";
}
