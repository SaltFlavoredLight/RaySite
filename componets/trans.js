/*
 * Transition system
 */
const flexEngineTransition = {

	name: "transition",


	/*
	 * ============================================================
	 * SELF QUERY
	 * ============================================================
	 *
	 * Data:
	 *
	 * transition.self.*
	 */
	selfQuery: [

		{
			name: "inherit",
			label: "Inherit",
			type: "boolean/checkmark"
		},

		{
			name: "property",
			label: "Property",
			type: "selection/popup",

			catergory: [
				{
					label: "Basic",
					choice: [
						{ name: "all", label: "All" },
						{ name: "opacity", label: "Opacity" },
						{ name: "visibility", label: "Visibility" }
					]
				},

				{
					label: "Transform",
					choice: [
						{ name: "transform", label: "Transform" }
					]
				},

				{
					label: "Size",
					choice: [
						{ name: "width", label: "Width" },
						{ name: "height", label: "Height" },
						{ name: "min-width", label: "Minimum Width" },
						{ name: "max-width", label: "Maximum Width" },
						{ name: "min-height", label: "Minimum Height" },
						{ name: "max-height", label: "Maximum Height" }
					]
				},

				{
					label: "Spacing",
					choice: [
						{ name: "padding", label: "Padding" },
						{ name: "padding-top", label: "Padding Top" },
						{ name: "padding-right", label: "Padding Right" },
						{ name: "padding-bottom", label: "Padding Bottom" },
						{ name: "padding-left", label: "Padding Left" }
					]
				},

				{
					label: "Background & Color",
					choice: [
						{ name: "background", label: "Background" },
						{ name: "background-color", label: "Background Color" },
						{ name: "color", label: "Text Color" },
						{ name: "border-color", label: "Border Color" }
					]
				},

				{
					label: "Border",
					choice: [
						{ name: "border", label: "Border" },
						{ name: "border-width", label: "Border Width" },
						{ name: "border-top-width", label: "Top Border Width" },
						{ name: "border-right-width", label: "Right Border Width" },
						{ name: "border-bottom-width", label: "Bottom Border Width" },
						{ name: "border-left-width", label: "Left Border Width" },
						{ name: "border-radius", label: "Border Radius" }
					]
				},

				{
					label: "Shadow & Filter",
					choice: [
						{ name: "box-shadow", label: "Box Shadow" },
						{ name: "filter", label: "Filter" },
						{ name: "backdrop-filter", label: "Backdrop Filter" }
					]
				},

				{
					label: "Other",
					choice: [
						{ name: "font-size", label: "Font Size" },
						{ name: "line-height", label: "Line Height" },
						{ name: "letter-spacing", label: "Letter Spacing" },
						{ name: "flex", label: "Flex" },
						{ name: "flex-grow", label: "Flex Grow" },
						{ name: "flex-shrink", label: "Flex Shrink" },
						{ name: "gap", label: "Gap" }
					]
				}
			],

			default: [],

			visibleIf: {
				name: "inherit",
				value: false
			}
		},

		{
			name: "duration",
			label: "Duration",
			type: "integer/noNeg",
			default: 300,

			visibleIf: {
				name: "inherit",
				value: false
			}
		},

		{
			name: "delay",
			label: "Delay",
			type: "integer/noNeg",
			default: 0,

			visibleIf: {
				name: "inherit",
				value: false
			}
		},

		{
			name: "curve",
			label: "Timing Curve",
			type: "curve/curve",

			visibleIf: {
				name: "inherit",
				value: false
			}
		}
	],


	/*
	 * ============================================================
	 * ALL QUERY
	 * ============================================================
	 */
	allQuery: [

		{
			name: "property",
			label: "Property",
			type: "selection/popup",

			catergory: [
				{
					label: "Basic",
					choice: [
						{ name: "all", label: "All" },
						{ name: "opacity", label: "Opacity" },
						{ name: "visibility", label: "Visibility" }
					]
				},

				{
					label: "Transform",
					choice: [
						{ name: "transform", label: "Transform" }
					]
				},

				{
					label: "Size",
					choice: [
						{ name: "width", label: "Width" },
						{ name: "height", label: "Height" },
						{ name: "min-width", label: "Minimum Width" },
						{ name: "max-width", label: "Maximum Width" },
						{ name: "min-height", label: "Minimum Height" },
						{ name: "max-height", label: "Maximum Height" }
					]
				},

				{
					label: "Spacing",
					choice: [
						{ name: "margin", label: "Margin" },
						{ name: "margin-top", label: "Margin Top" },
						{ name: "margin-right", label: "Margin Right" },
						{ name: "margin-bottom", label: "Margin Bottom" },
						{ name: "margin-left", label: "Margin Left" },

						{ name: "padding", label: "Padding" },
						{ name: "padding-top", label: "Padding Top" },
						{ name: "padding-right", label: "Padding Right" },
						{ name: "padding-bottom", label: "Padding Bottom" },
						{ name: "padding-left", label: "Padding Left" }
					]
				},

				{
					label: "Background & Color",
					choice: [
						{ name: "background", label: "Background" },
						{ name: "background-color", label: "Background Color" },
						{ name: "color", label: "Text Color" },
						{ name: "border-color", label: "Border Color" }
					]
				},

				{
					label: "Border",
					choice: [
						{ name: "border", label: "Border" },
						{ name: "border-width", label: "Border Width" },
						{ name: "border-top-width", label: "Top Border Width" },
						{ name: "border-right-width", label: "Right Border Width" },
						{ name: "border-bottom-width", label: "Bottom Border Width" },
						{ name: "border-left-width", label: "Left Border Width" },
						{ name: "border-radius", label: "Border Radius" }
					]
				},

				{
					label: "Shadow & Filter",
					choice: [
						{ name: "box-shadow", label: "Box Shadow" },
						{ name: "filter", label: "Filter" },
						{ name: "backdrop-filter", label: "Backdrop Filter" }
					]
				},

				{
					label: "Other",
					choice: [
						{ name: "font-size", label: "Font Size" },
						{ name: "line-height", label: "Line Height" },
						{ name: "letter-spacing", label: "Letter Spacing" },
						{ name: "flex", label: "Flex" },
						{ name: "flex-grow", label: "Flex Grow" },
						{ name: "flex-shrink", label: "Flex Shrink" },
						{ name: "gap", label: "Gap" }
					]
				}
			],

			default: []
		},

		{
			name: "duration",
			label: "Duration",
			type: "integer/noNeg",
			default: 300
		},

		{
			name: "delay",
			label: "Delay",
			type: "integer/noNeg",
			default: 0
		},

		{
			name: "curve",
			label: "Timing Curve",
			type: "curve/curve"
		}
	],


	/*
	 * ============================================================
	 * RENDER
	 * ============================================================
	 */
	render: {

		/*
		 * --------------------------------------------------------
		 * MODE 0
		 * --------------------------------------------------------
		 */
		0: function(dataArray, node) {

			if (!node) {
				return;
			}

			const prefix =
				BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}transition-config-self`,
				""
			);

			node.setAttribute(
				`${prefix}transition-config-all`,
				""
			);

			node.setAttribute(
				`${prefix}transition-self-inherit`,
				""
			);

			return;
		},


		/*
		 * --------------------------------------------------------
		 * MODE 1
		 * --------------------------------------------------------
		 *
		 * Transition enabled for SELF.
		 */
		1: function(dataArray, node) {

			if (!node) {
				return;
			}

			const prefix =
				BUILDER_CONFIG.classPrefix;

			const attrSelf =
				`${prefix}transition-config-self`;

			const attrInherit =
				`${prefix}transition-self-inherit`;

			const transition =
				dataArray &&
				dataArray.transition &&
				dataArray.transition.self;


			/*
			 * Inherit from parent SECTION.
			 */
			if (
				transition &&
				transition.inherit === true
			) {

				node.setAttribute(
					attrInherit,
					"1"
				);

				node.setAttribute(
					attrSelf,
					"inherit"
				);

				return;
			}


			/*
			 * Normal SELF transition.
			 */
			node.setAttribute(
				attrInherit,
				""
			);


			const selfCSS =
				flexEngineTransition.renderSingle(
					transition
				);


			node.setAttribute(
				attrSelf,
				selfCSS
					? `transition:${selfCSS};`
					: ""
			);

			return;
		},


		/*
		 * --------------------------------------------------------
		 * MODE 2
		 * --------------------------------------------------------
		 *
		 * SECTION owns both SELF and ALL.
		 */
		2: function(dataArray, node) {

			if (!node || !dataArray) {
				return;
			}

			const prefix =
				BUILDER_CONFIG.classPrefix;

			const attrSelf =
				`${prefix}transition-config-self`;

			const attrAll =
				`${prefix}transition-config-all`;

			const transitionData =
				dataArray.transition || {};


			/*
			 * Render SELF.
			 */
			const selfData =
				structuredClone(dataArray);

			selfData.transition =
				transitionData.self || {};

			flexEngineTransition.render[1](
				selfData,
				node
			);


			/*
			 * Render ALL.
			 */
			const allTransition =
				transitionData.all;


			if (!allTransition) {

				node.setAttribute(
					attrAll,
					""
				);

				return;
			}


			const allCSS =
				flexEngineTransition.renderSingle(
					allTransition
				);


			node.setAttribute(
				attrAll,
				allCSS
					? `transition:${allCSS};`
					: ""
			);

			return;
		},


		/*
		 * --------------------------------------------------------
		 * MODE 3
		 * --------------------------------------------------------
		 *
		 * Controlled by a SECTION.
		 */
		3: function(dataArray, node) {

			if (!node) {
				return;
			}

			const prefix =
				BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}transition-config-self`,
				"inherit"
			);

			node.setAttribute(
				`${prefix}transition-self-inherit`,
				"1"
			);

			return;
		},


		/*
		 * --------------------------------------------------------
		 * UNKNOWN MODE
		 * --------------------------------------------------------
		 */
		other: function(dataArray, node) {

			return;
		}
	},


	/*
	 * ============================================================
	 * APPLY SECTION TRANSITION
	 * ============================================================
	 */
	applySectionTransition: function(node) {

		if (!node) {
			return;
		}

		const prefix =
			BUILDER_CONFIG.classPrefix;

		const attrAll =
			`${prefix}transition-config-all`;

		const attrSelf =
			`${prefix}transition-config-self`;

		const attrSelfInherit =
			`${prefix}transition-self-inherit`;

		const allConfig =
			node.getAttribute(attrAll) || "";


		if (
			!allConfig ||
			allConfig === "inherit"
		) {
			return;
		}


		const walk =
			function(currentNode, currentDepth) {

				const currentInherit =
					currentNode.getAttribute(
						attrSelfInherit
					);

				const enabled =
					currentInherit !== null &&
					currentInherit !== "" &&
					currentInherit !== "0";


				if (enabled) {

					currentNode.setAttribute(
						attrSelfInherit,
						String(currentDepth)
					);

					currentNode.setAttribute(
						attrSelf,
						allConfig
					);
				}


				[...currentNode.children].forEach(
					function(child) {
						walk(
							child,
							currentDepth + 1
						);
					}
				);
			};


		[...node.children].forEach(
			function(child) {
				walk(child, 1);
			}
		);
	},


	/*
	 * ============================================================
	 * INTERNAL RENDERER
	 * ============================================================
	 *
	 * Kept at the BACK.
	 */
	renderSingle: function(transition) {

		if (!transition) {
			return "";
		}

		if (!Array.isArray(transition.property)) {
			return "";
		}

		if (transition.property.length === 0) {
			return "";
		}


		const duration =
			Math.max(
				0,
				Number(transition.duration) || 0
			);

		const delay =
			Math.max(
				0,
				Number(transition.delay) || 0
			);


		let curve = "";

		try {
			curve =
				flexEngineDefaultVaribles
					.curve
					.curve
					.render(
						transition.curve
					) || "ease";
		}
		catch (e) {
			curve = "ease";
		}


		const durationSeconds =
			duration / 1000;

		const delaySeconds =
			delay / 1000;


		const parts = [];


		for (
			const property of transition.property
		) {

			if (
				typeof property !== "string" ||
				property.trim() === ""
			) {
				continue;
			}

			parts.push(
				`${property} ${durationSeconds}s ${curve} ${delaySeconds}s`
			);
		}


		return parts.join(",");
	}
};