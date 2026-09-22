// Setting List for nodes.
const SizeSettingList = {
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

/*
END NODE (1) and CONTAINER NODE (2) LEVEL
*/

// Context Creator for the END NODE (1) and CONTAINER NODE (2)
const flexEngineContextCreator = {
	/*
	END NODE (1)
	*/
	//Sheet is passed......
	//Form is passed......
	/*
	CONTAINER NODE (2)
	*/
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
// create a new Section, SECTION (3)
// moved

/*
POPUP (4) LEVEL
*/

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