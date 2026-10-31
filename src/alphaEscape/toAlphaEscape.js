'use strict';
import { defaultMapping } from './defaultMapping';
import { encodeUnicode } from './encodeUnicode';
import { isSafeCharacter } from './isSafeCharacter';

/**
 * From Normal Text to Alpha Escape
 * @param {string} string original text
 * @returns {string} transformed text
 */

export function toAlphaEscape(string) {

    let result = "";

    for (const character of string) {

        /*
         * A-Z / a-z / 0-9
         */
        if (isSafeCharacter(character)) {

            result += character;

            continue;
        }


        /*
         * Known special character.
         */
        if (Object.prototype.hasOwnProperty.call(
            defaultMapping,
            character
        )) {

            result += "_"
                + defaultMapping[character]
                + "_";

            continue;
        }


        /*
         * Any other Unicode character.
         */
        result += encodeUnicode(character);
    }

    return result;
}
