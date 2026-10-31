'use strict';
import { decodeUnicode } from './alphaEscape/decodeUnicode';
import { reverseMapping } from './alphaEscape/reverseMapping';

/**
 * from Alpha Escape Text to the real text
 * @param {string} string alphaEscape code
 * @returns {string} original text
 */

export function fromAlphaEscape(string) {

    return string.replace(
        /_([^_]+)_/g,
        (match, code) => {

            /*
             * Normal mapped character.
             */
            if (Object.prototype.hasOwnProperty.call(
                reverseMapping,
                code
            )) {

                return reverseMapping[code];
            }


            /*
             * Unicode fallback.
             */
            const unicode = decodeUnicode(code);

            if (unicode !== null) {
                return unicode;
            }


            /*
             * Unknown AlphaEscape sequence.
             *
             * Example:
             *
             *     _xa_
             *
             * stays exactly as:
             *
             *     _xa_
             */
            return match;
        }
    );
}
