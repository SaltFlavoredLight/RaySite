const flexengineCreateFloat = function(dataArray, documentHTML) {
	const node = flexEngineCreateEndNode(dataArray, documentHTML, true);

	const position = dataArray.position || {};

	const yPosition = position.yPosition;
	const yOffset = position.yOffset || 0;

	const xPosition = position.xPosition;
	const xOffset = position.xOffset || 0;

	const maxHeight = position.maxHeight;
	const maxWidth = position.maxWidth;

	let floatCss = `
		position: fixed;
	`.trim();

	// Y position
	if (yPosition === 1) {
		floatCss += `
			top: ${yOffset};
			bottom: auto;
		`;
	} else if (yPosition === 3) {
		floatCss += `
			top: auto;
			bottom: ${yOffset};
		`;
	} else {
		floatCss += `
			top: auto;
			bottom: auto;
		`;
	}

	// X position
	if (xPosition === 1) {
		floatCss += `
			left: ${xOffset};
			right: auto;
		`;
	} else if (xPosition === 3) {
		floatCss += `
			left: auto;
			right: ${xOffset};
		`;
	} else if (xPosition === 2) {
		floatCss += `
			left: 0;
			right: 0;
		`;
	}

	// Max dimensions
	if (maxHeight !== undefined && maxHeight !== null && maxHeight !== "") {
		floatCss += `
			max-height: ${maxHeight};
		`;
	}

	if (maxWidth !== undefined && maxWidth !== null && maxWidth !== "") {
		floatCss += `
			max-width: ${maxWidth};
		`;
	}

	const prefix = BUILDER_CONFIG.classPrefix + "styles-node";

	node.setAttribute(
		prefix,
		((node.getAttribute(prefix) || "") + " " + floatCss).trim()
	);

	return node;
};