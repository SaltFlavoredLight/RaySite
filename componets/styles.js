const flexEngineAppearance = {
    styleQuery: [
		{
			name: "paddingTop",
			label: "Padding Top",
			type: "space"
		},
		{
			name: "paddingBottom",
			label: "Padding Bottom",
			type: "space"
		},
		{
			name: "paddingLeft",
			label: "Padding Left",
			type: "space"
		},
		{
			name: "paddingRight",
			label: "Padding Right",
			type: "space"
		},

		{
			name: "borderMode",
			label: "Border Style",
			type: "selection",
			choice: [
				{ label: "Solid", value: "solid" },
				{ label: "None", value: "none" },
				{ label: "Dashed", value: "dashed" },
				{ label: "Dotted", value: "dotted" },
				{ label: "Double", value: "double" }
			]
		},
		{
			name: "borderTop",
			label: "Top Border",
			type: "space"
		},
		{
			name: "borderBottom",
			label: "Bottom Border",
			type: "space"
		},
		{
			name: "borderLeft",
			label: "Left Border",
			type: "space"
		},
		{
			name: "borderRight",
			label: "Right Border",
			type: "space"
		},
		{
			name: "borderRadius",
			label: "Border Radius",
			type: "integer/noNeg"
		},

		{
			name: "shadow",
			label: "Shadow",
			type: "boolean/checkmark"
		},
		{
			name: "shadowInset",
			label: "Shadow Inset",
			type: "boolean/checkmark"
		},
		{
			name: "shadowOffsetX",
			label: "Shadow Offset X",
			type: "integer"
		},
		{
			name: "shadowOffsetY",
			label: "Shadow Offset Y",
			type: "integer"
		},
		{
			name: "shadowBlur",
			label: "Shadow Blur",
			type: "integer/noNeg"
		},
		{
			name: "shadowExpand",
			label: "Shadow Expand",
			type: "integer"
		},
		{
			name: "shadowColor",
			label: "Shadow Color",
			type: "color/picker"
		},

		{
			name: "textColor",
			label: "Text Color",
			type: "color/picker"
		},
		{
			name: "background",
			label: "Background",
			type: "color/picker"
		},
		{
			name: "blur",
			label: "Blur",
			type: "integer/noNeg"
		},
		{
			name: "font",
			label: "Font",
			type: "string/text"
		},
		{
			name: "markColor",
			label: "Caret Color",
			type: "color/picker"
		},

		{
			name: "mobilePaddingTop",
			label: "Mobile Padding Top",
			type: "space"
		},
		{
			name: "mobilePaddingBottom",
			label: "Mobile Padding Bottom",
			type: "space"
		},
		{
			name: "mobilePaddingLeft",
			label: "Mobile Padding Left",
			type: "space"
		},
		{
			name: "mobilePaddingRight",
			label: "Mobile Padding Right",
			type: "space"
		}
	],

	styleDefault: (s) => {
		return {
			"padding-top": flexEngineStyleVarible.space(s.paddingTop),
			"padding-bottom": flexEngineStyleVarible.space(s.paddingBottom),
			"padding-left": flexEngineStyleVarible.space(s.paddingLeft),
			"padding-right": flexEngineStyleVarible.space(s.paddingRight),
			"border-style": s.borderMode || "solid",
			"border-top": flexEngineStyleVarible.space(s.borderTop) || "0px",
			"border-bottom": flexEngineStyleVarible.space(s.borderBottom) || "0px",
			"border-left": flexEngineStyleVarible.space(s.borderLeft) || "0px",
			"border-right": flexEngineStyleVarible.space(s.borderRight) || "0px",
			"border-radius": `${s.borderRadius || 0}px`,
			"box-shadow": s.shadow
				? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpand || 0}px ${engine.color(s.shadowColor)}`
				: "none",
			"color": engine.color(s.textColor),
			"background": engine.color(s.background),
			"filter": s.blur ? `blur(${s.blur}px)` : "none",
			"font-family": s.font || "inherit",
			"caret-color": engine.color(s.markColor),
		};
	},

	styleMobile: (s) => {
		return {
			"padding-top": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingTop),
			"padding-bottom": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingBottom),
			"padding-left": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingLeft),
			"padding-right": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingRight)
		};
	}
};

// CSS overrides
const CSSOverridesHelper = (data) => {
	const overrides = {};

	if (Array.isArray(data.CSSoverride)) {
		data.CSSoverride.forEach(item => {
			if (item && item.key) {
				overrides[item.key] = item.value;
			}
		});
	}

	return overrides;
};

const flexEngineElementSettings = (elementMode) => {
	const [category, element] = String(elementMode || "").split("/");

	const categorySettings = flexEngineDefaultElements?.[category];

	return (
		categorySettings?.[element] ??
		categorySettings ??
		{
			default: (sz, isVertical) => {
				return {};
			},

			mobile: (sz, isVertical) => {
				return {};
			}
		}
	);
};

// Styling everything.
const flexEngineStylingClass = function(
	dataArray,
	isVertical,
	elementMode,
	contextSetting
) {
	const engine = flexEngineStyleVarible;

	const elementSettings = flexEngineElementSettings(elementMode);


	if (flexEngineCheckContext(contextSetting, "header") === true) {
		// That's Header
		const JSONarray = {
			default: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...flexEngineAppearance.styleDefault(s),
					...elementSettings.default(sz, isVertical),
					...CSSOverridesHelper(data)
				};
			})(dataArray),


			onMobile: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...flexEngineAppearance.styleMobile(s),
					...elementSettings.mobile(sz, isVertical),
				};
			})(dataArray),


			onHover: ((data) => {
				if (!data) return {};

				const s = data.style || {};
				const sz = data.size || {};

				return {
					...flexEngineAppearance.styleDefault(s),
					...elementSettings.default(sz, isVertical),
					...CSSOverridesHelper(data)
				};
			})(dataArray.hover),


			onHoverMobile: ((data) => {
				if (!data) return {};

				const s = data.style || {};
				const sz = data.size || {};

				return {
					...flexEngineAppearance.styleMobile(s),
					...elementSettings.mobile(sz, isVertical),
				};
			})(dataArray.hover),


			// Header's onTop.
			onTop: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...flexEngineAppearance.styleDefault(s),
					...elementSettings.default(sz, isVertical),
					...CSSOverridesHelper(data)
				};
			})(dataArray.onTop),


			onTopMobile: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...flexEngineAppearance.styleMobile(s),
					...elementSettings.mobile(sz, isVertical),
				};
			})(dataArray.onTop),


			onTopHover: ((data) => {
				if (!data) return {};

				const s = data.style || {};
				const sz = data.size || {};

				return {
					...flexEngineAppearance.styleDefault(s),
					...elementSettings.default(sz, isVertical),
					...CSSOverridesHelper(data)
				};
			})(dataArray.onTop.hover),


			onTopMobileHover: ((data) => {
				if (!data) return {};

				const s = data.style || {};
				const sz = data.size || {};

				return {
					...flexEngineAppearance.styleMobile(s),
					...elementSettings.mobile(sz, isVertical),
				};
			})(dataArray.onTop.hover)
		};

		return JSONarray;
	}


	// Normal
	const JSONarray = {
		default: ((data) => {
			const s = data.style || {};
			const sz = data.size || {};

			return {
				...flexEngineAppearance.styleDefault(s),
				...elementSettings.default(sz, isVertical),
				...CSSOverridesHelper(data)
			};
		})(dataArray),


		onMobile: ((data) => {
			const s = data.style || {};
			const sz = data.size || {};

			return {
				...flexEngineAppearance.styleMobile(s),
				...elementSettings.mobile(sz, isVertical),
			};
		})(dataArray),


		onHover: ((data) => {
			if (!data) return {};

			const s = data.style || {};
			const sz = data.size || {};

			return {
				...flexEngineAppearance.styleDefault(s),
				...elementSettings.default(sz, isVertical),
				...CSSOverridesHelper(data)
			};
		})(dataArray.hover),


		onHoverMobile: ((data) => {
			if (!data) return {};

			const s = data.style || {};
			const sz = data.size || {};

			return {
				...flexEngineAppearance.styleMobile(s),
				...elementSettings.mobile(sz, isVertical),
			};
		})(dataArray.hoverMobile)
	};

	return JSONarray;
};

// Styling system
const flexEngineStylingSystem = function(
	dataArray,
	node,
	isVertical,
	elementMode,
	contextSetting = ""
) {
	const nodeStyle = {
		// Primary state bundle
		default: flexEngineStylingClass(
			dataArray,
			isVertical,
			elementMode,
			contextSetting
		),

		// Map each custom class in overrideState
		...Object.keys(dataArray.overrideState || {}).reduce((acc, key) => {
			const stateData = dataArray.overrideState[key];

			acc[key] = flexEngineStylingClass(
				stateData,
				isVertical,
				elementMode,
				contextSetting
			);

			return acc;
		}, {}),
	};


	const prefix = BUILDER_CONFIG.classPrefix;


	Object.keys(nodeStyle).forEach(stateKey => {
		if (stateKey === "startAnimation") return;

		const cleanName = stateKey.startsWith(".")
			? stateKey.substring(1)
			: stateKey;

		const bundle = nodeStyle[stateKey];
		const attributeBase = `${prefix}-styles-${cleanName}`;


		// Convert object → CSS string
		const toCss = (obj) =>
			Object.entries(obj)
				.filter(([_, value]) =>
					value !== undefined &&
					value !== null &&
					value !== ""
				)
				.map(([key, value]) => `${key}: ${value};`)
				.join("");


		// DEFAULT
		if (bundle.default) {
			node.setAttribute(
				attributeBase,
				toCss(bundle.default)
			);
		}


		// MOBILE
		if (bundle.onMobile) {
			node.setAttribute(
				`${attributeBase}-onMobile`,
				toCss(bundle.onMobile)
			);
		}


		// HOVER
		if (bundle.onHover) {
			node.setAttribute(
				`${attributeBase}-onHover`,
				toCss(bundle.onHover)
			);
		}


		// HOVER & MOBILE
		if (bundle.onHoverMobile) {
			node.setAttribute(
				`${attributeBase}-onMobileHover`,
				toCss(bundle.onHoverMobile)
			);
		}


		if (flexEngineCheckContext(contextSetting, "header") === true) {
			// ON TOP
			if (bundle.onTop) {
				node.setAttribute(
					`${attributeBase}-onTop`,
					toCss(bundle.onTop)
				);
			}


			// ON TOP & Hover
			if (bundle.onTopHover) {
				node.setAttribute(
					`${attributeBase}-onTopHover`,
					toCss(bundle.onTopHover)
				);
			}


			// ON TOP & MOBILE
			if (bundle.onTopMobile) {
				node.setAttribute(
					`${attributeBase}-onTopMobile`,
					toCss(bundle.onTopMobile)
				);
			}


			// ON TOP & Hover & MOBILE
			if (bundle.onTopMobileHover) {
				node.setAttribute(
					`${attributeBase}-onTopMobileHover`,
					toCss(bundle.onTopMobileHover)
				);
			}
		}
	});
};