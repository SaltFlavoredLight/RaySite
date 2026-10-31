'use strict';
/**
 * Converts a value to a finite number, falling back to 0 if the result is invalid.
 *
 * @param {*} v - The value to convert.
 * @returns {number} The parsed finite number, or 0 if the value is NaN or Infinite.
 */
export const num = v => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};
