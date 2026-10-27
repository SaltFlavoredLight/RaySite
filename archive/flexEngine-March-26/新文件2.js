// Varible system
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

			case 'varibles':
			    return `var(--${colorObj.varibles})`;

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

			case 'varibles':
			    return `var(--${spaceObj.varibles})`;

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
				const prefix = BUILDER_CONFIG.classPrefix
		  
				// Constructing: prefix/assets/folder/name
				return `${prefix}assets/${mediaObj.folder}/${mediaObj.name}`;

			case 'external':
				return mediaObj.url;

			default:
				return '';
	    }
	},
};

//Styling system for END NODE (1)
const flexEngineStylingEndNode = function(dataArray, node, isVertical) {
	const engine = flexEngineStyleVarible;

	const nodeStyle = {
		// Primary state bundle
		default: {
			default: ((data) => {
				const s = data.style || {};
				const sz = data.size || {};
				const overrides = {};

				if (Array.isArray(data.CSSoverride)) {
					data.CSSoverride.forEach(item => {
						if (item && item.key) {
							overrides[item.key] = item.value;
						}
					});
				}

				const css = {
					"padding-top": engine.space(s.paddingTop),
					"padding-bottom": engine.space(s.paddingBottom),
					"padding-left": engine.space(s.paddingLeft),
					"padding-right": engine.space(s.paddingRight), // Fixed P
					"border-width": engine.space(s.borderThickness), // Fixed spelling
					"border-style": s.borderMode || "solid",
					"border-top": s.borderTop || "none",
					"border-bottom": s.borderBottom || "none",
					"border-left": s.borderLeft || "none",
					"border-right": s.borderRight || "none",
					"border-radius": `${s.borderRadius || 0}px`, // Fixed spelling
					"box-shadow": s.shadow ? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpand || 0}px ${engine.color(s.ShadowColor)}` : "none",
					"color": engine.color(s.textColor),
					"background": engine.color(s.background),
					"filter": s.blur ? `blur(${s.blur}px)` : "none",
					"font-family": s.font || "inherit",
					"caret-color": engine.color(s.markColor),
					"width": isVertical ? engine.space(sz.across) : engine.space(sz.along),
					"height": isVertical ? engine.space(sz.along) : engine.space(sz.across),
					"flex-grow": sz.alongGrow || 0,
					"flex-shrink": sz.alongShrink === true ? 1 : 0,
					"overflow-x": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible'),
					"overflow-y": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible'),
					"align-self": (sz.acrossAlign > 0) ? ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'][sz.acrossAlign - 1] : 'auto'
				};

				return { ...css, ...overrides };
			})(dataArray),

			onMobile: { // Fixed spelling
				"padding-top": engine.space(dataArray.style?.mobilePaddingTop),
				"padding-bottom": engine.space(dataArray.style?.mobilePaddingBottom),
				"padding-left": engine.space(dataArray.style?.mobilePaddingLeft),
				"padding-right": engine.space(dataArray.style?.mobilePaddingRight),
				"min-height": engine.space(dataArray.size?.mobileMinHeight)
			},

			onHover: ((data) => {
				if (!data) return {};
				const s = data.style || {};
				const sz = data.size || {};
				const overrides = {};

				if (Array.isArray(data.CSSoverride)) {
					data.CSSoverride.forEach(item => {
						if (item && item.key) overrides[item.key] = item.value;
					});
				}

				const css = {
					"padding-top": engine.space(s.paddingTop),
					"padding-bottom": engine.space(s.paddingBottom),
					"padding-left": engine.space(s.paddingLeft),
					"padding-right": engine.space(s.paddingRight),
					"border-width": engine.space(s.borderThickness),
					"border-style": s.borderMode || "solid",
					"border-radius": `${s.borderRadius || 0}px`,
					"color": engine.color(s.textColor),
					"background": engine.color(s.background),
					"width": isVertical ? engine.space(sz.across) : engine.space(sz.along),
					"height": isVertical ? engine.space(sz.along) : engine.space(sz.across)
				};

				return { ...css, ...overrides };
			})(dataArray.hover)
		},

		// Map each custom class in overrideState
		...Object.keys(dataArray.overrideState || {}).reduce((acc, key) => {
			const stateData = dataArray.overrideState[key];
			
			acc[key] = {
				default: ((data) => {
					const s = data.style || {};
					const sz = data.size || {};
					const overrides = {};
					if (Array.isArray(data.CSSoverride)) {
						data.CSSoverride.forEach(item => { if (item.key) overrides[item.key] = item.value; });
					}
					return {
						"padding-top": engine.space(s.paddingTop),
						"padding-bottom": engine.space(s.paddingBottom),
						"padding-left": engine.space(s.paddingLeft),
						"padding-right": engine.space(s.paddingRight),
						"border-width": engine.space(s.borderThickness),
						"border-style": s.borderMode || "solid",
						"border-radius": `${s.borderRadius || 0}px`,
						"color": engine.color(s.textColor),
						"background": engine.color(s.background),
						"width": isVertical ? engine.space(sz.across) : engine.space(sz.along),
						"height": isVertical ? engine.space(sz.along) : engine.space(sz.across),
						...overrides
					};
				})(stateData),
				onMobile: {
					"padding-top": engine.space(stateData.style?.mobilePaddingTop),
					"padding-bottom": engine.space(stateData.style?.mobilePaddingBottom),
					"padding-left": engine.space(stateData.style?.mobilePaddingLeft),
					"padding-right": engine.space(stateData.style?.mobilePaddingRight),
					"min-height": engine.space(stateData.size?.mobileMinHeight)
				},
				onHover: ((data) => {
					if (!data) return {};
					const s = data.style || {};
					return {
						"color": engine.color(s.textColor),
						"background": engine.color(s.background)
					};
				})(stateData.hover)
			};
			return acc;
		}, {}),
	};
	
	const prefix = BUILDER_CONFIG.classPrefix;

	Object.keys(nodeStyle).forEach(stateKey => {
		if (stateKey === 'startAnimation') return;

		let cleanName = stateKey.startsWith('.') ? stateKey.substring(1) : stateKey;

		const bundle = nodeStyle[stateKey];
		const attributeBase = `${prefix}-styles-${cleanName}`;

		if (bundle.default) {
			node.setAttribute(attributeBase, JSON.stringify(bundle.default));
		}

		if (bundle.onMobile) {
			node.setAttribute(`${attributeBase}-onMobile`, JSON.stringify(bundle.onMobile));
		}

		if (bundle.onHover) {
			node.setAttribute(`${attributeBase}-onHover`, JSON.stringify(bundle.onHover));
		}
	});
};

// Context Creator for the END NODE (1)
const flexEngineContextCreator = {
	text: function(dataArray, node) {
		const deltaOps = dataArray.content;

		const converter = new QuillDeltaToHtmlConverter(
			deltaOps,
			{ classPrefix: `${BUILDER_CONFIG.classPrefix}context-text` }
		);

		const html = converter.convert();

		node.innerHTML = html;	
	},
	
	heading: function(dataArray, node) {
		return this.text(dataArray, node); 
	},
	
	image: function(dataArray, node) {
		const content = dataArray.content;

		// Resolve media URL
		const src = flexEngineStyleVarible.media(content.source);

		// Create <img> element
		const img = document.createElement("img");
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
		node.innerHTML = "";     // clear previous content if needed
		node.appendChild(img);   // DOM insertion
	},
	
	button: function(dataArray, node) {
	    const label = dataArray.content.label || "";

		// SAFE: prevents XSS because it does not parse HTML
		node.textContent = label;
	},
	
	hr: function(dataArray, node) {
		const hr = document.createElement("hr");

		// Apply class
		hr.className = `${BUILDER_CONFIG.classPrefix}context-hr`;

		// Insert into node
		node.innerHTML = "";
		node.appendChild(hr);
	},
	
	space: function(dataArray, node) {
		// Do nothing — spacer is layout-only
		return;
	}
	
	//Sheet is passed......
	
	audio: function(dataArray, node) {
		const content = dataArray.content;

		const src = flexEngineStyleVarible.media(content.source);

		const audio = document.createElement("audio");
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
	}

	video: function(dataArray, node) {
		const content = dataArray.content;

		const src = flexEngineStyleVarible.media(content.source);
		const poster = content.thumbnail
			? flexEngineStyleVarible.media(content.thumbnail)
			: null;

		const video = document.createElement("video");
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
		
		const fallback = document.createElement("p");
		fallback.textContent = "Oh no! your Browser does not support Embed Video! but that's OK, download the video at ";
		const link = document.createElement("a");
		link.href = src;
		link.textContent = "here!";
		link.download = "";
		fallback.appendChild(link);
		video.appendChild(fallback);

		// Insert into node
		node.innerHTML = "";
		node.appendChild(video);
	}

	vimeoVideo: function(dataArray, node) {
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
		const iframe = document.createElement("iframe");
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
	
	ytVideo: function(dataArray, node) {
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
		const iframe = document.createElement("iframe");
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
	}
	
	iframe: function(dataArray, node) {
	    // --- Create iframe element ---
		const iframe = document.createElement("iframe");
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
					doc.write(src);   // SAFE: inside sandbox
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
	}
	
};

// create a new END NODE (1)
const flexEngineCreateEndNode = function(dataArray, documentHTML, parentVertical) {
	// create a new container about this element.
	const node = documentHTML.createElement('div');
	
	// WAIT HERE! THE A!
	
	// set attributes
	node.id = dataArray.JSID;
	
	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.type}`);
	node.classList.add(`${BUILDER_CONFIG.classPrefix}${dataArray.id}`);
	
	// setup data inside (select one)
	const renderFunction = flexEngineContextCreator[dataArray.type];

    if (typeof renderFunction === "function") {
        renderFunction(dataArray, node);
    } else {
        console.error(`FlexEngine: Type "${type}" not found!`);
    }
	
	// Styling (FlexEngine style, include style, styleOnHover, AnimationSetting)
	// since there have no CSS seperate sheet, this keep, later will use a render system to render to real HTML.
	flexEngineStylingEndNode(dataArray, node, parentVertical);
	
	//HERE WAIT!
	
	// Send everything back!
	return node;
};