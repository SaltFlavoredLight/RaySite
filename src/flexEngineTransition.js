'use strict';

import { flexEngineDefaultVariables } from './flexEngine';
import { BUILDER_CONFIG } from './utils/config';


/* ============================================================
 * Query Helpers
 * ============================================================ */

/**
 * Build a category from property names and labels.
 */
function createCategory(label, properties) {
    return {
        label,
        choice: properties.map(([name, label]) => ({
            name,
            label
        }))
    };
}

/**
 * Shared property choices for SELF and ALL queries.
 *
 * The ALL query includes margin properties.
 * The SELF query does not.
 */
function getPropertyCategories(includeMargin = false) {
    const spacing = [
        ['padding', 'Padding'],
        ['padding-top', 'Padding Top'],
        ['padding-right', 'Padding Right'],
        ['padding-bottom', 'Padding Bottom'],
        ['padding-left', 'Padding Left']
    ];

    if (includeMargin) {
        spacing.unshift(
            ['margin', 'Margin'],
            ['margin-top', 'Margin Top'],
            ['margin-right', 'Margin Right'],
            ['margin-bottom', 'Margin Bottom'],
            ['margin-left', 'Margin Left']
        );
    }

    return [
        createCategory('Basic', [
            ['all', 'All'],
            ['opacity', 'Opacity'],
            ['visibility', 'Visibility']
        ]),

        createCategory('Transform', [
            ['transform', 'Transform']
        ]),

        createCategory('Size', [
            ['width', 'Width'],
            ['height', 'Height'],
            ['min-width', 'Minimum Width'],
            ['max-width', 'Maximum Width'],
            ['min-height', 'Minimum Height'],
            ['max-height', 'Maximum Height']
        ]),

        createCategory('Spacing', spacing),

        createCategory('Background & Color', [
            ['background', 'Background'],
            ['background-color', 'Background Color'],
            ['color', 'Text Color'],
            ['border-color', 'Border Color']
        ]),

        createCategory('Border', [
            ['border', 'Border'],
            ['border-width', 'Border Width'],
            ['border-top-width', 'Top Border Width'],
            ['border-right-width', 'Right Border Width'],
            ['border-bottom-width', 'Bottom Border Width'],
            ['border-left-width', 'Left Border Width'],
            ['border-radius', 'Border Radius']
        ]),

        createCategory('Shadow & Filter', [
            ['box-shadow', 'Box Shadow'],
            ['filter', 'Filter'],
            ['backdrop-filter', 'Backdrop Filter']
        ]),

        createCategory('Other', [
            ['font-size', 'Font Size'],
            ['line-height', 'Line Height'],
            ['letter-spacing', 'Letter Spacing'],
            ['flex', 'Flex'],
            ['flex-grow', 'Flex Grow'],
            ['flex-shrink', 'Flex Shrink'],
            ['gap', 'Gap']
        ])
    ];
}

/**
 * Generate a transition query.
 *
 * isSelf = true:
 *   - Include inheritance
 *   - Apply visibility conditions
 *   - Exclude margin properties
 */
function buildQuery(isSelf = false) {
    const query = [];

    if (isSelf) {
        query.push({
            name: 'inherit',
            label: 'Inherit',
            type: 'boolean/checkmark'
        });
    }

    const fields = [
        {
            name: 'property',
            label: 'Property',
            type: 'selection/popup',
            catergory: getPropertyCategories(!isSelf),
            default: []
        },
        {
            name: 'duration',
            label: 'Duration',
            type: 'integer/noNeg',
            default: 300
        },
        {
            name: 'delay',
            label: 'Delay',
            type: 'integer/noNeg',
            default: 0
        },
        {
            name: 'curve',
            label: 'Timing Curve',
            type: 'curve/curve'
        }
    ];

    for (const field of fields) {
        if (isSelf) {
            field.visibleIf = {
                name: 'inherit',
                value: false
            };
        }

        query.push(field);
    }

    return query;
}


/* ============================================================
 * Transition CSS Helpers
 * ============================================================ */

/**
 * Convert transition duration and delay
 * from milliseconds into seconds.
 */
function getTransitionTiming(transition) {
    const duration = Math.max(
        0,
        Number(transition.duration) || 0
    );

    const delay = Math.max(
        0,
        Number(transition.delay) || 0
    );

    return {
        durationSeconds: duration / 1000,
        delaySeconds: delay / 1000
    };
}

/**
 * Resolve the transition timing curve.
 */
function getTransitionCurve(transition) {
    try {
        return (
            flexEngineDefaultVariables.curve.curve.render(
                transition.curve
            ) || 'ease'
        );
    } catch (e) {
        return 'ease';
    }
}

/**
 * Generate a transition shorthand value.
 *
 * Example:
 * opacity 0.3s ease 0s,transform 0.3s ease 0s
 */
function renderSingle(transition) {
    if (!transition) {
        return '';
    }

    if (!Array.isArray(transition.property)) {
        return '';
    }

    if (transition.property.length === 0) {
        return '';
    }

    const {
        durationSeconds,
        delaySeconds
    } = getTransitionTiming(transition);

    const curve = getTransitionCurve(transition);
    const parts = [];

    for (const property of transition.property) {
        if (
            typeof property !== 'string' ||
            property.trim() === ''
        ) {
            continue;
        }

        parts.push(
            `${property} ${durationSeconds}s ${curve} ${delaySeconds}s`
        );
    }

    return parts.join(',');
}


/* ============================================================
 * Render Helpers
 * ============================================================ */

/**
 * Mode 0:
 * Disable transition configuration.
 */
function renderDisabled(dataArray, node) {
    if (!node) {
        return;
    }

    const prefix = BUILDER_CONFIG.classPrefix;

    node.setAttribute(
        `${prefix}transition-config-self`,
        ''
    );

    node.setAttribute(
        `${prefix}transition-config-all`,
        ''
    );

    node.setAttribute(
        `${prefix}transition-self-inherit`,
        ''
    );
}

/**
 * Mode 1:
 * Render the SELF transition configuration.
 */
function renderSelf(dataArray, node) {
    if (!node) {
        return;
    }

    const prefix = BUILDER_CONFIG.classPrefix;

    const attrSelf =
        `${prefix}transition-config-self`;

    const attrInherit =
        `${prefix}transition-self-inherit`;

    const transition =
        dataArray &&
        dataArray.transition &&
        dataArray.transition.self;

    // Inherit from parent section.
    if (transition && transition.inherit === true) {
        node.setAttribute(attrInherit, '1');
        node.setAttribute(attrSelf, 'inherit');
        return;
    }

    // Normal self transition.
    node.setAttribute(attrInherit, '');

    const css = flexEngineTransition.renderSingle(
        transition
    );

    node.setAttribute(
        attrSelf,
        css ? `transition:${css};` : ''
    );
}

/**
 * Mode 2:
 * Render SELF and ALL transition configurations.
 */
function renderSection(dataArray, node) {
    if (!node || !dataArray) {
        return;
    }

    const prefix = BUILDER_CONFIG.classPrefix;
    const attrAll = `${prefix}transition-config-all`;

    const transitionData = dataArray.transition || {};

    /*
     * SELF
     *
     * Preserves the original data structure
     * passed to render[1].
     */
    const selfData = structuredClone(dataArray);

    selfData.transition = transitionData.self || {};

    flexEngineTransition.render[1](
        selfData,
        node
    );

    /*
     * ALL
     */
    const allTransition = transitionData.all;

    if (!allTransition) {
        node.setAttribute(attrAll, '');
        return;
    }

    const css = flexEngineTransition.renderSingle(
        allTransition
    );

    node.setAttribute(
        attrAll,
        css ? `transition:${css};` : ''
    );
}

/**
 * Mode 3:
 * Force transition inheritance.
 */
function renderInherit(dataArray, node) {
    if (!node) {
        return;
    }

    const prefix = BUILDER_CONFIG.classPrefix;

    node.setAttribute(
        `${prefix}transition-config-self`,
        'inherit'
    );

    node.setAttribute(
        `${prefix}transition-self-inherit`,
        '1'
    );
}

/**
 * Unknown render mode.
 */
function renderOther(dataArray, node) {
    return;
}


/* ============================================================
 * Section Transition Helpers
 * ============================================================ */

/**
 * Determine whether the node has inheritance enabled.
 */
function isInheritanceEnabled(node, attrInherit) {
    const value = node.getAttribute(attrInherit);

    return (
        value !== null &&
        value !== '' &&
        value !== '0'
    );
}

/**
 * Traverse descendant elements in depth-first order.
 *
 * The callback receives:
 *   - current node
 *   - current depth
 */
function walkDescendants(node, callback) {
    function walk(currentNode, depth) {
        callback(currentNode, depth);

        [...currentNode.children].forEach(child => {
            walk(child, depth + 1);
        });
    }

    [...node.children].forEach(child => {
        walk(child, 1);
    });
}

/**
 * Apply a section transition to inheriting descendants.
 */
function applySectionTransition(node) {
    if (!node) {
        return;
    }

    const prefix = BUILDER_CONFIG.classPrefix;

    const attrAll =
        `${prefix}transition-config-all`;

    const attrSelf =
        `${prefix}transition-config-self`;

    const attrInherit =
        `${prefix}transition-self-inherit`;

    const allConfig =
        node.getAttribute(attrAll) || '';

    if (!allConfig || allConfig === 'inherit') {
        return;
    }

    walkDescendants(node, (child, depth) => {
        if (!isInheritanceEnabled(child, attrInherit)) {
            return;
        }

        child.setAttribute(
            attrInherit,
            String(depth)
        );

        child.setAttribute(
            attrSelf,
            allConfig
        );
    });
}


/* ============================================================
 * Public FlexEngine Transition
 * ============================================================ */

export const flexEngineTransition = {
    name: 'transition',

    selfQuery: buildQuery(true),
    allQuery: buildQuery(false),

    render: {
        0: renderDisabled,
        1: renderSelf,
        2: renderSection,
        3: renderInherit,
        other: renderOther
    },

    applySectionTransition,
    renderSingle
};