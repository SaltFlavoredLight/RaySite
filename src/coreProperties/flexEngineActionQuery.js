'use strict';
/**
 * Query system that forces the user to provide specific information for certain actions or configurations.
 * This is particularly useful for ensuring that all necessary parameters are collected before executing an action.
 */
const flexEngineActionQuery = [
    {
        name: "enable",
        label: "Clickable",
        type: "boolean/checkmark"
    },
    {
        name: "action.mode",
        label: "Action",
        type: "selection",
        choice: [{
            name: "Link",
            value: "a"
        }, {
            name: "Download",
            value: "download"
        }, {
            name: "Open Popup",
            value: "openPopup"
        }, {
            name: "Close This Popup",
            value: "closeThisPopup"
        }, {
            name: "Run JavaScript",
            value: "runJS"
        }],
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
];
