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