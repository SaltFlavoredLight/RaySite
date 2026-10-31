'use strict';

/**
 * function in JavaScript that restricts a number to a specified minimum and maximum range. 
 * If the number falls outside this range, it "snaps" to the nearest allowed boundary
 * 
 * @param {number} n the original number
 * @param {number} min the minimum number
 * @param {number} max the maximum number
 * @returns {number} the final number, if it's over limit, just clamp to that number
 */
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
