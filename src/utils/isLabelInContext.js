'use strict';
/**
 * Checks whether a context setting contains a specified label.
 *
 * Context settings may be provided as an array or as a string
 * containing values separated by commas or whitespace.
 *
 * Both context values and the target label are converted to
 * strings and trimmed before comparison.
 *
 * Matching is case-sensitive.
 *
 * @param {string|string[]} contextSetting
 *     The context values to search.
 *
 * @param {string} label
 *     The label to look for.
 *
 * @returns {boolean}
 *     True if the normalized context contains the label,
 *     otherwise false.
 *
 * @example
 * flexEngineCheckContext("desktop, tablet mobile", "tablet");
 * // true
 *
 * @example
 * flexEngineCheckContext(["desktop", "mobile"], "tablet");
 * // false
 */
const isLabelInContext = (contextSetting, label) => {
    if (label == null) {
        return false;
    }

    const target = String(label).trim();

    if (!target) {
        return false;
    }

    let list;

    if (Array.isArray(contextSetting)) {
        list = contextSetting;
    } else if (typeof contextSetting === "string") {
        list = contextSetting.split(/[,\s]+/);
    } else {
        return false;
    }

    return list
        .filter(value => value != null)
        .map(value => String(value).trim())
        .filter(Boolean)
        .includes(target);
};
