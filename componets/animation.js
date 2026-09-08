/*
Animation appear: 0-14
*/
const flexEngineDefaultAnimation = {
	0: {
		name: "showup",
		query: [],
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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
		variables: function(anim) {
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


/**
 * Query
 */
debugger; // Moved, remove when done
const flexEngineGetAnimationSelfQuery = function() {

	let query = [
		{
			name: "animationType",
			label: "Animation",
			type: "selection",
			choice: [
				{
					name: "Inherit",
					value: -1
				},
				...Object.keys(flexEngineDefaultAnimation).map(key => ({
					name: flexEngineDefaultAnimation[key].name,
					value: Number(key)
				}))
			],
			default: 1
		},

		{
			name: "animationCurve",
			label: "Curve",
			type: "curve",
			visibleIf: {
				name: "animationType",
				value: [
					0, 1, 2, 3, 4, 5, 6, 7,
					8, 9, 10, 11, 12, 13, 14
				]
			}
		},

		{
			name: "duration",
			label: "Duration",
			type: "number",
			default: 0.6,
			visibleIf: {
				name: "animationType",
				value: [
					0, 1, 2, 3, 4, 5, 6, 7,
					8, 9, 10, 11, 12, 13, 14
				]
			}
		},

		{
			name: "delayTime",
			label: "Delay",
			type: "number",
			default: 0,
			visibleIf: {
				name: "animationType",
				value: [
					0, 1, 2, 3, 4, 5, 6, 7,
					8, 9, 10, 11, 12, 13, 14
				]
			}
		},

		{
			name: "trigger",
			label: "Trigger",
			type: "integer",
			default: 1,
			visibleIf: {
				name: "animationType",
				value: [
					0, 1, 2, 3, 4, 5, 6, 7,
					8, 9, 10, 11, 12, 13, 14
				]
			}
		}
	];

	const optionalQueryMap = {};
	const optionalQueryOrder = [];

	Object.keys(flexEngineDefaultAnimation).forEach(function(key) {

		const animationType = Number(key);
		const animation = flexEngineDefaultAnimation[animationType];

		if (!animation || !Array.isArray(animation.query)) {
			return;
		}

		animation.query.forEach(function(animationQuery) {

			if (!animationQuery || !animationQuery.name) {
				return;
			}

			const name = animationQuery.name;

			if (!optionalQueryMap[name]) {

				optionalQueryMap[name] = {
					...animationQuery,
					visibleIf: {
						name: "animationType",
						value: [animationType]
					}
				};

				optionalQueryOrder.push(name);

			} else {

				optionalQueryMap[name].visibleIf.value.push(animationType);

			}

		});

	});

	optionalQueryOrder.forEach(function(name) {
		query.push(optionalQueryMap[name]);
	});

	return query;

};

const flexEngineGetAnimationAllQuery = function() {

	const query = [
		{
			name: "animationType",
			label: "Animation",
			type: "selection",
			choice: Object.keys(flexEngineDefaultAnimation).map(key => ({
				name: flexEngineDefaultAnimation[key].name,
				value: Number(key)
			}))
		},

		{
			name: "animationCurve",
			label: "Curve",
			type: "curve"
		},

		{
			name: "duration",
			label: "Duration",
			type: "number",
			default: 0.6
		},

		{
			name: "delayTime",
			label: "First Delay",
			type: "number",
			default: 0
		},

		{
			name: "executionInterval",
			label: "Execution Interval",
			type: "number",
			default: 0
		},

		{
			name: "trigger",
			label: "Trigger",
			type: "integer",
			default: 1
		}
	];


	/*
		Keep track of which animation IDs
		contain each optional query.

		Example:

		{
			direction: {
				query: {...},
				animationTypes: [2, 6, 7, 8, 9]
			}
		}
	*/
	const optionalQueries = new Map();


	/*
		Check every animation.
	*/
	Object.keys(flexEngineDefaultAnimation).forEach(key => {

		const animationNumber = Number(key);
		const animation =
			flexEngineDefaultAnimation[animationNumber];

		/*
			Check every optional query belonging
			to this animation.
		*/
		(animation.query || []).forEach(animationQuery => {

			const name = animationQuery.name;

			/*
				First definition wins.

				If another animation later uses the
				same name, we DO NOT replace the query.
			*/
			if (!optionalQueries.has(name)) {

				optionalQueries.set(name, {
					query: {
						...animationQuery
					},
					animationTypes: [
						animationNumber
					]
				});

				return;
			}


			/*
				Same variable already exists.

				Only add this animation number.
			*/
			const existing =
				optionalQueries.get(name);

			if (
				!existing.animationTypes.includes(
					animationNumber
				)
			) {
				existing.animationTypes.push(
					animationNumber
				);
			}

		});

	});


	/*
		Convert the collected optional queries
		into actual query definitions.
	*/
	optionalQueries.forEach(function(data) {

		const optionalQuery = {
			...data.query,

			visibleIf: {
				name: "animationType",
				value: data.animationTypes
			}
		};

		query.push(optionalQuery);

	});


	return query;
};




/*
Apply animation configuration to a node. (animation as 1)
*/
debugger; // Moved, remove when done
const flexEngineAnimationContextsNode = function(dataArray, node) {
	const prefix = BUILDER_CONFIG.classPrefix;

	const attrName = `${prefix}animation-config-self`;
	const triggerAttr = `${prefix}animation-config-self-trigger`;

	const anim = dataArray.animation;

	/*
		Inherit animation from another animation context.

		This must happen before resolving animationType,
		variables, curve, duration, etc.
	*/
	if (Number(anim.animationType) === -1) {
		node.setAttribute(attrName, "inherit");
		node.setAttribute(triggerAttr, "");
		return;
	}


	/*
		Resolve animation type.

		Animation IDs:
		0  showup
		1  fade
		2  flyIn
		3  growTurn
		4  zoom
		5  basicZoom
		6  rise
		7  stretch
		8  wipe
		9  peekIn
		10 box
		11 expand
		12 tumble
		13 rotate
		14 slideRotate
	*/
	let animationNumber = Number(anim.animationType);

	if (!Number.isInteger(animationNumber) || !flexEngineDefaultAnimation[animationNumber]) {
		animationNumber = 1;
	}

	const entry = flexEngineDefaultAnimation[animationNumber];


	/*
		Build animation-specific CSS variables.
	*/
	let cssVars = "";

	if (typeof entry.variables === "function") {
		try {
			cssVars = entry.variables(anim) || "";
		}
		catch (e) {
			cssVars = "";
		}
	}


	/*
		Animation duration.

		If the animation's setting explicitly overrides
		the time, use that value instead of anim.duration.

		Example:
		showup -> timeOverride = true
		showup -> timeOverrideSeconds = 0

		So showup always uses 0s regardless of anim.duration.
	*/
	let duration;

	if (
		entry.setting &&
		entry.setting.timeOverride === true
	) {
		duration = `${entry.setting.timeOverrideSeconds}s`;
	}
	else {
		duration = `${num(anim.duration) || 0.6}s`;
	}


	/*
		Animation curve.

		anim.animationCurve is the raw curve data/array.

		Do NOT treat it as the final CSS string.

		The curve renderer converts the stored data
		into the actual CSS timing-function value.
	*/
	let curve = "";

	try {
		curve = flexEngineDefaultVariables.curve.curve.render(
			anim.animationCurve
		) || "";
	}
	catch (e) {
		curve = "";
	}


	/*
		Animation delay.
	*/
	const delay = `${anim.delayTime || 0}s`;


	/*
		Build final animation shorthand.
	*/
	const animationName = entry.name;

	const cssAnim =
		`animation:${prefix}animation-${animationName} ` +
		`${duration} ${curve} ${delay} 1 normal both;`;


	/*
		Write final attributes.
	*/
	node.setAttribute(
		attrName,
		cssVars + cssAnim
	);

	node.setAttribute(
		triggerAttr,
		anim.trigger || 1
	);
};

/*
Apply animation configuration to a section (animation as 2).
*/
const flexEngineApplyAnimationSection = function(node) {
	const prefix = BUILDER_CONFIG.classPrefix;

	const attrAll = `${prefix}animation-config-all`;
	const attrAllTrigger = `${prefix}animation-config-all-trigger`;

	const attrSelf = `${prefix}animation-config-self`;
	const attrSelfTrigger = `${prefix}animation-config-self-trigger`;

	const attrFirstDelay = `${prefix}animation-config-all-firstdelay`;
	const attrTimeRange = `${prefix}animation-config-all-timeRange`;

	const attrInherit = `${prefix}animation-self-inherit`;

	const DELAY_PLACEHOLDER = "<delay>";


	const allConfig = node.getAttribute(attrAll) || "";
	const allTrigger = node.getAttribute(attrAllTrigger) || "";


	if (
		!allConfig ||
		allConfig === "inherit"
	) {
		return;
	}


	const parseNumber = function(value) {
		if (value === null || value === undefined) {
			return 0;
		}

		const parsed = parseFloat(
			String(value).trim()
		);

		return Number.isFinite(parsed)
			? parsed
			: 0;
	};

	const firstDelay = parseNumber(
		node.getAttribute(attrFirstDelay)
	);

	const timeRange = parseNumber(
		node.getAttribute(attrTimeRange)
	);


	let count = 0;


	const walk = function(currentNode, depth) {

		const currentInherit =
			currentNode.getAttribute(attrInherit);

		const enabled =
			currentInherit !== null &&
			currentInherit !== "" &&
			currentInherit !== "0";

		if (enabled) {

			currentNode.setAttribute(
				attrInherit,
				String(depth)
			);


			const delayValue =
				firstDelay + count * timeRange;


			const selfConfig =
				allConfig.replace(
					new RegExp(DELAY_PLACEHOLDER, "g"),
					String(delayValue)
				);

			currentNode.setAttribute(
				attrSelf,
				selfConfig
			);

			currentNode.setAttribute(
				attrSelfTrigger,
				allTrigger
			);


			count++;
		}


		[...currentNode.children].forEach(child => {
			walk(child, depth + 1);
		});
	};


	[...node.children].forEach(child => {
		walk(child, 1);
	});
};

const flexEngineAnimationSection = function(dataArray, node, expend = true) {
	const prefix = BUILDER_CONFIG.classPrefix;

	const attrSelf = `${prefix}animation-config-self`;
	const attrSelfTrigger = `${prefix}animation-config-self-trigger`;

	const attrAll = `${prefix}animation-config-all`;
	const attrAllTrigger = `${prefix}animation-config-all-trigger`;

	const attrFirstDelay = `${prefix}animation-config-all-firstdelay`;
	const attrTimeRange = `${prefix}animation-config-all-timeRange`;

	const attrInherit = `${prefix}animation-self-inherit`;

	if (!node || !dataArray) {
		return;
	}

	const animationData = dataArray.animation || {};


	const selfData = structuredClone(dataArray);

	selfData.animation = animationData.self || {};

	debugger; //don;t forgot dependicy!
	flexEngineAnimationContextsNode(selfData, node);


	const allAnimation = animationData.all;

	if (!allAnimation) {
		node.setAttribute(attrAll, "");
		node.setAttribute(attrAllTrigger, "");
		node.setAttribute(attrFirstDelay, "");
		node.setAttribute(attrTimeRange, "");

		if (expend === true) {
			debugger; //don;t forgot dependicy!
			flexEngineApplyAnimationSection(node);
		}

		return;
	}


	if (Number(allAnimation.animationType) === -1) {
		node.setAttribute(attrAll, "inherit");
		node.setAttribute(attrAllTrigger, "");

		node.setAttribute(attrFirstDelay, "");
		node.setAttribute(attrTimeRange, "");

		return;
	}


	let animationNumber = Number(allAnimation.animationType);

	if (
		!Number.isInteger(animationNumber) ||
		!flexEngineDefaultAnimation[animationNumber]
	) {
		animationNumber = 1;
	}

	const entry = flexEngineDefaultAnimation[animationNumber];


	let cssVars = "";

	if (typeof entry.variables === "function") {
		try {
			cssVars = entry.variables(allAnimation) || "";
		} catch (e) {
			cssVars = "";
		}
	}


	let duration;

	if (
		entry.setting &&
		entry.setting.timeOverride === true
	) {
		duration =
			`${num(entry.setting.timeOverrideSeconds) || 0}s`;
	} else {
		duration =
			`${num(allAnimation.duration) || 0.6}s`;
	}


	let curve = "";

	try {
		curve =
			flexEngineDefaultVariables.curve.curve.render(
				allAnimation.animationCurve
			) || "";
	} catch (e) {
		curve = "";
	}


	const animationName = entry.name;

	const cssAnim =
		`animation:${prefix}animation-${animationName} ` +
		`${duration} ${curve} <delay>s 1 normal both;`;


	node.setAttribute(
		attrAll,
		cssVars + cssAnim
	);

	node.setAttribute(
		attrAllTrigger,
		allAnimation.trigger || 1
	);


	node.setAttribute(
		attrFirstDelay,
		num(allAnimation.delayTime) || 0
	);

	node.setAttribute(
		attrTimeRange,
		num(allAnimation.executionInterval) || 0
	);


	if (expend === true) {
		debugger; //don;t forgot dependicy!
		flexEngineApplyAnimationSection(node);
	}
};

/*
Main Animation Function
*/
const flexEngineAnimationRender = function(dataArray, node, mode) {
	if (!node || !dataArray) {
		return;
	}

	switch (Number(mode)) {
		case 0: {
			const prefix = BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}animation-config-self`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-self-trigger`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-trigger`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-firstdelay`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-timeRange`,
				""
			);

			return;
		}

		case 1: {
			flexEngineAnimationContextsNode(
				dataArray,
				node
			);

			return;
		}

		// Animation enabled as a SECTION.
		case 2: {
			flexEngineAnimationSection(
				dataArray,
				node,
				true
			);

			return;
		}

		// Animation enabled, but controlled entirely
		// by the parent SECTION.
		case 3: {
			const prefix = BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}animation-config-self`,
				"inherit"
			);

			node.setAttribute(
				`${prefix}animation-config-self-trigger`,
				""
			);

			return;
		}

		// Unknown mode.
		default: {
			return;
		}
	}
};


/**
 * FlexEngineProperty
 * Scope:
 * selfQuery = about self
 * allQuery = about all
 * 
 * 
 * render: a object also show the infomation.
 * render is also another object thst can start with numbers
 * like code 0 using 0: function() {} to indicate 0.
 * "other" = fallback.
 */
const flexEngineAnimation = {
	name: "animation",

	// selfQuery and allQuery, 
	// however those were demytric, we use get name().
	get selfQuery() {
		let query = [
			{
				name: "animationType",
				label: "Animation",
				type: "selection",
				choice: [
					{
						name: "Inherit",
						value: -1
					},
					...Object.keys(flexEngineDefaultAnimation).map(key => ({
						name: flexEngineDefaultAnimation[key].name,
						value: Number(key)
					}))
				],
				default: 1
			},

			{
				name: "animationCurve",
				label: "Curve",
				type: "curve",
				visibleIf: {
					name: "animationType",
					value: [
						0, 1, 2, 3, 4, 5, 6, 7,
						8, 9, 10, 11, 12, 13, 14
					]
				}
			},

			{
				name: "duration",
				label: "Duration",
				type: "number",
				default: 0.6,
				visibleIf: {
					name: "animationType",
					value: [
						0, 1, 2, 3, 4, 5, 6, 7,
						8, 9, 10, 11, 12, 13, 14
					]
				}
			},

			{
				name: "delayTime",
				label: "Delay",
				type: "number",
				default: 0,
				visibleIf: {
					name: "animationType",
					value: [
						0, 1, 2, 3, 4, 5, 6, 7,
						8, 9, 10, 11, 12, 13, 14
					]
				}
			},

			{
				name: "trigger",
				label: "Trigger",
				type: "integer",
				default: 1,
				visibleIf: {
					name: "animationType",
					value: [
						0, 1, 2, 3, 4, 5, 6, 7,
						8, 9, 10, 11, 12, 13, 14
					]
				}
			}
		];

		const optionalQueryMap = {};
		const optionalQueryOrder = [];

		Object.keys(flexEngineDefaultAnimation).forEach(function(key) {

			const animationType = Number(key);
			const animation = flexEngineDefaultAnimation[animationType];

			if (!animation || !Array.isArray(animation.query)) {
				return;
			}

			animation.query.forEach(function(animationQuery) {

				if (!animationQuery || !animationQuery.name) {
					return;
				}

				const name = animationQuery.name;

				if (!optionalQueryMap[name]) {

					optionalQueryMap[name] = {
						...animationQuery,
						visibleIf: {
							name: "animationType",
							value: [animationType]
						}
					};

					optionalQueryOrder.push(name);

				} else {

					optionalQueryMap[name].visibleIf.value.push(animationType);

				}

			});

		});

		optionalQueryOrder.forEach(function(name) {
			query.push(optionalQueryMap[name]);
		});

		return query;
	},
	
	get allQuery() {
		const query = [
			{
				name: "animationType",
				label: "Animation",
				type: "selection",
				choice: Object.keys(flexEngineDefaultAnimation).map(key => ({
					name: flexEngineDefaultAnimation[key].name,
					value: Number(key)
				}))
			},

			{
				name: "animationCurve",
				label: "Curve",
				type: "curve"
			},

			{
				name: "duration",
				label: "Duration",
				type: "number",
				default: 0.6
			},

			{
				name: "delayTime",
				label: "First Delay",
				type: "number",
				default: 0
			},

			{
				name: "executionInterval",
				label: "Execution Interval",
				type: "number",
				default: 0
			},

			{
				name: "trigger",
				label: "Trigger",
				type: "integer",
				default: 1
			}
		];


		/*
			Keep track of which animation IDs
			contain each optional query.

			Example:

			{
				direction: {
					query: {...},
					animationTypes: [2, 6, 7, 8, 9]
				}
			}
		*/
		const optionalQueries = new Map();


		/*
			Check every animation.
		*/
		Object.keys(flexEngineDefaultAnimation).forEach(key => {

			const animationNumber = Number(key);
			const animation =
				flexEngineDefaultAnimation[animationNumber];

			/*
				Check every optional query belonging
				to this animation.
			*/
			(animation.query || []).forEach(animationQuery => {

				const name = animationQuery.name;

				/*
					First definition wins.

					If another animation later uses the
					same name, we DO NOT replace the query.
				*/
				if (!optionalQueries.has(name)) {

					optionalQueries.set(name, {
						query: {
							...animationQuery
						},
						animationTypes: [
							animationNumber
						]
					});

					return;
				}


				/*
					Same variable already exists.

					Only add this animation number.
				*/
				const existing =
					optionalQueries.get(name);

				if (
					!existing.animationTypes.includes(
						animationNumber
					)
				) {
					existing.animationTypes.push(
						animationNumber
					);
				}

			});

		});


		/*
			Convert the collected optional queries
			into actual query definitions.
		*/
		optionalQueries.forEach(function(data) {

			const optionalQuery = {
				...data.query,

				visibleIf: {
					name: "animationType",
					value: data.animationTypes
				}
			};

			query.push(optionalQuery);

		});


		return query;
	},

	// render part.
	render: {
		// Animation completely disabled.
		0: function(dataArray, node) {
			const prefix = BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}animation-config-self`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-self-trigger`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-trigger`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-firstdelay`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-timeRange`,
				""
			);

			return;			
		},

		// Animation enabled for this node itself
		1: function(dataArray, node) {
			const prefix = BUILDER_CONFIG.classPrefix;

			const attrName = `${prefix}animation-config-self`;
			const triggerAttr = `${prefix}animation-config-self-trigger`;

			const anim = dataArray.animation;

			/*
				Inherit animation from another animation context.

				This must happen before resolving animationType,
				variables, curve, duration, etc.
			*/
			if (Number(anim.animationType) === -1) {
				node.setAttribute(attrName, "inherit");
				node.setAttribute(triggerAttr, "");
				return;
			}


			/*
				Resolve animation type.

				Animation IDs:
				0  showup
				1  fade
				2  flyIn
				3  growTurn
				4  zoom
				5  basicZoom
				6  rise
				7  stretch
				8  wipe
				9  peekIn
				10 box
				11 expand
				12 tumble
				13 rotate
				14 slideRotate
			*/
			let animationNumber = Number(anim.animationType);

			if (!Number.isInteger(animationNumber) || !flexEngineDefaultAnimation[animationNumber]) {
				animationNumber = 1;
			}

			const entry = flexEngineDefaultAnimation[animationNumber];


			/*
				Build animation-specific CSS variables.
			*/
			let cssVars = "";

			if (typeof entry.variables === "function") {
				try {
					cssVars = entry.variables(anim) || "";
				}
				catch (e) {
					cssVars = "";
				}
			}


			/*
				Animation duration.

				If the animation's setting explicitly overrides
				the time, use that value instead of anim.duration.

				Example:
				showup -> timeOverride = true
				showup -> timeOverrideSeconds = 0

				So showup always uses 0s regardless of anim.duration.
			*/
			let duration;

			if (
				entry.setting &&
				entry.setting.timeOverride === true
			) {
				duration = `${entry.setting.timeOverrideSeconds}s`;
			}
			else {
				duration = `${num(anim.duration) || 0.6}s`;
			}


			/*
				Animation curve.

				anim.animationCurve is the raw curve data/array.

				Do NOT treat it as the final CSS string.

				The curve renderer converts the stored data
				into the actual CSS timing-function value.
			*/
			let curve = "";

			try {
				curve = flexEngineDefaultVariables.curve.curve.render(
					anim.animationCurve
				) || "";
			}
			catch (e) {
				curve = "";
			}


			/*
				Animation delay.
			*/
			const delay = `${anim.delayTime || 0}s`;


			/*
				Build final animation shorthand.
			*/
			const animationName = entry.name;

			const cssAnim =
				`animation:${prefix}animation-${animationName} ` +
				`${duration} ${curve} ${delay} 1 normal both;`;


			/*
				Write final attributes.
			*/
			node.setAttribute(
				attrName,
				cssVars + cssAnim
			);

			node.setAttribute(
				triggerAttr,
				anim.trigger || 1
			);
		},

		// Animation enabled as a SECTION.
		2: function(dataArray, node, expend = true) {

		},
		
		// Animation bepass, as inherit only.
		3: function(dataArray, node) {
			const prefix = BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}animation-config-self`,
				"inherit"
			);

			node.setAttribute(
				`${prefix}animation-config-self-trigger`,
				""
			);

			return;
		},

		// for unKnown node, if we cannot find one, atuo fallback.
		"other": function(dataArray, node) {
			return;
		}
	},

	//this schema allow custom helper functions.

};