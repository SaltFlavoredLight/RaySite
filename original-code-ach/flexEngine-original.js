/*
This is Flex Engine.

it work as create whole DOM for the website, then do everything else at next step.

Future:
we will change this whole part of code from the Normal to registery mode.
*/

// NEXT DAY (late 3.5 day): HEADER
// LAST: combine final HTML and CSS theme

'use strict';

import quillDeltaToHtml from 'https://cdn.jsdelivr.net/npm/quill-delta-to-html@0.12.1/+esm'

/*
Config
*/
const BUILDER_CONFIG = {
	brandName: "RaySite",
	classPrefix: "rs-",
	attribution: "Spread the message with RaySite! RaySite is a Free Website builder for you!"
};

/*
Styling system
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


// Variable system
const flexEngineStyleVarible = {
	color: function(colorObj) {
		if (!colorObj || !colorObj.mode) return 'transparent';

		switch (colorObj.mode) {
			case 'hex':
				return colorObj.hex;

			case 'linearGradient':
				// Map the stops array into "color offset, color offset" format
				const gradientStops = colorObj.stops
					.map(stop => `${stop.color} ${stop.offset}`)
					.join(', ');
				return `linear-gradient(${colorObj.angle}, ${gradientStops})`;

			case 'backgroundIMG':
				const repeat = `${colorObj.repeatX ? 'repeat-x' : ''} ${colorObj.repeatY ? 'repeat-y' : ''}`.trim() || 'no-repeat';

				// Mapping 1-3 to CSS position keywords
				const posX = ['left', 'center', 'right'][colorObj.positionX - 1] || 'center';
				const posY = ['top', 'center', 'bottom'][colorObj.positionY - 1] || 'center';
				const attachment = colorObj.attachment ? 'fixed' : 'scroll';

				// If a color overlay is provided, we use a linear-gradient trick 
				// to layer the color over the image.
				if (colorObj.coloroverlay && colorObj.coloroverlay !== 'transparent') {
					return `linear-gradient(${colorObj.coloroverlay}, ${colorObj.coloroverlay}), url("${colorObj.src}") ${posX} ${posY} / auto ${repeat} ${attachment}`;
				}
				return `url("${colorObj.src}") ${posX} ${posY} / auto ${repeat} ${attachment}`;

			case 'variables':
				return `var(--${colorObj.variables})`;

			case 'inherit':
				return 'inherit';

			case 'none':
			default:
				return 'transparent';
		}
	},

	space: function(spaceObj) {
		if (!spaceObj || !spaceObj.mode) return '0px';

		switch (spaceObj.mode) {
			case 'auto':
				return 'auto';

			case 'variables':
				return `var(--${spaceObj.variables})`;

				// Handles: px, rem, em, %, vw, vh, vmin, vmax, ch
			default:
				const validUnits = ['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax', 'ch'];
				if (validUnits.includes(spaceObj.mode)) {
					return `${spaceObj.value}${spaceObj.mode}`;
				}

				// Fallback for unexpected modes
				return '0px';
		}
	},

	media: function(mediaObj) {
		if (!mediaObj || !mediaObj.mode) return '';

		switch (mediaObj.mode) {
			case 'internal':
				const prefix = BUILDER_CONFIG.classPrefix;

				// Constructing: prefix-assets/folder/name
				return `/${prefix}assets/${mediaObj.folder}/${mediaObj.name}`;

			case 'external':
				return mediaObj.url;

			default:
				return '';
		}
	},

	// for Head only
	absMedia: function(mediaObj, mainArray, selfSlug) {
		if (!mediaObj || !mediaObj.mode) return '';

		switch (mediaObj.mode) {
			case 'internal':

				const prefix = BUILDER_CONFIG.classPrefix;

				const absoluteDomainEnable = (selfSlug !== null && mainArray.domain !== null && selfSlug !== "" && mainArray.domain !== "");
				const absoluteDomain = (absoluteDomainEnable) ? `https://${mainArray.domain}` : "/";

				// Constructing: prefix/assets/folder/name
				return `${absoluteDomain}/${prefix}assets/${mediaObj.folder}/${mediaObj.name}`;

			case 'external':
				return mediaObj.url;

			default:
				return '';
		}
	},

	curve: function(curveObj) {
		if (!curveObj || !curveObj.mode) return "";

		const mode = curveObj.mode;

		// 1. System default (your design palette)
		if (mode === "system") {
			return "var(--animation-curve)";
		}

		// 2. Built‑in CSS curves
		if (
			mode === "linear" ||
			mode === "ease" ||
			mode === "ease-in" ||
			mode === "ease-out" ||
			mode === "ease-in-out"
		) {
			return mode;
		}

		// 3. Step()
		if (mode === "step") {
			const n = curveObj.stepNumber || 1;
			const end = curveObj.changeAtEnd === true ? "end" : "start";
			return `steps(${n}, ${end})`;
		}

		// 4. Cubic‑bezier()
		if (mode === "cubic-bezier") {
			const x1 = curveObj.x1 ?? 0;
			const y1 = curveObj.y1 ?? 0;
			const x2 = curveObj.x2 ?? 1;
			const y2 = curveObj.y2 ?? 1;
			return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
		}

		// 5. Unknown → fallback
		return "var(--animation-curve)";
	},
};

// Setting List for nodes.
const SizeSettingList = {
	1: {
		defalut: (sz, isVertical) => {
			return {
				"width": isVertical ? flexEngineStyleVarible.space(sz.across) : flexEngineStyleVarible.space(sz.along),
				"height": isVertical ? flexEngineStyleVarible.space(sz.along) : flexEngineStyleVarible.space(sz.across),
				"flex-grow": sz.alongGrow || 0,
				"flex-shrink": sz.alongShrink === true ? 1 : 0,
				"overflow-x": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible'),
				"overflow-y": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible'),
				"align-self": (sz.acrossAlign > 0) ? ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'][sz.acrossAlign - 1] : 'auto'
			}
		},
		mobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
			}
		}
	},

	3: {
		defalut: (sz, isVertical) => {
			return {
				"width": '100%',
				"height": flexEngineStyleVarible.space(sz.height),
				"flex-grow": sz.alongGrow === true? 1 : 0,
				"flex-shrink": sz.alongShrink === true ? 1 : 0,
				"overflow-x": 'visible',
				"overflow-y": 'visible',
				"align-self": 'center'
			}
		},
		mobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
			}
		}		
	},

	4: {
		defalut: (sz, isVertical) => {
			return {
				"min-width": flexEngineStyleVarible.space(sz.minWidth),
				"min-height": flexEngineStyleVarible.space(sz.minHeight),
				"max-width": flexEngineStyleVarible.space(sz.maxWidth),
				"max-height": flexEngineStyleVarible.space(sz.maxHeight)
			}
		},
		mobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(dataArray.size?.mobileMinHeight),
				"max-height": flexEngineStyleVarible.space(dataArray.size?.mobileMaxHeight)
			}
		}				
	},

	6: {
		default: (sz) => {
			return {
				// width limits
				"max-width": sz.maxWidth ? flexEngineStyleVarible.space(sz.maxWidth) : "none",

				// height
				"height": sz.height ? flexEngineStyleVarible.space(sz.height) : "auto",

				// margins
				"margin-top": sz.marginTop ? flexEngineStyleVarible.space(sz.marginTop) : "0",
				"margin-left": sz.marginLeft ? flexEngineStyleVarible.space(sz.marginLeft) : "0",
				"margin-right": sz.marginRIght ? flexEngineStyleVarible.space(sz.marginRIght) : "0"
			};
		},

		mobile: (sz) => {
			return {
				// mobile height override
				"height": sz.mobileHeight ? flexEngineStyleVarible.space(sz.mobileHeight) : undefined,

				// mobile margins
				"margin-top": sz.mobileMarginTop ? flexEngineStyleVarible.space(sz.mobileMarginTop) : undefined,
				"margin-left": sz.mobileMarginLeft ? flexEngineStyleVarible.space(sz.mobileMarginLeft) : undefined,
				"margin-right": sz.mobileMarginRIght ? flexEngineStyleVarible.space(sz.mobileMarginRIght) : undefined
			};
		}
	},

	6311: {
		default: (sz, isVertical) => {
			return {
				"min-width": flexEngineStyleVarible.space(sz.minWidth),
				"max-width": flexEngineStyleVarible.space(sz.maxWidth),

				"padding-left": flexEngineStyleVarible.space(sz.paddingLeft),
				"padding-right": flexEngineStyleVarible.space(sz.paddingRight),

				"min-height": flexEngineStyleVarible.space(sz.minHeight),
				"max-height": flexEngineStyleVarible.space(sz.maxHeight),

				"overflow-y": sz.cutOverflow ? "hidden" : "auto"
			};
		},

		mobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.minMobileHeight)
			};
		}
	},

	6321: {
		default: (sz, isVertical) => {
			return {
				"min-width": flexEngineStyleVarible.space(sz.minWidth),
			};
		},

		mobile: (sz, isVertical) => {
			return {
				"min-width": flexEngineStyleVarible.space(sz.mobileMinWidth)
			};
		}
	},

	0: {
		default: (sz, isVertical) => {
			return {};
		},

		mobile: (sz, isVertical) => {
			return {};
		}
	},

	50: {
		default: (sz, isVertical) => {
			return {};
		},

		mobile: (sz, isVertical) => {
			return {};
		}
	},

	51: {
		default: (sz, isVertical) => {
			return {
				"height": flexEngineStyleVarible.space(sz.height),
			};
		},

		mobile: (sz, isVertical) => {
			return {};
		}
	}
};

// Some helping function control the style.
// Style
const defalutAppearance = (s) => {
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
			"box-shadow": s.shadow ? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpand || 0}px ${engine.color(s.shadowColor)}` : "none",
			"color": engine.color(s.textColor),
			"background": engine.color(s.background),
			"filter": s.blur ? `blur(${s.blur}px)` : "none",
			"font-family": s.font || "inherit",
			"caret-color": engine.color(s.markColor),
	};
};

const mobileAppearence = (s) => {
	return {
		"padding-top": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingTop),
		"padding-bottom": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingBottom),
		"padding-left": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingLeft),
		"padding-right": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingRight)
	};
};

// CSS overrides
const CSSOverrides = (data) => {
	const overrides = {};
	if (Array.isArray(data.CSSoverride)) {
		data.CSSoverride.forEach(item => {
			if (item && item.key) {
				overrides[item.key] = item.value;
			}
		});
	}
	return overrides;
};

// Styling everything.
const flexEngineStylingClass = function(dataArray, isVertical, sizeSettingMode, contextSetting) {
	const engine = flexEngineStyleVarible;
	if (flexEngineCheckContext(contextSetting, "header") === true) {
		// that's Header
		const JSONarray = {
			default: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...defalutAppearance(s),
					...SizeSettingList[sizeSettingMode].defalut(sz, isVertical),
					...CSSOverrides(data)
				};
			})(dataArray),

			onMobile: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				// there are no overrides.....
				return {
					...mobileAppearence(s),
					...SizeSettingList[sizeSettingMode].mobile(sz, isVertical),
				};
			})(dataArray),

			onHover: ((data) => {
				if (!data) return {};
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...defalutAppearance(s),
					...SizeSettingList[sizeSettingMode].defalut(sz, isVertical),
					...CSSOverrides(data)
				};
			})(dataArray.hover),

			onHoverMobile: ((data) => {
				if (!data) return {};
				const s = data.style || {};
				const sz = data.size || {};
		
				return {
					...mobileAppearence(s),
					...SizeSettingList[sizeSettingMode].mobile(sz, isVertical),
				};
			})(dataArray.hover),


			// Header's onTop.
			onTop: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...defalutAppearance(s),
					...SizeSettingList[sizeSettingMode].defalut(sz, isVertical),
					...CSSOverrides(data)
				};
			})(dataArray.onTop),

			onTopMobile: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				// there are no overrides.....
				return {
					...mobileAppearence(s),
					...SizeSettingList[sizeSettingMode].mobile(sz, isVertical),
				};
			})(dataArray.onTop),

			onTopHover: ((data) => {
				if (!data) return {};
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...defalutAppearance(s),
					...SizeSettingList[sizeSettingMode].defalut(sz, isVertical),
					...CSSOverrides(data)
				};
			})(dataArray.onTop.hover),

			onTopMobileHover: ((data) => {
				if (!data) return {};
				const s = data.style || {};
				const sz = data.size || {};
		
				return {
					...mobileAppearence(s),
					...SizeSettingList[sizeSettingMode].mobile(sz, isVertical),
				};
			})(dataArray.onTop.hover)
		};
	} else {
		// Normal
		const JSONarray = {
			default: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...defalutAppearance(s),
					...SizeSettingList[sizeSettingMode].defalut(sz, isVertical),
					...CSSOverrides(data)
				};
			})(dataArray),

			onMobile: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};

				// there are no overrides.....
				return {
					...mobileAppearence(s),
					...SizeSettingList[sizeSettingMode].mobile(sz, isVertical),
				};
			})(dataArray),

			onHover: ((data) => {
				if (!data) return {};
				const s = data.style || {};
				const sz = data.size || {};

				return {
					...defalutAppearance(s),
					...SizeSettingList[sizeSettingMode].defalut(sz, isVertical),
					...CSSOverrides(data)
				};
			})(dataArray.hover),

			onHoverMobile: ((data) => {
				if (!data) return {};
				const s = data.style || {};
				const sz = data.size || {};
		
				return {
					...mobileAppearence(s),
					...SizeSettingList[sizeSettingMode].mobile(sz, isVertical),
				};
			})(dataArray.hoverMobile)
		};
	}

	return JSONarray;
};

// Styling system
const flexEngineStylingSystem = function(dataArray, node, isVertical, sizeSettingMode, contextSetting = "") {
	const engine = flexEngineStyleVarible;

	const nodeStyle = {
		// Primary state bundle
		default: flexEngineStylingClass(dataArray, isVertical, sizeSettingMode, contextSetting),

		// Map each custom class in overrideState
		...Object.keys(dataArray.overrideState || {}).reduce((acc, key) => {
			const stateData = dataArray.overrideState[key];
			acc[key] = flexEngineStylingClass(stateData, isVertical, sizeSettingMode, contextSetting);
			return acc;
		}, {}),

	};

	const prefix = BUILDER_CONFIG.classPrefix;

	Object.keys(nodeStyle).forEach(stateKey => {
		if (stateKey === 'startAnimation') return;

		let cleanName = stateKey.startsWith('.') ? stateKey.substring(1) : stateKey;

		const bundle = nodeStyle[stateKey];
		const attributeBase = `${prefix}-styles-${cleanName}`;

		// Convert object → CSS string
		const toCss = (obj) =>
			Object.entries(obj)
			.filter(([_, value]) => value !== undefined && value !== null && value !== "")
			.map(([key, value]) => `${key}: ${value};`)
			.join("");

		// DEFAULT
		if (bundle.default) {
			node.setAttribute(attributeBase, toCss(bundle.default));
		}

		// MOBILE
		if (bundle.onMobile) {
			node.setAttribute(`${attributeBase}-onMobile`, toCss(bundle.onMobile));
		}

		// HOVER
		if (bundle.onHover) {
			node.setAttribute(`${attributeBase}-onHover`, toCss(bundle.onHover));
		}

		// HOVER & MOBILE
		if (bundle.onMobileHover) {
			node.setAttribute(`${attributeBase}-onMobileHover`, toCss(bundle.onMobileHover));
		}
		
		if (flexEngineCheckContext(contextSetting, "header") === true) {
			// ON TOP
			if (bundle.onTop) {
				node.setAttribute(`${attributeBase}-onTop`, toCss(bundle.onTop));
			}

			// ON TOP & Hover
			if (bundle.onTopHover) {
				node.setAttribute(`${attributeBase}-onTopHover`, toCss(bundle.onTopHover));
			}

			// ON TOP & Mobile
			if (bundle.onTopMobile) {
				node.setAttribute(`${attributeBase}-onTopMobile`, toCss(bundle.onTopMobile));
			}

			// ON TOP & Hover & Mobile
			if (bundle.onTopMobileHover) {
				node.setAttribute(`${attributeBase}-onTopMobileHover`, toCss(bundle.onTopMobileHover));
			}
		}
	});
};

/*
END NODE (1) and CONTAINER NODE (2) LEVEL
*/

// Context Creator for the END NODE (1) and CONTAINER NODE (2)
const flexEngineContextCreator = {
	/*
	END NODE (1)
	*/
	text: {
		contextFunction: function(dataArray, documentHTML, node) {
			const deltaOps = dataArray.content;
			const converter = new QuillDeltaToHtmlConverter(deltaOps, {
				classPrefix: `${BUILDER_CONFIG.classPrefix}context-text`
			});
			const html = converter.convert();
			node.innerHTML = html;
		},
	},
	heading: {
		contextFunction: function(dataArray, documentHTML, node) {
			return this.text(dataArray, documentHTML, node);
		},
	},
	image: {
		contextFunction: function(dataArray, documentHTML, node) {
			const content = dataArray.content;
			// Resolve media URL
			const src = flexEngineStyleVarible.media(content.source);
			// Create <img> element
			const img = documentHTML.createElement("img");
			img.src = src;
			img.alt = content.alt || "";
			img.className = `${BUILDER_CONFIG.classPrefix}context-image`;
			// Positioning logic
			const posX = content.displayX; // 1 = left, 2 = center, 3 = right
			const posY = content.displayY; // 1 = top, 2 = center, 3 = bottom
			// Convert numeric alignment to CSS keywords
			const map = {
				1: "start",
				2: "center",
				3: "end"
			};
			img.style.objectPosition = `${map[posX]} ${map[posY]}`;
			// Insert into node
			node.innerHTML = ""; // clear previous content if needed
			node.appendChild(img); // DOM insertion
		},
	},
	button: {
		contextFunction: function(dataArray, documentHTML, node) {
			const label = dataArray.content.label || "";
			// SAFE: prevents XSS because it does not parse HTML
			node.textContent = label;
		},
	},
	hr: {
		contextFunction: function(dataArray, documentHTML, node) {
			const hr = documentHTML.createElement("hr");
			// Apply class
			hr.className = `${BUILDER_CONFIG.classPrefix}context-hr`;
			// Insert into node
			node.innerHTML = "";
			node.appendChild(hr);
		},
	},
	space: {
		contextFunction: function(dataArray, documentHTML, node) {
			// Do nothing — spacer is layout-only
			return;
		},
	},
	//Sheet is passed......
	audio: {
		contextFunction: function(dataArray, documentHTML, node) {
			const content = dataArray.content;
			const src = flexEngineStyleVarible.media(content.source);
			const audio = documentHTML.createElement("audio");
			audio.className = `${BUILDER_CONFIG.classPrefix}context-audio`;
			audio.src = src;
			if (!content.hideControls) {
				audio.controls = true;
			}
			if (content.loop) {
				audio.loop = true;
			}
			node.innerHTML = "";
			node.appendChild(audio);
		},
	},
	video: {
		contextFunction: function(dataArray, documentHTML, node) {
			const content = dataArray.content;
			const src = flexEngineStyleVarible.media(content.source);
			const poster = content.thumbnail ? flexEngineStyleVarible.media(content.thumbnail) : null;
			const video = documentHTML.createElement("video");
			video.className = `${BUILDER_CONFIG.classPrefix}context-video`;
			video.src = src;
			if (poster) {
				video.poster = poster;
			}
			if (!content.hideControls) {
				video.controls = true;
			}
			if (content.autoplay) {
				video.autoplay = true;
			}
			if (content.muted) {
				video.muted = true;
			}
			if (content.loop) {
				video.loop = true;
			}
			if (content.disablepictureinpicture) {
				video.disablePictureInPicture = true;
				video.setAttribute("disablepictureinpicture", "");
			}
			const fallback = documentHTML.createElement("p");
			fallback.textContent = "Oh no! your Browser does not support Embed Video! but that's OK, download the video at ";
			const link = documentHTML.createElement("a");
			link.href = src;
			link.textContent = "here!";
			link.download = "";
			fallback.appendChild(link);
			video.appendChild(fallback);
			// Insert into node
			node.innerHTML = "";
			node.appendChild(video);
		},
	},
	vimeoVideo: {
		contextFunction: function(dataArray, documentHTML, node) {
			const c = dataArray.content;
			// Build Vimeo URL safely
			let url = `https://player.vimeo.com/video/${encodeURIComponent(c.sourceID)}`;
			const params = new URLSearchParams();
			if (c.hash) {
				params.set("h", c.hash);
			}
			params.set("controls", c.hideControls ? "0" : "1");
			if (c.autoplay) {
				params.set("autoplay", "1");
				params.set("muted", "1"); // Browser requirement
			}
			if (c.muted) {
				params.set("muted", "1");
			}
			if (c.loop) {
				params.set("loop", "1");
			}
			if (c.startTime) {
				params.set("#t", `${c.startTime}s`);
			}
			// Final URL
			url += "?" + params.toString();
			// Create iframe
			const iframe = documentHTML.createElement("iframe");
			iframe.className = `${BUILDER_CONFIG.classPrefix}context-vimeoVideo`;
			iframe.src = url;
			iframe.allow = "autoplay; fullscreen; picture-in-picture";
			// Disable Picture-in-Picture
			if (c.disablepictureinpicture) {
				iframe.setAttribute("disablepictureinpicture", "");
				iframe.allow = "autoplay; fullscreen"; // remove PiP permission
			}
			iframe.frameBorder = "0";
			iframe.allowFullscreen = true;
			// Insert into node
			node.innerHTML = "";
			node.appendChild(iframe);
		},
	},
	ytVideo: {
		contextFunction: function(dataArray, documentHTML, node) {
			const c = dataArray.content;
			let url = `https://www.youtube.com/embed/${encodeURIComponent(c.videoID)}`;
			const params = new URLSearchParams();
			params.set("controls", c.hideControls ? "0" : "1");
			if (c.autoplay) {
				params.set("autoplay", "1");
				params.set("mute", "1"); // Browser requirement
			}
			if (c.muted) {
				params.set("mute", "1");
			}
			if (c.loop) {
				params.set("loop", "1");
				params.set("playlist", c.videoID); // Required by YouTube for looping
			}
			if (c.startTime) {
				params.set("start", c.startTime);
			}
			url += "?" + params.toString();
			// Create iframe
			const iframe = documentHTML.createElement("iframe");
			iframe.className = `${BUILDER_CONFIG.classPrefix}context-ytvideo`;
			iframe.src = url;
			iframe.title = "YouTube video player";
			iframe.frameBorder = "0";
			// Allow attributes (standard YouTube embed)
			iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
			// Disable Picture-in-Picture
			if (c.disablepictureinpicture) {
				iframe.setAttribute("disablepictureinpicture", "");
				iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share";
			}
			iframe.referrerPolicy = "strict-origin-when-cross-origin";
			iframe.allowFullscreen = true;
			// Insert into node
			node.innerHTML = "";
			node.appendChild(iframe);
		},
	},
	iframe: {
		contextFunction: function(dataArray, documentHTML, node) {
			// --- Create iframe element ---
			const iframe = documentHTML.createElement("iframe");
			iframe.className = `${BUILDER_CONFIG.classPrefix}context-iframe`;
			// --- Read content ---
			const c = dataArray.content;
			// --- Build safe URL (only used when NOT embedAsHTML) ---
			const safeURL = encodeURI(c.source);
			// --- Sandbox handling ---
			if (c.sandbox === 1) {
				iframe.sandbox = "allow-scripts allow-same-origin";
			} else if (c.sandbox === 2) {
				iframe.sandbox = ""; // strict sandbox
			}
			// --- Allow fullscreen ---
			if (c.allowFullScreen) {
				iframe.allowFullscreen = true;
			}
			// --- Permissions list ---
			if (Array.isArray(c.permission) && c.permission.length > 0) {
				iframe.allow = c.permission.join("; ");
			}
			// ======================================================
			//  EMBED AS HTML MODE
			// ======================================================
			if (c.embedAsHTML === true) {
				const src = c.source;
				// --- Validate HTML safely (NO function, inline logic) ---
				// Must be a string
				if (typeof src !== "string") {
					console.warn("embedAsHTML: source is not a string");
					return;
				}
				// Reject URLs
				if (/^https?:\/\//i.test(src.trim())) {
					console.warn("embedAsHTML: source looks like a URL, not HTML");
					return;
				}
				// Reject javascript: URLs
				if (/^javascript:/i.test(src.trim())) {
					console.warn("embedAsHTML: javascript: URL blocked");
					return;
				}
				// Must contain at least one HTML tag
				if (!/<[^>]+>/.test(src)) {
					console.warn("embedAsHTML: source does not appear to be HTML");
					return;
				}
				// --- Safe HTML embedding inside iframe ---
				iframe.srcdoc = "";
				iframe.addEventListener("load", () => {
					const doc = iframe.contentDocument;
					if (doc) {
						doc.open();
						doc.write(src); // SAFE: inside sandbox
						doc.close();
					}
				});
			} else {
				// ======================================================
				//  NORMAL IFRAME MODE
				// ======================================================
				iframe.src = safeURL;
			}
			// --- Insert into node ---
			node.innerHTML = "";
			node.appendChild(iframe);
		},
	},
	gdocs: {
		contextFunction: function(dataArray, documentHTML, node) {
			// Create container
			const el = documentHTML.createElement("div");
			el.className = `${BUILDER_CONFIG.classPrefix}context-gdocs`;
			// Add data attribute
			el.setAttribute(`data-${BUILDER_CONFIG.classPrefix}gdocid`, dataArray.content.gDocsID);
			// Build docId
			const docId = dataArray.content.gDocsID;
			const loadingText = documentHTML.createElement("p");
			loadingText.textContent = "Loading Contents.......";
			el.appendChild(loadingText);
			const fallback = documentHTML.createElement("p");
			fallback.append(documentHTML.createTextNode("Cannot see the Context? go "));
			const link = documentHTML.createElement("a");
			link.href = `https://docs.google.com/document/d/e/${docId}/pub`;
			link.target = "_blank";
			link.textContent = "this link";
			fallback.appendChild(link);
			fallback.append(documentHTML.createTextNode(" to view the message. If you disabled JS, your document will be displayed here. For better experience we recommend to "));
			const jsLink = documentHTML.createElement("a");
			jsLink.href = "https://turnonjs.com";
			jsLink.target = "_blank";
			jsLink.textContent = "turn on JS";
			fallback.appendChild(jsLink);
			el.appendChild(fallback);
			const noscript = documentHTML.createElement("noscript");
			noscript.className = `${BUILDER_CONFIG.classPrefix}context-gdocs-noscript`;
			const iframe = documentHTML.createElement("iframe");
			iframe.className = `${BUILDER_CONFIG.classPrefix}context-gdocs-iframe`;
			iframe.src = `https://docs.google.com/document/d/e/${docId}/pub?embedded=true`;
			noscript.appendChild(iframe);
			el.appendChild(noscript);
			node.innerHTML = "";
			node.appendChild(el);
		},
	},
	ytLive: {
		contextFunction: function(dataArray, documentHTML, node) {
			// Add data attribute
			node.setAttribute("data-cw-ytchannelid", dataArray.content.channelID);
			const overlay = documentHTML.createElement("div");
			overlay.className = `${BUILDER_CONFIG.classPrefix}context-ytLive-overlay`;
			// Text: "Preparing Live Room....."
			overlay.appendChild(documentHTML.createTextNode("Preparing Live Room....."));
			const noscript = documentHTML.createElement("noscript");
			const nsText1 = documentHTML.createTextNode("We find your JavaScript is disabled, please ");
			noscript.appendChild(nsText1);
			const turnOn = documentHTML.createElement("a");
			turnOn.href = "https://turnonjs.com";
			turnOn.target = "_blank";
			turnOn.textContent = "Turn on JS";
			noscript.appendChild(turnOn);
			noscript.appendChild(documentHTML.createTextNode(" or visit the channel: "));
			const ytLink = documentHTML.createElement("a");
			ytLink.href = `https://youtube.com/channel/${dataArray.content.channelID}`;
			ytLink.target = "_blank";
			ytLink.textContent = "YouTube";
			noscript.appendChild(ytLink);
			overlay.appendChild(noscript);
			node.innerHTML = "";
			node.appendChild(overlay);
		},
	},
	//Form is passed......
	html: {
		contextFunction: function(dataArray, documentHTML, node) {
			node.innerHTML = dataArray.content.html;
		},
	},
	/*
	CONTAINER NODE (2)
	THOSE WILL WORK AS A CONTAINER BUT STILL TREAT AS END NODE SINCE THIS IS NOT WORK AS SECTION.
	REMEMBER WHEN START USE THIS, flexEngineCreateEndNode is already defined!
	*/
	div: {
		contextFunction: function(dataArray, documentHTML, node) {
			const layout = dataArray.layout || {};
			const content = dataArray.content;
			// 1. Map Layout Numbers to CSS Flexbox Properties
			const directions = ['row', 'column', 'row-reverse', 'column-reverse'];
			const wraps = ['nowrap', 'wrap', 'wrap-reverse'];
			const justifyMap = ['flex-start', 'center', 'flex-end', 'space-around', 'space-between', 'space-evenly'];
			const alignMap = ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'];
			// Calculate Desktop Direction
			const dirIndex = (layout.direction || 1) - 1;
			const desktopDirection = directions[dirIndex] || 'row';
			const isVertical = desktopDirection.includes('column');
			// 2. Apply Core CSS directly to the container's inline style
			const desktopCss = `
		    display: flex;
		    flex-direction: ${desktopDirection};
		    flex-wrap: ${wraps[(layout.wrap || 1) - 1] || 'nowrap'};
		    justify-content: ${justifyMap[(layout.spaceAlong || 1) - 1] || 'flex-start'};
		    align-items: ${alignMap[(layout.spaceAcross || 1) - 1] || 'flex-start'};
		    ${layout.gapX ? `column-gap: ${flexEngineStyleVarible.space(layout.gapX)};` : ''}
		    ${layout.gapY ? `row-gap: ${flexEngineStyleVarible.space(layout.gapY)};` : ''}
		`.trim();
			// 3. Handle Mobile Responsiveness using a localized <delay> tag
			// (Because inline styles cannot use @media queries natively)
			if (layout.stackAtMobile || layout.mobileReverseDirection || layout.mobileGap) {
				let mobileDir = desktopDirection;
				if (layout.stackAtMobile) {
					// Stack normally (column) or reverse stack (column-reverse)
					mobileDir = layout.mobileReverseDirection ? 'column-reverse' : 'column';
				} else if (layout.mobileReverseDirection) {
					// Keep axis but flip direction (e.g., row -> row-reverse)
					mobileDir = desktopDirection.includes('-reverse') ? desktopDirection.replace('-reverse', '') : desktopDirection + '-reverse';
				}
				//ready the gap.
				const mGap = flexEngineStyleVarible.space(layout.mobileGap);
				let mobileCSS = `
				flex-direction: ${mobileDir} !important;
				gap: ${mGap} !important;
				`;
				if (layout.stackAtMobile) {
					mobileCSS += `
					justify-content: center;
					align-items: center;
				`;
				};
			} else {
				const mobileCSS = "";
			}
			//Add all them up!
			const prefix = BUILDER_CONFIG.classPrefix + "styles-node";
			node.setAttribute(prefix, desktopCss.trim());
			node.setAttribute(prefix + "-onMobile", (mobileCSS.trim()));
			// 4. Render Children Elements (The "content" array)
			// We loop through any elements inside this div and render them recursively
			if (Array.isArray(content)) {
				content.forEach(childData => {
					if (childData) {
						// We pass 'isVertical' down so the child knows if it is inside 
						// a Row (across) or Column (along) for accurate sizing!
						const childNode = flexEngineCreateEndNode(childData, documentHTML, isVertical);
						if (childNode) {
							node.appendChild(childNode);
						}
					}
				});
			}
		},
	},
};

// Some System help to prevent problems
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const num = v => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};

// Animation List of all config
const flexEngineAnimationsList = {
	0: {
		name: "showup",
		variables: function(anim) {
			return "";
		}
	},

	1: {
		name: "fade",
		variables: function(anim) {
			return "";
		}
	},

	2: {
		name: "flyIn",
		variables: function(anim) {
			const direction = (num(anim.direction) % 360 + 360) % 360;
			const intensity = Math.max(0, num(anim.intensity));
			const rad = direction * Math.PI / 180;
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-x:${Math.cos(rad) * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-y:${Math.sin(rad) * intensity}px;`
			);
		}
	},

	3: {
		name: "growTurn",
		variables: function(anim) {
			const rotate = num(anim.rotate);
			return `--${BUILDER_CONFIG.classPrefix}animation-rotate:${rotate}deg;`;
		}
	},

	4: {
		name: "zoom",
		variables: function(anim) {
			return "";
		}
	},

	5: {
		name: "basicZoom",
		variables: function(anim) {
			const scaleStart = num(anim.scaleStart) || 100;
			return `--${BUILDER_CONFIG.classPrefix}animation-scaleStart:${scaleStart / 100};`;
		}
	},

	6: {
		name: "rise",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 8);
			const intensity = Math.max(0, num(anim.intensity));
			const angle = (direction - 1) * 45;
			const rad = angle * Math.PI / 180;
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-x:${Math.cos(rad) * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-y:${Math.sin(rad) * intensity}px;`
			);
		}
	},

	7: {
		name: "stretch",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const map = ["top", "right", "bottom", "left"];
			return `--${BUILDER_CONFIG.classPrefix}animation-origin:${map[direction - 1]};`;
		}
	},

	8: {
		name: "wipe",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const clip = [
				"inset(100% 0 0 0)",
				"inset(0 0 0 100%)",
				"inset(0 0 100% 0)",
				"inset(0 100% 0 0)"
			];
			return `--${BUILDER_CONFIG.classPrefix}animation-from:${clip[direction - 1]};`;
		}
	},

	9: {
		name: "peekIn",
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const intensity = Math.max(0, num(anim.intensity));
			const dirs = [
				[0, -1],
				[1, 0],
				[0, 1],
				[-1, 0]
			];
			const d = dirs[direction - 1];
			const clip = [
				"inset(100% 0 0 0)",
				"inset(0 0 0 100%)",
				"inset(0 0 100% 0)",
				"inset(0 100% 0 0)"
			];
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-x:${d[0] * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-y:${d[1] * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-from:${clip[direction - 1]};`
			);
		}
	},

	10: {
		name: "box",
		variables: function(anim) {
			// anim.x and anim.y are indices 1..3 (left/center/right and top/center/bottom)
			const xIndex = clamp(num(anim.x) || 1, 1, 3);
			const yIndex = clamp(num(anim.y) || 1, 1, 3);
			const map = {
				1: "100%", // left / top (collapsed)
				2: "50%", // center
				3: "0%" // right / bottom (open)
			};
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-x:${map[xIndex]};` +
				`--${BUILDER_CONFIG.classPrefix}animation-y:${map[yIndex]};`
			);
		}
	},

	11: {
		name: "expand",
		variables: function(anim) {
			return "";
		}
	},

	12: {
		name: "tumble",
		variables: function(anim) {
			const directionRight = anim.directionRight ? 1 : 0;
			const fromUp = anim.fromUp ? 1 : 0;
			const intensity = num(anim.intensity);
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-directionRight:${directionRight};` +
				`--${BUILDER_CONFIG.classPrefix}animation-fromUp:${fromUp};` +
				`--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;`
			);
		}
	},

	13: {
		name: "rotate",
		variables: function(anim) {
			const directionRight = anim.directionRight ? 1 : 0;
			const intensity = num(anim.intensity);
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-directionRight:${directionRight};` +
				`--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;`
			);
		}
	},

	14: {
		name: "slideRotate",
		variables: function(anim) {
			const intensity = num(anim.intensity);
			const slideX = num(anim.slideAmountX);
			const slideY = num(anim.slideAmountY);
			return (
				`--${BUILDER_CONFIG.classPrefix}animation-intensity:${intensity}deg;` +
				`--${BUILDER_CONFIG.classPrefix}animation-slideX:${slideX}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-slideY:${slideY}px;`
			);
		}
	}
};

// Animation System Styler for END NODE (1) and CONTAINER NODE (2) , and also used as part of SECTION (3)
const flexEngineAnimationContextsNode = function(dataArray, node) {
	const prefix = BUILDER_CONFIG.classPrefix; // e.g. "cw-"
	const attrName = `${prefix}animation-config-self`;
	const triggerAttr = `${prefix}animation-config-self-trigger`;

	const anim = dataArray && dataArray.animation;

	// If no animation → clear both attributes and skip everything
	if (!anim || anim.animation !== true) {
		node.setAttribute(attrName, "");
		node.setAttribute(triggerAttr, "");
		return;
	}

	// If animationInherit → write "inherit" and still allow transitions
	if (anim.animationInherit === true) {
		node.setAttribute(attrName, "inherit");
		node.setAttribute(triggerAttr, "");
		return;
	}

	// Build animation variables and animation shorthand
	let animationNumber = Number(anim.animationType);
	if (!animationNumber || !flexEngineAnimationsList[animationNumber]) {
		animationNumber = 1; // fallback to fade
	}

	const entry = flexEngineAnimationsList[animationNumber];
	let cssVars = "";
	try {
		cssVars = entry.variables(anim) || "";
	} catch (e) {
		cssVars = "";
	}

	// Add transform-origin where required
	if (animationNumber === 7) { // Stretch
		const dir = clamp(num(anim.direction) || 1, 1, 4);
		const map = ["top", "right", "bottom", "left"];
		cssVars += `transform-origin:${map[dir - 1]};`;
	} else if (animationNumber === 12) { // Tumble
		cssVars += `transform-origin:top left;`;
	} else if (animationNumber === 13) { // Rotate
		cssVars += `transform-origin:center center;`;
	} else if (animationNumber === 14) { // Slide Rotate
		cssVars += `transform-origin:center center;`;
	}

	const animationName = entry.name;
	const duration = `${num(anim.duration) || 0.6}s`;
	const delay = (anim.delayTime || 0) + "s";
	const curve = flexEngineStyleVarible.curve(anim.animationCurve);

	const cssAnim = `animation:${prefix}animation-${animationName} ${duration} ${curve} ${delay} 1 normal both;`;

	// Write attribute
	node.setAttribute(attrName, cssVars + cssAnim);
	node.setAttribute(triggerAttr, anim.trigger || 1);
};

// Transition for the END NODE (1) and CONTAINER NODE (2) and SECTION (3)
const flexEngineTransitionContextsNode = function(dataArray, node) {
	const anim = dataArray && dataArray.transition;

	if (!Array.isArray(anim) || anim.length === 0) {
		return "";
	}

	const parts = [];

	for (const t of anim) {
		if (!t || !t.property) continue;

		const duration = (t.timing || 0) + "s";
		const delay = (t.delay || 0) + "s";
		const curve = flexEngineStyleVarible.curve(t.animationCurve);

		parts.push(`${t.property} ${duration} ${curve} ${delay}`);
	}

	const finalCSS = parts.length ?
		`transition:${parts.join(",")};` :
		"";

	const prefix = BUILDER_CONFIG.classPrefix; // e.g. "cw-"
	const attrName = `${prefix}transition-config-self`;

	node.setAttribute(attrName, finalCSS);
};

const flexEngineCreateAction = function(documentHTML, clickable, nodeStyleDefault) {
	let node;

	if (!clickable || clickable.enable === false) {
		node = documentHTML.createElement(nodeStyleDefault);
	}

	if (clickable && clickable.enable === true &&
		clickable.action.mode === "a") {

		node = documentHTML.createElement("a");
		node.href = clickable.action.url;

		if (clickable.action.newPage === true) {
			node.target = "_blank";
		}
	}

	if (clickable && clickable.enable === true &&
		clickable.action.mode === "download") {

		node = documentHTML.createElement("a");
		node.href = clickable.action.url;
		node.target = "_blank";
		node.download = "";

		if (clickable.action.forceDownload === true) {
			node.setAttribute("download", clickable.action.forceDownload);
		}
	}

	if (clickable && clickable.enable === true &&
		clickable.action.mode === "openPopup") {

		node = documentHTML.createElement("button");
		node.setAttribute(
			`data-${BUILDER_CONFIG.classPrefix}popup-id`,
			clickable.action.popupID
		);
	}

	if (clickable && clickable.enable === true &&
		clickable.action.mode === "closeThisPopup") {

		node = documentHTML.createElement("button");
		node.setAttribute(
			`data-${BUILDER_CONFIG.classPrefix}popup-id`,
			"0"
		);
	}

	if (clickable && clickable.enable === true &&
		clickable.action.mode === "runJS") {

		node = documentHTML.createElement("button");
		node.setAttribute("onclick", clickable.action.JS);
	}

	return node;
};

// Create a new END NODE (1) and CONTAINER NODE (2)
const flexEngineCreateEndNode = function(dataArray, documentHTML, parentVertical = true) {
	const node = flexEngineCreateAction(documentHTML, dataArray.clickable, "div");

	// set attributes
	node.id = dataArray.JSID;

	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.type}`);
	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.id}`);

	if (dataArray.clickable && dataArray.clickable.enable === true &&
		((dataArray.clickable.action.mode === "openPopup") ||
			(dataArray.clickable.action.mode === "closeThisPopup"))) {

		node.classList.add(`${BUILDER_CONFIG.classPrefix}popupTriggler`);
	}

	// setup data inside (select one)
	const renderFunction = flexEngineContextCreator[dataArray.type].contextFunction;

	if (typeof renderFunction === "function") {
		renderFunction(dataArray, documentHTML, node);
	} else {
		console.error(`FlexEngine: Type "${dataArray.type}" not found!`);
	}

	// Styling (FlexEngine style, include style, styleOnHover, AnimationSetting)
	flexEngineStylingSystem(dataArray, node, parentVertical, 1);

	// animation system and transition system
	flexEngineAnimationContextsNode(dataArray, node);
	flexEngineTransitionContextsNode(dataArray, node);

	// Send everything back!
	return node;
};

/*
SECION (3) LEVEL
*/

// Animation system for SECTION (3) that help them apply the node
const flexEngineApplyAnimationSection = function(node) {
	// 1. Basic names
	const prefix = BUILDER_CONFIG.classPrefix;

	const attrAll = `${prefix}animation-config-all`;
	const attrAllTrigger = `${prefix}animation-config-all-trigger`;
	const attrSelf = `${prefix}animation-config-self`;
	const attrSelfTrigger = `${prefix}animation-config-self-trigger`;
	const attrFirst = `${prefix}animation-config-all-firstdelay`;
	const attrRange = `${prefix}animation-config-all-timeRange`;

	// 2. Start counter
	let count = 0;

	// 3. Read firstDelay and timeRange from the root node (the node you already set them on)
	// normalize placeholder constant
	const DELAY_PLACEHOLDER = "<delay>";

	// robust parse helper
	const parseAttrFloat = v => {
		if (!v) return 0;
		// remove trailing non-numeric characters like 's'
		const cleaned = String(v).trim().replace(/[^\d.+-eE]/g, "");
		return parseFloat(cleaned) || 0;
	};

	// read timing
	const firstDelay = parseAttrFloat(node.getAttribute(attrFirst));
	const timeRange = parseAttrFloat(node.getAttribute(attrRange));

	// here is the real start
	const walk = (n => {
		// A) If this node uses inherit
		if (n.getAttribute(attrSelf) === "inherit") {

			const delayValue = firstDelay + count * timeRange;

			const allConfig = n.getAttribute(attrAll) || "";
			const replaced = allConfig.replace(new RegExp(DELAY_PLACEHOLDER, "g"), String(delayValue));

			n.setAttribute(attrSelf, replaced);

			const trig = n.getAttribute(attrAllTrigger) || "";
			n.setAttribute(attrSelfTrigger, trig);

			count++;
		}

		// B) Recurse into children
		[...n.children].forEach(child => walk(child));

	});

	walk(node);
};

// Animation system for SECTION (3), use the 1 and 2 version
const flexEngineAnimationSection = function(dataArray, node, expend) {
	// Step 1, clone data
	const animationReadyData = structuredClone(dataArray);

	// Step 2, replace
	animationReadyData.animation = animationReadyData.animation.self;

	// Step 3, Run the animation engine render
	flexEngineAnimationContextsNode(animationReadyData, node);

	// STEP 5, Label all animation
	const prefix = BUILDER_CONFIG.classPrefix; // e.g. "cw-"
	const attrName = `${prefix}animation-config-all`;
	const triggerAttr = `${prefix}animation-config-all-trigger`;

	const anim = dataArray && dataArray.animation && dataArray.animation.all;

	// If no animation → clear both attributes and skip everything
	if (!anim || anim.animation !== true) {
		node.setAttribute(attrName, "");
		node.setAttribute(triggerAttr, "");
		return;
	}

	// If animationInherit → write "inherit" and still allow transitions
	if (anim.animationInherit === true) {
		node.setAttribute(attrName, "inherit");
		node.setAttribute(triggerAttr, "");
		return;
	}

	// Build animation variables and animation shorthand
	let animationNumber = Number(anim.animationType);
	if (!animationNumber || !flexEngineAnimationsList[animationNumber]) {
		animationNumber = 1;
	}

	const entry = flexEngineAnimationsList[animationNumber];
	let cssVars = "";
	try {
		cssVars = entry.variables(anim) || "";
	} catch (e) {
		cssVars = "";
	}

	// Add transform-origin where required
	if (animationNumber === 7) { // Stretch
		const dir = clamp(num(anim.direction) || 1, 1, 4);
		const map = ["top", "right", "bottom", "left"];
		cssVars += `transform-origin:${map[dir - 1]};`;
	} else if (animationNumber === 12) { // Tumble
		cssVars += `transform-origin:top left;`;
	} else if (animationNumber === 13) { // Rotate
		cssVars += `transform-origin:center center;`;
	} else if (animationNumber === 14) { // Slide Rotate
		cssVars += `transform-origin:center center;`;
	}

	const animationName = entry.name;
	const duration = `${num(anim.duration) || 0.6}s`;
	const delay = '<delay>s';
	const curve = flexEngineStyleVarible.curve(anim.animationCurve);

	const cssAnim = `animation:${prefix}animation-${animationName} ${duration} ${curve} ${delay} 1 normal both;`;

	// Write attribute
	node.setAttribute(attrName, cssVars + cssAnim);
	node.setAttribute(triggerAttr, anim.trigger || 1);

	// Step 6, extra stuff......
	const firstDelay = `${prefix}animation-config-all-firstdelay`;
	const timeRange = `${prefix}animation-config-all-timeRange`;

	node.setAttribute(firstDelay, anim.delayTime);
	node.setAttribute(timeRange, anim.executionInterval);

	// Last Step, check to do apply, only if we say.
	if (expend === true) {
		flexEngineApplyAnimationSection(node);
	}
};

// create a new Section, SECTION (3)
const flexengineCreateSection = function(dataArray, documentHTML) {
	// Create a new node
	if (dataArray.type === "section") {
		const node = documentHTML.createElement("section");
		node.classList.add(`${BUILDER_CONFIG.classPrefix}section`);
	} 

	/*
	// wait the thing, in case
	if (dataArray.type === "popup") {
		const node = documentHTML.createElement("div");
		node.classList.add(`${BUILDER_CONFIG.classPrefix}context-popup-inner`);
	}
	*/

	// setup basic attributes
	node.id = dataArray.JSID;

	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.id}`);

	// This is the layout part, for all node above is using external element, but here is simple......
	const layout = dataArray.layout;

	// Map the style layout first.
	const acrossMap = ["", "justify-start", "justify-center", "justify-end", "justify-stretch"];
	const alongMap = ["", "align-start", "align-center", "align-end"];
	const overflowMap = ["", "overflow-scroll", "overflow-hidden", ""];

	let cssOutput = "";
	let cssMobileOutput = "";

	if (layout.spaceAcross) {
		const rule = acrossMap[layout.spaceAcross];
		cssOutput += `.${prefix}-${rule}{justify-content:${flexEngineStyleVariable.justify[rule]};}`;
	}

	if (layout.spaceAlong) {
		const rule = alongMap[layout.spaceAlong];
		cssOutput += `.${prefix}-${rule}{align-items:${flexEngineStyleVariable.align[rule]};}`;
	}

	if (layout.overflow && overflowMap[layout.overflow]) {
		const rule = overflowMap[layout.overflow];
		cssOutput += `.${prefix}-${rule}{overflow:${flexEngineStyleVariable.overflow[rule]};}`;
	}

	if (layout.gap !== undefined) {
		const gapValue = flexEngineStyleVariable.space[layout.gap];
		cssOutput += `.${prefix}-gap-${gapValue}{gap:${gapValue};}`;
	}

	if (layout.mobileReverseDirection) {
		cssMobileOutput += `.${prefixMobile}-reverse{flex-direction:column-reverse;}`;
	}

	if (layout.mobileGap !== undefined) {
		const gapValue = flexEngineStyleVariable.space[layout.mobileGap];
		cssMobileOutput += `.${prefixMobile}-gap-${gapValue}{gap:${gapValue};}`;
	}

	// apply
	const prefix = BUILDER_CONFIG.classPrefix + "styles-node";
	const prefixMobile = BUILDER_CONFIG.classPrefix + "styles-node-onMobile";

	node.setAttribute(prefix, cssOutput);
	node.setAttribute(prefixMobile, cssMobileOutput);

	// Next add all the Child
	if (Array.isArray(dataArray.context)) {
		dataArray.context.forEach(ctx => {
			const childNode = flexEngineCreateEndNode(ctx, documentHTML, true);
			if (childNode) {
				node.appendChild(childNode);
			}
		});
	}

	//then start with now
	// Here is next Styling system
	flexEngineStylingSystem(dataArray, node, true, 3);

	// animation self, first from the Animation node.....
	flexEngineAnimationSection(dataArray, node, true);

	// Transition get from the END NODE (1)
	flexEngineTransitionContextsNode(dataArray, node);

	// Send everything back!
	return node;
};

/*
POPUP (4) LEVEL
*/

// Create inner part of the Popup, use the Section (3)
const flexEngineCreatePopupInnerPart = function(dataArray, documentHTML) {
	// start a new one
	const innerNode = documentHTML.createElement("div");

	// set up things
	innerNode.id = dataArray.outerJSID;
	innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}content-popup-inner`);
	innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.id}`);

	// rememebr layout!
	// This is the layout part, for all node above is using external element, but here is simple......
	const layout = dataArray.layout;

	// Map the style layout first.
	const acrossMap = ["", "justify-start", "justify-center", "justify-end", "justify-stretch"];
	const alongMap = ["", "align-start", "align-center", "align-end"];
	const overflowMap = ["", "overflow-scroll", "overflow-hidden", ""];

	let cssOutput = "";
	let cssMobileOutput = "";

	if (layout.spaceAcross) {
		const rule = acrossMap[layout.spaceAcross];
		cssOutput += `.${prefix}-${rule}{justify-content:${flexEngineStyleVariable.justify[rule]};}`;
	}

	if (layout.spaceAlong) {
		const rule = alongMap[layout.spaceAlong];
		cssOutput += `.${prefix}-${rule}{align-items:${flexEngineStyleVariable.align[rule]};}`;
	}

	if (layout.overflow && overflowMap[layout.overflow]) {
		const rule = overflowMap[layout.overflow];
		cssOutput += `.${prefix}-${rule}{overflow:${flexEngineStyleVariable.overflow[rule]};}`;
	}

	if (layout.gap !== undefined) {
		const gapValue = flexEngineStyleVariable.space[layout.gap];
		cssOutput += `.${prefix}-gap-${gapValue}{gap:${gapValue};}`;
	}

	if (layout.mobileReverseDirection) {
		cssMobileOutput += `.${prefixMobile}-reverse{flex-direction:column-reverse;}`;
	}

	if (layout.mobileGap !== undefined) {
		const gapValue = flexEngineStyleVariable.space[layout.mobileGap];
		cssMobileOutput += `.${prefixMobile}-gap-${gapValue}{gap:${gapValue};}`;
	}

	// apply
	const prefix = BUILDER_CONFIG.classPrefix + "styles-node";
	const prefixMobile = BUILDER_CONFIG.classPrefix + "styles-node-onMobile";

	innerNode.setAttribute(prefix, cssOutput);
	innerNode.setAttribute(prefixMobile, cssMobileOutput);

	// Next add all the Child
	if (Array.isArray(dataArray.context)) {
		dataArray.context.forEach(ctx => {
			const childNode = flexEngineCreateEndNode(ctx, documentHTML, true);
			if (childNode) {
				node.appendChild(childNode);
			}
		});
	}

	// Do same job from the Secion: Apply Section styling: style, CSSoverride, overrideState, size next part
	flexEngineStylingSystem(dataArray, node, true, 4);

	// Animation and Translation, as part 3, they are same!
	// animation self, first from the Animation node.....
	flexEngineAnimationSection(dataArray, node, true);

	// Transition get from the END NODE (1)
	flexEngineTransitionContextsNode(dataArray, node);

	//return
	return innerNode;
};

// create a new Popup (4)
const flexengineCreatePopup = function(dataArray, documentHTML) {
	// Create a new outer node
	const node = documentHTML.createElement("div");

	// setup the attributes
	node.id = dataArray.outerJSID;

	node.classList.add(`${BUILDER_CONFIG.classPrefix}popup`);
	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.id}`);

	// Outer style.
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


	const prefix = BUILDER_CONFIG.classPrefix + "styles-node";
	node.setAttribute(prefix, outerDesktopCSS.trim());
	node.setAttribute(prefix + "-onMobile", outerMobileCSS.trim());

	// Outer Animation, rememebr that all triggler is same: when you toggle the popup
	flexEngineAnimationContextsNode(dataArray, node);

	// Click to close
	if (dataArray.cilckToClose === true) {
		node.setAttribute(`data-${BUILDER_CONFIG.classPrefix}clicktoclose`, true);
	} else {
		node.setAttribute(`data-${BUILDER_CONFIG.classPrefix}clicktoclose`, true);
	}

	// Size part 1
	const sizeDesktopCSS = `
		display: flex;
		flex-direction: column;
		justify-content: ${SectionData.size.positionY === 1 ? "flex-start" : SectionData.size.positionY === 3 ? "flex-end" : "center"};
		align-items: ${SectionData.size.positionX === 1 ? "flex-start" : SectionData.size.positionX === 3 ? "flex-end" : "center"};
	`;

	const sizeMobileCSS = `
		justify-content: ${SectionData.size.mobilePositionY === 1 ? "flex-start" : SectionData.size.mobilePositionY === 3 ? "flex-end" : "center"};
	`;

	node.setAttribute(prefix, (node.getAttribute(prefix) || "") + sizeDesktopCSS.trim());
	node.setAttribute(prefix + "-onMobile", (node.getAttribute(prefix + "-onMobile") || "") + sizeMobileCSS.trim());


	/*
	 Then let's pass everything in inner Parts
	*/
	const innerNode = flexEngineCreatePopupInnerPart(dataArray, documentHTML);

	node.appendChild(innerNode);

	return node;
};


/*
HEADER (6) LEVEL
*/

// Control the Open List
const flexEngineCreateOpenList = function(dataArray, documentHTML, headerDataArray, isMobile) {
    const node = documentHTML.createElement("ul");

	// basics
    node.id = dataArray.JSID;

    node.classList.add(
        `${BUILDER_CONFIG.classPrefix}header-submenulist`,
    );

	//context creator
	dataArray.context.forEach(ctx => {

		// create <li>
		const li = documentHTML.createElement("li");

		// if action.enable is false → append attributes only
		if (!ctx.action || ctx.action.enable === false) {
			li.textContent = ctx.attributes;
			node.appendChild(li);
			return;
		}

		// otherwise → create action node
		const actionNode = flexEngineCreateAction(
			documentHTML,
			dataArray.clickable,
			'span' // 'span' works as fallback in case of problems
		);

		// append attributes into the action node
		actionNode.textContent = ctx.attributes;

		// append action node into <li>
		li.appendChild(actionNode);

		// append <li> into main node
		node.appendChild(li);
	});

	const prefix = BUILDER_CONFIG.classPrefix + "styles-node";

	// set attribute using prefix as the name
	node.setAttribute(
		prefix,
		`gap: ${dataArray.layout.gap}`
	);


	flexEngineStylingSystem(dataArray, node, true, 6321, "header");

	// animation system and transition system
	flexEngineAnimationContextsNode(dataArray, node);
	flexEngineTransitionContextsNode(dataArray, node);	

	// return everything back!
	return node;
};

// Control the Sub Section part, remember that is just first part.
const flexEngineCreateSubSection = function(dataArray, documentHTML, headerDataArray, isMobile) {

    // create base node
    const node = documentHTML.createElement("div");

    // basics
    node.id = dataArray.outer.JSID;

    node.classList.add(
        `${BUILDER_CONFIG.classPrefix}header-subsection`,
    );

	// render all inside as Elements inside
	const renderFunction = flexEngineContextCreator.div.contextFunction;
	renderFunction(dataArray, documentHTML, node);


	flexEngineStylingSystem(dataArray, node, parentVertical, 6311, "header");

	// animation system and transition system
	flexEngineAnimationSection(dataArray, node);
	flexEngineTransitionContextsNode(dataArray, node);

    return node;
};

// Setup with Header's Labels infomation.
const flexEngineCreateHeaderLabels = function(dataArray, documentHTML, headerDataArray) {
	// Start with Action node.
	const labelNode = flexEngineCreateAction(
		documentHTML,
		dataArray.clickable,
		'p'   // 'p' works as fallback for header labels
	);

	// CONTENT CREATOR
	if (dataArray.type === "text") {
		labelNode.textContent = dataArray.content.label;
	}
	else if (dataArray.type === "img") {
		const img = documentHTML.createElement("img");

		img.classList.add(`${BUILDER_CONFIG.classPrefix}header-labels-img`);

		img.src = dataArray.content.source;
		img.alt = dataArray.content.alt || "";

		labelNode.appendChild(img);
	}

	flexEngineStylingSystem(dataArray, labelNode, true, 0, "header");

	flexEngineAnimationContextsNode(dataArray, labelNode);
	flexEngineTransitionContextsNode(dataArray, labelNode);
	
	// now you can return it now.	
    return labelNode;
};

// Now create a labels
const flexEngineCreateHeaderNavItem = function(dataArray, documentHTML, headerDataArray) {
	const engine = flexEngineStyleVarible;

	// create <li> for header nav item
	const navItem = documentHTML.createElement("li");

	navItem.id = dataArray.JSID;

	navItem.classList.add(
		`${BUILDER_CONFIG.classPrefix}header-navitem`,
		`${BUILDER_CONFIG.classPrefix}header-${dataArray.id}`
	);

	// Start with CSS.
    const css = {
        // padding-bottom from headerDataArray
        "padding-bottom": flexEngineStyleVarible.space(headerDataArray.style.paddingBottom),

        // border-bottom from gaps
        "border-bottom-width": flexEngineStyleVarible.space(headerDataArray.gap),
        "border-bottom-style": dataArray.gaps.incline ? "inset" : "solid",
        "border-bottom-color": dataArray.gaps.defaultColor
    };

    // convert to CSS string
    const layoutCSS =  Object.entries(css)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ");


	navItem.setAttribute(`${BUILDER_CONFIG.classPrefix}styles-node`, layoutCSS);

	// create the label element using your existing engine function, then append it.
	const labelElement = flexEngineCreateHeaderLabels(
		dataArray,
		documentHTML,
		headerDataArray
	);

	navItem.appendChild(labelElement);

	// Inside, the another one!
	if ( dataArray.enableToggles === true ) {
		const height = flexEngineStyleVarible.space(headerDataArray.style.height);
		const gap = flexEngineStyleVarible.space(dataArray.gaps.gap);

		// top calculation
		const topValue = dataArray.gaps.incline === false
			? `calc(${height} + ${gap})`
			: height;

		// build CSS string
		const LayoutCSSMenu = [
			`top: ${topValue};`,

		].join(" ");

		// Things that inside.
		let openElement;

		if (dataArray.toggleOpen && dataArray.toggleOpen.mode === "Open Section") {
			// Use SubSection
			openElement = flexEngineCreateSubSection(
				dataArray,
				documentHTML,
				headerDataArray,
				false
			);
		} else {
			// Use OpenList
			openElement = flexEngineCreateOpenList(
				dataArray,
				documentHTML,
				headerDataArray,
				false
			);
		}

		const prefix = BUILDER_CONFIG.classPrefix + "styles-node";

		// read existing CSS string
		let cssString = openElement.getAttribute(prefix) || "";

		// prepend LayoutCSSMenu context
		cssString = LayoutCSSMenu + cssString;

		// write back to the same attribute
		openElement.setAttribute(prefix, cssString);
		
		// Append the returned element
		navItem.appendChild(openElement);
	}	

	// Styling (FlexEngine style, include style, styleOnHover, AnimationSetting)
	flexEngineStylingSystem(dataArray, navItem, true, 0, "header");

	// animation system and transition system
	flexEngineAnimationContextsNode(dataArray, navItem);
	flexEngineTransitionContextsNode(dataArray, navItem);

	return navItem;
};

// Inner parts!
const flexEngineCreateHeaderContext = function (dataArray, documentHTML, type) {
	const engine = flexEngineStyleVarible;

	//assume this is 'Standard'

	// 1. Create a new node <header> and add class `${BUILDER_CONFIG.classPrefix}header-row`
	const node = documentHTML.createElement("header");
	node.classList.add(`${BUILDER_CONFIG.classPrefix}header-row`);


	// 2. Create CSS string for max-height using dataArray.size.maxInnerWidth
	const cssMaxHeight = `max-height: ${flexEngineStyleVarible.space(dataArray.size.maxInnerWidth)};`;
	// 3. Add that CSS string to `${BUILDER_CONFIG.classPrefix}styles-node`
	node.setAttribute(
		`${BUILDER_CONFIG.classPrefix}styles-node`,
		cssMaxHeight
	);


	// 4. Create left, center, right elements with proper classes
	const left   = documentHTML.createElement("div");
	const center = documentHTML.createElement("div");
	const right  = documentHTML.createElement("div");

	left.classList.add(`${BUILDER_CONFIG.classPrefix}header-row-left`);
	center.classList.add(`${BUILDER_CONFIG.classPrefix}header-row-center`);
	right.classList.add(`${BUILDER_CONFIG.classPrefix}header-row-right`);

	// 5. Create CSS string for gap using dataArray.layout.gap
	const cssGap = `gap: ${flexEngineStyleVarible.space(dataArray.layout.gap)};`;

	// Apply to main + left + center + right
	[node, left, center, right].forEach((el) => {
		el.setAttribute(
			`${BUILDER_CONFIG.classPrefix}styles-node`,
			(el.getAttribute(`${BUILDER_CONFIG.classPrefix}styles-node`) || "") + cssGap
		);
	});


	// 7. Create CSS string for mobileGap
	const cssMobileGap = `gap: ${flexEngineStyleVarible.space(dataArray.layout.mobileGap)};`;

	// Apply to main + left + center + right
	[node, left, center, right].forEach((el) => {
		el.setAttribute(
			`${BUILDER_CONFIG.classPrefix}styles-node-onMobile`,
			cssMobileGap
		);
	});

	// 9. Add context items into left, center, right panels
	const ctx = dataArray.context || {};

	// Map JSON keys → DOM nodes
	const panelMap = {
		left: left,
		middle: center,
		right: right
	};

	// Loop through each panel
	["left", "middle", "right"].forEach((key) => {
		const list = ctx[key];

		// Must be an array
		if (Array.isArray(list)) {
			list.forEach((item) => {
				// Create nav item using your engine function
				const navNode = flexEngineCreateHeaderNavItem(item, documentHTML, dataArray);

				// Append if valid
				if (navNode) {
					panelMap[key].appendChild(navNode);
				}
			});
		}
	});

	// 10. Force animation OFF for node, left, center, right
	const prefix = BUILDER_CONFIG.classPrefix; // e.g. "cw-"
	const attrName = `${prefix}animation-config-self`;
	const triggerAttr = `${prefix}animation-config-self-trigger`;

	// Apply to all 4 nodes
	[node, left, center, right].forEach((el) => {
		el.setAttribute(attrName, "");
		el.setAttribute(triggerAttr, "");
	});


	// 11. Append left, center, right into the main node, then return it
	node.appendChild(left);
	node.appendChild(center);
	node.appendChild(right);

	return node;
};

// Final Function for Header!
const flexEngineCreateHeader = function(dataArray, documentHTML) {
	const header = documentHTML.createElement("header");

	header.id = dataArray.JSID;

	navItem.classList.add(
		`${BUILDER_CONFIG.classPrefix}header`,
		`${BUILDER_CONFIG.classPrefix}h${dataArray.id}`
	);

	// Styles
	flexEngineStylingSystem(dataArray, navItem, true, 0, "header");

	// Assume this is Standard: we create a inner context
	flexEngineCreateHeaderContext(dataArray, documentHTML, 'standard');

	// I did not create Mobile, that's you help!
	debugger;

	//then animation and eerything!
	flexEngineAnimationSection(dataArray, node);
	flexEngineTransitionContextsNode(dataArray, node);


};




/*
OTHERS (9)
*/

// create a Float element, OTHERS (9)
const flexengineCreateFloat = function(dataArray, documentHTML) {
	const node = flexEngineCreateEndNode(dataArray, documentHTML, true);

	const desktopCss = `
		position: fixed;
		top: ${dataArray.stickyTop || "auto"};
		right: ${dataArray.stickyRight || "auto"};
		bottom: ${dataArray.stickyBottom || "auto"};
		left: ${dataArray.stickyLeft || "auto"};
	`.trim();

	const mobileCSS = `
		position: fixed;
		top: ${dataArray.mobileStickyTop || "auto"};
		right: ${dataArray.mobileStickyRight || "auto"};
		bottom: ${dataArray.mobileStickyBottom || "auto"};
		left: ${dataArray.mobileStickyLeft || "auto"};
	`.trim();

	const prefix = BUILDER_CONFIG.classPrefix + "styles-node";

	node.setAttribute(prefix, ((node.getAttribute(prefix) || "") + " " + desktopCss).trim());
	node.setAttribute(prefix + "-onMobile", ((node.getAttribute(prefix + "-onMobile") || "") + " " + mobileCSS).trim());

	return node;
};

// create JS script, OTHERS (9)
const flexengineCreateJS = function(dataArray, documentHTML) {
	const node = documentHTML.createElement("script");

	if (dataArray.source === 1) {
		node.src = dataArray.script;
	} else {
		node.textContent = dataArray.script;
	}

	if (dataArray.defer) {
		node.defer = true;
	}

	if (dataArray.integrity !== "none") {
		node.integrity = "sha256-" + dataArray.integrity;
		node.crossOrigin = "anonymous";
	}

	if (dataArray.ESM) {
		node.type = "module";
	}

	return node;
};

/*
HTML LEVEL
*/

// Flex Engine give Requirements
const flexEngineRequirements = function(dataArray) {
	// The main purpose is to let outside know what is needed before rendering.
	let requirementsList = [];

	// 1. Check Global Layout Components
	if (dataArray.header && dataArray.header.enable === true) {
		requirementsList.push(`/components/header/${dataArray.header.index}.json`);
	}

	if (dataArray.CTA && dataArray.CTA.enable === true) {
		requirementsList.push(`/components/cta/${dataArray.CTA.index}.json`);
	}

	if (dataArray.footer && dataArray.footer.enable === true) {
		requirementsList.push(`/components/footer/${dataArray.footer.index}.json`);
	}

	// 2. Check Top-Level Content for Reusable Sections
	const context = dataArray.content;
	if (Array.isArray(context)) {
		context.forEach((section) => {
			if (section.type === "reusableSection") {
				requirementsList.push(`/components/reusable_sections/${section.name}.json`);
			}
		});
	}

	// 3. Remove duplicates just in case
	return [...new Set(requirementsList)];
};

// Flex Engine Head system
const flexEngineRenderHTMLHeader = function(documentHTML, dataArray, mainArray, selfSlug) {

	// environment check
	const absoluteDomainEnable =
		(selfSlug !== null && mainArray.domain !== null &&
			selfSlug !== "" && mainArray.domain !== "");

	const absoluteURL = absoluteDomainEnable ?
		`https://${mainArray.domain}${selfSlug}` :
		null;

	// charset
	const metaCharset = documentHTML.createElement('meta');
	metaCharset.setAttribute('charset', 'UTF-8');
	documentHTML.head.appendChild(metaCharset);

	// viewport
	const metaViewport = documentHTML.createElement('meta');
	metaViewport.setAttribute('name', 'viewport');
	metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
	documentHTML.head.appendChild(metaViewport);

	// description
	const metaDesc = documentHTML.createElement('meta');
	metaDesc.setAttribute('name', 'description');
	metaDesc.setAttribute('content', dataArray.description);
	documentHTML.head.appendChild(metaDesc);

	// keywords
	const metaKeywords = documentHTML.createElement('meta');
	metaKeywords.setAttribute('name', 'keywords');
	metaKeywords.setAttribute('content', mainArray.websiteKeywords.join(', '));
	documentHTML.head.appendChild(metaKeywords);

	// canonical
	if (absoluteDomainEnable) {
		const linkCanonical = documentHTML.createElement('link');
		linkCanonical.setAttribute('rel', 'canonical');
		linkCanonical.setAttribute('href', absoluteURL);
		documentHTML.head.appendChild(linkCanonical);
	}

	// OG tags
	const ogTitle = documentHTML.createElement('meta');
	ogTitle.setAttribute('property', 'og:title');
	ogTitle.setAttribute('content', `${dataArray.title} - ${mainArray.name}`);
	documentHTML.head.appendChild(ogTitle);

	const ogDesc = documentHTML.createElement('meta');
	ogDesc.setAttribute('property', 'og:description');
	ogDesc.setAttribute('content', dataArray.description);
	documentHTML.head.appendChild(ogDesc);

	const ogType = documentHTML.createElement('meta');
	ogType.setAttribute('property', 'og:type');
	ogType.setAttribute('content', 'website');
	documentHTML.head.appendChild(ogType);

	if (absoluteDomainEnable) {
		const ogUrl = documentHTML.createElement('meta');
		ogUrl.setAttribute('property', 'og:url');
		ogUrl.setAttribute('content', absoluteURL);
		documentHTML.head.appendChild(ogUrl);

		// OPTIONAL: OG image (now using absMedia)
		if (dataArray.coverIMG) {
			const ogImg = documentHTML.createElement('meta');
			ogImg.setAttribute('property', 'og:image');
			ogImg.setAttribute(
				'content',
				flexEngineStyleVarible.absMedia(dataArray.coverIMG, mainArray, selfSlug)
			);
			documentHTML.head.appendChild(ogImg);
		}
	}

	const ogSite = documentHTML.createElement('meta');
	ogSite.setAttribute('property', 'og:site_name');
	ogSite.setAttribute('content', mainArray.name);
	documentHTML.head.appendChild(ogSite);

	// Twitter
	const twCard = documentHTML.createElement('meta');
	twCard.setAttribute('name', 'twitter:card');
	twCard.setAttribute('content', 'summary_large_image');
	documentHTML.head.appendChild(twCard);

	const twTitle = documentHTML.createElement('meta');
	twTitle.setAttribute('name', 'twitter:title');
	twTitle.setAttribute('content', `${dataArray.title} - ${mainArray.name}`);
	documentHTML.head.appendChild(twTitle);

	const twDesc = documentHTML.createElement('meta');
	twDesc.setAttribute('name', 'twitter:description');
	twDesc.setAttribute('content', dataArray.description);
	documentHTML.head.appendChild(twDesc);

	if (absoluteDomainEnable && dataArray.coverIMG) {
		const twImg = documentHTML.createElement('meta');
		twImg.setAttribute('name', 'twitter:image');
		twImg.setAttribute(
			'content',
			flexEngineStyleVarible.absMedia(dataArray.coverIMG, mainArray, selfSlug)
		);
		documentHTML.head.appendChild(twImg);
	}

	// Favicon (now using absMedia)
	if (mainArray.icon) {
		const icon = documentHTML.createElement('link');
		icon.setAttribute('rel', 'icon');
		icon.setAttribute(
			'href',
			flexEngineStyleVarible.absMedia(mainArray.icon, mainArray, selfSlug)
		);
		documentHTML.head.appendChild(icon);

		const appleIcon = documentHTML.createElement('link');
		appleIcon.setAttribute('rel', 'apple-touch-icon');
		appleIcon.setAttribute(
			'href',
			flexEngineStyleVarible.absMedia(mainArray.icon, mainArray, selfSlug)
		);
		documentHTML.head.appendChild(appleIcon);
	}

	// CSS imports (now using absMedia)
	const cssList = [
		`${BUILDER_CONFIG.classPrefix}assets/styles/main.css`,
		`${BUILDER_CONFIG.classPrefix}assets/styles/theme.css`,
		`${BUILDER_CONFIG.classPrefix}assets/styles/animation.css`
	];

	cssList.forEach(path => {
		const link = documentHTML.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute(
			'href',
			flexEngineStyleVarible.absMedia(path, mainArray, selfSlug)
		);
		documentHTML.head.appendChild(link);
	});
};


//Render HTML.
// Flex Engine final render system!
//get about components. it should a list that include "path": {JSONs array}. double check everything!
// Flex Engine final render system!
const flexEngineRenderHTML = function(dataArray, mainArray, selfSlug, components) {
    // Dynamically create an empty DOM document setting the title
    const finalDoc = document.implementation.createHTMLDocument(dataArray.title + " - " + mainArray.name);

    // Context helper to securely pull data properties from the external JSON array list
    const getComponentData = (path) => {
        if (!Array.isArray(components)) return null;
        const comp = components.find(c => c.path === path);
        return comp ? comp.data : null;
    };

    // <head></head> config initialization
    flexEngineRenderHTMLHeader(finalDoc, dataArray, mainArray, selfSlug);

    // 1. <body></body> Header
    if (dataArray.header && dataArray.header.enable === true) {
        const headerPath = `/components/header/${dataArray.header.index}.json`;
        const headerData = getComponentData(headerPath);
        if (headerData) {
            const headerNode = flexEngineCreateHeader(headerData, finalDoc);
            if (headerNode) finalDoc.body.appendChild(headerNode);
        }
    }

    // 2. <body></body> Context (Standard & Reusable Sections)
    if (Array.isArray(dataArray.content)) {
        dataArray.content.forEach((section) => {
            if (!section) return;
            
            let sectionNode;
            
            // Check if section type requests an external reusable component JSON
            if (section.type === "reusableSection") {
                const reusablePath = `/components/reusable_sections/${section.name}.json`;
                const reusableData = getComponentData(reusablePath);
                if (reusableData) {
                    sectionNode = flexengineCreateSection(reusableData, finalDoc);
                }
            } else {
                // Otherwise process standard native layout sections
                sectionNode = flexengineCreateSection(section, finalDoc);
            }

            if (sectionNode) {
                finalDoc.body.appendChild(sectionNode);
            }
        });
    }

    // 3. <body></body> Call To Action (CTA)
    if (dataArray.CTA && dataArray.CTA.enable === true) {
        const ctaPath = `/components/cta/${dataArray.CTA.index}.json`;
        const ctaData = getComponentData(ctaPath);
        if (ctaData) {
            const ctaNode = flexengineCreateSection(ctaData, finalDoc);
            if (ctaNode) finalDoc.body.appendChild(ctaNode);
        }
    }

    // 4. <body></body> Footer
    if (dataArray.footer && dataArray.footer.enable === true) {
        const footerPath = `/components/footer/${dataArray.footer.index}.json`;
        const footerData = getComponentData(footerPath);
        if (footerData) {
            const footerNode = flexengineCreateSection(footerData, finalDoc);
            if (footerNode) finalDoc.body.appendChild(footerNode);
        }
    }

    // 5. Popups
    if (Array.isArray(dataArray.popups)) {
        dataArray.popups.forEach((popupData) => {
            const popupNode = flexengineCreatePopup(popupData, finalDoc);
            if (popupNode) finalDoc.body.appendChild(popupNode);
        });
    }

    // 6. Float Buttons
    if (Array.isArray(dataArray.floats)) {
        dataArray.floats.forEach((floatData) => {
            const floatNode = flexengineCreateFloat(floatData, finalDoc);
            if (floatNode) finalDoc.body.appendChild(floatNode);
        });
    }

    // 7. JavaScript Code as DOM nodes
    if (Array.isArray(dataArray.scripts)) {
        dataArray.scripts.forEach((scriptData) => {
            const jsNode = flexengineCreateJS(scriptData, finalDoc);
            if (jsNode) finalDoc.body.appendChild(jsNode);
        });
    }

    return finalDoc; // Returns the cleanly generated, fully assembled DOM HTML Document
};

// incomplete here!
// Organized Flex Engine Structural Module Object
const flexEngine = {
    meta: {
        version: '1.0',
        fileVersionStart: '1.0.0',
        fileVersionEnd: '1.0.0'
    },
    
    // Core Engine Process Functions

    getRequirements: flexEngineRequirements,
    render: flexEngineRenderHTML,
    
    // Abstract Factory creators that output Node/Layout Elements
    creators: {
        node: flexEngineCreateEndNode,
        section: flexengineCreateSection,
        popup: flexengineCreatePopup,
        header: flexEngineCreateHeader,
        float: flexengineCreateFloat,
        js: flexengineCreateJS
    },
    
    // Style sheets, variables, and physics math tools
    utils: {
        styling: flexEngineStylingSystem,
        variables: flexEngineStyleVarible,
        animation: flexEngineAnimationContextsNode,
        transition: flexEngineTransitionContextsNode
    }
};

export default flexEngine;