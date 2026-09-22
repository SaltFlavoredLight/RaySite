// new styles with comments

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



/**
 * A plain object containing CSS property/value pairs.
 *
 * Example:
 * {
 *     color: "red",
 *     "background-color": "blue",
 *     width: "100px"
 * }
 *
 * @typedef {Record<string, any>} FlexEngineCssObject
 */


/**
 * A style processor.
 *
 * Receives semantic style data and converts it into a CSS object.
 *
 * Example:
 * styleDefault: (style) => ({
 *     color: style.color,
 *     "background-color": style.background
 * })
 *
 * @typedef {(
 *     styleData: Record<string, any>,
 *     isVertical?: boolean
 * ) => FlexEngineCssObject|undefined|null} FlexEngineStyleProcessor
 */


/**
 * A size processor.
 *
 * Size processors additionally receive the current orientation.
 *
 * @typedef {(
 *     sizeData: Record<string, any>,
 *     isVertical?: boolean
 * ) => FlexEngineCssObject|undefined|null} FlexEngineSizeProcessor
 */


/**
 * Configuration object used by an extra target.
 *
 * Extra targets can override any of the normal style/size processors.
 *
 * @typedef {Object} FlexEngineExtraConfig
 * @property {string} [position]
 * @property {string} [target]
 * @property {string} [name]
 * @property {string} [key]
 * @property {FlexEngineStyleProcessor} [styleDefault]
 * @property {FlexEngineStyleProcessor} [styleMobile]
 * @property {FlexEngineSizeProcessor} [sizeDefault]
 * @property {FlexEngineSizeProcessor} [sizeMobile]
 */


/**
 * Registry containing processors and optional extra target definitions.
 *
 * @typedef {Object} FlexEngineRegistry
 * @property {FlexEngineStyleProcessor} [styleDefault]
 * @property {FlexEngineStyleProcessor} [styleMobile]
 * @property {FlexEngineSizeProcessor} [sizeDefault]
 * @property {FlexEngineSizeProcessor} [sizeMobile]
 * @property {any} [extras]
 */


/**
 * Converts a CSS object into a CSS declaration string.
 *
 * Undefined, null, and empty-string values are ignored.
 *
 * Example:
 *
 * Input:
 * {
 *     color: "red",
 *     height: "100px"
 * }
 *
 * Output:
 * "color: red;height: 100px;"
 *
 * @param {FlexEngineCssObject} cssObject
 * @returns {string}
 */
const flexEngineStylesToCss = (cssObject) => {
	if (!cssObject || typeof cssObject !== "object") {
		return "";
	}

	return Object.entries(cssObject)
		.filter(([_, value]) =>
			value !== undefined &&
			value !== null &&
			value !== ""
		)
		.map(([key, value]) => `${key}: ${value};`)
		.join("");
};


/**
 * Resolves the registry to use from an element mode.
 *
 * Supported forms:
 *
 *     "content"
 *     "content/card"
 *     "@root"
 *     "@root/card"
 *
 * Examples:
 *
 *     "content/card"
 *
 *     category = "content"
 *     element = "card"
 *
 *     "@root/button"
 *
 *     category = "@root"
 *     element = "button"
 *
 * Registry resolution:
 *
 * Normal:
 *     flexEngineDefaultElements[category]
 *
 * Root:
 *     flexEngineRootElement
 *
 * Then, if an element exists:
 *
 *     categoryRegistry[element]
 *
 * @param {string} elementMode
 * @returns {{
 *     category: string,
 *     element: string,
 *     isRoot: boolean,
 *     categoryRegistry: Record<string, any>,
 *     elementRegistry: Record<string, any>
 * }}
 */
const flexEngineStylesResolveRegistry = (elementMode) => {
	// Normalize the incoming mode.
	const rawMode = String(elementMode || "");

	// Find the first "/" so that:
	//
	//     "content/card"
	//
	// becomes:
	//
	//     category = "content"
	//     element = "card"
	const separatorIndex = rawMode.indexOf("/");

	// If there is no "/", the whole value is treated
	// as the category and the element is empty.
	const category =
		separatorIndex === -1
			? rawMode
			: rawMode.substring(0, separatorIndex);

	const element =
		separatorIndex === -1
			? ""
			: rawMode.substring(separatorIndex + 1);

	// "@root" is special.
	//
	// Instead of looking inside:
	//
	//     flexEngineDefaultElements["@root"]
	//
	// we use:
	//
	//     flexEngineRootElement
	const isRoot = category === "@root";

	const categoryRegistry = isRoot
		? (flexEngineRootElement || {})
		: (flexEngineDefaultElements?.[category] || {});

	// If the element exists and is an object, use it.
	//
	// Example:
	//
	// flexEngineDefaultElements = {
	//     content: {
	//         card: {
	//             styleDefault: ...
	//         }
	//     }
	// };
	//
	// elementMode = "content/card"
	//
	// categoryRegistry = flexEngineDefaultElements.content
	// elementRegistry = categoryRegistry.card
	const elementRegistry =
		categoryRegistry?.[element] &&
		typeof categoryRegistry[element] === "object"
			? categoryRegistry[element]
			: {};

	return {
		category,
		element,
		isRoot,
		categoryRegistry,
		elementRegistry
	};
};


/**
 * Resolves a processor using the fallback hierarchy:
 *
 *     1. Element processor
 *     2. Category processor
 *     3. Universal fallback
 *
 * This means an element can override a category-level processor.
 *
 * Example:
 *
 *     content.styleDefault
 *     content.card.styleDefault
 *
 * If card has styleDefault, card wins.
 * Otherwise content.styleDefault is used.
 *
 * @param {Record<string, any>} elementRegistry
 * @param {Record<string, any>} categoryRegistry
 * @param {string} processorName
 * @param {Function} fallback
 * @returns {Function}
 */
const flexEngineStylesGetProcessor = (
	elementRegistry,
	categoryRegistry,
	processorName,
	fallback
) => {

	// Highest priority:
	// processor defined specifically for the element.
	if (
		elementRegistry &&
		typeof elementRegistry[processorName] === "function"
	) {
		return elementRegistry[processorName];
	}

	// Second priority:
	// processor defined for the whole category.
	if (
		categoryRegistry &&
		typeof categoryRegistry[processorName] === "function"
	) {
		return categoryRegistry[processorName];
	}

	// Final fallback.
	//
	// IMPORTANT:
	// Your current universal fallback is an EMPTY object.
	//
	// That means unsupported processor types silently produce
	// no CSS.
	return fallback;
};


/**
 * Creates the processor registry used by the main styling engine.
 *
 * Processor priority:
 *
 *     element
 *       ↓
 *     category
 *       ↓
 *     empty fallback
 *
 * The "extras" definition also uses:
 *
 *     element.extras
 *       ↓
 *     category.extras
 *       ↓
 *     null
 *
 * @param {Record<string, any>} elementRegistry
 * @param {Record<string, any>} categoryRegistry
 * @returns {FlexEngineRegistry}
 */
const flexEngineStylesCreateBaseRegistry = (
	elementRegistry,
	categoryRegistry
) => {
	return {

		// Normal/default-state style processor.
		styleDefault: flexEngineStylesGetProcessor(
			elementRegistry,
			categoryRegistry,
			"styleDefault",

			// Universal fallback:
			// do nothing.
			() => ({})
		),

		// Mobile style processor.
		//
		// NOTE:
		// "Mobile" is kept because that is the existing API name.
		styleMobile: flexEngineStylesGetProcessor(
			elementRegistry,
			categoryRegistry,
			"styleMobile",

			// Universal fallback.
			() => ({})
		),

		// Normal/default-state size processor.
		sizeDefault: flexEngineStylesGetProcessor(
			elementRegistry,
			categoryRegistry,
			"sizeDefault",

			// Universal fallback.
			() => ({})
		),

		// Mobile size processor.
		sizeMobile: flexEngineStylesGetProcessor(
			elementRegistry,
			categoryRegistry,
			"sizeMobile",

			// Universal fallback.
			() => ({})
		),

		// Extra target definitions.
		//
		// Element extras take priority over category extras.
		extras:
			elementRegistry?.extras ??
			categoryRegistry?.extras ??
			null
	};
};


/**
 * Converts the various supported "extras" formats into
 * one normalized position map.
 *
 * Supported input forms:
 *
 * 1. Single string:
 *
 *     extras: "2_1"
 *
 * 2. Array of strings:
 *
 *     extras: ["1", "2_1"]
 *
 * 3. Array of objects:
 *
 *     extras: [
 *         {
 *             position: "2_1",
 *             styleDefault: ...
 *         }
 *     ]
 *
 * 4. Single object definition:
 *
 *     extras: {
 *         position: "2_1",
 *         styleDefault: ...
 *     }
 *
 * 5. Position map:
 *
 *     extras: {
 *         "1": {
 *             styleDefault: ...
 *         },
 *         "2_1": {
 *             sizeDefault: ...
 *         }
 *     }
 *
 * Output is always:
 *
 * {
 *     "position": config
 * }
 *
 * @param {any} extras
 * @returns {Record<string, object>}
 */
const flexEngineStylesNormalizeExtras = (extras) => {

	// The normalized output.
	const normalized = {};

	// No extras.
	if (!extras) {
		return normalized;
	}


	// ---------------------------------------------------------
	// FORM 1
	// Single string
	//
	// extras: "2_1"
	// ---------------------------------------------------------
	if (typeof extras === "string") {
		normalized[extras] = {};
		return normalized;
	}


	// ---------------------------------------------------------
	// FORM 2 / 3
	// Array
	//
	// extras: ["1", "2_1"]
	//
	// or:
	//
	// extras: [
	//     {
	//         position: "2_1",
	//         styleDefault: ...
	//     }
	// ]
	// ---------------------------------------------------------
	if (Array.isArray(extras)) {

		extras.forEach((item) => {

			// String item:
			//
			// "2_1"
			//
			// becomes:
			//
			// {
			//     "2_1": {}
			// }
			if (typeof item === "string") {
				normalized[item] = {};
				return;
			}

			// Ignore invalid array entries.
			if (!item || typeof item !== "object") {
				return;
			}

			// Find the target position using aliases.
			//
			// position is preferred.
			//
			// Then:
			// target
			// name
			// key
			const position =
				item.position ??
				item.target ??
				item.name ??
				item.key;

			// No position means this item cannot be used.
			if (!position) {
				return;
			}

			normalized[String(position)] = item;
		});

		return normalized;
	}


	// ---------------------------------------------------------
	// FORM 4
	// Single object definition
	//
	// extras: {
	//     position: "2_1",
	//     styleDefault: ...
	// }
	// ---------------------------------------------------------
	if (
		typeof extras === "object" &&
		(
			extras.position ||
			extras.target ||
			extras.styleDefault ||
			extras.styleMobile ||
			extras.sizeDefault ||
			extras.sizeMobile
		)
	) {

		// Only position/target are used here.
		const position =
			extras.position ??
			extras.target;

		if (position) {
			normalized[String(position)] = extras;
		}

		return normalized;
	}


	// ---------------------------------------------------------
	// FORM 5
	// Position map
	//
	// extras: {
	//     "1": {
	//         styleDefault: ...
	//     },
	//
	//     "2_1": {
	//         sizeDefault: ...
	//     }
	// }
	// ---------------------------------------------------------
	Object.entries(extras).forEach(
		([position, config]) => {

			// A string means:
			//
			// "2_1": "anything"
			//
			// Treat it as an extra target with
			// no custom processor.
			if (typeof config === "string") {
				normalized[position] = {};
				return;
			}

			// Valid configuration object.
			if (config && typeof config === "object") {
				normalized[position] = config;
				return;
			}

			// Invalid/null/undefined configuration.
			//
			// Still preserve the target position.
			normalized[position] = {};
		}
	);

	return normalized;
};


/**
 * Creates the processor set for one extra target.
 *
 * An extra target may override only some processors.
 *
 * Example:
 *
 * {
 *     position: "2_1",
 *     styleDefault: customStyle
 * }
 *
 * In that case:
 *
 *     styleDefault -> customStyle
 *
 * but:
 *
 *     styleMobile -> baseRegistry.styleMobile
 *     sizeDefault -> baseRegistry.sizeDefault
 *     sizeMobile -> baseRegistry.sizeMobile
 *
 * @param {FlexEngineExtraConfig|null} extraConfig
 * @param {FlexEngineRegistry} baseRegistry
 * @returns {FlexEngineRegistry}
 */
const flexEngineStylesGetExtraProcessors = (
	extraConfig,
	baseRegistry
) => {

	// Normalize null/undefined.
	const extra = extraConfig || {};

	return {

		// Extra override OR base processor.
		styleDefault:
			typeof extra.styleDefault === "function"
				? extra.styleDefault
				: baseRegistry.styleDefault,

		// Extra override OR base processor.
		styleMobile:
			typeof extra.styleMobile === "function"
				? extra.styleMobile
				: baseRegistry.styleMobile,

		// Extra override OR base processor.
		sizeDefault:
			typeof extra.sizeDefault === "function"
				? extra.sizeDefault
				: baseRegistry.sizeDefault,

		// Extra override OR base processor.
		sizeMobile:
			typeof extra.sizeMobile === "function"
				? extra.sizeMobile
				: baseRegistry.sizeMobile
	};
};


/**
 * Selects the processors appropriate for the current state.
 *
 * State mapping:
 *
 *     default
 *         -> styleDefault / sizeDefault
 *
 *     hover
 *         -> styleDefault / sizeDefault
 *
 *     onMobile
 *         -> styleMobile / sizeMobile
 *
 *     onMobileHover
 *         -> styleMobile / sizeMobile
 *
 * Notice that "hover" does NOT have a separate hover processor.
 * It reuses the default desktop processors.
 *
 * @param {string} stateName
 * @param {FlexEngineRegistry} processorRegistry
 * @returns {{
 *     style: Function,
 *     size: Function
 * }}
 */
const flexEngineStylesGetStateProcessors = (
	stateName,
	processorRegistry
) => {

	switch (stateName) {

		// Mobile states use mobile processors.
		case "onMobile":
			return {
				style: processorRegistry.styleMobile,
				size: processorRegistry.sizeMobile
			};

		// Desktop hover uses default processors.
		case "hover":
			return {
				style: processorRegistry.styleDefault,
				size: processorRegistry.sizeDefault
			};

		// Mobile + hover uses mobile processors.
		case "onMobileHover":
			return {
				style: processorRegistry.styleMobile,
				size: processorRegistry.sizeMobile
			};

		// Normal/default behavior.
		case "default":
		default:
			return {
				style: processorRegistry.styleDefault,
				size: processorRegistry.sizeDefault
			};
	}
};


/**
 * Processes one state object.
 *
 * Example state:
 *
 * {
 *     style: {
 *         color: "red"
 *     },
 *
 *     size: {
 *         width: "100px"
 *     }
 * }
 *
 * The state is split into:
 *
 *     styleData
 *     sizeData
 *
 * The appropriate processors are then executed.
 *
 * Finally both results are merged:
 *
 *     {
 *         ...styleResult,
 *         ...sizeResult
 *     }
 *
 * If size contains the same property as style,
 * sizeResult wins because it is spread later.
 *
 * @param {Record<string, any>} stateData
 * @param {string} stateName
 * @param {FlexEngineRegistry} processorRegistry
 * @param {boolean} isVertical
 * @returns {FlexEngineCssObject|null}
 */
const flexEngineStylesProcessState = (
	stateData,
	stateName,
	processorRegistry,
	isVertical
) => {

	// Invalid state data means:
	// nothing to process.
	if (!stateData || typeof stateData !== "object") {
		return null;
	}


	// Extract style information.
	//
	// If no style object exists, use {}.
	const styleData =
		stateData.style &&
		typeof stateData.style === "object"
			? stateData.style
			: {};


	// Extract size information.
	//
	// If no size object exists, use {}.
	const sizeData =
		stateData.size &&
		typeof stateData.size === "object"
			? stateData.size
			: {};


	// Pick the correct style/size processors
	// based on the state name.
	const processors =
		flexEngineStylesGetStateProcessors(
			stateName,
			processorRegistry
		);


	// Process style.
	const styleResult =
		typeof processors.style === "function"
			? (
				processors.style(styleData) || {}
			)
			: {};


	// Process size.
	//
	// isVertical is only sent to the size processor.
	const sizeResult =
		typeof processors.size === "function"
			? (
				processors.size(
					sizeData,
					isVertical
				) || {}
			)
			: {};


	// Merge style + size.
	//
	// sizeResult is spread second, meaning duplicate keys
	// from size override keys returned by style.
	return {
		...styleResult,
		...sizeResult
	};
};


/**
 * Converts a state name into the suffix used in the
 * generated HTML attribute name.
 *
 * State mapping:
 *
 *     default
 *         -> ""
 *
 *     onMobile
 *         -> "-onMobile"
 *
 *     hover
 *         -> "-onHover"
 *
 *     onMobileHover
 *         -> "-onMobileHover"
 *
 * @param {string} stateName
 * @returns {string}
 */
const flexEngineStylesBuildStateSuffix = (stateName) => {

	switch (stateName) {

		case "onMobile":
			return "-onMobile";

		case "hover":
			return "-onHover";

		case "onMobileHover":
			return "-onMobileHover";

		case "default":
		default:
			return "";
	}
};


/**
 * Builds the suffix associated with a target position.
 *
 * "base" has no suffix.
 *
 * Any other position becomes:
 *
 *     -at{position}
 *
 * Examples:
 *
 *     base
 *         -> ""
 *
 *     "1"
 *         -> "-at1"
 *
 *     "2_1"
 *         -> "-at2_1"
 *
 * @param {string|number|null|undefined} position
 * @returns {string}
 */
const flexEngineStylesBuildTargetSuffix = (position) => {

	// Base target does not need a suffix.
	if (
		position === undefined ||
		position === null ||
		position === "" ||
		position === "base"
	) {
		return "";
	}

	return `-at${position}`;
};


/**
 * Builds the final attribute name used to store the generated CSS.
 *
 * Example:
 *
 * prefix:
 *     "fx"
 *
 * appearance:
 *     "primary"
 *
 * position:
 *     "2_1"
 *
 * state:
 *     "hover"
 *
 * result:
 *     "fx-styles-primary-onHover-at2_1"
 *
 * IMPORTANT:
 *
 * Despite the function name "BuildClassName",
 * this code does NOT create a class.
 *
 * The generated string is used as an HTML attribute name:
 *
 *     node.setAttribute(attributeName, css)
 *
 * @param {string} prefix
 * @param {string} appearanceName
 * @param {string} position
 * @param {string} stateName
 * @returns {string}
 */
const flexEngineStylesBuildClassName = (
	prefix,
	appearanceName,
	position,
	stateName
) => {

	// Appearance names can optionally start with ".".
	//
	// Example:
	//
	// ".card"
	//
	// becomes:
	//
	// "card"
	const cleanAppearance =
		String(appearanceName || "")
			.replace(/^\./, "");


	// Build the state suffix.
	const stateSuffix =
		flexEngineStylesBuildStateSuffix(
			stateName
		);


	// Build the target suffix.
	const targetSuffix =
		flexEngineStylesBuildTargetSuffix(
			position
		);


	// Combine all pieces.
	return `${prefix}-styles-${cleanAppearance}${stateSuffix}${targetSuffix}`;
};


/**
 * Finds all target positions that should be processed
 * for an appearance.
 *
 * "base" is ALWAYS included.
 *
 * Additional positions come from:
 *
 *     1. appearanceData
 *     2. extras registry
 *
 * Example:
 *
 * appearanceData:
 *
 * {
 *     base: {...},
 *     "1": {...},
 *     "2_1": {...}
 * }
 *
 * extras:
 *
 * {
 *     "3": {...}
 * }
 *
 * result:
 *
 * [
 *     "base",
 *     "1",
 *     "2_1",
 *     "3"
 * ]
 *
 * @param {Record<string, any>} appearanceData
 * @param {Record<string, any>} extraRegistry
 * @returns {string[]}
 */
const flexEngineStylesGetTargetPositions = (
	appearanceData,
	extraRegistry
) => {

	// base is always a possible target.
	const positions = new Set(["base"]);


	// Add all positions explicitly present
	// inside the appearance.
	if (
		appearanceData &&
		typeof appearanceData === "object"
	) {
		Object.keys(appearanceData).forEach((key) => {
			positions.add(String(key));
		});
	}


	// Add all positions declared by extras.
	Object.keys(extraRegistry || {}).forEach((key) => {
		positions.add(String(key));
	});


	// Convert Set back to an array.
	return Array.from(positions);
};


/**
 * Returns every state the engine knows how to process.
 *
 * @returns {string[]}
 */
const flexEngineStylesGetStates = () => {

	return [
		"default",
		"onMobile",
		"hover",
		"onMobileHover"
	];
};


/**
 * Writes the generated CSS to the DOM node.
 *
 * Example:
 *
 * attributeName:
 *     "fx-styles-card-onHover"
 *
 * cssObject:
 *     {
 *         color: "red",
 *         width: "100px"
 *     }
 *
 * becomes:
 *
 *     node.setAttribute(
 *         "fx-styles-card-onHover",
 *         "color: red;width: 100px;"
 *     );
 *
 * @param {HTMLElement|any} node
 * @param {string} attributeName
 * @param {FlexEngineCssObject} cssObject
 * @returns {void}
 */
const flexEngineStylesApplyResult = (
	node,
	attributeName,
	cssObject
) => {

	// Only continue if the object looks like a DOM node
	// that supports setAttribute().
	if (!node || typeof node.setAttribute !== "function") {
		return;
	}

	node.setAttribute(
		attributeName,
		flexEngineStylesToCss(cssObject)
	);
};


/**
 * Processes every target position and state for one appearance.
 *
 * Processing hierarchy:
 *
 *     appearance
 *         ↓
 *     position
 *         ↓
 *     extra processor selection
 *         ↓
 *     state
 *         ↓
 *     style + size processing
 *         ↓
 *     generated attribute
 *
 * Example:
 *
 *     appearance = "card"
 *     position  = "2_1"
 *     state     = "hover"
 *
 * can become:
 *
 *     fx-styles-card-onHover-at2_1
 *
 * @param {string} appearanceName
 * @param {Record<string, any>} appearanceData
 * @param {FlexEngineRegistry} baseRegistry
 * @param {Record<string, object>} extraRegistry
 * @param {HTMLElement|any} node
 * @param {string} prefix
 * @param {boolean} isVertical
 * @returns {void}
 */
const flexEngineStylesProcessAppearance = (
	appearanceName,
	appearanceData,
	baseRegistry,
	extraRegistry,
	node,
	prefix,
	isVertical
) => {

	// ---------------------------------------------------------
	// STEP 1
	// Find every target position that must be processed.
	// ---------------------------------------------------------
	const positions =
		flexEngineStylesGetTargetPositions(
			appearanceData,
			extraRegistry
		);


	// ---------------------------------------------------------
	// STEP 2
	// Get the four supported states.
	// ---------------------------------------------------------
	const states =
		flexEngineStylesGetStates();


	// ---------------------------------------------------------
	// STEP 3
	// Process every position.
	// ---------------------------------------------------------
	positions.forEach((position) => {

		// Get the data belonging to this target position.
		//
		// Example:
		//
		// appearanceData["2_1"]
		const targetData =
			appearanceData &&
			typeof appearanceData === "object"
				? appearanceData[position]
				: undefined;


		// Base does NOT use an extra processor.
		//
		// Every non-base target can optionally have
		// a configuration in extraRegistry.
		const extraConfig =
			position === "base"
				? null
				: extraRegistry?.[position] || null;


		// -----------------------------------------------------
		// Choose which processor registry this target uses.
		//
		// base:
		//
		//     baseRegistry
		//
		// extra target:
		//
		//     extra processors
		//     ↓
		//     base processors
		// -----------------------------------------------------
		const processorRegistry =
			extraConfig
				? flexEngineStylesGetExtraProcessors(
					extraConfig,
					baseRegistry
				)
				: baseRegistry;


		// -----------------------------------------------------
		// STEP 4
		// Process every state at this target position.
		// -----------------------------------------------------
		states.forEach((stateName) => {

			// Read:
			//
			// targetData[stateName]
			//
			// Example:
			//
			// targetData.hover
			const stateData =
				targetData &&
				typeof targetData === "object"
					? targetData[stateName]
					: undefined;


			// If this particular state was not defined,
			// simply skip it.
			//
			// This is why you do NOT need to define all four
			// states for every position.
			if (
				!stateData ||
				typeof stateData !== "object"
			) {
				return;
			}


			// -------------------------------------------------
			// STEP 5
			// Convert state data into a CSS object.
			// -------------------------------------------------
			const cssObject =
				flexEngineStylesProcessState(
					stateData,
					stateName,
					processorRegistry,
					isVertical
				);


			// Invalid state processing result.
			if (!cssObject) {
				return;
			}


			// -------------------------------------------------
			// STEP 6
			// Build the final HTML attribute name.
			// -------------------------------------------------
			const attributeName =
				flexEngineStylesBuildClassName(
					prefix,
					appearanceName,
					position,
					stateName
				);


			// -------------------------------------------------
			// STEP 7
			// Write the generated CSS to the DOM node.
			// -------------------------------------------------
			flexEngineStylesApplyResult(
				node,
				attributeName,
				cssObject
			);
		});
	});
};


/**
 * Main Flex Engine styling system.
 *
 * This function:
 *
 * 1. Validates the input.
 * 2. Resolves category/element registry.
 * 3. Builds the base processor registry.
 * 4. Normalizes extras.
 * 5. Reads appearance definitions.
 * 6. Processes every appearance.
 * 7. Writes generated CSS into HTML attributes.
 *
 * Main data flow:
 *
 *     dataArray
 *         ↓
 *     appearance
 *         ↓
 *     appearance name
 *         ↓
 *     target positions
 *         ↓
 *     states
 *         ↓
 *     processors
 *         ↓
 *     CSS object
 *         ↓
 *     CSS string
 *         ↓
 *     node.setAttribute()
 *
 * Example elementMode:
 *
 *     "content/card"
 *
 * means:
 *
 *     category = "content"
 *     element  = "card"
 *
 * @param {Record<string, any>} dataArray
 * @param {HTMLElement|any} node
 * @param {boolean} isVertical
 * @param {string} elementMode
 * @returns {void}
 */
const flexEngineStylingSystem = function(
	dataArray,
	node,
	isVertical,
	elementMode
) {

	// ---------------------------------------------------------
	// STEP 0
	// Validate the basic inputs.
	//
	// Without a node or data object there is nothing to do.
	// ---------------------------------------------------------
	if (
		!node ||
		!dataArray ||
		typeof dataArray !== "object"
	) {
		return;
	}


	// ---------------------------------------------------------
	// STEP 1
	// Resolve the category and element registry.
	//
	// Example:
	//
	// elementMode:
	//     "content/card"
	//
	// gives:
	//
	// categoryRegistry:
	//     flexEngineDefaultElements.content
	//
	// elementRegistry:
	//     flexEngineDefaultElements.content.card
	// ---------------------------------------------------------
	const {
		categoryRegistry,
		elementRegistry
	} = flexEngineStylesResolveRegistry(
		elementMode
	);


	// ---------------------------------------------------------
	// STEP 2
	// Build the base processor registry.
	//
	// Processor priority:
	//
	//     element
	//       ↓
	//     category
	//       ↓
	//     universal empty fallback
	// ---------------------------------------------------------
	const baseRegistry =
		flexEngineStylesCreateBaseRegistry(
			elementRegistry,
			categoryRegistry
		);


	// ---------------------------------------------------------
	// STEP 3
	// Normalize extra target declarations.
	//
	// No matter what format extras used, it becomes:
	//
	// {
	//     "1": {...},
	//     "2_1": {...}
	// }
	// ---------------------------------------------------------
	const extraRegistry =
		flexEngineStylesNormalizeExtras(
			baseRegistry.extras
		);


	// ---------------------------------------------------------
	// STEP 4
	// Read the appearance object.
	//
	// If appearance does not exist, use {}.
	//
	// Therefore:
	//
	// dataArray = {
	//     foo: "bar"
	// }
	//
	// simply results in no processing.
	// ---------------------------------------------------------
	const appearance =
		dataArray.appearance &&
		typeof dataArray.appearance === "object"
			? dataArray.appearance
			: {};


	// ---------------------------------------------------------
	// STEP 5
	// Read the configured prefix.
	//
	// Example:
	//
	// BUILDER_CONFIG.classPrefix = "fx"
	//
	// then:
	//
	// fx-styles-card
	// ---------------------------------------------------------
	const prefix =
		BUILDER_CONFIG?.classPrefix || "";


	// ---------------------------------------------------------
	// STEP 6
	// Process every appearance.
	//
	// Example:
	//
	// appearance: {
	//     default: {...},
	//     ".card": {...},
	//     ".featured": {...}
	// }
	//
	// creates three appearance processing passes.
	// ---------------------------------------------------------
	Object.entries(appearance).forEach(
		([appearanceName, appearanceData]) => {

			// Ignore invalid appearance definitions.
			//
			// Example:
			//
			// appearance: {
			//     default: null
			// }
			//
			// is simply skipped.
			if (
				!appearanceData ||
				typeof appearanceData !== "object"
			) {
				return;
			}


			// Process this entire appearance.
			flexEngineStylesProcessAppearance(
				appearanceName,
				appearanceData,
				baseRegistry,
				extraRegistry,
				node,
				prefix,
				isVertical
			);
		}
	);
};



// -----------------------------------------------
debugger;

const elementMode = "content/card";



const BUILDER_CONFIG = {
	classPrefix: "fx"
};

const flexEngineDefaultElements = {
	content: {

		// Category-level fallback.
		styleDefault: (style) => ({
			color: style.color
		}),

		styleMobile: (style) => ({
			color: style.color
		}),

		sizeDefault: (size, isVertical) => ({
			width: isVertical
				? "100%"
				: size.width,

			height: size.height
		}),

		sizeMobile: (size) => ({
			width: "100%",
			height: size.height
		}),

		card: {

			// Element-specific style processor.
			styleDefault: (style) => ({
				color: style.color,
				"background-color": style.background,
				"border-radius": style.radius,
				padding: style.padding
			}),

			// Element-specific mobile style processor.
			styleMobile: (style) => ({
				color: style.color,
				"background-color": style.background,
				padding: style.padding,
				"font-size": style.fontSize
			}),

			// Extra target definitions.
			extras: [
				{
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
				},

				{
					position: "3"
				}
			]
		}
	}
};

const data = {
	appearance: {

		// This is a valid appearance name.
		default: {

			base: {

				// Normal/default state.
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

				// Desktop hover.
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

				// Mobile.
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

				// Mobile hover.
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

			// Extra target.
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

			// Another extra target.
			//
			// It intentionally does not have
			// a custom processor in extras.
			//
			// Therefore it inherits from the
			// base element/category processors.
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

		// Another appearance.
		//
		// Notice that this is class-like.
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

flexEngineStylingSystem(
	data,
	node,
	false,
	elementMode,
);

/*
<div
	id="card-42"

	fx-styles-default="
		color: #ffffff;
		background-color: #2563eb;
		border-radius: 12px;
		padding: 24px;
		width: 400px;
		height: 250px;
	"

	fx-styles-default-onHover="
		color: #ffffff;
		background-color: #1d4ed8;
		border-radius: 14px;
		padding: 26px;
		width: 420px;
		height: 260px;
	"

	fx-styles-default-onMobile="
		color: #111827;
		background-color: #dbeafe;
		padding: 16px;
		font-size: 14px;
		width: 100%;
		height: 220px;
	"

	fx-styles-default-onMobileHover="
		color: #111827;
		background-color: #bfdbfe;
		padding: 18px;
		font-size: 14px;
		width: 100%;
		height: 230px;
	"

	fx-styles-default-at2_1="
		color: #0f172a;
		font-size: 18px;
		font-weight: 700;
		width: 100%;
		height: 60px;
	"

	fx-styles-default-onHover-at2_1="
		color: #1d4ed8;
		font-size: 20px;
		font-weight: 700;
		width: 100%;
		height: 64px;
	"

	fx-styles-default-onMobile-at3="
		color: #475569;
		background-color: #f1f5f9;
		padding: 12px;
		font-size: 12px;
		width: 100%;
		height: undefined;
	"

	fx-styles-featured="
		color: #fef3c7;
		background-color: #92400e;
		border-radius: 16px;
		padding: 30px;
	"
>
	...
</div>
*/



// remember, we need change default appearence!