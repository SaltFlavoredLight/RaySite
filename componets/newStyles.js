// this is the old version, please do not use this snap


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


const flexEngineStylesResolveRegistry = (elementMode) => {
	const rawMode = String(elementMode || "");

	const separatorIndex = rawMode.indexOf("/");

	const category =
		separatorIndex === -1
			? rawMode
			: rawMode.substring(0, separatorIndex);

	const element =
		separatorIndex === -1
			? ""
			: rawMode.substring(separatorIndex + 1);

	const isRoot = category === "@root";

	const categoryRegistry = isRoot
		? (flexEngineRootElement || {})
		: (flexEngineDefaultElements?.[category] || {});

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


const flexEngineStylesGetProcessor = (
	elementRegistry,
	categoryRegistry,
	processorName,
	fallback
) => {
	if (
		elementRegistry &&
		typeof elementRegistry[processorName] === "function"
	) {
		return elementRegistry[processorName];
	}

	if (
		categoryRegistry &&
		typeof categoryRegistry[processorName] === "function"
	) {
		return categoryRegistry[processorName];
	}

	return fallback;
};


const flexEngineStylesCreateBaseRegistry = (
	elementRegistry,
	categoryRegistry
) => {
	return {
		styleDefault: flexEngineStylesGetProcessor(
			elementRegistry,
			categoryRegistry,
			"styleDefault",
			() => ({})
		),

		styleMobile: flexEngineStylesGetProcessor(
			elementRegistry,
			categoryRegistry,
			"styleMobile",
			() => ({})
		),

		sizeDefault: flexEngineStylesGetProcessor(
			elementRegistry,
			categoryRegistry,
			"sizeDefault",
			() => ({})
		),

		sizeMobile: flexEngineStylesGetProcessor(
			elementRegistry,
			categoryRegistry,
			"sizeMobile",
			() => ({})
		),

		extras:
			elementRegistry?.extras ??
			categoryRegistry?.extras ??
			null
	};
};


const flexEngineStylesNormalizeExtras = (extras) => {
	const normalized = {};

	if (!extras) {
		return normalized;
	}

	// Single string:
	// extras: "2_1"
	if (typeof extras === "string") {
		normalized[extras] = {};
		return normalized;
	}

	// Array:
	// extras: ["1", "2_1"]
	//
	// or:
	// extras: [
	//     {
	//         position: "2_1",
	//         styleDefault: ...
	//     }
	// ]
	if (Array.isArray(extras)) {
		extras.forEach((item) => {
			if (typeof item === "string") {
				normalized[item] = {};
				return;
			}

			if (!item || typeof item !== "object") {
				return;
			}

			const position =
				item.position ??
				item.target ??
				item.name ??
				item.key;

			if (!position) {
				return;
			}

			normalized[String(position)] = item;
		});

		return normalized;
	}

	// Single object definition:
	// {
	//     position: "2_1",
	//     styleDefault: ...
	// }
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
		const position =
			extras.position ??
			extras.target;

		if (position) {
			normalized[String(position)] = extras;
		}

		return normalized;
	}

	// Position map:
	// {
	//     "1": {
	//         styleDefault: ...
	//     },
	//     "2_1": {
	//         sizeDefault: ...
	//     }
	// }
	Object.entries(extras).forEach(([position, config]) => {
		if (typeof config === "string") {
			normalized[position] = {};
			return;
		}

		if (config && typeof config === "object") {
			normalized[position] = config;
			return;
		}

		normalized[position] = {};
	});

	return normalized;
};


const flexEngineStylesGetExtraProcessors = (
	extraConfig,
	baseRegistry
) => {
	const extra = extraConfig || {};

	return {
		styleDefault:
			typeof extra.styleDefault === "function"
				? extra.styleDefault
				: baseRegistry.styleDefault,

		styleMobile:
			typeof extra.styleMobile === "function"
				? extra.styleMobile
				: baseRegistry.styleMobile,

		sizeDefault:
			typeof extra.sizeDefault === "function"
				? extra.sizeDefault
				: baseRegistry.sizeDefault,

		sizeMobile:
			typeof extra.sizeMobile === "function"
				? extra.sizeMobile
				: baseRegistry.sizeMobile
	};
};


const flexEngineStylesGetStateProcessors = (
	stateName,
	processorRegistry
) => {
	switch (stateName) {
		case "onMobile":
			return {
				style: processorRegistry.styleMobile,
				size: processorRegistry.sizeMobile
			};

		case "hover":
			return {
				style: processorRegistry.styleDefault,
				size: processorRegistry.sizeDefault
			};

		case "onMobileHover":
			return {
				style: processorRegistry.styleMobile,
				size: processorRegistry.sizeMobile
			};

		case "default":
		default:
			return {
				style: processorRegistry.styleDefault,
				size: processorRegistry.sizeDefault
			};
	}
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
		stateData.style &&
		typeof stateData.style === "object"
			? stateData.style
			: {};

	const sizeData =
		stateData.size &&
		typeof stateData.size === "object"
			? stateData.size
			: {};

	const processors =
		flexEngineStylesGetStateProcessors(
			stateName,
			processorRegistry
		);

	const styleResult =
		typeof processors.style === "function"
			? (
				processors.style(styleData) || {}
			)
			: {};

	const sizeResult =
		typeof processors.size === "function"
			? (
				processors.size(
					sizeData,
					isVertical
				) || {}
			)
			: {};

	return {
		...styleResult,
		...sizeResult
	};
};


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


const flexEngineStylesBuildTargetSuffix = (position) => {
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


const flexEngineStylesBuildClassName = (
	prefix,
	appearanceName,
	position,
	stateName
) => {
	const cleanAppearance =
		String(appearanceName || "")
			.replace(/^\./, "");

	const stateSuffix =
		flexEngineStylesBuildStateSuffix(
			stateName
		);

	const targetSuffix =
		flexEngineStylesBuildTargetSuffix(
			position
		);

	return `${prefix}-styles-${cleanAppearance}${stateSuffix}${targetSuffix}`;
};


const flexEngineStylesGetTargetPositions = (
	appearanceData,
	extraRegistry
) => {
	const positions = new Set(["base"]);

	if (
		appearanceData &&
		typeof appearanceData === "object"
	) {
		Object.keys(appearanceData).forEach((key) => {
			positions.add(String(key));
		});
	}

	Object.keys(extraRegistry || {}).forEach((key) => {
		positions.add(String(key));
	});

	return Array.from(positions);
};


const flexEngineStylesGetStates = () => {
	return [
		"default",
		"onMobile",
		"hover",
		"onMobileHover"
	];
};


const flexEngineStylesApplyResult = (
	node,
	attributeName,
	cssObject
) => {
	if (!node || typeof node.setAttribute !== "function") {
		return;
	}

	node.setAttribute(
		attributeName,
		flexEngineStylesToCss(cssObject)
	);
};


const flexEngineStylesProcessAppearance = (
	appearanceName,
	appearanceData,
	baseRegistry,
	extraRegistry,
	node,
	prefix,
	isVertical
) => {
	const positions =
		flexEngineStylesGetTargetPositions(
			appearanceData,
			extraRegistry
		);

	const states =
		flexEngineStylesGetStates();

	positions.forEach((position) => {
		const targetData =
			appearanceData &&
			typeof appearanceData === "object"
				? appearanceData[position]
				: undefined;

		const extraConfig =
			position === "base"
				? null
				: extraRegistry?.[position] || null;

		const processorRegistry =
			extraConfig
				? flexEngineStylesGetExtraProcessors(
					extraConfig,
					baseRegistry
				)
				: baseRegistry;

		states.forEach((stateName) => {
			const stateData =
				targetData &&
				typeof targetData === "object"
					? targetData[stateName]
					: undefined;

			if (
				!stateData ||
				typeof stateData !== "object"
			) {
				return;
			}

			const cssObject =
				flexEngineStylesProcessState(
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

			flexEngineStylesApplyResult(
				node,
				attributeName,
				cssObject
			);
		});
	});
};


// Styling system
const flexEngineStylingSystem = function(
	dataArray,
	node,
	isVertical,
	elementMode
) {
	if (
		!node ||
		!dataArray ||
		typeof dataArray !== "object"
	) {
		return;
	}

	const {
		categoryRegistry,
		elementRegistry
	} = flexEngineStylesResolveRegistry(
		elementMode
	);

	const baseRegistry =
		flexEngineStylesCreateBaseRegistry(
			elementRegistry,
			categoryRegistry
		);

	const extraRegistry =
		flexEngineStylesNormalizeExtras(
			baseRegistry.extras
		);

	const appearance =
		dataArray.appearance &&
		typeof dataArray.appearance === "object"
			? dataArray.appearance
			: {};

	const prefix =
		BUILDER_CONFIG?.classPrefix || "";

	Object.entries(appearance).forEach(
		([appearanceName, appearanceData]) => {
			if (
				!appearanceData ||
				typeof appearanceData !== "object"
			) {
				return;
			}

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