const flexEngineAnimationsList = {
	0: {
		name: "showup",
		variables: function(anim) {
			return "";
		}
	},

	1: {
		name: "fade",
		variables: function(anim) {
			return "";
		}
	},

	2: {
		name: "flyIn",
		variables: function(anim) {
			const direction = (num(anim.direction) % 360 + 360) % 360;
			const intensity = Math.max(0, num(anim.intensity));
			const rad = direction * Math.PI / 180;
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-x:${Math.cos(rad) * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-y:${Math.sin(rad) * intensity}px;`
			);
		}
	},

	3: {
		name: "growTurn",
		variables: function(anim) {
			const rotate = num(anim.rotate);
			return `--${BUILDER_CONFIG.classPrefix}animation-rotate:${rotate}deg;`;
		}
	},

	4: {
		name: "zoom",
		variables: function(anim) {
			return "";
		}
	},

	5: {
		name: "basicZoom",
		variables: function(anim) {
			const scaleStart = num(anim.scaleStart) || 100;
			return `--${BUILDER_CONFIG.classPrefix}animation-scaleStart:${scaleStart / 100};`;
		}
	},

	6: {
		name: "rise",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 8);
			const intensity = Math.max(0, num(anim.intensity));
			const angle = (direction - 1) * 45;
			const rad = angle * Math.PI / 180;
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-x:${Math.cos(rad) * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-y:${Math.sin(rad) * intensity}px;`
			);
		}
	},

	7: {
		name: "stretch",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const map = ["top", "right", "bottom", "left"];
			return `--${BUILDER_CONFIG.classPrefix}animation-origin:${map[direction - 1]};`;
		}
	},

	8: {
		name: "wipe",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const clip = [
				"inset(100% 0 0 0)",
				"inset(0 0 0 100%)",
				"inset(0 0 100% 0)",
				"inset(0 100% 0 0)"
			];
			return `--${BUILDER_CONFIG.classPrefix}animation-from:${clip[direction - 1]};`;
		}
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
			const clip = [
				"inset(100% 0 0 0)",
				"inset(0 0 0 100%)",
				"inset(0 0 100% 0)",
				"inset(0 100% 0 0)"
			];
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-x:${d[0] * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-y:${d[1] * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-from:${clip[direction - 1]};`
			);
		}
	},

	10: {
		name: "box",
		variables: function(anim) {
			// anim.x and anim.y are indices 1..3 (left/center/right and top/center/bottom)
			const xIndex = clamp(num(anim.x) || 1, 1, 3);
			const yIndex = clamp(num(anim.y) || 1, 1, 3);
			const map = {
				1: "100%", // left / top (collapsed)
				2: "50%", // center
				3: "0%" // right / bottom (open)
			};
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-x:${map[xIndex]};` +
				`--${BUILDER_CONFIG.classPrefix}animation-y:${map[yIndex]};`
			);
		}
	},

	11: {
		name: "expand",
		variables: function(anim) {
			return "";
		}
	},

	12: {
		name: "tumble",
		variables: function(anim) {
			const directionRight = anim.directionRight ? 1 : 0;
			const fromUp = anim.fromUp ? 1 : 0;
			const intensity = num(anim.intensity);
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-directionRight:${directionRight};` +
				`--${BUILDER_CONFIG.classPrefix}animation-fromUp:${fromUp};` +
				`--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;`
			);
		}
	},

	13: {
		name: "rotate",
		variables: function(anim) {
			const directionRight = anim.directionRight ? 1 : 0;
			const intensity = num(anim.intensity);
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-directionRight:${directionRight};` +
				`--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;`
			);
		}
	},

	14: {
		name: "slideRotate",
		variables: function(anim) {
			const intensity = num(anim.intensity);
			const slideX = num(anim.slideAmountX);
			const slideY = num(anim.slideAmountY);
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;` +
				`--${BUILDER_CONFIG.classPrefix}animation-slideX:${slideX}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-slideY:${slideY}px;`
			);
		}
	}
};

// Animation System Styler for END NODE (1) and CONTAINER NODE (2) , and also used as part of SECTION (3)
const flexEngineAnimationContextsNode = function(dataArray, node) {
	const prefix = BUILDER_CONFIG.classPrefix; // e.g. "cw-"
	const attrName = `${prefix}animation-config-self`;
	const triggerAttr = `${prefix}animation-config-self-trigger`;

	const anim = dataArray && dataArray.animation;

	// If no animation → clear both attributes and skip everything
	if (!anim || anim.animation !== true) {
		node.setAttribute(attrName, "");
		node.setAttribute(triggerAttr, "");
		return;
	}

	// If animationInherit → write "inherit" and still allow transitions
	if (anim.animationInherit === true) {
		node.setAttribute(attrName, "inherit");
		node.setAttribute(triggerAttr, "");
		return;
	}

	// Build animation variables and animation shorthand
	let animationNumber = Number(anim.animationType);
	if (!animationNumber || !flexEngineAnimationsList[animationNumber]) {
		animationNumber = 1; // fallback to fade
	}

	const entry = flexEngineAnimationsList[animationNumber];
	let cssVars = "";
	try {
		cssVars = entry.variables(anim) || "";
	} catch (e) {
		cssVars = "";
	}

	// Add transform-origin where required
	if (animationNumber === 7) { // Stretch
		const dir = clamp(num(anim.direction) || 1, 1, 4);
		const map = ["top", "right", "bottom", "left"];
		cssVars += `transform-origin:${map[dir - 1]};`;
	} else if (animationNumber === 12) { // Tumble
		cssVars += `transform-origin:top left;`;
	} else if (animationNumber === 13) { // Rotate
		cssVars += `transform-origin:center center;`;
	} else if (animationNumber === 14) { // Slide Rotate
		cssVars += `transform-origin:center center;`;
	}

	const animationName = entry.name;
	const duration = `${num(anim.duration) || 0.6}s`;
	const delay = (anim.delayTime || 0) + "s";
	const curve = flexEngineStyleVarible.curve(anim.animationCurve);

	const cssAnim = `animation:${prefix}animation-${animationName} ${duration} ${curve} ${delay} 1 normal both;`;

	// Write attribute
	node.setAttribute(attrName, cssVars + cssAnim);
	node.setAttribute(triggerAttr, anim.trigger || 1);
};