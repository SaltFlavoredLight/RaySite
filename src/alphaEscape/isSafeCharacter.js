'use strict';
/**
 * Check: if this alpha escape system is safe or not
 *
 * @param {string} character the testing code.
 * @returns {boolean} if it's OK of base 64 excluding "/" and "-", return true (safe)
 */
export function isSafeCharacter(character) {
    return /^[A-Za-z0-9]$/.test(character);
}
