'use strict';
import { clamp } from './utils/clamp';
import { BUILDER_CONFIG } from './utils/config';
import { num } from './utils/num';

/**
 * Default Animation Setting, this is how it work for queries.
 */


export const defaultAnimation = {
    0: {
        name: "showup",
        query: [],
        variables: function (anim) {
            return "";
        },
        cssRawCode: `
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}`,
        setting: {
            timeOverride: true,
            timeOverrideSeconds: 0
        }
    },

    1: {
        name: "fade",
        query: [],
        variables: function (anim) {
            return "";
        },
        cssRawCode: `
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}`,
        setting: {}
    },

    2: {
        name: "flyIn",
        query: [
            {
                name: "direction",
                label: "Direction",
                type: "integer/slide",
                min: 0,
                max: 359,
                step: 1,
                default: 0
            },
            {
                name: "intensity",
                label: "Distance",
                type: "integer/noNeg",
                default: 60
            }
        ],
        variables: function (anim) {
            const direction = (num(anim.direction) % 360 + 360) % 360;
            const intensity = Math.max(0, num(anim.intensity));
            const rad = direction * Math.PI / 180;
            const x = Math.cos(rad) * intensity;
            const y = Math.sin(rad) * intensity;

            return (
                `--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-x:${x}px;` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-y:${y}px;`
            );
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform: translate(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-x, 0px),
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-y, 60px)
				);
			}
			to {
				opacity: 1;
				transform: translate(0, 0);
			}`,
        setting: {}
    },

    3: {
        name: "growTurn",
        query: [
            {
                name: "rotate",
                label: "Rotate Deg",
                type: "integer",
                default: -25
            }
        ],
        variables: function (anim) {
            const rotate = num(anim.rotate);

            return `--${BUILDER_CONFIG.classPrefix}animation-variables-growTurn-rotate:${rotate}deg;`;
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform: scale(0.3) rotate(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-growTurn-rotate, -25deg)
				);
			}
			to {
				opacity: 1;
				transform: scale(1) rotate(0deg);
			}`,
        setting: {}
    },

    4: {
        name: "zoom",
        query: [],
        variables: function (anim) {
            return "";
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform: scale(0.4);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}`,
        setting: {}
    },

    5: {
        name: "basicZoom",
        query: [
            {
                name: "scaleStart",
                label: "Starting Scale %",
                type: "integer/slide",
                min: 0,
                max: 100,
                step: 1,
                default: 85
            }
        ],
        variables: function (anim) {
            const scaleStart = num(anim.scaleStart) || 100;

            return `--${BUILDER_CONFIG.classPrefix}animation-variables-basicZoom-scaleStart:${scaleStart / 100};`;
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform: scale(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-basicZoom-scaleStart, 0.85)
				);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}`,
        setting: {}
    },

    6: {
        name: "rise",
        query: [
            {
                name: "direction",
                label: "Direction",
                type: "selection",
                choice: [
                    { label: "Top", value: 1 },
                    { label: "Top Right", value: 2 },
                    { label: "Right", value: 3 },
                    { label: "Bottom Right", value: 4 },
                    { label: "Bottom", value: 5 },
                    { label: "Bottom Left", value: 6 },
                    { label: "Left", value: 7 },
                    { label: "Top Left", value: 8 }
                ]
            },
            {
                name: "intensity",
                label: "Distance",
                type: "integer/noNeg",
                default: 25
            }
        ],
        variables: function (anim) {
            const direction = clamp(num(anim.direction) || 1, 1, 8);
            const intensity = Math.max(0, num(anim.intensity));
            const angle = (direction - 1) * 45;
            const rad = angle * Math.PI / 180;

            return (
                `--${BUILDER_CONFIG.classPrefix}animation-variables-rise-x:${Math.cos(rad) * intensity}px;` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-rise-y:${Math.sin(rad) * intensity}px;`
            );
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform: translate(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-rise-x, 0px),
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-rise-y, 25px)
				);
			}
			to {
				opacity: 1;
				transform: translate(0, 0);
			}`,
        setting: {}
    },

    7: {
        name: "stretch",
        query: [
            {
                name: "direction",
                label: "Direction",
                type: "selection",
                choice: [
                    { label: "Top", value: 1 },
                    { label: "Right", value: 2 },
                    { label: "Bottom", value: 3 },
                    { label: "Left", value: 4 }
                ]
            }
        ],
        variables: function (anim) {
            const direction = clamp(num(anim.direction) || 1, 1, 4);
            const map = ["top", "right", "bottom", "left"];

            return `--${BUILDER_CONFIG.classPrefix}animation-variables-stretch-origin:${map[direction - 1]};`;
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform-origin: var(
					--${BUILDER_CONFIG.classPrefix}animation-variables-stretch-origin,
					left
				);
				transform: scaleX(0.1);
			}
			to {
				opacity: 1;
				transform: scaleX(1);
			}`,
        setting: {}
    },

    8: {
        name: "wipe",
        query: [
            {
                name: "direction",
                label: "Direction",
                type: "selection",
                choice: [
                    { label: "Top", value: 1 },
                    { label: "Right", value: 2 },
                    { label: "Bottom", value: 3 },
                    { label: "Left", value: 4 }
                ]
            }
        ],
        variables: function (anim) {
            const direction = clamp(num(anim.direction) || 1, 1, 4);

            const clip = [
                "inset(100% 0 0 0)",
                "inset(0 0 0 100%)",
                "inset(0 0 100% 0)",
                "inset(0 100% 0 0)"
            ];

            return `--${BUILDER_CONFIG.classPrefix}animation-variables-wipe-from:${clip[direction - 1]};`;
        },
        cssRawCode: `
			from {
				opacity: 0;
				clip-path: var(
					--${BUILDER_CONFIG.classPrefix}animation-variables-wipe-from,
					inset(0 100% 0 0)
				);
			}
			to {
				opacity: 1;
				clip-path: inset(0 0 0 0);
			}`,
        setting: {}
    },

    9: {
        name: "peekIn",
        query: [
            {
                name: "direction",
                label: "Direction",
                type: "selection",
                choice: [
                    { label: "Top", value: 1 },
                    { label: "Right", value: 2 },
                    { label: "Bottom", value: 3 },
                    { label: "Left", value: 4 }
                ]
            },
            {
                name: "intensity",
                label: "Distance",
                type: "integer/noNeg",
                default: 40
            }
        ],
        variables: function (anim) {
            const direction = clamp(num(anim.direction) || 1, 1, 4);
            const intensity = Math.max(0, num(anim.intensity));

            const dirs = [
                [0, -1],
                [1, 0],
                [0, 1],
                [-1, 0]
            ];

            const d = dirs[direction - 1];

            const clip = [
                "inset(100% 0 0 0)",
                "inset(0 0 0 100%)",
                "inset(0 0 100% 0)",
                "inset(0 100% 0 0)"
            ];

            return (
                `--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-x:${d[0] * intensity}px;` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-y:${d[1] * intensity}px;` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-from:${clip[direction - 1]};`
            );
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform: translate(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-x, -40px),
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-y, 0px)
				);
				clip-path: var(
					--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-from,
					inset(0 100% 0 0)
				);
			}
			to {
				opacity: 1;
				transform: translate(0, 0);
				clip-path: inset(0 0 0 0);
			}`,
        setting: {}
    },

    10: {
        name: "box",
        query: [
            {
                name: "x",
                label: "Horizontal Origin",
                type: "selection",
                choice: [
                    { label: "Right", value: 1 },
                    { label: "Center", value: 2 },
                    { label: "Left", value: 3 }
                ]
            },
            {
                name: "y",
                label: "Vertical Origin",
                type: "selection",
                choice: [
                    { label: "Bottom", value: 1 },
                    { label: "Center", value: 2 },
                    { label: "Top", value: 3 }
                ]
            }
        ],
        variables: function (anim) {
            const xIndex = clamp(num(anim.x) || 1, 1, 3);
            const yIndex = clamp(num(anim.y) || 1, 1, 3);

            const map = {
                1: "100%",
                2: "50%",
                3: "0%"
            };

            return (
                `--${BUILDER_CONFIG.classPrefix}animation-variables-box-x:${map[xIndex]};` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-box-y:${map[yIndex]};`
            );
        },
        cssRawCode: `
			from {
				opacity: 0;
				clip-path: inset(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-box-y, 50%)
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-box-x, 50%)
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-box-y, 50%)
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-box-x, 50%)
				);
			}
			to {
				opacity: 1;
				clip-path: inset(0 0 0 0);
			}`,
        setting: {}
    },

    11: {
        name: "expand",
        query: [],
        variables: function (anim) {
            return "";
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform: scale(0);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}`,
        setting: {}
    },

    12: {
        name: "tumble",
        query: [
            {
                name: "directionRight",
                label: "Direction Right?",
                type: "selection",
                choice: [
                    { label: "Left", value: 0 },
                    { label: "Right", value: 1 }
                ]
            },
            {
                name: "fromUp",
                label: "From Up?",
                type: "selection",
                choice: [
                    { label: "No", value: 0 },
                    { label: "Yes", value: 1 }
                ]
            },
            {
                name: "rotateIntensity",
                label: "Rotate Deg",
                type: "integer",
                default: -120
            }
        ],
        variables: function (anim) {
            const directionRight = anim.directionRight ? 1 : 0;
            const fromUp = anim.fromUp ? 1 : 0;
            const intensity = num(anim.rotateIntensity);

            return (
                `--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-x:${directionRight ? 40 : -40}px;` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-y:${fromUp ? -40 : 40}px;` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-intensity:${intensity}deg;` +
                `transform-origin:top left;`
            );
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform-origin: top left;
				transform:
					translate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-x, -40px),
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-y, -40px)
					)
					rotate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-intensity, -120deg)
					);
			}
			to {
				opacity: 1;
				transform: translate(0, 0) rotate(0deg);
			}`,
        setting: {}
    },

    13: {
        name: "rotate",
        query: [
            {
                name: "directionRight",
                label: "Direction Right?",
                type: "selection",
                choice: [
                    { label: "Left", value: 0 },
                    { label: "Right", value: 1 }
                ]
            },
            {
                name: "rotateIntensity",
                label: "Rotate Deg",
                type: "integer",
                default: 180
            }
        ],
        variables: function (anim) {
            const directionRight = anim.directionRight ? 1 : 0;
            const intensity = num(anim.rotateIntensity);

            return (
                `--${BUILDER_CONFIG.classPrefix}animation-variables-rotate-intensity:${directionRight ? intensity : -intensity}deg;` +
                `transform-origin:center center;`
            );
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform:
					translateY(50%)
					rotate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-rotate-intensity, 180deg)
					);
			}
			to {
				opacity: 1;
				transform: translateY(0) rotate(0deg);
			}`,
        setting: {}
    },

    14: {
        name: "slideRotate",
        query: [
            {
                name: "rotateIntensity",
                label: "Rotate Deg",
                type: "integer",
                default: 180
            },
            {
                name: "slideAmountX",
                label: "Slide X",
                type: "integer",
                default: 0
            },
            {
                name: "slideAmountY",
                label: "Slide Y",
                type: "integer",
                default: 100
            }
        ],
        variables: function (anim) {
            const intensity = num(anim.rotateIntensity);
            const slideX = num(anim.slideAmountX);
            const slideY = num(anim.slideAmountY);

            return (
                `--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-intensity:${intensity}deg;` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideX:${slideX}px;` +
                `--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideY:${slideY}px;` +
                `transform-origin:center center;`
            );
        },
        cssRawCode: `
			from {
				opacity: 0;
				transform:
					translate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideX, 0px),
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideY, 100px)
					)
					rotate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-intensity, 180deg)
					);
			}
			to {
				opacity: 1;
				transform: translate(0, 0) rotate(0deg);
			}`,
        setting: {}
    }
};
