'use strict';

import { defaultAnimation } from './defaultAnimation';
import { flexEngineDefaultVariables } from './flexEngine';
import { BUILDER_CONFIG } from './utils/config';
import { num } from './utils/num';


/* ============================================================
 * Constants
 * ============================================================ */

const DELAY_PLACEHOLDER = '<delay>';

const ATTR = {
    get self() {
        return `${BUILDER_CONFIG.classPrefix}animation-config-self`;
    },

    get selfTrigger() {
        return `${BUILDER_CONFIG.classPrefix}animation-config-self-trigger`;
    },

    get all() {
        return `${BUILDER_CONFIG.classPrefix}animation-config-all`;
    },

    get allTrigger() {
        return `${BUILDER_CONFIG.classPrefix}animation-config-all-trigger`;
    },

    get firstDelay() {
        return `${BUILDER_CONFIG.classPrefix}animation-config-all-firstdelay`;
    },

    get timeRange() {
        return `${BUILDER_CONFIG.classPrefix}animation-config-all-timeRange`;
    },

    get inherit() {
        return `${BUILDER_CONFIG.classPrefix}animation-self-inherit`;
    }
};


/* ============================================================
 * Query Helpers
 * ============================================================ */

/**
 * Get registered animation IDs.
 */
function getAnimationTypes() {
    return Object.keys(defaultAnimation).map(Number);
}

/**
 * Build choices for the animation selector.
 */
function getAnimationChoices(includeInherit = false) {
    const choices = getAnimationTypes().map(type => ({
        name: defaultAnimation[type].name,
        value: type
    }));

    if (includeInherit) {
        choices.unshift({
            name: 'Inherit',
            value: -1
        });
    }

    return choices;
}

/**
 * Collect optional queries from all animation definitions.
 *
 * Queries with the same name are merged.
 * The first definition takes priority.
 */
function getOptionalQueries() {
    const queries = new Map();

    for (const type of getAnimationTypes()) {
        const animation = defaultAnimation[type];

        if (!Array.isArray(animation?.query)) {
            continue;
        }

        for (const query of animation.query) {
            if (!query?.name) {
                continue;
            }

            if (!queries.has(query.name)) {
                queries.set(query.name, {
                    ...query,
                    visibleIf: {
                        name: 'animationType',
                        value: [type]
                    }
                });

                continue;
            }

            const existing = queries.get(query.name);
            const types = existing.visibleIf.value;

            if (!types.includes(type)) {
                types.push(type);
            }
        }
    }

    return [...queries.values()];
}

/**
 * Generate the query schema for an individual element.
 */
function buildSelfQuery() {
    const types = getAnimationTypes();

    const visibleIf = () => ({
        name: 'animationType',
        value: [...types]
    });

    return [
        {
            name: 'animationType',
            label: 'Animation',
            type: 'selection',
            choice: getAnimationChoices(true),
            default: 1
        },
        {
            name: 'animationCurve',
            label: 'Curve',
            type: 'curve',
            visibleIf: visibleIf()
        },
        {
            name: 'duration',
            label: 'Duration',
            type: 'number',
            default: 0.6,
            visibleIf: visibleIf()
        },
        {
            name: 'delayTime',
            label: 'Delay',
            type: 'number',
            default: 0,
            visibleIf: visibleIf()
        },
        {
            name: 'trigger',
            label: 'Trigger',
            type: 'integer',
            default: 1,
            visibleIf: visibleIf()
        },
        ...getOptionalQueries()
    ];
}

/**
 * Generate the query schema for section animations.
 */
function buildAllQuery() {
    return [
        {
            name: 'animationType',
            label: 'Animation',
            type: 'selection',
            choice: getAnimationChoices()
        },
        {
            name: 'animationCurve',
            label: 'Curve',
            type: 'curve'
        },
        {
            name: 'duration',
            label: 'Duration',
            type: 'number',
            default: 0.6
        },
        {
            name: 'delayTime',
            label: 'First Delay',
            type: 'number',
            default: 0
        },
        {
            name: 'executionInterval',
            label: 'Execution Interval',
            type: 'number',
            default: 0
        },
        {
            name: 'trigger',
            label: 'Trigger',
            type: 'integer',
            default: 1
        },
        ...getOptionalQueries()
    ];
}


/* ============================================================
 * Animation Helpers
 * ============================================================ */

/**
 * Resolve animation configuration.
 * Invalid IDs fall back to animation 1.
 */
function resolveAnimation(animationType) {
    let type = Number(animationType);

    if (
        !Number.isInteger(type) ||
        !defaultAnimation[type]
    ) {
        type = 1;
    }

    return defaultAnimation[type];
}

/**
 * Generate animation-specific CSS variables.
 */
function getAnimationVariables(entry, animation) {
    if (typeof entry.variables !== 'function') {
        return '';
    }

    try {
        return entry.variables(animation) || '';
    } catch {
        return '';
    }
}

/**
 * Resolve duration, including animation overrides.
 */
function getAnimationDuration(entry, animation) {
    if (entry.setting?.timeOverride === true) {
        return `${entry.setting.timeOverrideSeconds}s`;
    }

    return `${num(animation.duration) || 0.6}s`;
}

/**
 * Convert stored curve data into a CSS timing function.
 */
function getAnimationCurve(animation) {
    try {
        return flexEngineDefaultVariables.curve.curve.render(
            animation.animationCurve
        ) || '';
    } catch {
        return '';
    }
}

/**
 * Generate the final CSS animation string.
 *
 * For section animations, delay is left as a placeholder.
 */
function buildAnimationCSS(animation, isSection = false) {
    const entry = resolveAnimation(animation.animationType);
    const prefix = BUILDER_CONFIG.classPrefix;

    const variables = getAnimationVariables(entry, animation);
    const duration = getAnimationDuration(entry, animation);
    const curve = getAnimationCurve(animation);

    const delay = isSection
        ? `${DELAY_PLACEHOLDER}s`
        : `${animation.delayTime || 0}s`;

    const css =
        `animation:${prefix}animation-${entry.name} ` +
        `${duration} ${curve} ${delay} 1 normal both;`;

    return variables + css;
}


/* ============================================================
 * Attribute Helpers
 * ============================================================ */

/**
 * Set multiple attributes in one operation.
 */
function setAttributes(node, attributes) {
    for (const [name, value] of Object.entries(attributes)) {
        node.setAttribute(name, value);
    }
}

/**
 * Clear a list of attributes without removing them.
 */
function clearAttributes(node, ...names) {
    for (const name of names) {
        node.setAttribute(name, '');
    }
}

/**
 * Parse numeric attributes safely.
 */
function parseAttributeNumber(value) {
    if (value == null) {
        return 0;
    }

    const parsed = parseFloat(String(value).trim());

    return Number.isFinite(parsed) ? parsed : 0;
}


/* ============================================================
 * Render Functions
 * ============================================================ */

/**
 * Mode 0:
 * Completely disable animation configuration.
 */
function renderDisabled(dataArray, node) {
    clearAttributes(
        node,
        ATTR.self,
        ATTR.selfTrigger,
        ATTR.all,
        ATTR.allTrigger,
        ATTR.firstDelay,
        ATTR.timeRange
    );
}

/**
 * Mode 1:
 * Render an individual element's animation.
 */
function renderSelf(dataArray, node) {
    const animation = dataArray.animation;

    if (Number(animation.animationType) === -1) {
        setAttributes(node, {
            [ATTR.self]: 'inherit',
            [ATTR.selfTrigger]: ''
        });

        return;
    }

    setAttributes(node, {
        [ATTR.self]: buildAnimationCSS(animation),
        [ATTR.selfTrigger]: animation.trigger || 1
    });
}

/**
 * Mode 2:
 * Render the section's own animation and its
 * configuration for descendant elements.
 */
function renderSection(dataArray, node, expend = true) {
    if (!node || !dataArray) {
        return;
    }

    const animation = dataArray.animation || {};

    // Render the section element itself.
    renderSelf(
        { animation: animation.self || {} },
        node
    );

    const allAnimation = animation.all;

    // No descendant animation.
    if (!allAnimation) {
        clearAttributes(
            node,
            ATTR.all,
            ATTR.allTrigger,
            ATTR.firstDelay,
            ATTR.timeRange
        );

        if (expend === true) {
            applySectionAnimation(node);
        }

        return;
    }

    // Inherit descendant animation.
    if (Number(allAnimation.animationType) === -1) {
        setAttributes(node, {
            [ATTR.all]: 'inherit',
            [ATTR.allTrigger]: '',
            [ATTR.firstDelay]: '',
            [ATTR.timeRange]: ''
        });

        return;
    }

    // Generate the section's animation configuration.
    setAttributes(node, {
        [ATTR.all]: buildAnimationCSS(allAnimation, true),
        [ATTR.allTrigger]: allAnimation.trigger || 1,
        [ATTR.firstDelay]: num(allAnimation.delayTime) || 0,
        [ATTR.timeRange]: num(allAnimation.executionInterval) || 0
    });

    if (expend === true) {
        applySectionAnimation(node);
    }
}

/**
 * Mode 3:
 * Bypass normal configuration and use inheritance.
 */
function renderInherit(dataArray, node) {
    setAttributes(node, {
        [ATTR.self]: 'inherit',
        [ATTR.selfTrigger]: ''
    });
}

/**
 * Fallback for unknown render modes.
 */
function renderOther(dataArray, node) {
    return;
}


/* ============================================================
 * Section Animation Helpers
 * ============================================================ */

/**
 * Walk through descendant nodes and apply the
 * section animation to eligible elements.
 *
 * The callback receives each eligible node,
 * its depth, and its animation index.
 */
function walkAnimationNodes(root, callback) {
    let index = 0;

    function walk(node, depth) {
        const inherit = node.getAttribute(ATTR.inherit);

        const enabled =
            inherit !== null &&
            inherit !== '' &&
            inherit !== '0';

        if (enabled) {
            callback(node, depth, index);
            index++;
        }

        for (const child of node.children) {
            walk(child, depth + 1);
        }
    }

    for (const child of root.children) {
        walk(child, 1);
    }
}

/**
 * Apply the section's animation configuration
 * to eligible descendant elements.
 */
function applySectionAnimation(node) {
    if (!node) {
        return;
    }

    const allConfig = node.getAttribute(ATTR.all) || '';
    const allTrigger = node.getAttribute(ATTR.allTrigger) || '';

    if (!allConfig || allConfig === 'inherit') {
        return;
    }

    const firstDelay = parseAttributeNumber(
        node.getAttribute(ATTR.firstDelay)
    );

    const timeRange = parseAttributeNumber(
        node.getAttribute(ATTR.timeRange)
    );

    walkAnimationNodes(node, (child, depth, index) => {
        const delay = firstDelay + index * timeRange;

        const css = allConfig.split(DELAY_PLACEHOLDER).join(
            String(delay)
        );

        setAttributes(child, {
            [ATTR.inherit]: String(depth),
            [ATTR.self]: css,
            [ATTR.selfTrigger]: allTrigger
        });
    });
}


/* ============================================================
 * Public FlexEngine Animation API
 * ============================================================ */

export const flexEngineAnimation = {
    name: 'animation',

    get selfQuery() {
        return buildSelfQuery();
    },

    get allQuery() {
        return buildAllQuery();
    },

    render: {
        0: renderDisabled,
        1: renderSelf,
        2: renderSection,
        3: renderInherit,
        other: renderOther
    },

    applySectionAnimation
};