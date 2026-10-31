'use strict';
import { defaultMapping } from './alphaEscape/defaultMapping';

/**
 * Reverse Mapping - there also have a helper that help map the reverse of default mapping.
 *
 * @type {Object<string, string>}
 */
export const reverseMapping = Object.fromEntries(
    Object.entries(defaultMapping).map(
        ([character, code]) => [code, character]
    )
);
