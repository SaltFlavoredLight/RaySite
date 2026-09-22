const header = {
        name: "Header",
        className: "header",
        alts: [],
        icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M144-744v-72h672v72H144Zm600 72q33 0 52.5 19.5T816-600v384q0 33-19.5 52.5T744-144H216q-33 0-52.5-19.5T144-216v-384q0-33 19.5-52.5T216-672h528Zm0 72H216v384h528v-384Zm-528 0v384-384Z"/>
                    </svg>
                `,

        contentQuery: [
            {
                name: "logo.type",
                label: "Logo Type",
                type: "selection",
                choice: [
                    {
                        name: "Text",
                        value: "text"
                    },
                    {
                        name: "Image",
                        value: "image"
                    }
                ]
            },
            {
                name: "logo.text",
                label: "Logo Text",
                type: "string/text",
                visibleIf: {
                    name: "logo.type",
                    value: "text"
                }
            },
            {
                name: "logo.image",
                label: "Logo IMG",
                type: "media/img",
                visibleIf: {
                    name: "logo.type",
                    value: "image"
                }
            },


            {
                name: "nav",
                label: "Navigation",
                type: "list/nested"
            },

            {
                name: "button.enable",
                label: "Clickable",
                type: "boolean/checkmark"
            },
            {
                name: "button.text",
                label: "Text",
                type: "string/text",
                visibleIf: {
                    name: "button.enable",
                    value: true
                }        
            },    
            {
                name: "button.action.mode",
                label: "Action",
                type: "selection",
                choice: [
                    {
                        name: "Link",
                        value: "a"
                    },
                    {
                        name: "Download",
                        value: "download"
                    },
                    {
                        name: "Open Popup",
                        value: "openPopup"
                    },
                    {
                        name: "Run JavaScript",
                        value: "runJS"
                    }
                ],
                visibleIf: {
                    name: "button.enable",
                    value: true
                }
            },
            {
                name: "button.action.url",
                label: "URL",
                type: "string/text",
                visibleIf: {
                    name: "button.action.mode",
                    value: ["a", "download"]
                }
            },
            {
                name: "button.action.newPage",
                label: "Open in New Page",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "button.action.mode",
                    value: "a"
                }
            },
            {
                name: "button.action.forceDownload",
                label: "Force Download",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "button.action.mode",
                    value: "download"
                }
            },
            {
                name: "button.action.popupID",
                label: "Popup ID",
                type: "string/text",
                visibleIf: {
                    name: "button.action.mode",
                    value: "openPopup"
                }
            },
            {
                name: "button.action.JS",
                label: "JavaScript",
                type: "string/text",
                visibleIf: {
                    name: "button.action.mode",
                    value: "runJS"
                }
            }
        ],

        layoutQuery: [
            {
                name: "mainGap",
                label: "Main Gap",
                type: "space"
            },
            {
                name: "mobileMainGap",
                label: "Mobile Main Gap",
                type: "space"
            },


            {
                name: "navHorizontalGap",
                label: "Navigation Horizontal Gap",
                type: "space",
                visibleIf: {
                    name: "menuMode",
                    value: [0, 5, 6]
                }
            },
            {
                name: "navVerticalGap",
                label: "Navigation Vertical Gap",
                type: "space"
            },

            {
                name: "mobileNavGap",
                label: "Mobile Navigation Gap",
                type: "space"
            },


            {
                name: "menuMode",
                label: "Menu Mode",
                type: "selection",
                choice: [
                    {
                        name: "None",
                        value: 0
                    },
                    {
                        name: "Left Menu Slide",
                        value: 1
                    },
                    {
                        name: "Right Menu Slide",
                        value: 2
                    },
                    {
                        name: "Left Menu Cover",
                        value: 3
                    },
                    {
                        name: "Right Menu Cover",
                        value: 4
                    },
                    {
                        name: "Center Expend",
                        value: 5
                    },
                    {
                        name: "Center Cover",
                        value: 6
                    }
                ]
            },


            {
                name: "wrapPaddingVertical",
                label: "Wrap Padding Vertical",
                type: "space",
                visibleIf: {
                    name: "menuMode",
                    value: [1, 2, 3, 4, 5, 6]
                }
            },
            {
                name: "wrapPaddingHorizontal",
                label: "Wrap Padding Horizontal",
                type: "space",
                visibleIf: {
                    name: "menuMode",
                    value: [1, 2, 3, 4, 5, 6]
                }
            },
            {
                name: "mobileWrapPaddingVertical",
                label: "Mobile Wrap Padding Vertical",
                type: "space"
            },
            {
                name: "mobileWrapPaddingHorizontal",
                label: "Mobile Wrap Padding Horizontal",
                type: "space"
            },

            {
                name: "fullScreenMenu",
                label: "Full Screen Menu",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "menuMode",
                    value: [1, 2, 3, 4, 5, 6]
                }
            },

            {
                name: "MobileFullScreenMenu",
                label: "Full Screen Menu",
                type: "boolean/checkmark"
            },

            {
                name: "headerWidth",
                label: "Header Width",
                type: "space",
                visibleIf: {
                    name: "fullScreenMenu",
                    value: false
                }
            },

            {
                name: "textAlign",
                label: "Text Align",
                type: "selection",
                choice: [
                    {
                        name: "Left",
                        value: 1
                    },
                    {
                        name: "Center",
                        value: 2
                    },
                    {
                        name: "Right",
                        value: 3
                    }
                ]
            },

            {
                name: "listGap",
                label: "List Gap",
                type: "space"
            },

            {
                name: "collapseHeader",
                label: "Collapse Header",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "menuMode",
                    value: [1, 2, 3, 4]
                }
            },
            {
                name: "biggerFirstLevelHeaderText",
                label: "Show Bigger Text For First Level Header Text",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "menuMode",
                    value: [1, 2, 3, 4, 5, 6]
                }
            },

            {
                name: "maxInnerWidth",
                label: "Maximum Inner Width",
                type: "space",
                defaultAsFull: true
            }
        ],

        extraQuery: [],

        extraDefault: (sz, isVertical) => {},

        extraMobile: (sz, isVertical) => {},

        initQuery: [],
        initFunction: function(dataArray, element) {
            debugger; // in future we will add some default views
        },

        contentFunction: function(dataArray, documentHTML, node, createAnotherNode) {
        },

        jsRuntime: {},

        cssStyles: [],

        sizeQuery: [
            {
                name: "marginTop",
                label: "Margin Top",
                type: "space",
                defaultAsFull: false
            },
            {
                name: "marginLeft",
                label: "Margin Left",
                type: "space",
                defaultAsFull: false
            },
            {
                name: "marginRight",
                label: "Margin Right",
                type: "space",
                defaultAsFull: false
            },
            {
                name: "mobileMarginTop",
                label: "Mobile Margin Top",
                type: "space",
                defaultAsFull: false
            },
            {
                name: "mobileMarginLeft",
                label: "Mobile Margin Left",
                type: "space",
                defaultAsFull: false
            },
            {
                name: "mobileMarginRight",
                label: "Mobile Margin Right",
                type: "space",
                defaultAsFull: false
            },

            {
                name: "height",
                label: "Height",
                type: "space",
                default: "60px"
            },
            {
                name: "mobileHeight",
                label: "Mobile Height",
                type: "space",
                default: "60px"
            }
        ],

        sizeDefault: (sz, isVertical) => {
            return {
                "width": `calc(100% - ${flexEngineStyleVarible.space(sz.marginLeft)} - ${flexEngineStyleVarible.space(sz.marginRight)})`,
                "margin-top": flexEngineStyleVarible.space(sz.marginTop),
                "margin-left": flexEngineStyleVarible.space(sz.marginLeft),
                "margin-right": flexEngineStyleVarible.space(sz.marginRight),
                "height": flexEngineStyleVarible.space(sz.height)
            };
        },

        sizeMobile: (sz, isVertical) => {
            return {
                "width": `calc(100% - ${flexEngineStyleVarible.space(sz.mobileMarginLeft)} - ${flexEngineStyleVarible.space(sz.mobileMarginRight)})`,
                "margin-top": flexEngineStyleVarible.space(sz.mobileMarginTop),
                "margin-left": flexEngineStyleVarible.space(sz.mobileMarginLeft),
                "margin-right": flexEngineStyleVarible.space(sz.mobileMarginRight),
                "height": flexEngineStyleVarible.space(sz.mobileHeight)
            };
        },

        settings: {
            elementType: "header",
            noDelete: true,
            hide: true,
            animation: 2,
            systemClass: true,
            allowedSortIn: true,
            disableAction: true
        }
    }