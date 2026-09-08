/*
Transition system
*/
const flexEngineTransition = {

	/*
	 * ============================================================
	 * SELF QUERY
	 * ============================================================
	 *
	 * Used when mode = 1.
	 *
	 * Data is stored under:
	 *
	 * transition.self.*
	 */
	selfQuery: [

		{
			name: "transition.self.property",
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
			default: []
		},

		{
			name: "transition.self.duration",
			label: "Duration",
			type: "integer/noNeg",
			default: 300
		},

		{
			name: "transition.self.delay",
			label: "Delay",
			type: "integer/noNeg",
			default: 0
		},

		{
			name: "transition.self.curve",
			label: "Timing Curve",
			type: "curve/curve"
		}
	],


	/*
	 * ============================================================
	 * ALL QUERY
	 * ============================================================
	 *
	 * Used when mode = 2.
	 *
	 * Data is stored under:
	 *
	 * transition.all.*
	 */
	allQuery: [

		{
			name: "transition.all.property",
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
			name: "transition.all.duration",
			label: "Duration",
			type: "integer/noNeg",
			default: 300
		},

		{
			name: "transition.all.delay",
			label: "Delay",
			type: "integer/noNeg",
			default: 0
		},

		{
			name: "transition.all.curve",
			label: "Timing Curve",
			type: "curve/curve"
		}
	],


	/*
	 * ============================================================
	 * INTERNAL RENDERER
	 * ============================================================
	 *
	 * Render one transition object into CSS.
	 *
	 * This does not know about SELF / SECTION.
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

		for (const property of transition.property) {

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
	},


	/*
	 * ============================================================
	 * MAIN RENDER
	 * ============================================================
	 *
	 * mode:
	 *
	 * 0 = None
	 * 1 = Self
	 * 2 = Section
	 * 3 = Inherit
	 *
	 * Returns an object because SECTION mode needs both
	 * self and all output.
	 */
	render: function(transition, mode) {

		const renderMode =
			Number(mode);


		/*
		 * --------------------------------------------------------
		 * MODE 0
		 * --------------------------------------------------------
		 */

		if (renderMode === 0) {
			return {
				self: "",
				all: ""
			};
		}


		/*
		 * --------------------------------------------------------
		 * MODE 1
		 * --------------------------------------------------------
		 *
		 * Only SELF is active.
		 */

		if (renderMode === 1) {

			const selfCSS =
				this.renderSingle(
					transition &&
					transition.self
				);

			return {
				self: selfCSS
					? `transition:${selfCSS};`
					: "",
				all: ""
			};
		}


		/*
		 * --------------------------------------------------------
		 * MODE 2
		 * --------------------------------------------------------
		 *
		 * SECTION owns both SELF and ALL.
		 */

		if (renderMode === 2) {

			const selfCSS =
				this.renderSingle(
					transition &&
					transition.self
				);

			const allCSS =
				this.renderSingle(
					transition &&
					transition.all
				);

			return {
				self: selfCSS
					? `transition:${selfCSS};`
					: "",

				all: allCSS
					? `transition:${allCSS};`
					: ""
			};
		}


		/*
		 * --------------------------------------------------------
		 * MODE 3
		 * --------------------------------------------------------
		 *
		 * Controlled by a SECTION.
		 *
		 * Do not generate actual transition CSS.
		 *
		 * The section will later write it.
		 */

		if (renderMode === 3) {
			return {
				self: "inherit",
				all: ""
			};
		}


		/*
		 * --------------------------------------------------------
		 * UNKNOWN MODE
		 * --------------------------------------------------------
		 */

		return {
			self: "",
			all: ""
		};
	}
};


/*
Apply transition configuration to a node.
*/
const flexEngineTransitionContextsNode = function(
	dataArray,
	node,
	mode
) {

	if (!node) {
		return;
	}

	const prefix =
		BUILDER_CONFIG.classPrefix;

	const attrSelf =
		`${prefix}transition-config-self`;

	const attrAll =
		`${prefix}transition-config-all`;


	const transition =
		dataArray &&
		dataArray.transition;


	const result =
		flexEngineTransition.render(
			transition,
			mode
		);


	node.setAttribute(
		attrSelf,
		result.self || ""
	);

	node.setAttribute(
		attrAll,
		result.all || ""
	);
};