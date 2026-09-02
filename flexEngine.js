/*
flexEngine.js 

the Core Render Engine FOr the Website Builder system
*/

// Enable strict mode, later I will use ESM.
'use strict';

// Nesserary for have a Quill delta element
import quill from 'https://cdn.jsdelivr.net/npm/quill@2.0.3/+esm';
import quillDeltaToHtml from 'https://cdn.jsdelivr.net/npm/quill-delta-to-html@0.12.1/+esm';

// And Sortable, another important part.
import Sortable from 'https://cdn.jsdelivr.net/npm/sortablejs/+esm';

// Our import of Editors:
import CubicBezierEditor from 'CubicBezierEditor.js';

// and configs
const BUILDER_CONFIG = {
	brandName: "RaySite",
	classPrefix: "rs-",
	attribution: "Spread the message with RaySite! RaySite is a Free Website builder for you!"
};


/*
this is the Functions Mode, we will organize soon after.
*/

// helper function for check this system
const flexEngineCheckContext = function(contextSetting, label) {

    // Normalize into array
    let list = [];

    if (Array.isArray(contextSetting)) {
        // Already an array
        list = contextSetting.map(s => String(s).trim());
    } 
    else if (typeof contextSetting === "string") {
        // Replace commas with spaces, split on spaces
        list = contextSetting
            .replace(/,/g, " ")
            .split(/\s+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    // Check if label exists
    return list.includes(label);
}

// this function will give animation as default. remember, section may different.
const flexEngineAnimationContextsNode = function(dataArray, node) {
	const prefix = BUILDER_CONFIG.classPrefix; // e.g. "cw-"
	const attrName = `${prefix}animation-config-self`;
	const triggerAttr = `${prefix}animation-config-self-trigger`;
	const anim = dataArray && dataArray.animation;

	// No animation → clear attributes
	if (!anim || anim.animation !== true) {
		node.setAttribute(attrName, "");
		node.setAttribute(triggerAttr, "");
		return;
	}

	// Inherit mode → write "inherit"
	if (anim.animationInherit === true) {
		node.setAttribute(attrName, "inherit");
		node.setAttribute(triggerAttr, "");
		return;
	}

	// Resolve animation type
	let animationNumber = Number(anim.animationType);
	if (!animationNumber || !flexEngineDefaultAnimation[animationNumber]) {
		animationNumber = 1; // fallback to fade
	}

	const entry = flexEngineDefaultAnimation[animationNumber];

	// Build CSS variables
	let cssVars = "";
	try {
		cssVars = entry.variables(anim) || "";
	} catch (e) {
		cssVars = "";
	}

	// Build animation shorthand
	const animationName = entry.name;
	const duration = entry.setting && entry.setting.timeOverride
		? `${entry.setting.timeOverrideSeconds}s`
		: `${num(anim.duration) || 0.6}s`;
	const delay = (anim.delayTime || 0) + "s";
	const curve = flexEngineStyleVarible.curve(anim.animationCurve);
	const cssAnim = `animation:${prefix}animation-${animationName} ` + `${duration} ${curve} ${delay} 1 normal both;`;

	// Write final attributes
	node.setAttribute(attrName, cssVars + cssAnim);
	node.setAttribute(triggerAttr, anim.trigger || 1);
};

