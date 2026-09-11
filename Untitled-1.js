// Create Popup (single function, no inner wrapper)
const flexengineCreatePopup = function(dataArray, documentHTML) {
	// Create the popup root
	const node = documentHTML.createElement("div");

	// Prefixes
	const prefix = BUILDER_CONFIG.classPrefix + "styles-node";
	const prefixMobile = BUILDER_CONFIG.classPrefix + "styles-node-onMobile";

	// --------------------------------------------------
	// Basic attributes / classes
	// --------------------------------------------------

	node.id = dataArray.outerJSID;

	node.classList.add(`${BUILDER_CONFIG.classPrefix}popup`);
	node.classList.add(`${BUILDER_CONFIG.classPrefix}content-popup-inner`);
	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.id}`);

	// --------------------------------------------------
	// Layout
	// --------------------------------------------------

	const layout = dataArray.layout || {};

	const acrossMap = [
		"",
		"justify-start",
		"justify-center",
		"justify-end",
		"justify-stretch"
	];

	const alongMap = [
		"",
		"align-start",
		"align-center",
		"align-end"
	];

	const overflowMap = [
		"",
		"overflow-scroll",
		"overflow-hidden",
		""
	];

	let cssOutput = "";
	let cssMobileOutput = "";

	if (layout.spaceAcross) {
		const rule = acrossMap[layout.spaceAcross];

		if (rule) {
			cssOutput += `.${prefix}-${rule}{justify-content:${flexEngineStyleVariable.justify[rule]};}`;
		}
	}

	if (layout.spaceAlong) {
		const rule = alongMap[layout.spaceAlong];

		if (rule) {
			cssOutput += `.${prefix}-${rule}{align-items:${flexEngineStyleVariable.align[rule]};}`;
		}
	}

	if (layout.overflow && overflowMap[layout.overflow]) {
		const rule = overflowMap[layout.overflow];

		cssOutput += `.${prefix}-${rule}{overflow:${flexEngineStyleVariable.overflow[rule]};}`;
	}

	if (layout.gap !== undefined) {
		const gapValue = flexEngineStyleVariable.space[layout.gap];

		if (gapValue !== undefined) {
			cssOutput += `.${prefix}-gap-${gapValue}{gap:${gapValue};}`;
		}
	}

	if (layout.mobileReverseDirection) {
		cssMobileOutput += `.${prefixMobile}-reverse{flex-direction:column-reverse;}`;
	}

	if (layout.mobileGap !== undefined) {
		const gapValue = flexEngineStyleVariable.space[layout.mobileGap];

		if (gapValue !== undefined) {
			cssMobileOutput += `.${prefixMobile}-gap-${gapValue}{gap:${gapValue};}`;
		}
	}

	node.setAttribute(prefix, cssOutput);
	node.setAttribute(prefixMobile, cssMobileOutput);

	// --------------------------------------------------
	// Popup outer style
	// --------------------------------------------------

	const outerDesktopCSS = `
		margin-top: ${SectionData.outerstyle.marginTop};
		margin-bottom: ${SectionData.outerstyle.marginBottom};
		margin-left: ${SectionData.outerstyle.marginLeft};
		margin-right: ${SectionData.outerstyle.marginRight};
		background: ${SectionData.outerstyle.background};
		backdrop-filter: blur(${SectionData.outerstyle.blur}px);
	`;

	const outerMobileCSS = `
		margin-top: ${SectionData.outerstyle.mobileMarginTop};
		margin-bottom: ${SectionData.outerstyle.mobileMarginBottom};
		margin-left: ${SectionData.outerstyle.mobileMarginLeft};
		margin-right: ${SectionData.outerstyle.mobileMarginRight};
	`;

	node.setAttribute(
		prefix,
		`${node.getAttribute(prefix) || ""}${outerDesktopCSS.trim()}`
	);

	node.setAttribute(
		prefixMobile,
		`${node.getAttribute(prefixMobile) || ""}${outerMobileCSS.trim()}`
	);

	// --------------------------------------------------
	// Popup animation
	// --------------------------------------------------

	// Animation of the popup itself
	flexEngineAnimationContextsNode(dataArray, node);

	// --------------------------------------------------
	// Click to close
	// --------------------------------------------------

	if (dataArray.cilckToClose === true) {
		node.setAttribute(
			`data-${BUILDER_CONFIG.classPrefix}clicktoclose`,
			"true"
		);
	}

	// --------------------------------------------------
	// Popup size / position
	// --------------------------------------------------

	const sizeDesktopCSS = `
		display: flex;
		flex-direction: column;
		justify-content: ${
			SectionData.size.positionY === 1
				? "flex-start"
				: SectionData.size.positionY === 3
					? "flex-end"
					: "center"
		};
		align-items: ${
			SectionData.size.positionX === 1
				? "flex-start"
				: SectionData.size.positionX === 3
					? "flex-end"
					: "center"
		};
	`;

	const sizeMobileCSS = `
		justify-content: ${
			SectionData.size.mobilePositionY === 1
				? "flex-start"
				: SectionData.size.mobilePositionY === 3
					? "flex-end"
					: "center"
		};
	`;

	node.setAttribute(
		prefix,
		`${node.getAttribute(prefix) || ""}${sizeDesktopCSS.trim()}`
	);

	node.setAttribute(
		prefixMobile,
		`${node.getAttribute(prefixMobile) || ""}${sizeMobileCSS.trim()}`
	);

	// --------------------------------------------------
	// Children
	// --------------------------------------------------

	if (Array.isArray(dataArray.context)) {
		dataArray.context.forEach(ctx => {
			const childNode = flexEngineCreateEndNode(
				ctx,
				documentHTML,
				true
			);

			if (childNode) {
				node.appendChild(childNode);
			}
		});
	}

	// --------------------------------------------------
	// Section styling
	// --------------------------------------------------

	flexEngineStylingSystem(
		dataArray,
		node,
		true,
		4
	);

	// --------------------------------------------------
	// Section animation
	// --------------------------------------------------

	flexEngineAnimationSection(
		dataArray,
		node,
		true
	);

	// --------------------------------------------------
	// Transition
	// --------------------------------------------------

	flexEngineTransitionContextsNode(
		dataArray,
		node
	);

	// --------------------------------------------------
	// Return
	// --------------------------------------------------

	return node;
};