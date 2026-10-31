'use strict';
/**
 * This function takes a CSS object and converts it into a CSS string.
 * it will ignore any undefined, null, or empty string values.
 * @param {object} cssObject an object where keys are CSS properties and values are the corresponding CSS values.
 * @returns {string} a string representation of the CSS rules.
 */
export const generateCssFromObject = (cssObject) => {
    if (!cssObject || typeof cssObject !== "object") {
        return "";
    }

    return Object.entries(cssObject)
        .filter(([_, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${key}: ${value};`)
        .join("");
};
