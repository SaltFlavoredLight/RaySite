/*
This is Flex Engine Resigtery Defalut Config

NOTE: Run before the flexengine.js
*/


// Enable strict mode, later I will use ESM.
'use strict';

// Nesserary for have a Quill delta element
import quillDeltaToHtml from 'https://cdn.jsdelivr.net/npm/quill-delta-to-html@0.12.1/+esm'

// and configs
const BUILDER_CONFIG = {
	brandName: "RaySite",
	classPrefix: "rs-",
	attribution: "Spread the message with RaySite! RaySite is a Free Website builder for you!"
};

/*
Input type - those parts will define the input and how to process it to work.
*/
const flexEngineDefaultVaribles = {
    integer: {
        // remember: same name will be collapse to same name, EG: integer/integer = integer.
        integer: {
            strutureSample: 0,
            // this is a Sample to prectice, you can put anything you want. that is default.

            displayType: "small",
            // small: just a field
            // medium: take one line (still 100%)
            // large: take a big space for that question (Custom height)
            // extraLarge: take the expend option
            // extraExtraLarge: expend option with full screen notice 
            // custom: follow the space of how it taken
            // popup: prepare for the popup of the system
            // interactive: it completely work differently!

            cssStyles: {},

            component: class {
                // Constructor: pass dataArray & entryElement, data is that piece, and entryElement is what the field is, different depending on time
                constructor(dataArray, entryElement, elementSetting) { 
                    this.dataArray = dataArray; // regieter it
                    this.entryElement = entryElement; // remember it!

                    const input = document.createElement('input');

                    input.type = 'number';
                    input.step = '1';
                    input.style.height = '100%';
                    input.style.width = '100%';

                    input.addEventListener('keydown', (event) => {
                    if (event.key === '.' || event.key === ',' ) {
                        event.preventDefault();
                    }
                    });

                    input.addEventListener('input', (event) => {
                        event.target.value = event.target.value.replace(/[^0-9-]/g, '');

                        this.dataArray = Number(input.value);
                    });       
                    
                    input.value = this.dataArray;

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(input);

                    return { code: 0 };
                    // 0: everything OK!
                    // 1: No, happend the error.
                    // another JSON array: change my layout type please.
                    // another Function: OK, this is an aynsc function, tell system run it after
                }

                onSave(){
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return dataArray; // Good, since it is just Number.
            }
        },

        noNeg: {
            strutureSample: 0,

            displayType: "small",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = dataArray;
                    this.entryElement = entryElement;

                    const input = document.createElement('input');

                    input.type = 'number';
                    input.step = '1';
                    input.style.height = '100%';
                    input.style.width = '100%';

                    // Prevent typing "-" or any non-digit
                    input.addEventListener('keydown', (event) => {
                        if (event.key === '.' || event.key === ',' || event.key === '-') {
                            event.preventDefault();
                        }
                    });

                    input.addEventListener('input', (event) => {
                        // Remove anything not a digit
                        event.target.value = event.target.value.replace(/[^0-9-]/g, '');
                        if (Number(input.value) < 0) {
                            input.value = Number(input.value) * -1;
                        } 

                        // Convert to number
                        this.dataArray = Number(input.value);
                    });

                    input.value = this.dataArray;

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(input);
                    
                    return { code: 0};
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return dataArray;
            }
        }
    },

    boolean: {
        checkmark: {
            strutureSample: true,

            displayType: "small",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = Boolean(dataArray);
                    this.entryElement = entryElement;

                    const box = document.createElement('input');
                    box.type = 'checkbox';

                    // 1:1 ratio, full height
                    box.style.height = '100%';
                    box.style.aspectRatio = '1 / 1';
                    box.style.width = 'auto';

                    // Set initial state
                    box.checked = this.dataArray;

                    // Live update
                    box.addEventListener('input', () => {
                        this.dataArray = box.checked;
                    });

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(box);

                    return { code: 0};
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return Boolean(dataArray);
            }         
        }
    },

    string: {
        text: {
            strutureSample: "Love the Lord your God with all your heart and with all your soul and with all your mind",

            displayType: "medium",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = String(dataArray);
                    this.entryElement = entryElement;

                    const input = document.createElement('input');
                    input.type = 'text';

                    // full size
                    input.style.width = '100%';
                    input.style.height = '100%';

                    // initial value
                    input.value = this.dataArray;

                    // live update
                    input.addEventListener('input', () => {
                        this.dataArray = input.value;
                    });

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(input);
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return String(dataArray);
            }
        },

        url: {
            strutureSample: "https://www.raysite.app",

            displayType: "medium",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = String(dataArray);
                    this.entryElement = entryElement;

                    const input = document.createElement('input');
                    input.type = 'url';

                    // full size
                    input.style.width = '100%';
                    input.style.height = '100%';

                    // initial value
                    input.value = this.dataArray;

                    // live update
                    input.addEventListener('input', () => {
                        this.dataArray = input.value;
                    });

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(input);
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return String(dataArray);
            }
        },


    }
};

debugger; // FLAG! this part need change on how to Render the some certain elements not just Number
/*
Elements - those will define what the elements will be
*/
const flexEngineDefaultElements = {
    basic: {
        sizeQuery: [
            {
                name: "along",
                label: "{Width/Height}",
                type: "space"
            },
            {
                name: "overflowAlong",
                label: "{Width/Hwight} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "alongGrow",
                label: "{Width/Hwight} Growth Amount",
                type: "number"
            },
            {
                name: "alongShrink",
                label: "Shrink?",
                type: "selection",
                choice: [
                    { label: "No shrink", value: 0 },
                    { label: "Shrink", value: 1 }
                ]
            },

            {
                name: "across",
                label: "{Height/Width}",
                type: "space"
            },
            {
                name: "overflowAcross",
                label: "{Height/Width} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "acrossAlign",
                label: "{Height/Width} Alignment",
                type: "selection",
                choice: [
                    { label: "Default", value: 0 },
                    { label: "Start", value: 1 },
                    { label: "Center", value: 2 },
                    { label: "End", value: 3 },
                    { label: "Stretch", value: 4 },
                    { label: "Baseline", value: 5 }
                ]
            },

            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space"
            }
        ],

		sizeDefault: (sz, isVertical) => {
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
		sizeMobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
			}
		},

        elements: {
            text: {
                className: "text",
                alts: ["p"],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">
                        <path d="M288-192v-480H96v-96h480v96H384v480h-96Zm360 0v-288H528v-96h336v96H744v288h-96Z" />
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "textbox", 
                        type: "interactiveTextBox",
                    }
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const deltaOps = dataArray.content;
                    const converter = new QuillDeltaToHtmlConverter(deltaOps, {
                        classPrefix: `${BUILDER_CONFIG.classPrefix}content-text`
                    });
                    const html = converter.convert();
                    node.innerHTML = html;
                },  
                cssStyles: [],
                jsRuntime: {},

                settings: {}
            },

            heading: {
                className: "heading",
                alts: ["h1", "h2", "h3", "h4", "h5", "h6"],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">
                        <path d="M432-192v-480H240v-96h480v96H528v480h-96Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "textbox", 
                        type: "interactiveTextBox",
                    }
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const deltaOps = dataArray.content;
                    const converter = new QuillDeltaToHtmlConverter(deltaOps, {
                        classPrefix: `${BUILDER_CONFIG.classPrefix}content-text`
                    });
                    const html = converter.convert();
                    node.innerHTML = html;
                },  
                cssStyles: [],
                jsRuntime: {},


                settings: {}
            },
            
            image: {
                className: "image",
                alts: ["img"],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">

                        <path d="M216-144q-29.7 0-50.85-21.5Q144-187 
                        144-216v-528q0-29 21.15-50.5T216-816h528q29.7 0 50.85 21.5Q816-773 
                        816-744v528q0 29-21.15 50.5T744-144H216Zm0-72h528v-528H216v528Zm48-72h432L552-480 444-336l-72-96-108 
                        144Zm-48 72v-528 528Z"/>

                    </svg>
                `,

                contentQuery: [
                    {
                        name: "source", 
                        type: "media/img",
                    },
                    {
                        name: "alt", 
                        label: "alt text",
                        type: "string/textbox",
                    }, 
                    {
                        name: "displayX", 
                        label: "X Alignment",
                        type: "selection",
                        choice: [
                            {label: "left", value: 1},
                            {label: "center", value: 2},
                            {label: "right", value: 3}
                        ],
                        default: 2,
                    },  
                    {
                        name: "displayY", 
                        label: "Y Alignment",
                        type: "selection",
                        choice: [
                            {label: "top", value: 1},
                            {label: "center", value: 2},
                            {label: "bottom", value: 3}
                        ],
                        default: 2,
                    },                                                         
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
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
                cssStyles: [
                    {
                        object: "@root",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "100%" },
                            { key: "object-fit", value: "cover" },
                            { key: "object-position", value: "center" },
                            { key: "display", value: "block" },
                            { key: "user-select", value: "none" }
                        ]
                    }
                ],
                jsRuntime: {},

                initQuery: [
                    {
                        name: "src",
                        lebel: "select image",
                        type: "media/img"
                    }
                ],
                
                initFunction: function(dataArray, element) {
                    const sourceData = dataArray.src;

                    // Ensure the element and its content object exist safely
                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    // Step 2: Insert it directly into element.content.source
                    element.content.source = sourceData;           
                },

                settings: {}
            },

            button: {
                className: "button",
                alts: ["btn"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">

                        <path d="M168-240q-29.7 0-50.85-21.15Q96-282.3 96-312v-336q0-29.7 21.15-50.85Q138.3-720 168-720h624q29.7 0 50.85 21.15Q864-677.7 864-648v336q0 29.7-21.15 50.85Q821.7-240 792-240H168Zm0-72h624v-336H168v336Zm132-48h72v-84h84v-72h-84v-84h-72v84h-84v72h84v84Zm-132 48v-336 336Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "label",
                        type: "string/text",
                    }
                ],

                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const content = dataArray.content;
                    const label = content.label || "";

                    // SAFE: prevents XSS because it does not parse HTML
                    node.textContent = label;
                },

                cssStyles: [],

                jsRuntime: {},

                settings: {}
            },

            line: {
                className: "hr",
                alts: ["line"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">

                        <path d="m271-209-62-62q-11-11-11-25.5t11-25.5l429-429q11-11 25.5-11t25.5 11l62 62q11 11 11 25.5T751-638L322-209q-11 11-25.5 11T271-209Z"/>
                    </svg>
                `,

                contentQuery: [],

                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const hr = documentHTML.createElement("hr");
                    hr.className = `${BUILDER_CONFIG.classPrefix}context-hr`;

                    node.innerHTML = "";
                    node.appendChild(hr);
                },

                cssStyles: [
                    {
                        object: "hr",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "margin", value: "0" },
                            { key: "border", value: "none" },
                            { key: "border-top", value: "1px solid currentColor" },
                            { key: "box-sizing", value: "border-box" }
                        ]
                    }
                ],

                jsRuntime: {},

                settings: {}
            },

            spacer: {
                className: "br",
                alts: ["br"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">

                        <path d="M349.5-610.29q10.5-10.29 10.5-25.5t-10.29-25.71q-10.29-10.5-25.5-10.5t-25.71 10.29q-10.5 10.29-10.5 25.5t10.29 25.71q10.29 10.5 25.5 10.5t25.71-10.29Zm156 0q10.5-10.29 10.5-25.5t-10.29-25.71q-10.29-10.5-25.5-10.5t-25.71 10.29q-10.5 10.29-10.5 25.5t10.29 25.71q10.29 10.5 25.5 10.5t25.71-10.29Zm156 0q10.5-10.29 10.5-25.5t-10.29-25.71q-10.29-10.5-25.5-10.5t-25.71 10.29q-10.5 10.29-10.5 25.5t10.29 25.71q10.29 10.5 25.5 10.5t25.71-10.29ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z"/>
                    </svg>
                `,

                contentQuery: [],

                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    // Spacer is layout-only — no DOM insertion
                    return;
                },

                cssStyles: [],

                jsRuntime: {},

                settings: {}
            }
        },

        setting: {
            systemClass: true,
            allowedSortIn: false, // Work at End node
            allowedSortTo: ["container", "@root/section", "@root/CTA", "@root/Footer"]
        }
    },
    
    media: {
        sizeQuery: [
            {
                name: "along",
                label: "{Width/Height}",
                type: "space"
            },
            {
                name: "overflowAlong",
                label: "{Width/Hwight} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "alongGrow",
                label: "{Width/Hwight} Growth Amount",
                type: "number"
            },
            {
                name: "alongShrink",
                label: "Shrink?",
                type: "selection",
                choice: [
                    { label: "No shrink", value: 0 },
                    { label: "Shrink", value: 1 }
                ]
            },

            {
                name: "across",
                label: "{Height/Width}",
                type: "space"
            },
            {
                name: "overflowAcross",
                label: "{Height/Width} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "acrossAlign",
                label: "{Height/Width} Alignment",
                type: "selection",
                choice: [
                    { label: "Default", value: 0 },
                    { label: "Start", value: 1 },
                    { label: "Center", value: 2 },
                    { label: "End", value: 3 },
                    { label: "Stretch", value: 4 },
                    { label: "Baseline", value: 5 }
                ]
            },

            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space"
            }
        ],

		sizeDefault: (sz, isVertical) => {
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
        
		sizeMobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
			}
		},

        elements: {
            audio: {
                className: "audio",
                alts: [],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">
                        <path d="M432-192q40 0 68-28t28-68v-144h120v-96H480v157q-11-6-22.5-9.5T432-384q-40 0-68 28t-28 68q0 40 28 68t68 28ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "source", 
                        label: "Source",
                        type: "media/audio",
                    },
                    {
                        name: "hideControls", 
                        label: "Hide Controls",
                        type: "boolean/checkmark",
                    }, 
                    {
                        name: "loop", 
                        label: "Loop Audio",
                        type: "boolean/checkmark",
                    }                                          
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const content = dataArray.content;
                    const src = flexEngineStyleVarible.media(content.source);
                    const audio = documentHTML.createElement("audio");
                    
                    audio.className = `${BUILDER_CONFIG.classPrefix}context-audio`;
                    audio.src = src;
                    
                    // Handle native audio player properties
                    if (!content.hideControls) {
                        audio.controls = true;
                    }
                    if (content.loop) {
                        audio.loop = true;
                    }
                    
                    node.innerHTML = ""; 
                    node.appendChild(audio); 
                },  
                cssStyles: [
                    {
                        object: "@root",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "display", value: "block" }
                        ]
                    }
                ],
                jsRuntime: {},

                settings: {}
            },

            video: {
                className: "video",
                alts: ["video"],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">
                        <path d="m456-384 264-168-264-168v336ZM312-240q-29.7 0-50.85-21.15Q240-282.3 240-312v-480q0-29.7 21.15-50.85Q282.3-864 312-864h480q29.7 0 50.85 21.15Q864-821.7 864-792v480q0 29.7-21.15 50.85Q821.7-240 792-240H312Zm0-72h480v-480H312v480ZM168-96q-29.7 0-50.85-21.15Q96-138.3 96-168v-552h72v552h552v72H168Zm144-696v480-480Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "source",
                        label: "Source",
                        type: "media/video"
                    },
                    {
                        name: "hideControls",
                        label: "Hide Controls",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "autoplay",
                        label: "Autoplay",
                        type: "boolean/checkmark",
                        unavliable: { label: "muted", value: "true" }
                    },
                    {
                        name: "muted",
                        label: "Mute by default",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "loop",
                        label: "Loop the video",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "thumbnail",
                        label: "thumbnail",
                        type: "media/image"
                    },
                    {
                        name: "disablepictureinpicture",
                        label: "Disable Picture to Picture",
                        type: "boolean/checkmark"
                    }
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
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
                    
                    node.innerHTML = "";
                    node.appendChild(video);
                },
                cssStyles: [
                    {
                        object: "@root",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "auto" },
                            { key: "display", value: "block" },
                            { key: "background", value: "#000" }
                        ]
                    }
                ],
                jsRuntime: {},

                settings: {
                    hide: true,
                }
            },

            vimeoVideo: {
                name: "Vimeo Video",
                className: "vimeoVideo",

                alts: ["vimeo", "vimeo video"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M2498.5,499c-11.2,242.7-181.1,575.1-509.7,997.1c-339.8,440.6-627.4,661-862.6,661 
                        c-145.6,0-268.9-134.4-369.7-403.3l-201.6-739.4C480.1,745.4,399.8,611,314,611c-18.7,0-84,39.2-196.1,117.6L0.3,577.4 
                        C122.5,470,243.8,361.7,364.4,252.5C528.7,110.6,651.9,35.9,734.1,28.5c194.2-18.7,313.7,113.9,358.5,397.7 
                        c48.5,306.2,82.2,496.7,100.8,571.3c56,253.9,117.6,380.9,184.8,380.9c52.3,0,130.7-82.2,235.3-246.5 
                        c104.6-164.3,160.6-289.4,168-375.3c14.9-141.9-41.1-212.9-168-212.9c-59.7,0-121.4,13.1-184.8,39.2 
                        c123.2-399.6,358.5-593.7,705.8-582.5C2392.1,7.9,2513.4,174.1,2498.5,499L2498.5,499z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "sourceID",
                        label: "Video ID",
                        type: "string/text"
                    },
                    {
                        name: "hash",
                        label: "Password hash",
                        type: "string/text"
                    },
                    {
                        name: "hideControls",
                        label: "Hide controls",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "autoplay",
                        label: "Autoplay",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "muted",
                        label: "Mute",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "loop",
                        label: "Loop Video",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "disablepictureinpicture",
                        label: "Disable Picture in Picture",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "startTime",
                        label: "Start time (seconds)",
                        type: "integer/NoNeg"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "url",
                        label: "Vimeo shared link",
                        type: "string/url"
                    }
                ],

                initFunction: function(dataArray, element) {
                    const rawURL = dataArray.url || "";

                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    // Extract Vimeo ID + hash from shared link
                    try {
                        const u = new URL(rawURL);
                        const parts = u.pathname.split("/").filter(Boolean);

                        // Vimeo shared links look like:
                        // https://vimeo.com/123456789
                        // https://vimeo.com/123456789/h:abcdefg
                        // https://player.vimeo.com/video/123456789?h=abcdefg

                        let id = "";
                        let hash = "";

                        // Find numeric ID
                        for (const p of parts) {
                            if (/^\d+$/.test(p)) {
                                id = p;
                            }
                            if (p.startsWith("h:")) {
                                hash = p.replace("h:", "");
                            }
                        }

                        // Also check query params
                        if (u.searchParams.has("h")) {
                            hash = u.searchParams.get("h");
                        }

                        element.content.sourceID = id;
                        element.content.hash = hash;

                    } catch (e) {
                        // If URL parsing fails, leave fields empty
                        element.content.sourceID = "";
                        element.content.hash = "";
                    }
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    const c = dataArray.content;

                    let url = `https://player.vimeo.com/video/${encodeURIComponent(c.sourceID)}`;

                    const params = new URLSearchParams();

                    if (c.hash && c.hash !== "") {
                        params.set("h", c.hash);
                    }

                    params.set("controls", c.hideControls ? "0" : "1");

                    if (c.autoplay) {
                        params.set("autoplay", "1");
                        params.set("muted", "1");
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

                    url += "?" + params.toString();

                    const iframe = documentHTML.createElement("iframe");
                    iframe.className = `${BUILDER_CONFIG.classPrefix}context-vimeoVideo`;
                    iframe.src = url;
                    iframe.allow = "autoplay; fullscreen; picture-in-picture";

                    if (c.disablepictureinpicture) {
                        iframe.setAttribute("disablepictureinpicture", "");
                        iframe.allow = "autoplay; fullscreen";
                    }

                    iframe.frameBorder = "0";
                    iframe.allowFullscreen = true;

                    node.innerHTML = "";
                    node.appendChild(iframe);
                },

                cssStyles: [
                    {
                        object: "@root",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "aspect-ratio", value: "16 / 9" },
                            { key: "display", value: "block" },
                            { key: "border", value: "none" }
                        ]
                    }
                ],

                jsRuntime: {},

                settings: {}
            },
     
            ytVideo: {
                name: "YouTube Video",
                className: "ytVideo",

                alts: ["youtube", "yt", "youtube video"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "videoID",
                        label: "Video ID",
                        type: "string/text"
                    },
                    {
                        name: "hideControls",
                        label: "Hide controls",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "autoplay",
                        label: "Autoplay",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "muted",
                        label: "Mute",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "loop",
                        label: "Loop Video",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "disablepictureinpicture",
                        label: "Disable Picture in Picture",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "startTime",
                        label: "Start time (seconds)",
                        type: "integer/noNeg"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "url",
                        label: "YouTube Video shared Link",
                        type: "string/url"
                    }
                ],

                initFunction: function(dataArray, element) {
                    const rawURL = dataArray.url || "";

                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    try {
                        const u = new URL(rawURL);

                        let id = "";

                        // Handle:
                        // https://www.youtube.com/watch?v=XXXXXXXX
                        // https://youtu.be/XXXXXXXX
                        // https://www.youtube.com/embed/XXXXXXXX
                        // https://youtube.com/shorts/XXXXXXXX
                        // https://youtube.com/live/XXXXXXXX

                        // 1. Check query param
                        if (u.searchParams.has("v")) {
                            id = u.searchParams.get("v");
                        }

                        // 2. Check pathname segments
                        if (!id) {
                            const parts = u.pathname.split("/").filter(Boolean);

                            // youtu.be/XXXXXXXX
                            if (u.hostname.includes("youtu.be")) {
                                id = parts[0];
                            }

                            // youtube.com/embed/XXXXXXXX
                            if (parts[0] === "embed") {
                                id = parts[1];
                            }

                            // youtube.com/shorts/XXXXXXXX
                            if (parts[0] === "shorts") {
                                id = parts[1];
                            }

                            // youtube.com/live/XXXXXXXX
                            if (parts[0] === "live") {
                                id = parts[1];
                            }
                        }

                        element.content.videoID = id;

                    } catch (e) {
                        element.content.videoID = "";
                    }
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    const c = dataArray.content;

                    let url = `https://www.youtube.com/embed/${encodeURIComponent(c.videoID)}`;

                    const params = new URLSearchParams();

                    params.set("controls", c.hideControls ? "0" : "1");

                    if (c.autoplay) {
                        params.set("autoplay", "1");
                        params.set("mute", "1");
                    }

                    if (c.muted) {
                        params.set("mute", "1");
                    }

                    if (c.loop) {
                        params.set("loop", "1");
                        params.set("playlist", c.videoID);
                    }

                    if (c.startTime) {
                        params.set("start", c.startTime);
                    }

                    url += "?" + params.toString();

                    const iframe = documentHTML.createElement("iframe");
                    iframe.className = `${BUILDER_CONFIG.classPrefix}context-ytvideo`;
                    iframe.src = url;
                    iframe.title = "YouTube video player";
                    iframe.frameBorder = "0";

                    iframe.allow =
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

                    if (c.disablepictureinpicture) {
                        iframe.setAttribute("disablepictureinpicture", "");
                        iframe.allow =
                            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share";
                    }

                    iframe.referrerPolicy = "strict-origin-when-cross-origin";
                    iframe.allowFullscreen = true;

                    node.innerHTML = "";
                    node.appendChild(iframe);
                },

                cssStyles: [
                    {
                        object: "@root",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "aspect-ratio", value: "16 / 9" },
                            { key: "display", value: "block" },
                            { key: "border", value: "none" }
                        ]
                    }
                ],

                jsRuntime: {},

                settings: {}
            },
            
            iframe: {
                name: "Embeds",
                className: "iframe",

                alts: ["embed", "iframe", "html embed", "external embed"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M480-432h192v-72H480v72Zm-48 48v-168h288v168H432ZM168-192q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Zm0-72h624v-360H168v360Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "source",
                        label: "source",
                        type: "string/textbox"
                    },
                    {
                        name: "embedAsHTML",
                        label: "this is HTML document",
                        type: "boolean/checkmark",
                        default: false
                    },
                    {
                        name: "sandboxChoice",
                        label: "sandbox policy",
                        type: "selection",
                        choice: [
                            { label: "No sandbox", value: 0 },
                            { label: "Sandbox (allow scripts + same-origin)", value: 1 },
                            { label: "Strict sandbox", value: 2 }
                        ],
                        default: 0
                    },
                    {
                        name: "allowFullScreen",
                        label: "Allow Full Screen",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "permission",
                        label: "Permission Setting......",
                        type: "selection/popup",
                        catergory: [
                            {
                                label: "Media & Playback",
                                choice: [
                                    { name: "autoplay", label: "Autoplay" },
                                    { name: "encrypted-media", label: "Encrypted Media" },
                                    { name: "picture-in-picture", label: "Picture in Picture" },
                                    { name: "fullscreen", label: "Fullscreen" },
                                    { name: "camera", label: "Camera" },
                                    { name: "microphone", label: "Microphone" },
                                    { name: "speaker-selection", label: "Speaker Selection" }
                                ]
                            },
                            {
                                label: "Input & Interaction",
                                choice: [
                                    { name: "clipboard-read", label: "Clipboard Read" },
                                    { name: "clipboard-write", label: "Clipboard Write" },
                                    { name: "display-capture", label: "Display Capture" },
                                    { name: "gamepad", label: "Gamepad" },
                                    { name: "geolocation", label: "Geolocation" },
                                    { name: "hid", label: "HID" },
                                    { name: "idle-detection", label: "Idle Detection" },
                                    { name: "keyboard-map", label: "Keyboard Map" },
                                    { name: "magnetometer", label: "Magnetometer" },
                                    { name: "midi", label: "MIDI" },
                                    { name: "payment", label: "Payment" },
                                    { name: "screen-wake-lock", label: "Screen Wake Lock" },
                                    { name: "serial", label: "Serial" },
                                    { name: "usb", label: "USB" },
                                    { name: "xr-spatial-tracking", label: "XR Spatial Tracking" }
                                ]
                            },
                            {
                                label: "Storage & System",
                                choice: [
                                    { name: "storage-access", label: "Storage Access" },
                                    { name: "web-share", label: "Web Share" },
                                    { name: "sync-xhr", label: "Sync XHR (deprecated)" }
                                ]
                            },
                            {
                                label: "Experimental / Less common",
                                choice: [
                                    { name: "accelerometer", label: "Accelerometer" },
                                    { name: "gyroscope", label: "Gyroscope" },
                                    { name: "ambient-light-sensor", label: "Ambient Light Sensor" },
                                    { name: "vr", label: "VR (deprecated)" }
                                ]
                            }
                        ],
                        default: []
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "text",
                        label: "iframe code",
                        type: "string/textbox"
                    }
                ],

                initFunction: function(dataArray, element) {
                    const raw = dataArray.text || "";

                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    // ---------------------------------------------------------
                    // 1. Extract ONLY the first <iframe> from the pasted HTML
                    // ---------------------------------------------------------
                    let iframeHTML = "";
                    const iframeMatch = raw.match(/<iframe[\s\S]*?<\/iframe>/i);

                    if (iframeMatch) {
                        iframeHTML = iframeMatch[0];
                    } else {
                        // If no iframe found, treat entire text as source
                        element.content.source = raw.trim();
                        element.content.embedAsHTML = false;
                        element.content.sandboxChoice = 0;
                        element.content.allowFullScreen = false;
                        element.content.permission = [];
                        return;
                    }

                    // ---------------------------------------------------------
                    // 2. Extract attributes from the iframe
                    // ---------------------------------------------------------
                    const getAttr = (attr) => {
                        const m = iframeHTML.match(new RegExp(attr + '\\s*=\\s*["\']([^"\']+)["\']', 'i'));
                        return m ? m[1] : "";
                    };

                    const src = getAttr("src");
                    const sandbox = getAttr("sandbox");
                    const allow = getAttr("allow");
                    const allowfullscreen = /allowfullscreen/i.test(iframeHTML);

                    // ---------------------------------------------------------
                    // 3. Apply extracted values to content
                    // ---------------------------------------------------------
                    element.content.source = src || "";

                    // sandboxChoice mapping:
                    // 0 = no sandbox
                    // 1 = allow scripts + same-origin
                    // 2 = strict sandbox
                    if (!sandbox) {
                        element.content.sandboxChoice = 0;
                    } else if (sandbox.includes("allow-scripts")) {
                        element.content.sandboxChoice = 1;
                    } else {
                        element.content.sandboxChoice = 2;
                    }

                    element.content.allowFullScreen = allowfullscreen ? true : false;

                    // Permissions list → split into array
                    if (allow) {
                        element.content.permission = allow
                            .split(";")
                            .map(p => p.trim())
                            .filter(p => p.length > 0);
                    } else {
                        element.content.permission = [];
                    }

                    // embedAsHTML always false on init
                    element.content.embedAsHTML = false;
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    const iframe = documentHTML.createElement("iframe");
                    iframe.className = `${BUILDER_CONFIG.classPrefix}context-iframe`;

                    const c = dataArray.content;

                    const safeURL = encodeURI(c.source);

                    // Sandbox handling
                    if (c.sandboxChoice === 1) {
                        iframe.sandbox = "allow-scripts";
                    } else if (c.sandboxChoice === 2) {
                        iframe.sandbox = "";
                    }

                    // Allow fullscreen
                    if (c.allowFullScreen) {
                        iframe.allowFullscreen = true;
                    }

                    // Permissions
                    if (Array.isArray(c.permission) && c.permission.length > 0) {
                        iframe.allow = c.permission.join("; ");
                    }

                    // HTML embed mode
                    if (c.embedAsHTML === true) {
                        const src = c.source;

                        if (typeof src !== "string") return;
                        if (/^https?:\/\//i.test(src.trim())) return;
                        if (/^javascript:/i.test(src.trim())) return;
                        if (!/<[^>]+>/.test(src)) return;

                        iframe.srcdoc = "";
                        iframe.addEventListener("load", () => {
                            const doc = iframe.contentDocument;
                            if (doc) {
                                doc.open();
                                doc.write(src);
                                doc.close();
                            }
                        });
                    } else {
                        // Normal iframe mode
                        iframe.src = safeURL;
                    }

                    node.innerHTML = "";
                    node.appendChild(iframe);
                },

                cssStyles: [
                    {
                        object: "@root",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "100%" },
                            { key: "padding", value: "0" },
                            { key: "display", value: "block" },
                            { key: "border", value: "none" }
                        ]
                    }
                ],  

                jsRuntime: {},

                settings: {}
            },

            gDocs: {
                name: "Google Docs Native Embeds",
                className: "gDocs",

                alts: ["google docs", "gdocs", "docs embed", "google document"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 47 65"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <!-- Generator: Sketch 54.1 (76490) - https://sketchapp.com -->
                        <title>Docs-icon</title>
                        <desc>Created with Sketch.</desc>
                        <defs>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-1"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-3"></path>
                            <linearGradient x1="50.0053945%" y1="8.58610612%" x2="50.0053945%" y2="100.013939%" id="linearGradient-5">
                                <stop stop-color="#1A237E" stop-opacity="0.2" offset="0%"></stop>
                                <stop stop-color="#1A237E" stop-opacity="0.02" offset="100%"></stop>
                            </linearGradient>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-6"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-8"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-10"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-12"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-14"></path>
                            <radialGradient cx="3.16804688%" cy="2.71744318%" fx="3.16804688%" fy="2.71744318%" r="161.248516%" gradientTransform="translate(0.031680,0.027174),scale(1.000000,0.723077),translate(-0.031680,-0.027174)" id="radialGradient-16">
                                <stop stop-color="#FFFFFF" stop-opacity="0.1" offset="0%"></stop>
                                <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"></stop>
                            </radialGradient>
                        </defs>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Consumer-Apps-Docs-Large-VD-R8" transform="translate(-451.000000, -463.000000)">
                                <g id="Hero" transform="translate(0.000000, 63.000000)">
                                    <g id="Personal" transform="translate(277.000000, 309.000000)">
                                        <g id="Docs-icon" transform="translate(174.000000, 91.000000)">
                                            <g id="Group">
                                                <g id="Clipped">
                                                    <mask id="mask-2" fill="white">
                                                        <use xlink:href="#path-1"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L36.71875,10.3409091 L29.375,0 Z" id="Path" fill="#4285F4" fill-rule="nonzero" mask="url(#mask-2)"></path>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-4" fill="white">
                                                        <use xlink:href="#path-3"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <polygon id="Path" fill="url(#linearGradient-5)" fill-rule="nonzero" mask="url(#mask-4)" points="30.6638281 16.4309659 47 32.8582386 47 17.7272727"></polygon>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-7" fill="white">
                                                        <use xlink:href="#path-6"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M11.75,47.2727273 L35.25,47.2727273 L35.25,44.3181818 L11.75,44.3181818 L11.75,47.2727273 Z M11.75,53.1818182 L29.375,53.1818182 L29.375,50.2272727 L11.75,50.2272727 L11.75,53.1818182 Z M11.75,32.5 L11.75,35.4545455 L35.25,35.4545455 L35.25,32.5 L11.75,32.5 Z M11.75,41.3636364 L35.25,41.3636364 L35.25,38.4090909 L11.75,38.4090909 L11.75,41.3636364 Z" id="Shape" fill="#F1F1F1" fill-rule="nonzero" mask="url(#mask-7)"></path>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-9" fill="white">
                                                        <use xlink:href="#path-8"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <g id="Group" mask="url(#mask-9)">
                                                        <g transform="translate(26.437500, -2.954545)">
                                                            <path d="M2.9375,2.95454545 L2.9375,16.25 C2.9375,18.6985795 4.90929688,20.6818182 7.34375,20.6818182 L20.5625,20.6818182 L2.9375,2.95454545 Z" id="Path" fill="#A1C2FA" fill-rule="nonzero"></path>
                                                        </g>
                                                    </g>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-11" fill="white">
                                                        <use xlink:href="#path-10"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,4.80113636 C0,2.36363636 1.9828125,0.369318182 4.40625,0.369318182 L29.375,0.369318182 L29.375,0 L4.40625,0 Z" id="Path" fill-opacity="0.2" fill="#FFFFFF" fill-rule="nonzero" mask="url(#mask-11)"></path>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-13" fill="white">
                                                        <use xlink:href="#path-12"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M42.59375,64.6306818 L4.40625,64.6306818 C1.9828125,64.6306818 0,62.6363636 0,60.1988636 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,60.1988636 C47,62.6363636 45.0171875,64.6306818 42.59375,64.6306818 Z" id="Path" fill-opacity="0.2" fill="#1A237E" fill-rule="nonzero" mask="url(#mask-13)"></path>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-15" fill="white">
                                                        <use xlink:href="#path-14"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M33.78125,17.7272727 C31.3467969,17.7272727 29.375,15.7440341 29.375,13.2954545 L29.375,13.6647727 C29.375,16.1133523 31.3467969,18.0965909 33.78125,18.0965909 L47,18.0965909 L47,17.7272727 L33.78125,17.7272727 Z" id="Path" fill-opacity="0.1" fill="#1A237E" fill-rule="nonzero" mask="url(#mask-15)"></path>
                                                </g>
                                            </g>
                                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="Path" fill="url(#radialGradient-16)" fill-rule="nonzero"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "gDocsID",
                        label: "Google docs URL",
                        type: "string/text"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "text",
                        label: "Google Docs Public URL",
                        type: "string/text"
                    }
                ],

                initFunction: function(dataArray, element) {
                    const raw = dataArray.text || "";

                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    let docId = "";

                    // ---------------------------------------------------------
                    // 1. If user pasted an <iframe>, extract src="..."
                    // ---------------------------------------------------------
                    const iframeMatch = raw.match(/<iframe[\s\S]*?src=["']([^"']+)["'][\s\S]*?>/i);
                    let url = "";

                    if (iframeMatch) {
                        url = iframeMatch[1];
                    } else {
                        url = raw.trim();
                    }

                    // ---------------------------------------------------------
                    // 2. Extract Google Docs ID from URL
                    // ---------------------------------------------------------
                    try {
                        const u = new URL(url);

                        // Expected formats:
                        // https://docs.google.com/document/d/e/<ID>/pub
                        // https://docs.google.com/document/d/e/<ID>/pub?embedded=true
                        const parts = u.pathname.split("/").filter(Boolean);

                        // Find the "d/e/<ID>" pattern
                        const idx = parts.indexOf("e");
                        if (idx !== -1 && parts[idx + 1]) {
                            docId = parts[idx + 1];
                        }
                    } catch (e) {
                        docId = "";
                    }

                    element.content.gDocsID = docId;
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    const el = documentHTML.createElement("div");
                    el.className = `${BUILDER_CONFIG.classPrefix}context-gdocs`;

                    el.setAttribute(`data-${BUILDER_CONFIG.classPrefix}gdocid`, dataArray.content.gDocsID);

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

                jsRuntime: {
                    forEach: function(BUILDER_CONFIG) {
                        return `
                            const docId = element.getAttribute(\`data-${BUILDER_CONFIG.classPrefix}gdocid\`);
                            const url = \`https://docs.google.com/document/d/e/\${docId}/pub?embedded=true\`;

                            const raw = await fetch(url).then(r => r.text());
                            const parsed = new DOMParser().parseFromString(raw, "text/html");

                            parsed.querySelectorAll("style, link[rel='stylesheet']").forEach(el => el.remove());
                            const container = parsed.querySelector(".doc-content") || parsed.body;

                            element.innerHTML = container.innerHTML;
                        `;
                    }
                },

                cssStyles: [
                    {
                        object: "@root",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "display", value: "block" },
                            { key: "font-family", value: "inherit" },
                            { key: "color", value: "inherit" }
                        ]
                    },
                    {
                        object: "@root-noscript",
                        info: [
                            { key: "display", value: "block" }
                        ]
                    },
                    {
                        object: "@root-iframe",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "border", value: "none" },
                            { key: "display", value: "block" }
                        ]
                    }
                ],

                settings: {}
            },

            ytLive: {
                name: "YouTube Live Connector",
                className: "ytLive",

                alts: ["youtube live", "yt live", "live connector", "youtube stream"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <circle cx="480" cy="-480" r="120" fill="#f44336"></circle>
                        <path fill="#f44336" d="M350 -580 L300 -630 C240 -570 200 -480 200 -380 s40 190 100 250 l50 -50 c-40 -40 -60 -100 -60 -160 s20 -120 60 -160z"></path>
                        <path fill="#f44336" d="M610 -580 l50 -50 c60 60 100 150 100 250 s-40 190 -100 250 l-50 -50 c40 -40 60 -100 60 -160 s-20 -120 -60 -160z"></path>
                        <path fill="#f44336" d="M280 -700 l-60 -60 C120 -640 60 -520 60 -380 s60 260 160 340 l60 -60 c-80 -80 -120 -180 -120 -280 s40 -200 120 -280z"></path>
                        <path fill="#f44336" d="M680 -700 l60 -60 c100 80 160 200 160 340 s-60 260 -160 340 l-60 -60 c80 -80 120 -180 120 -280 s-40 -200 -120 -280z"></path>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "channelID",
                        label: "YouTube channel ID",
                        type: "string/text"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "channelID",
                        label: "Please paste your YouTube channel ID (you can find yours on https://www.youtube.com/account_advanced)",
                        type: "string/text"
                    }
                ],

                initFunction: function(dataArray, element) {
                    element.content.channelID = dataArray.channelID || "";
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    // Add data attribute
                    node.setAttribute("data-cw-ytchannelid", dataArray.content.channelID);

                    // Clear existing content
                    node.innerHTML = "";

                    // <noscript> block
                    const noscript = documentHTML.createElement("noscript");

                    // "We find your JavaScript is disabled, please "
                    noscript.appendChild(documentHTML.createTextNode("We find your JavaScript is disabled, please "));

                    // <a> Turn on JS
                    const turnOn = documentHTML.createElement("a");
                    turnOn.href = "https://turnonjs.com";
                    turnOn.target = "_blank";
                    turnOn.textContent = "Turn on JS";
                    noscript.appendChild(turnOn);

                    // " or visit the channel: "
                    noscript.appendChild(documentHTML.createTextNode(" or visit the channel: "));

                    // <a> YouTube channel link
                    const ytLink = documentHTML.createElement("a");
                    ytLink.href = `https://youtube.com/channel/${dataArray.content.channelID}`;
                    ytLink.target = "_blank";
                    ytLink.textContent = "YouTube";
                    noscript.appendChild(ytLink);

                    // Append <noscript> directly to node
                    node.appendChild(noscript);

                },

                jsRuntime: {
                    sourceRequirement: [
                        {
                            source: 1,
                            script: "https://www.youtube.com/iframe_api",
                            defer: false,
                            integrity: "none",
                            ESM: false
                        }
                    ],

                    forEach: function(BUILDER_CONFIG) {
                        return `
                            const channelId = el.getAttribute(\`data-\${BUILDER_CONFIG.classPrefix}ytchannelid\`);

                            el.innerHTML = "";
                            const overlay = document.createElement("div");
                            overlay.className = \`\${BUILDER_CONFIG.classPrefix}context-ytLive-preparing\`;
                            overlay.textContent = "Preparing, Please Wait.....";
                            el.appendChild(overlay);

                            const iframe = document.createElement("iframe");
                            iframe.src = \`https://www.youtube.com/embed/live_stream?channel=\${channelId}&autoplay=1&mute=1&enablejsapi=1\`;
                            iframe.allow = "autoplay; encrypted-media";
                            iframe.allowFullscreen = true;
                            el.appendChild(iframe);

                            const poll = setInterval(() => {
                            if (window.YT && window.YT.Player) {
                                clearInterval(poll);

                                const thisPlayer = new YT.Player(iframe, {
                                events: {
                                    onReady: () => {
                                    if (overlay) overlay.remove();
                                    },

                                    onError: function(event) {
                                    if (event.data === 100 || event.data === 150) {
                                        const playlistId = "UU" + channelId.substring(2);

                                        const playlistIframe = document.createElement("iframe");
                                        playlistIframe.src = \`https://www.youtube.com/embed/videoseries?list=\${playlistId}&autoplay=0\`;
                                        playlistIframe.allow = "autoplay; encrypted-media";
                                        playlistIframe.allowFullscreen = true;
                                        playlistIframe.className = \`\${BUILDER_CONFIG.classPrefix}offline\`;

                                        thisPlayer.destroy();
                                        el.innerHTML = "";
                                        el.appendChild(playlistIframe);
                                    }
                                    }
                                }
                                });
                            }
                            }, 120);
                        `;
                    }
                },

                cssStyles: [
                    {
                        object: "@root-preparing",
                        info: [
                            { key: "position", value: "absolute" },
                            { key: "inset", value: "0" },
                            { key: "display", value: "flex" },
                            { key: "align-items", value: "center" },
                            { key: "justify-content", value: "center" },
                            { key: "background", value: "#222" },
                            { key: "color", value: "#EEE" },
                            { key: "font-size", value: "1.2rem" },
                            { key: "z-index", value: "10" },
                            { key: "pointer-events", value: "none" }
                        ]
                    },
                    {
                        object: "iframe",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "aspect-ratio", value: "16 / 9" },
                            { key: "border", value: "0" }
                        ]
                    }
                ],

                settings: {}
            },

            html: {
                name: "HTML",
                className: "html",

                alts: ["html", "raw html", "custom html", "embed html"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M228-300 48-480l180-180 51 51-129 129 129 129-51 51Zm196 119-69-22 180-576 69 22-180 576Zm308-119-51-51 129-129-129-129 51-51 180 180-180 180Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "html",
                        label: "HTML Code Snap",
                        type: "string/textbox"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "html",
                        label: "HTML Code Snap Here",
                        type: "string/textbox"
                    }
                ],

                initFunction: function(dataArray, element) {
                    element.content.html = dataArray.html || "";
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    node.innerHTML = dataArray.content.html;
                },

                jsRuntime: "",

                cssStyles: [],

                settings: {}
            }
        },

        setting: {
            systemClass: true,
            allowedSortIn: false,
            allowedSortTo: ["container", "@root/section", "@root/CTA", "@root/Footer"]
        }
    },

    container: {
        sizeQuery: [
            {
                name: "along",
                label: "{Width/Height}",
                type: "space"
            },
            {
                name: "overflowAlong",
                label: "{Width/Hwight} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "alongGrow",
                label: "{Width/Hwight} Growth Amount",
                type: "number"
            },
            {
                name: "alongShrink",
                label: "Shrink?",
                type: "selection",
                choice: [
                    { label: "No shrink", value: 0 },
                    { label: "Shrink", value: 1 }
                ]
            },

            {
                name: "across",
                label: "{Height/Width}",
                type: "space"
            },
            {
                name: "overflowAcross",
                label: "{Height/Width} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "acrossAlign",
                label: "{Height/Width} Alignment",
                type: "selection",
                choice: [
                    { label: "Default", value: 0 },
                    { label: "Start", value: 1 },
                    { label: "Center", value: 2 },
                    { label: "End", value: 3 },
                    { label: "Stretch", value: 4 },
                    { label: "Baseline", value: 5 }
                ]
            },

            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space"
            }
        ],

		sizeDefault: (sz, isVertical) => {
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
        
		sizeMobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
			}
		},

        elements: {
            div: {
                name: "Standard Container",
                className: "div",

                alts: ["div", "container", "wrapper", "layout container"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M96-191v-240h336v240H96Zm0-337v-240h336v240H96Zm72-72h192v-96H168v96Zm505 411L481-381l51-51 105 105v-441h72v441l106-105 50 51-192 192Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "@global",
                        label: "Elements",
                        type: "interactiveElements"
                    }
                ],

                layoutQuery: [
                    {
                        name: "direction",
                        label: "Direction",
                        type: "selection",
                        choice: [
                            { label: "Left → Right", value: 1 },
                            { label: "Top → Bottom", value: 2 },
                            { label: "Right → Left", value: 3 },
                            { label: "Bottom → Top", value: 4 }
                        ],
                        default: 1
                    },
                    {
                        name: "wrap",
                        label: "Wrap Permission",
                        type: "selection",
                        choice: [
                            { label: "No wrap", value: 1 },
                            { label: "Wrap", value: 2 },
                            { label: "Wrap reverse", value: 3 }
                        ],
                        default: 1
                    },
                    {
                        name: "spaceAlong",
                        label: "{Width/Hwight} Space Distribuation",
                        type: "selection",
                        choice: [
                            { label: "Start", value: 1 },
                            { label: "Center", value: 2 },
                            { label: "End", value: 3 },
                            { label: "Space Around", value: 4 },
                            { label: "Space Between", value: 5 },
                            { label: "Space Evenly", value: 6 }
                        ],
                        default: 1
                    },
                    {
                        name: "spaceAcross",
                        label: "{Height/Width} Space Distribuation",
                        type: "selection",
                        choice: [
                            { label: "Start", value: 1 },
                            { label: "Center", value: 2 },
                            { label: "End", value: 3 },
                            { label: "Stretch", value: 4 },
                            { label: "Baseline", value: 5 }
                        ],
                        default: 1
                    },
                    {
                        name: "spaceAcrossMutiple",
                        label: "When Wrap Happend, Align {Height/Width} with",
                        type: "selection",
                        choice: [
                            { label: "Start", value: 1 },
                            { label: "Center", value: 2 },
                            { label: "End", value: 3 },
                            { label: "Stretch", value: 4 },
                            { label: "Baseline", value: 5 },
                            { label: "Evenly", value: 6 }
                        ],
                        default: 1
                    },
                    {
                        name: "gapX",
                        label: "Gap on Horizontal",
                        type: "space"
                    },
                    {
                        name: "gapY",
                        label: "Gap on Vertical",
                        type: "space"
                    },
                    {
                        name: "stackAtMobile",
                        label: "Stack when at Mobile?",
                        type: "boolean/checkmark",
                        default: false
                    },
                    {
                        name: "mobileReverseDirection",
                        label: "Reverse Direction on Mobile?",
                        type: "boolean/checkmark",
                        default: false
                    },
                    {
                        name: "mobileGap",
                        label: "Gap on Mobile",
                        type: "space"
                    }
                ],

                initQuery: [],

                initFunction: null,

                contextFunction: function(dataArray, documentHTML, node) {
                    const layout = dataArray.layout || {};
                    const content = dataArray.content;

                    const directions = ['row', 'column', 'row-reverse', 'column-reverse'];
                    const wraps = ['nowrap', 'wrap', 'wrap-reverse'];
                    const justifyMap = ['flex-start', 'center', 'flex-end', 'space-around', 'space-between', 'space-evenly'];
                    const alignMap = ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'];

                    const dirIndex = (layout.direction || 1) - 1;
                    const desktopDirection = directions[dirIndex] || 'row';
                    const isVertical = desktopDirection.includes('column');

                    const desktopCss = `
                        display: flex;
                        flex-direction: ${desktopDirection};
                        flex-wrap: ${wraps[(layout.wrap || 1) - 1] || 'nowrap'};
                        justify-content: ${justifyMap[(layout.spaceAlong || 1) - 1] || 'flex-start'};
                        align-items: ${alignMap[(layout.spaceAcross || 1) - 1] || 'flex-start'};
                        ${layout.gapX ? `column-gap: ${flexEngineStyleVarible.space(layout.gapX)};` : ''}
                        ${layout.gapY ? `row-gap: ${flexEngineStyleVarible.space(layout.gapY)};` : ''}
                    `.trim();

                    let mobileCSS = "";
                    if (layout.stackAtMobile || layout.mobileReverseDirection || layout.mobileGap) {
                        let mobileDir = desktopDirection;

                        if (layout.stackAtMobile) {
                            mobileDir = layout.mobileReverseDirection ? 'column-reverse' : 'column';
                        } else if (layout.mobileReverseDirection) {
                            mobileDir = desktopDirection.includes('-reverse')
                                ? desktopDirection.replace('-reverse', '')
                                : desktopDirection + '-reverse';
                        }

                        const mGap = flexEngineStyleVarible.space(layout.mobileGap);

                        mobileCSS = `
                            flex-direction: ${mobileDir} !important;
                            gap: ${mGap} !important;
                        `.trim();

                        if (layout.stackAtMobile) {
                            mobileCSS += `
                                justify-content: center;
                                align-items: center;
                            `;
                        }
                    }

                    const prefix = BUILDER_CONFIG.classPrefix + "styles-node";
                    node.setAttribute(prefix, desktopCss.trim());
                    node.setAttribute(prefix + "-onMobile", mobileCSS.trim());

                    if (Array.isArray(content)) {
                        content.forEach(childData => {
                            if (childData) {
                                const childNode = flexEngineCreateEndNode(childData, documentHTML, isVertical);
                                if (childNode) node.appendChild(childNode);
                            }
                        });
                    }
                },

                jsRuntime: {},

                cssStyles: [],

                settings: {
                    sortablePart: "@root"
                }
            }     
        },

        setting: {
            systemClass: true,
            allowedSortIn: true,
            allowedSortTo: ["root/section", "@root/CTA", "@root/Footer"],
        }
    },

    /* System wide class: Root cannot be used, and it sort differently */
    root: {

    }
};

/**
 * How we check the Element? and element should be named like {catergory}/{name}, like basic/image
 * Set @global direct mean that's the only 1, and that will make only 1 can accapt this.
 * 
 * 
 * interactiveTextBox: a textbox just show it.
 * interactiveElements: a interactive elements.
 * boolean/checkmark: a true/false question (DONE)
 * media/img: a source file from image. 
 * media/audio: a source file from audio.
 * media/video: a source file from video.
 * string/textbox: just ask a longstring.
 * string/text: ask for a short thing. (DONE)
 * (not using) string/rich: a rich text box!
 * string/url: ask for a URL.
 * integer: appear a bar with the thing. or simply a number question for things. (DONE)
 * integer/noNeg: appear a bar with the thing. or simply a number question for things. (DONE)
 * (not using) interger/bound: that's for bounds have minimum and maximum.
 * selection: how they want the option and the value of that option, there will have choice.
 * selection/popup: ask that like a popup to adjust mutiple choice setting.
 * space: it ask a space query
 * 
 * one note: 
 * {Width/Hwight} when is along, {Height/Width} when is across
 * 
 * and also when it's unaliable shown, there will set something.
 * default is what you can fill before, default is blank or true.
 * 
 * 
 */