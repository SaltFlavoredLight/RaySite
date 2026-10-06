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
                description: "Sets the logo type.",
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
                description: "Sets the text used for the logo.",
                type: "string/text",
                visibleIf: {
                    name: "logo.type",
                    value: "text"
                }
            },
            {
                name: "logo.image",
                label: "Logo IMG",
                description: "Sets the image used for the logo.",
                type: "media/img",
                visibleIf: {
                    name: "logo.type",
                    value: "image"
                }
            },


            {
                name: "nav",
                label: "Navigation",
                description: "Sets the navigation menu items.",
                type: "list/nested"
            },


            {
                name: "primaryButton.enable",
                label: "Primary Clickable",
                description: "Enables the primary button.",
                type: "boolean/checkmark"
            },
            {
                name: "primaryButton.text",
                label: "Primary Text",
                description: "Sets the primary button text.",
                type: "string/text",
                visibleIf: {
                    name: "primaryButton.enable",
                    value: true
                }
            },
            {
                name: "primaryButton.url",
                label: "Primary URL",
                description: "Sets the link URL for the primary button.",
                type: "string/text",
                visibleIf: {
                    name: "primaryButton.enable",
                    value: true
                }
            },
            {
                name: "primaryButton.newPage",
                label: "Primary Open in New Page",
                description: "Opens the primary button link in a new page.",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "primaryButton.enable",
                    value: true
                }
            },
           
            {
                name: "secondaryButton.enable",
                label: "Secondary Clickable",
                description: "Enables the secondary button after the primary button is enabled.",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "primaryButton.enable",
                    value: true
                }
            },
            {
                name: "secondaryButton.text",
                label: "Secondary Text",
                description: "Sets the secondary button text.",
                type: "string/text",
                visibleIf: {
                    name: "secondaryButton.enable",
                    value: true
                }
            },
            {
                name: "secondaryButton.url",
                label: "Secondary URL",
                description: "Sets the link URL for the secondary button.",
                type: "string/text",
                visibleIf: {
                    name: "secondaryButton.enable",
                    value: true
                }
            },
            {
                name: "secondaryButton.newPage",
                label: "Secondary Open in New Page",
                description: "Opens the secondary button link in a new page.",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "secondaryButton.enable",
                    value: true
                }
            }
        ],                


        layoutQuery: [
            {
                name: "desktopPosition",
                label: "Desktop Position",
                description: "Sets the positions of the Logo, Navs, and CTA.",
                type: "selection",
                choice: [
                    {
                        name: "Nav Center · Logo Left · CTA Right",
                        value: 1
                    },
                    {
                        name: "Nav Left · Logo Left · CTA Center",
                        value: 2
                    },
                    {
                        name: "Nav Left · Logo Left · CTA Right",
                        value: 3
                    },
                    {
                        name: "Nav Left · Logo Center · CTA Right",
                        value: 4
                    },
                    {
                        name: "Nav Right · Logo Left · CTA Center",
                        value: 5
                    },
                    {
                        name: "Nav Right · Logo Left · CTA Right",
                        value: 6
                    },
                    {
                        name: "Nav Right · Logo Center · CTA Right",
                        value: 7
                    }
                ]
            },


            {
                name: "mobileMenuPlace",
                label: "Menu Place",
                description: "Sets the mobile menu position.",
                type: "selection",
                choice: [
                    {
                        name: "Left",
                        value: "left"
                    },
                    {
                        name: "Right",
                        value: "right"
                    }
                ]
            },


            {
                name: "desktopHeaderMaxInnerWidth",
                label: "Max Inner Width",
                description: "Sets the maximum inner width of the header on the desktop version.",
                type: "space"
            },


            {
                name: "desktopHeaderMainGap",
                label: "Desktop Main Gap",
                description: "Sets the main gap within the desktop header.",
                type: "space"
            },
            {
                name: "mobileHeaderMainGap",
                label: "Mobile Main Gap",
                description: "Sets the main gap within the mobile header.",
                type: "space"
            },


            {
                name: "desktopHeaderSeparateBorderSpace",
                label: "Separate Border Space",
                description: "Sets the separate border spacing of the desktop header.",
                type: "space"
            },




            {
                name: "desktopMenuMode",
                label: "Desktop Menu Mode",
                description: "Controls the menu opening mode on the desktop version. 0 means None (on top), while 1-6 select Left Slide, Left Clip, Right Slide, Right Clip, Top Slide, or Top Clip.",
                type: "selection",
                choice: [
                    {
                        name: "None (on top)",
                        value: 0
                    },
                    {
                        name: "Left Slide",
                        value: 1
                    },
                    {
                        name: "Left Clip",
                        value: 2
                    },
                    {
                        name: "Right Slide",
                        value: 3
                    },
                    {
                        name: "Right Clip",
                        value: 4
                    },
                    {
                        name: "Top Slide",
                        value: 5
                    },
                    {
                        name: "Top Clip",
                        value: 6
                    }
                ]
            },


            {
                name: "desktopCoverHeaderOnMenu",
                label: "Desktop Cover Header On Menu",
                description: "Controls whether the desktop menu covers the desktop header when the menu opens. Mode 0 does nothing, while modes 1-6 cause the menu to cover the header.",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "desktopMenuMode",
                    value: (input) => input !== 0
                }
            },


            {
                name: "mobileCoverHeaderOnMenu",
                label: "Mobile Cover Header On Menu",
                description: "Controls whether the mobile menu covers the mobile header when the menu opens. Menu modes 1-6 cause the menu to cover the header.",
                type: "boolean/checkmark"
            },


            {
                name: "spaceBetween",
                label: "Space Between",
                description: "Sets the space between the list and its item. When the menu mode is 0, this is the gap between the list and item. For menu modes 1-6, this setting has no effect. The same setting controls both desktop and mobile.",
                type: "space",
                visibleIf: {
                    name: "desktopMenuMode",
                    value: 0
                }
            },


            {
                name: "navMajorGap",
                label: "Nav Major Gap",
                description: "Sets the major navigation gap. In mode 0, it is the gap between navs. In modes 1-4, it is the vertical gap between navs. Modes 5-6 follow the same behavior as modes 1-4.",
                type: "space"
            },


            {
                name: "navMinorGap",
                label: "Nav Minor Gap",
                description: "Sets the minor navigation gap. In mode 0, it is the gap for the list. In modes 1-4, it is the gap between list items. Modes 5-6 use the same behavior and can additionally represent horizontal spacing.",
                type: "space"
            },


            {
                name: "nestingSupport",
                label: "Nesting Support",
                description: "Controls how nested menu items behave. 0 means None, 1 means Expand, 2 means Clickable Menu, and 3 means Non-Clickable Menu. In menu modes 1-4, these provide the traditional nesting choices. In modes 5-6, only value 0 is supported.",
                type: "selection",
                choice: [
                    {
                        name: "None",
                        value: 0
                    },
                    {
                        name: "Expand",
                        value: 1
                    },
                    {
                        name: "Clickable Menu",
                        value: 2
                    },/*
                    {
                        name: "Non-Clickable Menu",
                        value: 3
                    }*/
                ],
                comment: "even desktop do not apply, moblie does."
            },


            {
                name: "transitionTime",
                label: "Transition Time",
                description: "Sets the transition time used by the menu on both desktop and mobile.",
                type: "integer"
            },


            {
                name: "transitionCurve",
                label: "Transition Curve",
                description: "Sets the transition curve used by the menu on both desktop and mobile. Inherit uses the theme's transition curve.",
                type: "curve",
            },


            {
                name: "mobileMenuMode",
                label: "Mobile Menu Mode",
                description: "Controls the menu opening animation on the mobile version. 1-6 select Left Slide, Left Clip, Right Slide, Right Clip, Top Slide, or Top Clip.",
                type: "selection",
                choice: [
                    {
                        name: "Left Slide",
                        value: 1
                    },
                    {
                        name: "Left Clip",
                        value: 2
                    },
                    {
                        name: "Right Slide",
                        value: 3
                    },
                    {
                        name: "Right Clip",
                        value: 4
                    },
                    {
                        name: "Top Slide",
                        value: 5
                    },
                    {
                        name: "Top Clip",
                        value: 6
                    }
                ]
            },


            {
                name: "mobileCtaType",
                label: "Mobile CTA Type",
                description: "Controls the CTA button type on the mobile version. 0 means Call to Action on Standard Button, 1 means Call to Action on Full Stick, and 2 means Call to Action on Full Row.",
                type: "selection",
                choice: [
                    {
                        name: "Call to Action on Standard Button",
                        value: 0
                    },
                    {
                        name: "Call to Action on Full Stick",
                        value: 1
                    },
                    {
                        name: "Call to Action on Full Row",
                        value: 2
                    }
                ]
            },


            // position!
            {
                name: "mobileLogoPosition",
                label: "Logo Position",
                description: "Sets the mobile logo position.",
                type: "selection",
                choice: [
                    {
                        name: "Left",
                        value: "left"
                    },
                    {
                        name: "Center",
                        value: "center"
                    }
                ]
            },


            {
                name: "hamAnimation",
                label: "Menu Hamberger Animation",
                description: "this will determine what your animation to grow",
                type: "selection",
                choice: [
                    {
                        name: "Animation 1",
                        value: 1
                    },
                    {
                        name: "Animation 2",
                        value: 2
                    },
                    {
                        name: "Animation 3",
                        value: 3
                    }
                ]
            },


            {
                name: "hamAnimationOnDesktop",
                label: "Also enable Animation on desktop",
                description: "Check if you wish desktop animation is also can be enabled.",
                type: "boolean/checkmark",
                visibleIf: {
                    name: "desktopMenuMode",
                    value: (input) => input !== 0
                }
            },


            {
                name: "mobileButonRound",
                label: "Brder of Moblie Button",
                type: "space/space",
                visibleIf: {
                    name: "mobileCtaType",
                    value: (input) => input !== 0
                }
            },




            {
                name: "textAlignInMenu",
                label: "Text Align",
                type: "selection",
                choice: [
                    {
                        name: "Left",
                        value: "left"
                    },
                    {
                        name: "Center",
                        value: "center"
                    },
                    {
                        name: "Right",
                        value: "right"
                    }
                ]


            },


            {
                name: "stickyToBottom",
                label: "Menu Sticky to bottom",
                type: "boolean/checkmark"
            },
           
        ],


        initQuery: [],
        initFunction: function(dataArray, element) {
            debugger; // in future we will add some default views
        },




        contentFunction: function(dataArray, documentHTML, node, createAnotherNode) {
        },


        jsRuntime: {},


        cssStyles: [],




        extras: [
            {
                position: "@context-primaryCTA",
                sizeQuery: [{
                    name: "minWidth",
                    label: "Min Width",
                    description: "Sets the minimum width.",
                    type: "space"
                },
                {
                    name: "fullHeight",
                    label: "Full Height",
                    description: "Makes the element use full height.",
                    type: "boolean/checkmark"
                }],
                sizeDefault: (sz, isVertical) => {
                    return {
                        "min-width": flexEngineStyleVarible.space(sz.minWidth),
                        "height": sz.fullHeight ? "100%" : "auto"
                    };
                },
                sizeMobile: (sz, isVertical) => {return {}}
            },


            {
                position: "@context-secondaryCTA",
                sizeQuery: [{
                    name: "minWidth",
                    label: "Min Width",
                    description: "Sets the minimum width.",
                    type: "space"
                },
                {
                    name: "fullHeight",
                    label: "Full Height",
                    description: "Makes the element use full height.",
                    type: "boolean/checkmark"
                }],
                sizeDefault: (sz, isVertical) => {
                    return {
                        "min-width": flexEngineStyleVarible.space(sz.minWidth),
                        "height": sz.fullHeight ? "100%" : "auto"
                    };
                },
                sizeMobile: (sz, isVertical) => {return {}}
            },  
           
            {
                position: "@context-menustyleapply",
                sizeQuery: [{
                    name: "widthMode",
                    label: "Width",
                    description: "Sets how the width is determined.",
                    type: "selection",
                    choice: [
                        {
                            name: "Full Width",
                            value: "full"
                        },
                        {
                            name: "Minimum",
                            value: "minimum"
                        },
                        {
                            name: "Custom",
                            value: "custom"
                        }
                    ]
                },
                {
                    name: "width",
                    label: "Width Size",
                    description: "Sets the custom width.",
                    type: "space",
                    visibleIf: {
                        name: "widthMode",
                        value: "custom"
                    }
                }],
                sizeDefault: (sz, isVertical) => {
                    if (sz.widthMode === "full") {
                        return {
                            "width": "100%",
                            "max-width": "100%",
                            "overflow": "scroll"
                        };
                    }


                    if (sz.widthMode === "minimum") {
                        return {
                            "width": "auto",
                            "max-width": "100%",
                            "overflow": "scroll"
                        };
                    }


                    return {
                        "width": "auto",
                        "max-width": flexEngineStyleVarible.space(sz.width),
                        "overflow": "scroll"
                    };
                },
                sizeMobile: (sz, isVertical) => {return {}}
            }            
        ],




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
                name: "maxWidth",
                label: "Max Width",
                description: "Sets the maximum width.",
                type: "space"
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
                "max-width": flexEngineStyleVarible.space(sz.maxWidth),
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
            extraSystemState: "onTop",
            noDelete: true,
            hide: true,
            animation: 2,
            systemClass: true,
            allowedSortIn: true,
            disableAction: true
        }
    }

