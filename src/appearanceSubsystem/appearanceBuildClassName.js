'use strict';
import { toAlphaEscape } from '../alphaEscape/toAlphaEscape';

/**
 * Generates a CSS class name for a FlexEngine appearance state.
 *
 * Combines the configured prefix, appearance name, optional
 * state suffix, and optional target position suffix.
 *
 * A leading "." is removed from the appearance name.
 * The prefix is normalized to end with a hyphen.
 *
 * Supported state suffixes:
 * - "default"       -> ""
 * - "onMobile"      -> "-onMobile"
 * - "hover"         -> "-onHover"
 * - "onMobileHover" -> "-onMobileHover"
 *
 * Target positions other than "base" are appended using
 * the "-at" suffix and escaped through toAlphaEscape().
 *
 * Missing, empty, or "base" positions do not add a suffix.
 *
 * @param {string} prefix - The CSS class prefix.
 * @param {string} appearanceName - The appearance identifier.
 * @param {string|number|null|undefined} position - Optional target position.
 * @param {string} stateName - The appearance state identifier.
 * @returns {string}
 * The generated CSS class name.
 *
 * @example
 * flexEngineStylesBuildClassName("fe-", "button", "base", "default");
 * // "fe-styles-button"
 *
 * @example
 * flexEngineStylesBuildClassName("fe-", "button", "base", "hover");
 * // "fe-styles-button-onHover"
 */
export const appearanceBuildClassName = (prefix, appearanceName, position, stateName) => {
    const cleanAppearance = String(appearanceName || "").replace(/^\./, "");

    const stateSuffix = {
        default: "",
        onMobile: "-onMobile",
        hover: "-onHover",
        onMobileHover: "-onMobileHover"
    }[stateName] || "";

    const targetSuffix = position === undefined ||
        position === null ||
        position === "" ||
        position === "base"
        ? ""
        : `-at${toAlphaEscape(String(position))}`;

    const normalizedPrefix = String(prefix).endsWith("-")
        ? String(prefix)
        : `${prefix}-`;

    return `${normalizedPrefix}styles-${cleanAppearance}${stateSuffix}${targetSuffix}`;
};
