'use strict';
import { defaultAppearance } from './defaultAppearance';

/**
 * Creates a base style processor registry using the resolved
 * element and category configurations.
 *
 * Processor functions are selected in the following priority:
 * 1. Element registry
 * 2. Category registry
 * 3. Default appearance registry
 * 4. Empty object fallback
 *
 * Extra style configurations are resolved from the element
 * registry first, followed by the category registry.
 *
 * @param {Object} elementRegistry - Configuration for the target element.
 * @param {Object} categoryRegistry - Configuration for the element category.
 * @returns {{
 *   styleDefault: Function,
 *   styleMobile: Function,
 *   sizeDefault: Function,
 *   sizeMobile: Function,
 *   extras: *
 * }}
 * The resolved style processors and extra configurations.
 */
export const appearanceCreateBaseRegistry = (elementRegistry, categoryRegistry) => {
    const getProcessor = (name) => typeof elementRegistry?.[name] === "function"
        ? elementRegistry[name]
        : typeof categoryRegistry?.[name] === "function"
            ? categoryRegistry[name]
            : typeof defaultAppearance?.[name] === "function"
                ? defaultAppearance[name]
                : () => ({});

    return {
        styleDefault: getProcessor("styleDefault"),
        styleMobile: getProcessor("styleMobile"),
        sizeDefault: getProcessor("sizeDefault"),
        sizeMobile: getProcessor("sizeMobile"),
        extras: elementRegistry?.extras ?? categoryRegistry?.extras ?? null
    };
};
