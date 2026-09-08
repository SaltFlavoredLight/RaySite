const flexEngineActionQuery = {
	query: [
		{
			name: "enable",
			label: "Clickable",
			type: "boolean/checkmark"
		},

		{
			name: "action.mode",
			label: "Action",
			type: "selection",
			choice: [
				{
					name: "Link",
					value: "a"
				},
				{
					name: "Download",
					value: "download"
				},
				{
					name: "Open Popup",
					value: "openPopup"
				},
				{
					name: "Close This Popup",
					value: "closeThisPopup"
				},
				{
					name: "Run JavaScript",
					value: "runJS"
				}
			],
			visibleIf: {
				name: "enable",
				value: true
			}
		},

		{
			name: "action.url",
			label: "URL",
			type: "string/text",
			visibleIf: {
				name: "action.mode",
				value: ["a", "download"]
			}
		},

		{
			name: "action.newPage",
			label: "Open in New Page",
			type: "boolean/checkmark",
			visibleIf: {
				name: "action.mode",
				value: "a"
			}
		},

		{
			name: "action.forceDownload",
			label: "Force Download",
			type: "boolean/checkmark",
			visibleIf: {
				name: "action.mode",
				value: "download"
			}
		},

		{
			name: "action.popupID",
			label: "Popup ID",
			type: "string/text",
			visibleIf: {
				name: "action.mode",
				value: "openPopup"
			}
		},

		{
			name: "action.JS",
			label: "JavaScript",
			type: "string/text",
			visibleIf: {
				name: "action.mode",
				value: "runJS"
			}
		}
	]
};

const flexEngineCreateAction = function(
	documentHTML,
	clickable,
	nodeStyleDefault
) {
	let node = documentHTML.createElement(nodeStyleDefault);

	if (
		!clickable ||
		clickable.enable !== true ||
		!clickable.action
	) {
		return node;
	}

	const action = clickable.action;

	if (action.mode === "a") {
		node = documentHTML.createElement("a");
		node.href = action.url || "";

		if (action.newPage === true) {
			node.target = "_blank";
		}
	}

	if (action.mode === "download") {
		node = documentHTML.createElement("a");
		node.href = action.url || "";
		node.target = "_blank";
		node.download = "";

		if (action.forceDownload === true) {
			node.setAttribute("download", action.forceDownload);
		}
	}

	if (action.mode === "openPopup") {
		node = documentHTML.createElement("button");

		node.setAttribute(
			`data-${BUILDER_CONFIG.classPrefix}popup-id`,
			action.popupID || ""
		);
	}

	if (action.mode === "closeThisPopup") {
		node = documentHTML.createElement("button");

		node.setAttribute(
			`data-${BUILDER_CONFIG.classPrefix}popup-id`,
			"0"
		);
	}

	if (action.mode === "runJS") {
		node = documentHTML.createElement("button");

		node.setAttribute(
			"onclick",
			action.JS || ""
		);
	}

	return node;
};