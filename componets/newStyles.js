const flexEngineDefaultAppearance = {
	styleQuery: [{
		name: "paddingTop",
		label: "Padding Top",
		type: "space"
	}, {
		name: "paddingBottom",
		label: "Padding Bottom",
		type: "space"
	}, {
		name: "paddingLeft",
		label: "Padding Left",
		type: "space"
	}, {
		name: "paddingRight",
		label: "Padding Right",
		type: "space"
	}, {
		name: "borderMode",
		label: "Border Style",
		type: "selection",
		choice: [{
			label: "Solid",
			value: "solid"
		}, {
			label: "None",
			value: "none"
		}, {
			label: "Dashed",
			value: "dashed"
		}, {
			label: "Dotted",
			value: "dotted"
		}, {
			label: "Double",
			value: "double"
		}]
	}, {
		name: "borderTop",
		label: "Top Border",
		type: "space"
	}, {
		name: "borderBottom",
		label: "Bottom Border",
		type: "space"
	}, {
		name: "borderLeft",
		label: "Left Border",
		type: "space"
	}, {
		name: "borderRight",
		label: "Right Border",
		type: "space"
	}, {
		name: "borderRadius",
		label: "Border Radius",
		type: "integer/noNeg"
	}, {
		name: "shadow",
		label: "Shadow",
		type: "boolean/checkmark"
	}, {
		name: "shadowInset",
		label: "Shadow Inset",
		type: "boolean/checkmark"
	}, {
		name: "shadowOffsetX",
		label: "Shadow Offset X",
		type: "integer"
	}, {
		name: "shadowOffsetY",
		label: "Shadow Offset Y",
		type: "integer"
	}, {
		name: "shadowBlur",
		label: "Shadow Blur",
		type: "integer/noNeg"
	}, {
		name: "shadowExpand",
		label: "Shadow Expand",
		type: "integer"
	}, {
		name: "shadowColor",
		label: "Shadow Color",
		type: "color/picker"
	}, {
		name: "textColor",
		label: "Text Color",
		type: "color/picker"
	}, {
		name: "background",
		label: "Background",
		type: "color/picker"
	}, {
		name: "blur",
		label: "Blur",
		type: "integer/noNeg"
	}, {
		name: "font",
		label: "Font",
		type: "string/text"
	}, {
		name: "markColor",
		label: "Caret Color",
		type: "color/picker"
	}, {
		name: "mobilePaddingTop",
		label: "Mobile Padding Top",
		type: "space"
	}, {
		name: "mobilePaddingBottom",
		label: "Mobile Padding Bottom",
		type: "space"
	}, {
		name: "mobilePaddingLeft",
		label: "Mobile Padding Left",
		type: "space"
	}, {
		name: "mobilePaddingRight",
		label: "Mobile Padding Right",
		type: "space"
	}],
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
			"box-shadow": s.shadow ? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpand || 0}px ${flexEngineStyleVarible.color(s.shadowColor)}` : "none",
			"color": flexEngineStyleVarible.color(s.textColor),
			"background": flexEngineStyleVarible.color(s.background),
			"filter": s.blur ? `blur(${s.blur}px)` : "none",
			"font-family": s.font || "inherit",
			"caret-color": flexEngineStyleVarible.color(s.markColor),
		};
	},
	styleMobile: (s) => {
		return {
			"padding-top": flexEngineStyleVarible.space(s.mobilePaddingTop),
			"padding-bottom": flexEngineStyleVarible.space(s.mobilePaddingBottom),
			"padding-left": flexEngineStyleVarible.space(s.mobilePaddingLeft),
			"padding-right": flexEngineStyleVarible.space(s.mobilePaddingRight)
		};
	},


	sizeQuery: [],
	sizeDefault: (sz, isVertical) => {
		return {};
	},

	sizeMobile: (sz, isVertical) => {
		return {};
	}
};

const flexEngineStylesToCss = (cssObject) => {
	if (!cssObject || typeof cssObject !== "object") {
		return "";
	}

	return Object.entries(cssObject)
		.filter(([_, value]) => value !== undefined && value !== null && value !== "")
		.map(([key, value]) => `${key}: ${value};`)
		.join("");
};

const flexEngineStylesResolveRegistry = (elementMode) => {
	const rawMode = String(elementMode || "");
	const separatorIndex = rawMode.indexOf("/");
	const category = separatorIndex === -1 ? rawMode : rawMode.substring(0, separatorIndex);
	const element = separatorIndex === -1 ? "" : rawMode.substring(separatorIndex + 1);
	const isRoot = category === "@root";

	const categoryRegistry = isRoot
		? (flexEngineRootElement || {})
		: (flexEngineDefaultElements?.[category] || {});

	const elementRegistry =
		categoryRegistry?.[element] && typeof categoryRegistry[element] === "object"
			? categoryRegistry[element]
			: {};

	return {
		categoryRegistry,
		elementRegistry
	};
};

const flexEngineStylesCreateBaseRegistry = (
	elementRegistry,
	categoryRegistry
) => {
	const getProcessor = (name) =>
		typeof elementRegistry?.[name] === "function"
			? elementRegistry[name]
			: typeof categoryRegistry?.[name] === "function"
				? categoryRegistry[name]
				: typeof flexEngineDefaultAppearance?.[name] === "function"
					? flexEngineDefaultAppearance[name]
					: () => ({});

	return {
		styleDefault: getProcessor("styleDefault"),
		styleMobile: getProcessor("styleMobile"),
		sizeDefault: getProcessor("sizeDefault"),
		sizeMobile: getProcessor("sizeMobile"),
		extras: elementRegistry?.extras ?? categoryRegistry?.extras ?? null
	};
};

const flexEngineStylesNormalizeExtras = (extras) => {
	const normalized = {};

	if (!extras) {
		return normalized;
	}

	if (typeof extras === "string") {
		normalized[extras] = {};
		return normalized;
	}

	if (Array.isArray(extras)) {
		extras.forEach((item) => {
			if (typeof item === "string") {
				normalized[item] = {};
				return;
			}

			if (!item || typeof item !== "object") {
				return;
			}

			const position = item.position ?? item.target ?? item.name ?? item.key;

			if (position) {
				normalized[String(position)] = item;
			}
		});

		return normalized;
	}

	if (
		typeof extras === "object" &&
		(extras.position ||
			extras.target ||
			extras.styleDefault ||
			extras.styleMobile ||
			extras.sizeDefault ||
			extras.sizeMobile)
	) {
		const position = extras.position ?? extras.target;

		if (position) {
			normalized[String(position)] = extras;
		}

		return normalized;
	}

	Object.entries(extras).forEach(([position, config]) => {
		normalized[position] =
			config && typeof config === "object"
				? config
				: {};
	});

	return normalized;
};

const flexEngineStylesProcessState = (
	stateData,
	stateName,
	processorRegistry,
	isVertical
) => {
	if (!stateData || typeof stateData !== "object") {
		return null;
	}

	const styleData =
		stateData.style && typeof stateData.style === "object"
			? stateData.style
			: {};

	const sizeData =
		stateData.size && typeof stateData.size === "object"
			? stateData.size
			: {};

	const isMobile = stateName === "onMobile" || stateName === "onMobileHover";

	const styleProcessor = isMobile
		? processorRegistry.styleMobile
		: processorRegistry.styleDefault;

	const sizeProcessor = isMobile
		? processorRegistry.sizeMobile
		: processorRegistry.sizeDefault;

	return {
		...(typeof styleProcessor === "function"
			? styleProcessor(styleData) || {}
			: {}),
		...(typeof sizeProcessor === "function"
			? sizeProcessor(sizeData, isVertical) || {}
			: {})
	};
};

const flexEngineStylesBuildClassName = (
	prefix,
	appearanceName,
	position,
	stateName
) => {
	const cleanAppearance = String(appearanceName || "").replace(/^\./, "");

	const stateSuffix = {
		default: "",
		onMobile: "-onMobile",
		hover: "-onHover",
		onMobileHover: "-onMobileHover"
	}[stateName] || "";

	const targetSuffix =
		position === undefined ||
		position === null ||
		position === "" ||
		position === "base"
			? ""
			: `-at${position}`;

	return `${prefix}-styles-${cleanAppearance}${stateSuffix}${targetSuffix}`;
};

const flexEngineStylingSystem = function (
	dataArray,
	node,
	isVertical,
	elementMode
) {
	if (!node || !dataArray || typeof dataArray !== "object") {
		return;
	}

	const {
		categoryRegistry,
		elementRegistry
	} = flexEngineStylesResolveRegistry(elementMode);

	const baseRegistry = flexEngineStylesCreateBaseRegistry(
		elementRegistry,
		categoryRegistry
	);

	const extraRegistry = flexEngineStylesNormalizeExtras(
		baseRegistry.extras
	);

	const appearance =
		dataArray.appearance &&
		typeof dataArray.appearance === "object"
			? dataArray.appearance
			: {};

	const prefix = BUILDER_CONFIG?.classPrefix || "";

	const states = [
		"default",
		"onMobile",
		"hover",
		"onMobileHover"
	];

	Object.entries(appearance).forEach(
		([appearanceName, appearanceData]) => {
			if (
				!appearanceData ||
				typeof appearanceData !== "object"
			) {
				return;
			}

			const positions = new Set(["base"]);

			Object.keys(appearanceData).forEach((key) => {
				positions.add(String(key));
			});

			Object.keys(extraRegistry || {}).forEach((key) => {
				positions.add(String(key));
			});

			positions.forEach((position) => {
				const targetData = appearanceData?.[position];

				const extraConfig =
					position === "base"
						? null
						: extraRegistry?.[position] || null;

				const processorRegistry = extraConfig
					? {
							styleDefault:
								typeof extraConfig.styleDefault ===
								"function"
									? extraConfig.styleDefault
									: baseRegistry.styleDefault,

							styleMobile:
								typeof extraConfig.styleMobile ===
								"function"
									? extraConfig.styleMobile
									: baseRegistry.styleMobile,

							sizeDefault:
								typeof extraConfig.sizeDefault ===
								"function"
									? extraConfig.sizeDefault
									: baseRegistry.sizeDefault,

							sizeMobile:
								typeof extraConfig.sizeMobile ===
								"function"
									? extraConfig.sizeMobile
									: baseRegistry.sizeMobile
						}
					: baseRegistry;

				states.forEach((stateName) => {
					const stateData = targetData?.[stateName];

					if (
						!stateData ||
						typeof stateData !== "object"
					) {
						return;
					}

					const cssObject = flexEngineStylesProcessState(
						stateData,
						stateName,
						processorRegistry,
						isVertical
					);

					if (!cssObject) {
						return;
					}

					const attributeName =
						flexEngineStylesBuildClassName(
							prefix,
							appearanceName,
							position,
							stateName
						);

					node.setAttribute(
						attributeName,
						flexEngineStylesToCss(cssObject)
					);
				});
			});
		}
	);
};




// Sample here!
debugger;
const elementMode = "content/card";
const BUILDER_CONFIG = {
	classPrefix: "fx"
};
const flexEngineDefaultElements = {
	content: {
		styleDefault: (style) => ({
			color: style.color
		}),
		styleMobile: (style) => ({
			color: style.color
		}),
		sizeDefault: (size, isVertical) => ({
			width: isVertical ? "100%" : size.width,
			height: size.height
		}),
		sizeMobile: (size) => ({
			width: "100%",
			height: size.height
		}),
		card: {
			styleDefault: (style) => ({
				color: style.color,
				"background-color": style.background,
				"border-radius": style.radius,
				padding: style.padding
			}),
			styleMobile: (style) => ({
				color: style.color,
				"background-color": style.background,
				padding: style.padding,
				"font-size": style.fontSize
			}),
			extras: [{
				position: "2_1",
				styleDefault: (style) => ({
					color: style.color,
					"font-size": style.fontSize,
					"font-weight": style.fontWeight
				}),
				sizeDefault: (size) => ({
					width: size.width,
					height: size.height
				})
			}, {
				position: "3"
			}]
		}
	}
};
const data = {
	appearance: {
		default: {
			base: {
				default: {
					style: {
						color: "#ffffff",
						background: "#2563eb",
						radius: "12px",
						padding: "24px"
					},
					size: {
						width: "400px",
						height: "250px"
					}
				},
				hover: {
					style: {
						color: "#ffffff",
						background: "#1d4ed8",
						radius: "14px",
						padding: "26px"
					},
					size: {
						width: "420px",
						height: "260px"
					}
				},
				onMobile: {
					style: {
						color: "#111827",
						background: "#dbeafe",
						padding: "16px",
						fontSize: "14px"
					},
					size: {
						height: "220px"
					}
				},
				onMobileHover: {
					style: {
						color: "#111827",
						background: "#bfdbfe",
						padding: "18px",
						fontSize: "14px"
					},
					size: {
						height: "230px"
					}
				}
			},
			"2_1": {
				default: {
					style: {
						color: "#0f172a",
						fontSize: "18px",
						fontWeight: "700"
					},
					size: {
						width: "100%",
						height: "60px"
					}
				},
				hover: {
					style: {
						color: "#1d4ed8",
						fontSize: "20px",
						fontWeight: "700"
					},
					size: {
						width: "100%",
						height: "64px"
					}
				}
			},
			"3": {
				onMobile: {
					style: {
						color: "#475569",
						background: "#f1f5f9",
						padding: "12px",
						fontSize: "12px"
					}
				}
			}
		},
		".featured": {
			base: {
				default: {
					style: {
						color: "#fef3c7",
						background: "#92400e",
						radius: "16px",
						padding: "30px"
					}
				}
			}
		}
	}
};
flexEngineStylingSystem(data, node, false, elementMode, );