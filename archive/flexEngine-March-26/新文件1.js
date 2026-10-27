import quillDeltaToHtml from 'https://cdn.jsdelivr.net/npm/quill-delta-to-html@0.12.1/+esm'

const BUILDER_CONFIG = {
    brandName: "CubicWorld",
    classPrefix: "cw-",
    attribution: "Created with CubicWorld, a free, powerful website builder."
};

/*

var deltaOps =  [
    {insert: "Hello\n"},
    {insert: "This is colorful", attributes: {color: '#f00'}}
];

var converter = new QuillDeltaToHtmlConverter(deltaOps, {classPrefix: `${BUILDER_CONFIG.classPrefix}text-`});

var html = converter.convert(); 


// 1. Create the "Blank Canvas" (This includes the Doctype automatically!)
const newDoc = document.implementation.createHTMLDocument(BUILDER_CONFIG.brandName);

// 2. The Loop: Processing data and adding to the DOM
dataArray.forEach((block) => {
    // Instead of a string, this function now returns a DOM Element
    const element = flexEngine.execute(block, newDoc); 
    
    // 3. Add to the "Body" of our new document
    newDoc.body.appendChild(element);
});

*/


 
//incomplete
const flexEngineContextCreator = {
	
};



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


//Flex Engine Head system
const flexEngineRenderHTMLHeader = function(documentHTML, dataArray, mainArray, selfSlug) {
	
	//enviroment check
	const absoluteDomainEnable = (selfSlug !== null && mainArray.domain !== null && selfSlug !== "" && mainArray.domain !== "");
	const absoluteURL = (absoluteDomainEnable) ? `https://${mainArray.domain}${selfSlug}` : null;
	
	
	
	// SEO and Cover
	// <meta charset="UTF-8">
	const headerMetaCharset = documentHTML.createElement('meta');
	headerMetaCharset.setAttribute('charset', 'UTF-8');
	documentHTML.head.appendChild(headerMetaCharset);
	
	// <meta name="viewport" content="width=device-width, initial-scale=1">
	const headerMetaViewport = documentHTML.createElement('meta');
	headerMetaViewport.setAttribute('name', 'viewport');
	headerMetaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
	documentHTML.head.appendChild(headerMetaViewport);

	// <title>Example Page Title – Brand Name</title>
	// Skip becuase already on

	// <meta name="description" content="A short, clear summary of what this page is about. Around 150–160 characters is ideal.">
	const headerMetaDescription = documentHTML.createElement('meta');
	headerMetaDescription.setAttribute('name', 'description');
	headerMetaDescription.setAttribute('content', dataArray.description);
	documentHTML.head.appendChild(headerMetaDescription);
	
	// <meta name="keywords" content="keyword1, keyword2, keyword3">
	const headerMetaKeywords = documentHTML.createElement('meta');
	headerMetaKeywords.setAttribute('name', 'keywords');
	headerMetaKeywords.setAttribute('content', mainArray.websiteKeywords.join(', '));
	documentHTML.head.appendChild(headerMetaKeywords);
	
	// <link rel="canonical" href="https://www.example.com/page"> need require the path.
	if (absoluteDomainEnable) {
		const headerMetaLink = documentHTML.createElement('link');
		headerMetaLink.setAttribute('name', 'canonical');
		headerMetaLink.setAttribute('content', absoluteURL);
		documentHTML.head.appendChild(headerMetaLink);		
	}
	
	// OGs	
	const headerMetaOGTitle = documentHTML.createElement('meta');
	headerMetaOGTitle.setAttribute('property', 'og:title');
	headerMetaOGTitle.setAttribute('content', dataArray.title + " - " + mainArray.name);
	documentHTML.head.appendChild(headerMetaOGTitle);
	
	const headerMetaOGDescription = documentHTML.createElement('meta');
	headerMetaOGDescription.setAttribute('property', 'og:description');
	headerMetaOGDescription.setAttribute('content', dataArray.description);
	documentHTML.head.appendChild(headerMetaOGDescription);	

	const headerMetaOGType = documentHTML.createElement('meta');
	headerMetaOGType.setAttribute('property', 'og:type');
	headerMetaOGType.setAttribute('content', 'website');
	documentHTML.head.appendChild(headerMetaOGType);

	if (absoluteDomainEnable) {
		const headerMetaOGUrl = documentHTML.createElement('meta');
		headerMetaOGUrl.setAttribute('property', 'og:url');
		headerMetaOGUrl.setAttribute('content', absoluteURL);
		documentHTML.head.appendChild(headerMetaOGUrl);
		
		/*
		const headerMetaOGCover = documentHTML.createElement('meta');
		headerMetaOGCover.setAttribute('property', 'og:image');
		headerMetaOGCover.setAttribute('content', coverIMG); // change the coverIMG to the new onw after.
		documentHTML.head.appendChild(headerMetaOGCover);
		*/
	}
	
	const headerMetaOGSitename = documentHTML.createElement('meta');
	headerMetaOGSitename.setAttribute('property', 'og:site_name');
	headerMetaOGSitename.setAttribute('content', mainArray.name);
	documentHTML.head.appendChild(headerMetaOGSitename);	
	
	// Twitter Cards
	const headerMetaTwitterType = documentHTML.createElement('meta');
	headerMetaTwitterType.setAttribute('name', 'twitter:card');
	headerMetaTwitterType.setAttribute('content', "summary_large_image");
	documentHTML.head.appendChild(headerMetaTwitterType);
	
	const headerMetaTwitterTitle = documentHTML.createElement('meta');
	headerMetaTwitterTitle.setAttribute('name', 'twitter:title');
	headerMetaTwitterTitle.setAttribute('content', dataArray.title + " - " + mainArray.name);
	documentHTML.head.appendChild(headerMetaTwitterTitle);	
	
	const headerMetaTwitterDescription = documentHTML.createElement('meta');
	headerMetaTwitterDescription.setAttribute('name', 'twitter:description');
	headerMetaTwitterDescription.setAttribute('content', dataArray.description);
	documentHTML.head.appendChild(headerMetaTwitterDescription);

	//<meta name="theme-color" content="#ffffff">
	// Skip first

	if (absoluteDomainEnable) {
		/*
		const headerMetaTwitterCover = documentHTML.createElement('meta');
		headerMetaTwitterCover.setAttribute('name', 'twitter:image');
		headerMetaTwitterCover.setAttribute('content', coverIMG); // change the coverIMG to the new onw after.
		documentHTML.head.appendChild(headerMetaTwitterCover);
		*/
	}	
	
	// <link rel="icon" href="/favicon.ico">
	/*
	const headerMetaIcon = documentHTML.createElement('link');
	headerMetaIcon.setAttribute('rel', 'icon');
	headerMetaIcon.setAttribute('href', mainArray.icon); // change the coverIMG to the new onw after.
	documentHTML.head.appendChild(headerMetaIcon);	
	
	const headerMetaAppleIcon = documentHTML.createElement('link');
	headerMetaAppleIcon.setAttribute('rel', 'apple-touch-icon');
	headerMetaAppleIcon.setAttribute('href', mainArray.icon); // change the coverIMG to the new onw after.
	documentHTML.head.appendChild(headerMetaAppleIcon);	
	*/
	
	// CSS imports
	const headerSystemStyle = documentHTML.createElement('link');
	headerSystemStyle.setAttribute('rel', 'stylesheet');
	headerSystemStyle.setAttribute('href', `/${BUILDER_CONFIG.classPrefix}assets/styles/main.css`); 
	documentHTML.head.appendChild(headerSystemStyle);	

	const headerThemeStyle = documentHTML.createElement('link');
	headerThemeStyle.setAttribute('rel', 'stylesheet');
	headerThemeStyle.setAttribute('href', `/${BUILDER_CONFIG.classPrefix}assets/styles/theme.css`); 
	documentHTML.head.appendChild(headerThemeStyle);	

	const headerAnimationStyle = documentHTML.createElement('link');
	headerAnimationStyle.setAttribute('rel', 'stylesheet');
	headerAnimationStyle.setAttribute('href', `/${BUILDER_CONFIG.classPrefix}assets/styles/animation.css`); 
	documentHTML.head.appendChild(headerAnimationStyle);		
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
		const sectionHTML = flexEngineElements.section(section);
		
		finalDoc.body.appendChild(sectionHTML);
	});
	
	// <body></body> Call to action, Popup, footer, float button and JS.
	//wait for action
	
	
};


//incomplete
const flexEngine = {
	version: 1.0,
	flieVersionStart: 1.0.0,
	flieVersionEnd: 1.0.0,
	
	getRequirements: flexEngineRequirements,
	
	renderHTML: flexEngineRenderHTML
};

//incomplete
export flexEngine;