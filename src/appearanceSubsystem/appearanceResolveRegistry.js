'use strict';
import { flexEngineRootElement, flexEngineDefaultElements } from './flexEngine';

/**
 * Resolves the category and element registries for a given element mode.
 *
 * Supports standard element modes in the format "category/element"
 * and root element modes in the format "@root/element".
 *
 * Root elements are resolved by their registry key or className,
 * while standard elements are resolved through their category's
 * elements registry.
 *
 * Missing or invalid registry entries fall back to empty objects.
 *
 * @param {string} elementMode - The element mode to resolve.
 * @returns {{categoryRegistry: Object, elementRegistry: Object}}
 * The resolved category and element registries.
 */




export const appearanceResolveRegistry = (elementMode) => {
    const rawMode = String(elementMode || "");
    const separatorIndex = rawMode.indexOf("/");

    const category = separatorIndex === -1
        ? rawMode
        : rawMode.substring(0, separatorIndex);

    const element = separatorIndex === -1
        ? ""
        : rawMode.substring(separatorIndex + 1);

    const isRoot = category === "@root";

    const categoryRegistry = isRoot
        ? (flexEngineRootElement || {})
        : (flexEngineDefaultElements?.[category] || {});

    const elementsRegistry = isRoot
        ? categoryRegistry
        : (categoryRegistry?.elements || {});

    // Root types use className as the identifier.
    const elementRegistry = isRoot
        ? Object.entries(elementsRegistry).find(
            ([name, entry]) => entry &&
                typeof entry === "object" &&
                (name === element || entry.className === element)
        )?.[1] || {}
        : (
            elementsRegistry[element] &&
                typeof elementsRegistry[element] === "object"
                ? elementsRegistry[element]
                : {}
        );

    return {
        categoryRegistry,
        elementRegistry
    };
};
