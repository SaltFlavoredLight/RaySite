'use strict';
/**
 * Normalizes extra style configurations into an object indexed
 * by their target positions.
 *
 * Supports the following input formats:
 * - A string representing a single target position.
 * - An array of position strings or configuration objects.
 * - A single configuration object with a position or target.
 * - An object mapping positions to their configurations.
 *
 * Configuration objects in arrays may identify their position
 * using "position", "target", "name", or "key".
 *
 * String entries and invalid mapped configurations are
 * normalized to empty configuration objects.
 *
 * Missing or falsy input produces an empty object.
 *
 * @param {string|Array|Object|null|undefined} extras
 * The extra style configuration to normalize.
 * @returns {Object<string, Object>}
 * An object mapping target positions to their configurations.
 */
export const appearanceNormalizeExtras = (extras) => {
    const normalized = {};

    if (!extras) {
        return normalized;
    }

    if (typeof extras === "string") {
        normalized[extras] = {};
        return normalized;
    }

    if (Array.isArray(extras)) {
        extras.forEach((item) => {
            if (typeof item === "string") {
                normalized[item] = {};
                return;
            }

            if (!item || typeof item !== "object") {
                return;
            }

            const position = item.position ?? item.target ?? item.name ?? item.key;

            if (position) {
                normalized[String(position)] = item;
            }
        });

        return normalized;
    }

    if (typeof extras === "object" &&
        (extras.position ||
            extras.target ||
            extras.styleDefault ||
            extras.styleMobile ||
            extras.sizeDefault ||
            extras.sizeMobile)) {
        const position = extras.position ?? extras.target;

        if (position) {
            normalized[String(position)] = extras;
        }

        return normalized;
    }

    Object.entries(extras).forEach(([position, config]) => {
        normalized[position] =
            config && typeof config === "object"
                ? config
                : {};
    });

    return normalized;
};
