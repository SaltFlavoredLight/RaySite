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

// helper functions
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const num = v => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};
const flexEngineCheckContext = function(contextSetting, label) {

	// Normalize into array
	let list = [];

	if (Array.isArray(contextSetting)) {
		list = contextSetting.map(s => String(s).trim());
	}
	else if (typeof contextSetting === "string") {
		list = contextSetting
			.replace(/,/g, " ")
			.split(/\s+/)
			.map(s => s.trim())
			.filter(s => s.length > 0);
	}

	return list.includes(label);
};

/*
this is the Functions Mode, we will organize soon after.
*/



