'use strict';
/**
 * Processes the style and size data for a specific appearance state.
 *
 * Selects the appropriate default or mobile processors based on
 * the state name, then merges their generated style properties
 * into a single result object.
 *
 * Supported state names include:
 * - "default"
 * - "hover"
 * - "onMobile"
 * - "onMobileHover"
 *
 * Mobile states use the mobile style and size processors.
 * Size processors also receive the vertical orientation flag.
 *
 * Size properties take precedence over style properties when
 * both processors return the same property name.
 *
 * Invalid state data returns null. Missing processors or
 * falsy processor results contribute empty objects.
 *
 * @param {Object} stateData - The appearance state's style and size data.
 * @param {string} stateName - The appearance state identifier.
 * @param {Object} processorRegistry - Registry containing style and size processors.
 * @param {boolean} isVertical - Whether vertical sizing should be applied.
 * @returns {Object|null}
 * The merged style and size properties, or null for invalid state data.
 */
export const appearanceProcessState = (stateData, stateName, processorRegistry, isVertical) => {
    if (!stateData || typeof stateData !== "object") {
        return null;
    }

    const styleData = stateData.style && typeof stateData.style === "object"
        ? stateData.style
        : {};

    const sizeData = stateData.size && typeof stateData.size === "object"
        ? stateData.size
        : {};

    const isMobile = stateName === "onMobile" || stateName === "onMobileHover";

    const styleProcessor = isMobile
        ? processorRegistry.styleMobile
        : processorRegistry.styleDefault;

    const sizeProcessor = isMobile
        ? processorRegistry.sizeMobile
        : processorRegistry.sizeDefault;

    return {
        ...(typeof styleProcessor === "function"
            ? styleProcessor(styleData) || {}
            : {}),
        ...(typeof sizeProcessor === "function"
            ? sizeProcessor(sizeData, isVertical) || {}
            : {})
    };
};
