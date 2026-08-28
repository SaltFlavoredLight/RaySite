const flexEngineAnimationsList = {
	0: {
		name: "showup",
		
		variables: function(anim) {
			return "";
		},
		cssRawCode: `
            from { opacity: 0; }
            to   { opacity: 1; }`,
        setting: {
            timeOverride: true,
            timeOverrideSeconds: 0
        }
	},
	1: {
		name: "fade",
		variables: function(anim) {
			return "";
		},
		cssRawCode: `
            from { opacity: 0; }
            to   { opacity: 1; }`,
        setting: {}
	},
	2: {
		name: "flyIn",
		variables: function(anim) {
			const direction = (num(anim.direction) % 360 + 360) % 360;
			const intensity = Math.max(0, num(anim.intensity));
			const rad = direction * Math.PI / 180;
			const x = Math.cos(rad) * intensity;
			const y = Math.sin(rad) * intensity;
			return (`--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-x:${x}px;` + `--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-y:${y}px;`);
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
		variables: function(anim) {
			const rotate = num(anim.rotate);
			return `--${BUILDER_CONFIG.classPrefix}animation-rotate:${rotate}deg;`;
		},
		cssRawCode: `
            from {
                opacity: 0;
                transform: scale(0.3) rotate(var(--${BUILDER_CONFIG.classPrefix}animation-variables-growTurn-rotate, -25deg));
            }
            to {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }`,
        setting: {}
	},
	4: {
		name: "zoom",
		variables: function(anim) {
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
		variables: function(anim) {
			const scaleStart = num(anim.scaleStart) || 100;
			return `--${BUILDER_CONFIG.classPrefix}animation-scaleStart:${scaleStart / 100};`;
		},
		cssRawCode: `
        from {
            opacity: 0;
            transform: scale(calc(var(--${BUILDER_CONFIG.classPrefix}animation-variables-basicZoom-scaleStart, 85) / 100));
        }
        to {
            opacity: 1;
            transform: scale(1);
        }`,
        setting: {}
	},
	6: {
		name: "rise",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 8);
			const intensity = Math.max(0, num(anim.intensity));
			const angle = (direction - 1) * 45;
			const rad = angle * Math.PI / 180;
			return (`--${BUILDER_CONFIG.classPrefix}animation-x:${Math.cos(rad) * intensity}px;` + `--${BUILDER_CONFIG.classPrefix}animation-y:${Math.sin(rad) * intensity}px;`);
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
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const map = ["top", "right", "bottom", "left"];
			return (`--${BUILDER_CONFIG.classPrefix}animation-origin:${map[direction - 1]};` + `transform-origin:${map[direction - 1]};`);
		},
		cssRawCode: `
            from {
                opacity: 0;
                transform-origin: var(--${BUILDER_CONFIG.classPrefix}animation-variables-stretch-origin, left);
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
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const clip = ["inset(100% 0 0 0)", "inset(0 0 0 100%)", "inset(0 0 100% 0)", "inset(0 100% 0 0)"];
			return `--${BUILDER_CONFIG.classPrefix}animation-from:${clip[direction - 1]};`;
		},
		cssRawCode: `
            from {
                opacity: 0;
                clip-path: var(--${BUILDER_CONFIG.classPrefix}animation-variables-wipe-from, inset(0 100% 0 0));
            }
            to {
                opacity: 1;
                clip-path: inset(0 0 0 0);
            }`,
        setting: {}
	},
	9: {
		name: "peekIn",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const intensity = Math.max(0, num(anim.intensity));
			const dirs = [
				[0, -1],
				[1, 0],
				[0, 1],
				[-1, 0]
			];
			const d = dirs[direction - 1];
			const clip = ["inset(100% 0 0 0)", "inset(0 0 0 100%)", "inset(0 0 100% 0)", "inset(0 100% 0 0)"];
			return (`--${BUILDER_CONFIG.classPrefix}animation-x:${d[0] * intensity}px;` + `--${BUILDER_CONFIG.classPrefix}animation-y:${d[1] * intensity}px;` + `--${BUILDER_CONFIG.classPrefix}animation-from:${clip[direction - 1]};`);
		},
		cssRawCode: `
            from {
                opacity: 0;
                transform: translate(
                var(--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-x, -40px),
                var(--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-y, 0px)
                );
                clip-path: var(--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-from, inset(0 100% 0 0));
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
		variables: function(anim) {
			const xIndex = clamp(num(anim.x) || 1, 1, 3);
			const yIndex = clamp(num(anim.y) || 1, 1, 3);
			const map = {
				1: "100%",
				2: "50%",
				3: "0%"
			};
			return (`--${BUILDER_CONFIG.classPrefix}animation-x:${map[xIndex]};` + `--${BUILDER_CONFIG.classPrefix}animation-y:${map[yIndex]};`);
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
		variables: function(anim) {
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
		variables: function(anim) {
			const directionRight = anim.directionRight ? 1 : 0;
			const fromUp = anim.fromUp ? 1 : 0;
			const intensity = num(anim.intensity);
			return (`--${BUILDER_CONFIG.classPrefix}animation-directionRight:${directionRight};` + `--${BUILDER_CONFIG.classPrefix}animation-fromUp:${fromUp};` + `--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;` + `transform-origin:top left;`);
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
                rotate(var(--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-intensity, -120deg));
            }
            to {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg);
            }`,
        setting: {}
	},
	13: {
		name: "rotate",
		variables: function(anim) {
			const directionRight = anim.directionRight ? 1 : 0;
			const intensity = num(anim.intensity);
			return (`--${BUILDER_CONFIG.classPrefix}animation-directionRight:${directionRight};` + `--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;` + `transform-origin:center center;`);
		},
		cssRawCode: `
            from {
                opacity: 0;
                transform:
                translateY(50%)
                rotate(var(--${BUILDER_CONFIG.classPrefix}animation-variables-rotate-intensity, 180deg));
            }
            to {
                opacity: 1;
                transform: translateY(0) rotate(0deg);
            }`,
        setting: {}
	},
	14: {
		name: "slideRotate",
		variables: function(anim) {
			const intensity = num(anim.intensity);
			const slideX = num(anim.slideAmountX);
			const slideY = num(anim.slideAmountY);
			return (`--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;` + `--${BUILDER_CONFIG.classPrefix}animation-slideX:${slideX}px;` + `--${BUILDER_CONFIG.classPrefix}animation-slideY:${slideY}px;` + `transform-origin:center center;`);
		},
		cssRawCode: `
            from {
                opacity: 0;
                transform:
                translate(
                    var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideX, 0px),
                    var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideY, 100px)
                )
                rotate(var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-intensity, 180deg));
            }
            to {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg);
            }`,
        setting: {}
	}
};
const flexEngineAnimationContextsNode = function(dataArray, node) {
	const prefix = BUILDER_CONFIG.classPrefix; // e.g. "cw-"
	const attrName = `${prefix}animation-config-self`;
	const triggerAttr = `${prefix}animation-config-self-trigger`;
	const anim = dataArray && dataArray.animation;
	// No animation → clear attributes
	if (!anim || anim.animation !== true) {
		node.setAttribute(attrName, "");
		node.setAttribute(triggerAttr, "");
		return;
	}
	// Inherit mode → write "inherit"
	if (anim.animationInherit === true) {
		node.setAttribute(attrName, "inherit");
		node.setAttribute(triggerAttr, "");
		return;
	}
	// Resolve animation type
	let animationNumber = Number(anim.animationType);
	if (!animationNumber || !flexEngineAnimationsList[animationNumber]) {
		animationNumber = 1; // fallback to fade
	}
	const entry = flexEngineAnimationsList[animationNumber];
	// Build CSS variables
	let cssVars = "";
	try {
		cssVars = entry.variables(anim) || "";
	} catch (e) {
		cssVars = "";
	}
	// Build animation shorthand
	const animationName = entry.name;
	const duration = `${num(anim.duration) || 0.6}s`;
	const delay = (anim.delayTime || 0) + "s";
	const curve = flexEngineStyleVarible.curve(anim.animationCurve);
	const cssAnim = `animation:${prefix}animation-${animationName} ` + `${duration} ${curve} ${delay} 1 normal both;`;
	// Write final attributes
	node.setAttribute(attrName, cssVars + cssAnim);
	node.setAttribute(triggerAttr, anim.trigger || 1);
};