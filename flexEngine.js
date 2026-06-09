/*
This is Flex Engine.

it work as create whole DOM for the website, then do everything else at next step.

Future:
we will change this whole part of code from the Normal to registery mode.
*/

// NEXT DAY (late 3.5 day): HEADER
// LAST: combine final HTML and CSS theme

import quillDeltaToHtml from 'https://cdn.jsdelivr.net/npm/quill-delta-to-html@0.12.1/+esm'

/*
Config
*/
const BUILDER_CONFIG = {
	brandName: "CubicWorld",
	classPrefix: "cw-",
	attribution: "Created with CubicWorld, a free, powerful website builder."
};

/*
Styling system
*/
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

				// Constructing: prefix/assets/folder/name
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
				return `${absoluteURL}${prefix}assets/${mediaObj.folder}/${mediaObj.name}`;

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
				"width": isVertical ? engine.space(sz.across) : engine.space(sz.along),
				"height": isVertical ? engine.space(sz.along) : engine.space(sz.across),
				"flex-grow": sz.alongGrow || 0,
				"flex-shrink": sz.alongShrink === true ? 1 : 0,
				"overflow-x": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible'),
				"overflow-y": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible'),
				"align-self": (sz.acrossAlign > 0) ? ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'][sz.acrossAlign - 1] : 'auto'
			}
		},
		mobile: (sz, isVertical) => {
			return {
				"min-height": engine.space(sz.mobileMinHeight)
			}
		}
	},

	3: {
		defalut: (sz, isVertical) => {
			return {
				"width": '100%',
				"height": engine.space(sz.height),
				"flex-grow": sz.alongGrow === true? 1 : 0,
				"flex-shrink": sz.alongShrink === true ? 1 : 0,
				"overflow-x": 'visible',
				"overflow-y": 'visible',
				"align-self": 'center'
			}
		},
		mobile: (sz, isVertical) => {
			return {
				"min-height": engine.space(sz.mobileMinHeight)
			}
		}		
	},

	4: {
		defalut: (sz, isVertical) => {
			return {
				"min-width": engine.space(sz.minWidth),
				"min-height": engine.space(sz.minHeight),
				"max-width": engine.space(sz.maxWidth),
				"max-height": engine.space(sz.maxHeight)
			}
		},
		mobile: (sz, isVertical) => {
			return {
				"min-height": engine.space(dataArray.size?.mobileMinHeight),
				"max-height": engine.space(dataArray.size?.mobileMaxHeight)
			}
		}				
	},

	601: {
		default: (sz, isVertical) => {
			return {
				"height": engine.space(sz.height),
				"max-width": engine.space(sz.maxWidth),

				"margin-top": engine.space(sz.marginTop),
				"margin-bottom": engine.space(sz.marginBottom),
				"margin-left": engine.space(sz.marginLeft),
				"margin-right": engine.space(sz.marginRIght)
			}
		},

		mobile: (sz, isVertical) => {
			return {
				"height": engine.space(sz.mobileHeight),

				"margin-top": engine.space(sz.mobileMarginTop),
				"margin-bottom": engine.space(sz.mobileMarginBottom),
				"margin-left": engine.space(sz.mobileMarginLeft),
				"margin-right": engine.space(sz.mobileMarginRIght)
			}
		}
	}
};

// Some helping function control the style.
// Style
const defalutAppearance = (s) => {
	return {
			"padding-top": engine.space(s.paddingTop),
			"padding-bottom": engine.space(s.paddingBottom),
			"padding-left": engine.space(s.paddingLeft),
			"padding-right": engine.space(s.paddingRight),
			"border-style": s.borderMode || "solid",
			"border-top": engine.space(s.borderTop) || "0px",
			"border-bottom": engine.space(s.borderBottom) || "0px",
			"border-left": engine.space(s.borderLeft) || "0px",
			"border-right": engine.space(s.borderRight) || "0px",
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
		"padding-top": engine.space(dataArray.style?.mobilePaddingTop),
		"padding-bottom": engine.space(dataArray.style?.mobilePaddingBottom),
		"padding-left": engine.space(dataArray.style?.mobilePaddingLeft),
		"padding-right": engine.space(dataArray.style?.mobilePaddingRight)
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
const flexEngineStylingClass = function(dataArray, isVertical, sizeSettingMode) {
	const engine = flexEngineStyleVarible;

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

	return JSONarray;
};

// Styling system
const flexEngineStylingSystem = function(dataArray, node, isVertical, sizeSettingMode) {
	const engine = flexEngineStyleVarible;

	const nodeStyle = {
		// Primary state bundle
		default: flexEngineStylingClass(dataArray, isVertical, sizeSettingMode),

		// Map each custom class in overrideState
		...Object.keys(dataArray.overrideState || {}).reduce((acc, key) => {
			const stateData = dataArray.overrideState[key];
			acc[key] = flexEngineStylingClass(stateData, isVertical, sizeSettingMode);
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

	text: function(dataArray, documentHTML, node) {
		const deltaOps = dataArray.content;

		const converter = new QuillDeltaToHtmlConverter(
			deltaOps, {
				classPrefix: `${BUILDER_CONFIG.classPrefix}context-text`
			}
		);

		const html = converter.convert();

		node.innerHTML = html;
	},

	heading: function(dataArray, documentHTML, node) {
		return this.text(dataArray, documentHTML, node);
	},

	image: function(dataArray, documentHTML, node) {
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

	button: function(dataArray, documentHTML, node) {
		const label = dataArray.content.label || "";

		// SAFE: prevents XSS because it does not parse HTML
		node.textContent = label;
	},

	hr: function(dataArray, documentHTML, node) {
		const hr = documentHTML.createElement("hr");

		// Apply class
		hr.className = `${BUILDER_CONFIG.classPrefix}context-hr`;

		// Insert into node
		node.innerHTML = "";
		node.appendChild(hr);
	},

	space: function(dataArray, documentHTML, node) {
		// Do nothing — spacer is layout-only
		return;
	},

	//Sheet is passed......

	audio: function(dataArray, documentHTML, node) {
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

	video: function(dataArray, documentHTML, node) {
		const content = dataArray.content;

		const src = flexEngineStyleVarible.media(content.source);
		const poster = content.thumbnail ?
			flexEngineStyleVarible.media(content.thumbnail) :
			null;

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

	vimeoVideo: function(dataArray, documentHTML, node) {
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

	ytVideo: function(dataArray, documentHTML, node) {
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
		iframe.allow =
			"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

		// Disable Picture-in-Picture
		if (c.disablepictureinpicture) {
			iframe.setAttribute("disablepictureinpicture", "");
			iframe.allow =
				"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share";
		}

		iframe.referrerPolicy = "strict-origin-when-cross-origin";
		iframe.allowFullscreen = true;

		// Insert into node
		node.innerHTML = "";
		node.appendChild(iframe);
	},

	iframe: function(dataArray, documentHTML, node) {
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

	gdocs: function(dataArray, documentHTML, node) {

		// Create container
		const el = documentHTML.createElement("div");
		el.className = `${BUILDER_CONFIG.classPrefix}context-gdocs`;

		// Add data attribute
		el.setAttribute(
			`data-${BUILDER_CONFIG.classPrefix}gdocid`,
			dataArray.content.gDocsID
		);

		// Build docId
		const docId = dataArray.content.gDocsID;

		const loadingText = documentHTML.createElement("p");
		loadingText.textContent = "Loading Contents.......";
		el.appendChild(loadingText);

		const fallback = documentHTML.createElement("p");

		fallback.append(
			documentHTML.createTextNode("Cannot see the Context? go ")
		);

		const link = documentHTML.createElement("a");
		link.href = `https://docs.google.com/document/d/e/${docId}/pub`;
		link.target = "_blank";
		link.textContent = "this link";
		fallback.appendChild(link);

		fallback.append(
			documentHTML.createTextNode(
				" to view the message. If you disabled JS, your document will be displayed here. For better experience we recommend to "
			)
		);

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

	ytLive: function(dataArray, documentHTML, node) {
		// Add data attribute
		node.setAttribute("data-cw-ytchannelid", dataArray.content.channelID);

		const overlay = documentHTML.createElement("div");
		overlay.className = `${BUILDER_CONFIG.classPrefix}context-ytLive-overlay`;

		// Text: "Preparing Live Room....."
		overlay.appendChild(
			documentHTML.createTextNode("Preparing Live Room.....")
		);

		const noscript = documentHTML.createElement("noscript");

		const nsText1 = documentHTML.createTextNode(
			"We find your JavaScript is disabled, please "
		);
		noscript.appendChild(nsText1);

		const turnOn = documentHTML.createElement("a");
		turnOn.href = "https://turnonjs.com";
		turnOn.target = "_blank";
		turnOn.textContent = "Turn on JS";
		noscript.appendChild(turnOn);

		noscript.appendChild(
			documentHTML.createTextNode(" or visit the channel: ")
		);

		const ytLink = documentHTML.createElement("a");
		ytLink.href = `https://youtube.com/channel/${dataArray.content.channelID}`;
		ytLink.target = "_blank";
		ytLink.textContent = "YouTube";
		noscript.appendChild(ytLink);

		overlay.appendChild(noscript);

		node.innerHTML = "";
		node.appendChild(overlay);
	},

	//Form is passed......

	html: function(dataArray, documentHTML, node) {
		node.innerHTML = dataArray.content.html;
	},

	/*
	CONTAINER NODE (2)
	THOSE WILL WORK AS A CONTAINER BUT STILL TREAT AS END NODE SINCE THIS IS NOT WORK AS SECTION.
	REMEMBER WHEN START USE THIS, flexEngineCreateEndNode is already defined!
	*/

	div: function(dataArray, documentHTML, node) {
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
				mobileDir = desktopDirection.includes('-reverse') ?
					desktopDirection.replace('-reverse', '') :
					desktopDirection + '-reverse';
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

// Create a new END NODE (1) and CONTAINER NODE (2)
const flexEngineCreateEndNode = function(dataArray, documentHTML, parentVertical = true) {
	let node;

	if (!dataArray.clickable || dataArray.clickable.enable === false) {
		node = documentHTML.createElement("div");
	}

	if (dataArray.clickable && dataArray.clickable.enable === true &&
		dataArray.clickable.action.mode === "a") {

		node = documentHTML.createElement("a");
		node.href = dataArray.clickable.action.url;

		if (dataArray.clickable.action.newPage === true) {
			node.target = "_blank";
		}
	}

	if (dataArray.clickable && dataArray.clickable.enable === true &&
		dataArray.clickable.action.mode === "download") {

		node = documentHTML.createElement("a");
		node.href = dataArray.clickable.action.url;
		node.target = "_blank";
		node.download = "";

		if (dataArray.clickable.action.forceDownload === true) {
			node.setAttribute("download", dataArray.clickable.action.forceDownload);
		}
	}

	if (dataArray.clickable && dataArray.clickable.enable === true &&
		dataArray.clickable.action.mode === "openPopup") {

		node = documentHTML.createElement("button");
		node.setAttribute(
			`data-${BUILDER_CONFIG.classPrefix}popup-id`,
			dataArray.clickable.action.popupID
		);
	}

	if (dataArray.clickable && dataArray.clickable.enable === true &&
		dataArray.clickable.action.mode === "closeThisPopup") {

		node = documentHTML.createElement("button");
		node.setAttribute(
			`data-${BUILDER_CONFIG.classPrefix}popup-id`,
			"0"
		);
	}

	if (dataArray.clickable && dataArray.clickable.enable === true &&
		dataArray.clickable.action.mode === "runJS") {

		node = documentHTML.createElement("button");
		node.setAttribute("onclick", dataArray.clickable.action.JS);
	}

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
	const renderFunction = flexEngineContextCreator[dataArray.type];

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
	flexEngineTransitionContextsNode(animationReadyData, node);

	// Step 4, cleanup for this part
	delete animationReadyData;

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

// dealing with Open List function
const flexEngineCreateOpeningList = function(dataArray, node, documentHTML) {
	debugger; // Wait to create
}

// create a lists of elements as a source in header context
debugger; // Wait for create
const flexEngineHeaderElementList = {

};

// create a floder lists......
const flexEngineCreateHeaderElements = function(dataArray, node, documentHTML) {
	debugger; // Wait to create
};

// that is create a Row, one header in standard have one row.
const flexEngineCreateHeaderRow = function(dataArray, node, documentHTML) {
	debugger; // wait to create.
};


// create a new standard HEADER (601)
const flexEngineCreateHeader = function(dataArray, documentHTML) {
	const node = documentHTML.createElement("header");

	node.id = dataArray.JSID;

	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.type}`);
	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.id}`);


	// fot the context, we will wait.
	debugger;

	// Styling system.
	flexEngineStylingSystem(dataArray, node, true, 601);

	// animation system and transition system
	debugger; //wait for changes......
	flexEngineAnimationContextsNode(dataArray, node);
	flexEngineTransitionContextsNode(dataArray, node);

	// Send everything back!
	return node;	
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


//incomplete
// Flex Engine final render system!
//get about components. it should a list that include "path": {JSONs array}. double check everything!
const flexEngineRenderHTML = function(dataArray, mainArray, selfSlug, components) {

	const finalDoc = document.implementation.createHTMLDocument(dataArray.title + " - " + mainArray.name);

	// <head></head>
	flexEngineRenderHTMLHeader(finalDoc, dataArray, mainArray, selfSlug);

	// <body></body> Header
	const header = dataArray.header;
	//wait for header action

	// <body></body> Context	
	const context = dataArray.content;
	context.forEach((section) => {
		const sectionHTML = flexengineCreateSection(section);

		finalDoc.body.appendChild(sectionHTML);
	});

	// <body></body> Call to action, Popup, footer, float button and JS.
	//wait for action
	debugger;

};

// incomplete here!
const flexEngine = {
	version: '1.0',
	flieVersionStart: '1.0.0',
	flieVersionEnd: '1.0.0',

	getRequirements: flexEngineRequirements,

	renderHTML: flexEngineRenderHTML
};
debugger;

// incomplete here!
export default flexEngine;