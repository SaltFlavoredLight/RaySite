'use strict';
import { appearanceBuildClassName } from './appearanceBuildClassName';
import { appearanceCreateBaseRegistry } from './appearanceCreateBaseRegistry';
import { appearanceNormalizeExtras } from './appearanceNormalizeExtras';
import { appearanceProcessState } from './appearanceProcessState';
import { appearanceResolveRegistry } from './appearanceResolveRegistry';
import { generateCssFromObject } from './generateCssFromObject';
import { BUILDER_CONFIG } from '../utils/config';

/**
 * Processes and applies appearance-based styles to a target DOM element.
 *
 * Resolves the styling registries for the specified element mode, then
 * processes each appearance, position, and supported interaction state.
 *
 * Supports base and custom positions, including positions defined by
 * extra styling registries. Custom positions may override the default
 * style and size processors, with fallback to the base registry.
 *
 * Generated CSS is stored on the target element as attributes whose
 * names are constructed from the configured class prefix, appearance
 * name, position, and state.
 *
 * Supported states:
 * - `default`       - Default desktop styles.
 * - `onMobile`      - Mobile-specific styles.
 * - `hover`         - Desktop hover styles.
 * - `onMobileHover` - Mobile hover styles.
 *
 * @param {Object} dataArray - Configuration object containing appearance definitions.
 * @param {Object} [dataArray.appearance] - Appearance configurations keyed by appearance name.
 * @param {HTMLElement} node - Target DOM element receiving the generated CSS attributes.
 * @param {boolean} isVertical - Whether the layout uses a vertical orientation.
 * @param {*} elementMode - Element mode used to resolve the appropriate styling registries.
 * @returns {void} Does not return a value. Updates the target element's attributes.
 */

export const appearanceSystem = function (dataArray, node, isVertical, elementMode) {
    if (!node || !dataArray || typeof dataArray !== "object") {
        return;
    }

    const {
        categoryRegistry, elementRegistry
    } = appearanceResolveRegistry(elementMode);

    const baseRegistry = appearanceCreateBaseRegistry(
        elementRegistry,
        categoryRegistry
    );

    const extraRegistry = appearanceNormalizeExtras(
        baseRegistry.extras
    );

    const appearance = dataArray.appearance &&
        typeof dataArray.appearance === "object"
        ? dataArray.appearance
        : {};

    const prefix = BUILDER_CONFIG?.classPrefix || "";

    const states = [
        "default",
        "onMobile",
        "hover",
        "onMobileHover"
    ];

    Object.entries(appearance).forEach(
        ([appearanceName, appearanceData]) => {
            if (!appearanceData ||
                typeof appearanceData !== "object") {
                return;
            }

            const positions = new Set(["base"]);

            Object.keys(appearanceData).forEach((key) => {
                positions.add(String(key));
            });

            Object.keys(extraRegistry || {}).forEach((key) => {
                positions.add(String(key));
            });

            positions.forEach((position) => {
                const targetData = appearanceData?.[position];

                const extraConfig = position === "base"
                    ? null
                    : extraRegistry?.[position] || null;

                const processorRegistry = extraConfig
                    ? {
                        styleDefault: typeof extraConfig.styleDefault ===
                            "function"
                            ? extraConfig.styleDefault
                            : baseRegistry.styleDefault,

                        styleMobile: typeof extraConfig.styleMobile ===
                            "function"
                            ? extraConfig.styleMobile
                            : baseRegistry.styleMobile,

                        sizeDefault: typeof extraConfig.sizeDefault ===
                            "function"
                            ? extraConfig.sizeDefault
                            : baseRegistry.sizeDefault,

                        sizeMobile: typeof extraConfig.sizeMobile ===
                            "function"
                            ? extraConfig.sizeMobile
                            : baseRegistry.sizeMobile
                    }
                    : baseRegistry;

                states.forEach((stateName) => {
                    const stateData = targetData?.[stateName];

                    if (!stateData ||
                        typeof stateData !== "object") {
                        return;
                    }

                    const cssObject = appearanceProcessState(
                        stateData,
                        stateName,
                        processorRegistry,
                        isVertical
                    );

                    if (!cssObject) {
                        return;
                    }

                    const attributeName = appearanceBuildClassName(
                        prefix,
                        appearanceName,
                        position,
                        stateName
                    );

                    node.setAttribute(
                        attributeName,
                        generateCssFromObject(cssObject)
                    );
                });
            });
        }
    );
};
