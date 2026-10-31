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
                    value: [0, 5, 6]
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
                        name: "Clickable Menu (Mobile at Expand)",
                        value: 2
                    },
                    {
                        name: "Non-Clickable Menu (Mobile at Whole Expand)",
                        value: 3
                    },
                    {
                        name: "Whole Expend",
                        value: 4
                    }
                ],
                comment: "only apply in some.",
                visibleIf: {
                    name: "desktopMenuMode",
                    value: [1, 2, 3, 4],
                    otherwise: 0
                }
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
            // Do a setup
            const content = dataArray.content || {};
            const layout = dataArray.layout || {};
            const prefix = BUILDER_CONFIG.classPrefix;
            const header = node;
            // End Setup
            // Start Content Creation
            // Wrap
            const contentWrap = documentHTML.createElement(`div`);
            contentWrap.classList.add(`${prefix}content-header-wrap`);
            header.appendChild(contentWrap);
            // Hamburger
            const hamburger = documentHTML.createElement(`button`);
            hamburger.classList.add(`${prefix}content-header-hamberger`);
            hamburger.setAttribute(`aria-label`, `Open navigation menu`);
            hamburger.type = `button`;
            for (let i = 0; i < 3; i++) {
                const span = documentHTML.createElement(`span`);
                span.setAttribute(`aria-hidden`, `true`);
                hamburger.appendChild(span);
            }
            contentWrap.appendChild(hamburger);
            // Logo
            const logoWrap = documentHTML.createElement(`div`);
            logoWrap.classList.add(`${prefix}content-header-logo`);
            const logoLink = documentHTML.createElement(`a`);
            logoLink.classList.add(`logo`);
            logoLink.href = `/`;
            if (content[`logo.type`] === `text`) {
                const logoText = documentHTML.createElement(`h2`);
                if (content[`logo.text`] != null) {
                    logoText.innerText = content[`logo.text`] ?? "";
                }
                logoLink.appendChild(logoText);
            }
            if (content[`logo.type`] === `image`) {
                const logoImage = documentHTML.createElement(`img`);
                if (content[`logo.image`] != null) {
                    logoImage.src = content[`logo.image`];
                }
                logoLink.appendChild(logoImage);
            }
            logoWrap.appendChild(logoLink);
            contentWrap.appendChild(logoWrap);
            // Navigation
            const nav = documentHTML.createElement(`nav`);
            nav.classList.add(`${prefix}content-header-menu`);
            nav.setAttribute(`aria-label`, `Primary navigation`);
            // Close button
            const closeButton = documentHTML.createElement(`button`);
            closeButton.classList.add(`${prefix}content-header-closebutton`);
            closeButton.setAttribute(`aria-label`, `Close navigation menu`);
            closeButton.type = `button`;
            for (let i = 0; i < 3; i++) {
                const span = documentHTML.createElement(`span`);
                span.setAttribute(`aria-hidden`, `true`);
                closeButton.appendChild(span);
            }
            nav.appendChild(closeButton);
            // Navigation list
            const navList = documentHTML.createElement(`ul`);
            const navItems = Array.isArray(content.nav) ? content.nav : [];
            navItems.forEach(navData => {
                const navItem = documentHTML.createElement(`li`);
                navItem.classList.add(`${prefix}content-header-navpage`);
                const navLink = documentHTML.createElement(navData.url ? `a` : `span`);
                navLink.textContent = navData.name ?? ``;
                if (navData.url) {
                    navLink.href = navData.url;
                } else {
                    navLink.setAttribute('role', 'button');
                    navLink.setAttribute('tabindex', '0');
                }
                navItem.appendChild(navLink);
                // Submenu
                if (Array.isArray(navData.children) && navData.children.length > 0) {
                    const submenu = documentHTML.createElement(`ul`);
                    submenu.classList.add(`${prefix}content-header-submenu`);
                    navData.children.forEach(childData => {
                        const submenuItem = documentHTML.createElement(`li`);
                        const submenuLink = documentHTML.createElement(childData.url ? `a` : `span`);

                        if (!childData.url) {
                            submenuLink.setAttribute('role', 'button');
                            submenuLink.setAttribute('tabindex', '0');
                        }

                        submenuLink.textContent = childData.name ?? ``;
                        if (childData.url) {
                            submenuLink.href = childData.url;
                        }
                        submenuItem.appendChild(submenuLink);
                        submenu.appendChild(submenuItem);
                    });
                    navItem.appendChild(submenu);
                }
                navList.appendChild(navItem);
            });
            nav.appendChild(navList);
            // Mobile buttons
            const mobileButtons = documentHTML.createElement(`div`);
            mobileButtons.classList.add(`${prefix}content-header-mbuttons`);
            if (content[`secondaryButton.enable`]) {
                const mobileSecondary = documentHTML.createElement(`a`);
                mobileSecondary.classList.add(`${prefix}content-header-secondaryCTA`);
                mobileSecondary.textContent = content[`secondaryButton.text`] ?? ``;
                if (content[`secondaryButton.url`] != null) {
                    mobileSecondary.href = content[`secondaryButton.url`];
                }
                if (content[`secondaryButton.newPage`]) {
                    mobileSecondary.target = `_blank`;
                    mobileSecondary.rel = `noopener noreferrer`;
                }
                mobileButtons.appendChild(mobileSecondary);
            }
            if (content[`primaryButton.enable`]) {
                const mobilePrimary = documentHTML.createElement(`a`);
                mobilePrimary.classList.add(`${prefix}content-header-primaryCTA`);
                mobilePrimary.textContent = content[`primaryButton.text`] ?? ``;
                if (content[`primaryButton.url`] != null) {
                    mobilePrimary.href = content[`primaryButton.url`];
                }
                if (content[`primaryButton.newPage`]) {
                    mobilePrimary.target = `_blank`;
                    mobilePrimary.rel = `noopener noreferrer`;
                }
                mobileButtons.appendChild(mobilePrimary);
            }
            nav.appendChild(mobileButtons);
            contentWrap.appendChild(nav);
            // Desktop buttons
            const buttons = documentHTML.createElement(`div`);
            buttons.classList.add(`${prefix}content-header-buttons`);
            if (content[`secondaryButton.enable`]) {
                const secondary = documentHTML.createElement(`a`);
                secondary.classList.add(`${prefix}content-header-secondaryCTA`);
                secondary.textContent = content[`secondaryButton.text`] ?? ``;
                if (content[`secondaryButton.url`] != null) {
                    secondary.href = content[`secondaryButton.url`];
                }
                if (content[`secondaryButton.newPage`]) {
                    secondary.target = `_blank`;
                    secondary.rel = `noopener noreferrer`;
                }
                buttons.appendChild(secondary);
            }
            if (content[`primaryButton.enable`]) {
                const primary = documentHTML.createElement(`a`);
                primary.classList.add(`${prefix}content-header-primaryCTA`);
                primary.textContent = content[`primaryButton.text`] ?? ``;
                if (content[`primaryButton.url`] != null) {
                    primary.href = content[`primaryButton.url`];
                }
                if (content[`primaryButton.newPage`]) {
                    primary.target = `_blank`;
                    primary.rel = `noopener noreferrer`;
                }
                buttons.appendChild(primary);
            }
            contentWrap.appendChild(buttons);
            // Space
            const spaceWrap = documentHTML.createElement(`div`);
            spaceWrap.classList.add(`${prefix}content-header-space`);
            contentWrap.appendChild(spaceWrap);
            // End Content Creation.
            // Start Varibles Layout Creation (Replace it with AI after)
            const cssVaribles = `
                    --${prefix}header-layout-desktopHeaderMaxInnerWidth: ${flexEngineDefaultVariables.space.space.render(layout.desktopHeaderMaxInnerWidth)};
                    --${prefix}header-layout-desktopHeaderMainGap: ${flexEngineDefaultVariables.space.space.render(layout.desktopHeaderMainGap)};
                    --${prefix}header-layout-mobileHeaderMainGap: ${flexEngineDefaultVariables.space.space.render(layout.mobileHeaderMainGap)};
                    --${prefix}header-layout-desktopHeaderSeparateBorderSpace: ${flexEngineDefaultVariables.space.space.render(layout.desktopHeaderSeparateBorderSpace)};
                    --${prefix}header-layout-spaceBetween: ${flexEngineDefaultVariables.space.space.render(layout.spaceBetween)};
                    --${prefix}header-layout-navMajorGap: ${flexEngineDefaultVariables.space.space.render(layout.navMajorGap)};
                    --${prefix}header-layout-navMinorGap: ${flexEngineDefaultVariables.space.space.render(layout.navMinorGap)};
                    --${prefix}header-layout-transitionTime: ${layout.transitionTime};
                    --${prefix}header-layout-transitionCurve: ${flexEngineDefaultVariables.curve.curve.render(layout.transitionCurve)};
                    --${prefix}header-layout-mobileButonRound: ${flexEngineDefaultVariables.space.space.render(layout.mobileButonRound)};
                `;
            header.setAttribute(`${prefix}styles-node`, cssVaribles);
            // End Layout Creation
            // Start Class Layout Creation
            /*
            DesktopPosition:
            will be assigned for each element with correct source, like:
            .site-content-header-onleft
            */
            const positionMap = {
                1: {
                    logo: "onleft",
                    nav: "oncenter",
                    cta: "onright",
                    space: "onhidden"
                },
                2: {
                    logo: "onleft",
                    nav: "onleft",
                    cta: "oncenter",
                    space: "onright"
                },
                3: {
                    logo: "onleft",
                    nav: "onleft",
                    cta: "onright",
                    space: "oncenter"
                },
                4: {
                    logo: "oncenter",
                    nav: "onleft",
                    cta: "onright",
                    space: "onhidden"
                },
                5: {
                    logo: "onleft",
                    nav: "onright",
                    cta: "oncenter",
                    space: "onhidden"
                },
                6: {
                    logo: "onleft",
                    nav: "onright",
                    cta: "onright",
                    space: "oncenter"
                },
                7: {
                    logo: "oncenter",
                    nav: "onright",
                    cta: "onright",
                    space: "onleft"
                }
            };
            const position = positionMap[layout.desktopPosition];
            if (position) {
                logoWrap.classList.add(`${prefix}content-header-${position.logo}`);
                hamburger.classList.add(`${prefix}content-header-${position.nav}`);
                nav.classList.add(`${prefix}content-header-${position.nav}`);
                buttons.classList.add(`${prefix}content-header-${position.cta}`);
                spaceWrap.classList.add(`${prefix}content-header-${position.space}`);
            }
            /*
            MobileMenuPlace:
            it is either left or right, it will add:
            .site-content-header-mobile-onleft or onright
            mobileLogoPosition:
            Almost same, but is left or center.
            REMEMBER: ORDER MATTERS!!!!!!!!!
            */
            hamburger.classList.add(`${prefix}content-header-mobile-${(layout.mobileMenuPlace === "left") ? "onleft" : "onright"}`);
            logoWrap.classList.add(`${prefix}content-header-mobile-${(layout.mobileLogoPosition === "left") ? "onleft" : "oncenter"}`);
            buttons.classList.add(`${prefix}content-header-mobile-onright`);
            const resultForSpace = (layout.mobileMenuPlace === "left") ? (layout.mobileLogoPosition === "left") ? "oncenter" : "onhidden" : (layout.mobileLogoPosition === "left") ? "oncenter" : "onleft";
            spaceWrap.classList.add(`${prefix}content-header-mobile-${resultForSpace ?? "onhidden"}`)
            /*
            desktopMenuMode:
                as .site-content-header-menumode{number} on wrap
            */
            contentWrap.classList.add(`${prefix}content-header-menumode${layout.desktopMenuMode ?? 0}`);
            /*
            nestingSupport:
            as .site-content-header-nested{mode} on menu
            */
            // Normalize unsupported nesting modes before creating classes or markup.
            // Modes 5 and 6 must behave exactly like mode 0.
            const requestedNestingSupport = Number(layout.nestingSupport ?? 0);
            const nestingSupport = [5, 6].includes(requestedNestingSupport) ? 0 : requestedNestingSupport;
            nav.classList.add(`${prefix}content-header-nested${nestingSupport}`);
            if (nestingSupport >= 1 && nestingSupport <= 4) {
                nav.querySelectorAll(`.${prefix}content-header-navpage`).forEach((navpage) => {
                    const submenu = navpage.querySelector(`:scope > .${prefix}content-header-submenu`);
                    // No submenu = nothing to process.
                    if (!submenu) {
                        return;
                    }
                    /*
                    * nestingSupport 1, 2, 3, 5:
                    * Add the submenu icon before the submenu.
                    *
                    * nestingSupport 4:
                    * No submenu icon.
                    */
                    if (nestingSupport <= 3 || nestingSupport == 5) {
                        const subIcon = document.createElement('button');
                        subIcon.className = `${prefix}content-header-menusubicon`;
                        // Plain Unicode character, not an emoji.
                        subIcon.textContent = '▶';
                        submenu.before(subIcon);
                    }
                    /*
                    * nestingSupport 3, 4, 5:
                    * Clone the original navpage link and place
                    * the duplicate immediately after the submenu.
                    */
                    if (nestingSupport >= 3) {
                        const link = navpage.querySelector(`:scope > a`);
                        if (link) {
                            const clonedLink = link.cloneNode(true);
                            const li = document.createElement('li');
                            clonedLink.innerHTML += " →"
                            li.appendChild(clonedLink);
                            submenu.prepend(li);
                        }
                    }
                    /*
                    * nestingSupport 2, 3:
                    * Add the close button as the first element
                    * inside the submenu.
                    */
                    if (nestingSupport == 2 || nestingSupport == 3) {
                        const closeButton = document.createElement('button');
                        closeButton.className = `${prefix}content-header-closebutton`;
                        closeButton.innerHTML = `
                                <span></span>
                                <span></span>
                                <span></span>
                            `;
                        submenu.prepend(closeButton);
                    }
                });
            }
            /*
            mobileCtaType:
            as .site-content-header-mbutton{mode} on mbotton
            */
            mobileButtons.classList.add(`${prefix}content-header-mbutton${layout.mobileCtaType ?? 1}`);
            /*
            hamAnimation:
            as .site-content-header-hamAnim{mode} on hamberger desktop.
            */
            hamburger.classList.add(`${prefix}content-header-hamAnim${layout.hamAnimation ?? 2}`)
            /*
                hamAnimationOnDesktop:
                as .site-content-header-enableAnimation on hamberber desktop.
            */
            hamburger.classList.add(`${prefix}content-header-enableAnimation`)
            nav.classList.add(`${prefix}content-header-align-onleft` //${layout.textAlignInMenu ?? "left"}
            );
            if (layout.stickyToBottom) {
                mobileButtons.classList.add(`${prefix}content-header-stickyToBottom`);
            }
            // End Layout Creation

            const menuMode = layout.desktopMenuMode;
            const className = "site-content-header-menustyleapply";

            if (menuMode >= 1 && menuMode <= 4) {
                nav.classList.add(className);
            } else if (menuMode >= 5 && menuMode <= 6) {
                nav.querySelector("ul")?.classList.add(className);
            }
            // Return it back.
        },

        jsRuntime: {
            forEach: function(BUILDER_CONFIG) {
                return `function startRuntime(element) {
                    if (element) {
                        const hamburger = element.querySelector(".${BUILDER_CONFIG.classPrefix}content-header-hamberger");
                        const menuWrap = element.querySelector(".${BUILDER_CONFIG.classPrefix}content-header-wrap");
                        const clearSubmenus = (scope = element) => {
                            scope.querySelectorAll(".${BUILDER_CONFIG.classPrefix}content-header-navpage.issubmenuopen").forEach((navPage) => {
                                navPage.classList.remove("issubmenuopen");
                            });
                        };

                        const closeMenu = () => {
                            clearSubmenus();
                            menuWrap?.classList.remove("ismenuopen");
                        };

                        hamburger?.addEventListener("click", () => {
                            if (
                                window.innerWidth < 768 &&
                                element.querySelectorAll(".${BUILDER_CONFIG.classPrefix}content-header-navpage.issubmenuopen").length > 0
                            ) {
                                clearSubmenus();
                                return;
                            }

                            menuWrap?.classList.toggle("ismenuopen");
                        });

                        document.addEventListener("click", (event) => {
                            const target = event.target;
                            if (!(target instanceof Element)) return;
                            const closeButton = target.closest(".${BUILDER_CONFIG.classPrefix}content-header-closebutton");
                            if (!closeButton) return;
                            const navPage = closeButton.closest(".${BUILDER_CONFIG.classPrefix}content-header-navpage");
                            if (navPage) {
                                navPage.classList.remove("issubmenuopen");
                                return;
                            }
                            if (menuWrap && (menuWrap.contains(closeButton) || element.contains(closeButton))) {
                                closeMenu();
                            }
                        });

                        function getNestedLevel(nested) {
                            if (!nested) return 0;
                            for (const className of nested.classList) {
                                const match = className.match(/^${BUILDER_CONFIG.classPrefix}content-header-nested(\\d+)$/);
                                if (match) {
                                    return Number(match[1]);
                                }
                            }
                            return 0;
                        }

                        element.querySelectorAll('[class*="${BUILDER_CONFIG.classPrefix}content-header-nested"]').forEach((nested) => {
                            const level = getNestedLevel(nested);
                            if (level !== 1 && level !== 2 && level !== 3 && level !== 4) {
                                return;
                            }

                            const menu = nested.querySelector(".${BUILDER_CONFIG.classPrefix}content-header-menu") || element.querySelector(".${BUILDER_CONFIG.classPrefix}content-header-menu");
                            if (!menu) return;

                            const navPages = Array.from(menu.querySelectorAll(".${BUILDER_CONFIG.classPrefix}content-header-navpage"));

                            const toggleSubmenu = (navPage) => {
                                const isOpen = navPage.classList.contains("issubmenuopen");

                                if (!isOpen && (level == 2 || level == 3)) {
                                    navPages.forEach((page) => {
                                        if (page !== navPage) {
                                            page.classList.remove("issubmenuopen");
                                        }
                                    });
                                }

                                const submenu = navPage.querySelector(".${BUILDER_CONFIG.classPrefix}content-header-submenu");

                                if (submenu && (level == 1 || level == 4)) {
                                    if (!isOpen) {
                                        submenu.style.maxHeight = submenu.scrollHeight + "px";
                                    } else {
                                        submenu.style.maxHeight = submenu.scrollHeight + "px";
                                        requestAnimationFrame(() => {
                                            submenu.style.maxHeight = null;
                                        });
                                    }
                                }

                                navPage.classList.toggle("issubmenuopen");
                            };

                            navPages.forEach((navPage) => {
                                const submenuIcon = navPage.querySelector(".${BUILDER_CONFIG.classPrefix}content-header-menusubicon");

                                if (submenuIcon) {
                                    submenuIcon.addEventListener("click", (event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        toggleSubmenu(navPage);
                                    });
                                }

                                if (
                                    (level === 3 || level === 4) &&
                                    navPage.querySelector(":scope > .${BUILDER_CONFIG.classPrefix}content-header-submenu")
                                ) {
                                    const firstElement = navPage.querySelector(":scope > *");

                                    if (firstElement) {
                                        const handleClick = (event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            toggleSubmenu(navPage);
                                        };

                                        firstElement.addEventListener("click", handleClick);

                                        firstElement.addEventListener("keydown", (event) => {
                                            if (event.key === "Enter") {
                                                handleClick(event);
                                            }
                                        });
                                    }
                                }
                            });
                        });

                        const updateOnTop = () => {
                            if (!menuWrap) return;

                            const menuIsOpen = menuWrap.classList.contains("ismenuopen");

                            if (menuIsOpen) {
                                element.classList.remove("onTop");
                                return;
                            }

                            const isAtTop = window.scrollY <= 0;
                            element.classList.toggle("onTop", isAtTop);
                        };

                        window.addEventListener("scroll", updateOnTop, {
                            passive: true
                        });

                        hamburger?.addEventListener("click", updateOnTop);

                        document.addEventListener("click", (event) => {
                            const target = event.target;
                            if (!(target instanceof Element)) return;

                            const closeButton = target.closest(".${BUILDER_CONFIG.classPrefix}content-header-closebutton");
                            if (!closeButton) return;

                            const navPage = closeButton.closest(".${BUILDER_CONFIG.classPrefix}content-header-navpage");

                            if (!navPage) {
                                updateOnTop();
                            }
                        });

                        updateOnTop();

                        function applyMenuStyle(header) {
                            const targetClass = "${BUILDER_CONFIG.classPrefix}content-header-menustyleapply";

                            const hasTargetMode = [
                                "${BUILDER_CONFIG.classPrefix}content-header-menumode5",
                                "${BUILDER_CONFIG.classPrefix}content-header-menumode6"
                            ].some(className =>
                                header.matches("." + className) ||
                                header.querySelector("." + className)
                            );

                            if (!hasTargetMode) return;

                            const styleElement = [
                                ...(header.matches("." + targetClass) ? [header] : []),
                                ...header.querySelectorAll("." + targetClass)
                            ][0];

                            if (!styleElement) return;

                            const isMobile = window.innerWidth <= 768;
                            const expectedTag = isMobile ? "NAV" : "UL";

                            if (styleElement.tagName === expectedTag) return;

                            styleElement.classList.remove(targetClass);

                            if (isMobile) {
                                header.querySelector("nav")?.classList.add(targetClass);
                            } else {
                                header.querySelector("nav ul")?.classList.add(targetClass);
                            }
                        }

                        function runMenuStyle() {
                            document.querySelectorAll("header").forEach(applyMenuStyle);
                        }

                        runMenuStyle();
                        window.addEventListener("resize", runMenuStyle);
                    }
                }`                           
            }
        },

        cssStyles: [
            {
                object: ".site-header",
                info: [
                    { "key": "width", "value": "100%" },
                    { "key": "max-width", "value": "100vw" },
                    { "key": "display", "value": "flex" },
                    { "key": "align-items", "value": "center" },
                    { "key": "justify-content", "value": "center" }
                ]
            },
            {
                object: ".site-header.sticky",
                info: [
                    { "key": "position", "value": "sticky" },
                    { "key": "top", "value": "0" }
                ]
            },
            {
                object: ".site-header",
                break: 768,
                info: [
                    { "key": "position", "value": "sticky" },
                    { "key": "top", "value": "0" }
                ]
            },
            {
                object: ".site-header a",
                info: [
                    { "key": "text-decoration", "value": "none" },
                    { "key": "color", "value": "unset" }
                ]
            },
            {
                object: "@context-wrap",
                info: [
                    { "key": "width", "value": "100%" },
                    { "key": "max-width", "value": "var(--site-header-layout-desktopHeaderMaxInnerWidth)" },
                    { "key": "display", "value": "flex" },
                    { "key": "align-items", "value": "center" },
                    { "key": "justify-content", "value": "space-between" },
                    { "key": "position", "value": "relative" },
                    { "key": "gap", "value": "var(--site-header-layout-desktopHeaderMainGap)" }
                ]
            },
            {
                object: "@context-wrap *",
                info: [
                    { "key": "transition", "value": "all var(--site-header-layout-transitionTime) var(--site-header-layout-transitionCurve)" }
                ]
            },
            {
                object: "@context-onhidden",
                info: [
                    { "key": "display", "value": "none" }
                ]
            },
            {
                object: "@context-onleft",
                info: [
                    { "key": "flex", "value": "0 0 auto" },
                    { "key": "text-align", "value": "start" },
                    { "key": "align-items", "value": "flex-start" },
                    { "key": "justify-content", "value": "flex-end" },
                    { "key": "margin-right", "value": "0" },
                    { "key": "margin-left", "value": "0" },
                    { "key": "order", "value": "10" }
                ]
            },
            {
                object: "@context-oncenter",
                info: [
                    { "key": "flex", "value": "8 8 auto" },
                    { "key": "align-items", "value": "center" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "text-align", "value": "center" },
                    { "key": "order", "value": "25" }
                ]
            },
            {
                object: "@context-onright",
                info: [
                    { "key": "flex", "value": "0 0 auto" },
                    { "key": "text-align", "value": "end" },
                    { "key": "align-items", "value": "flex-end" },
                    { "key": "justify-content", "value": "flex-end" },
                    { "key": "margin-left", "value": "0" },
                    { "key": "order", "value": "39" }
                ]
            },
            {
                object: "@context-hamberger@context-onleft",
                info: [
                    { "key": "order", "value": "11" }
                ]
            },
            {
                object: "@context-logo@context-onleft",
                info: [
                    { "key": "order", "value": "12" }
                ]
            },
            {
                object: "@context-buttons@context-onleft",
                info: [
                    { "key": "order", "value": "13" }
                ]
            },
            {
                object: "@context-menu@context-onleft",
                info: [
                    { "key": "order", "value": "14" }
                ]
            },
            {
                object: "@context-hamberger@context-onright",
                info: [
                    { "key": "order", "value": "39" }
                ]
            },
            {
                object: "@context-logo@context-onright",
                info: [
                    { "key": "order", "value": "38" }
                ]
            },
            {
                object: "@context-buttons@context-onright",
                info: [
                    { "key": "order", "value": "37" }
                ]
            },
            {
                object: "@context-menu@context-onright",
                info: [
                    { "key": "order", "value": "36" }
                ]
            },
            {
                object: "@context-onhidden, @context-onleft, @context-oncenter, @context-onright",
                break: 768,
                info: [
                    { "key": "flex", "value": "unset" },
                    { "key": "text-align", "value": "unset" },
                    { "key": "align-items", "value": "unset" },
                    { "key": "margin", "value": "unset" }
                ]
            },
            {
                object: "@context-mobile-onhidden",
                break: 768,
                info: [
                    { "key": "display", "value": "none" }
                ]
            },
            {
                object: "@context-mobile-onleft",
                break: 768,
                info: [
                    { "key": "flex", "value": "0 0 auto" },
                    { "key": "text-align", "value": "start" },
                    { "key": "align-items", "value": "flex-start" },
                    { "key": "justify-content", "value": "flex-start" },
                    { "key": "margin-right", "value": "0" },
                    { "key": "margin-left", "value": "0" },
                    { "key": "order", "value": "10" }
                ]
            },
            {
                object: "@context-mobile-oncenter",
                break: 768,
                info: [
                    { "key": "flex", "value": "1 1 auto" },
                    { "key": "align-items", "value": "center" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "text-align", "value": "center" },
                    { "key": "order", "value": "25" }
                ]
            },
            {
                object: "@context-mobile-onright",
                break: 768,
                info: [
                    { "key": "flex", "value": "0 0 auto" },
                    { "key": "text-align", "value": "end" },
                    { "key": "align-items", "value": "flex-end" },
                    { "key": "justify-content", "value": "flex-end" },
                    { "key": "margin-left", "value": "0" },
                    { "key": "order", "value": "39" }
                ]
            },
            {
                object: "@context-hamberger@context-mobile-onleft",
                break: 768,
                info: [
                    { "key": "order", "value": "11" }
                ]
            },
            {
                object: "@context-logo@context-mobile-onleft",
                break: 768,
                info: [
                    { "key": "order", "value": "12" }
                ]
            },
            {
                object: "@context-buttons@context-mobile-onleft",
                break: 768,
                info: [
                    { "key": "order", "value": "13" }
                ]
            },
            {
                object: "@context-menu@context-mobile-onleft",
                break: 768,
                info: [
                    { "key": "order", "value": "14" }
                ]
            },
            {
                object: "@context-hamberger@context-mobile-onright",
                break: 768,
                info: [
                    { "key": "order", "value": "39" }
                ]
            },
            {
                object: "@context-logo@context-mobile-onright",
                break: 768,
                info: [
                    { "key": "order", "value": "38" }
                ]
            },
            {
                object: "@context-buttons@context-mobile-onright",
                break: 768,
                info: [
                    { "key": "order", "value": "37" }
                ]
            },
            {
                object: "@context-menu@context-mobile-onright",
                break: 768,
                info: [
                    { "key": "order", "value": "36" }
                ]
            },
            {
                object: "@context-logo>a.logo, @context-logo>h2 @context-logo img",
                info: [
                    { "key": "text-decoration", "value": "none" },
                    { "key": "display", "value": "flex" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "align-items", "value": "center" },
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "color", "value": "inherit" },
                    { "key": "font-size", "value": "100%" }
                ]
            },
            {
                object: "@context-menu > ul a, @context-menu > ul span, @context-menu > ul button",
                info: [
                    { "key": "width", "value": "100%" }
                ]
            },
            {
                object: "@context-navpage>@context-menusubicon",
                info: [
                    { "key": "box-sizing", "value": "border-box" },
                    { "key": "width", "value": "1lh" },
                    { "key": "height", "value": "1lh" },
                    { "key": "flex", "value": "0 0 1lh" },
                    { "key": "display", "value": "inline-flex" },
                    { "key": "align-items", "value": "center" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "padding", "value": "0" },
                    { "key": "margin", "value": "0" },
                    { "key": "line-height", "value": "1" },
                    { "key": "transform-origin", "value": "center" }
                ]
            },
            {
                object: "@context-menumode0 @context-menu",
                info: [
                    { "key": "position", "value": "relative" },
                    { "key": "overflow", "value": "visible" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "align-items", "value": "center" },
                    { "key": "justify-content", "value": "center" }
                ]
            },
            {
                object: "@context-menumode0 @context-hamberger",
                info: [
                    { "key": "display", "value": "none" }
                ]
            },
            {
                object: "@context-menumode0 @context-closebutton",
                info: [
                    { "key": "display", "value": "none" }
                ]
            },
            {
                object: "@context-menumode0 @context-menu > ul",
                info: [
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "row" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "align-items", "value": "center" },
                    { "key": "gap", "value": "var(--site-header-layout-spaceBetween)" }
                ]
            },
            {
                object: "@context-menumode0 @context-navpage",
                info: [
                    { "key": "position", "value": "relative" }
                ]
            },
            {
                object: "@context-menumode0 @context-navpage > span, @context-menumode0 @context-navpage > a",
                info: [
                    { "key": "height", "value": "100%" },
                    { "key": "cursor", "value": "pointer" }
                ]
            },
            {
                object: "@context-menumode0 @context-submenu",
                info: [
                    { "key": "margin-top", "value": "var(--site-header-layout-spaceBetween)" },
                    { "key": "clip-path", "value": "inset(0 0 100% 0)" },
                    { "key": "position", "value": "absolute" },
                    { "key": "left", "value": "0" },
                    { "key": "top", "value": "100%" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "align-items", "value": "left" },
                    { "key": "justify-self", "value": "left" },
                    { "key": "text-align", "value": "left" },
                    { "key": "gap", "value": "var(--site-header-layout-navMinorGap)" },
                    { "key": "width", "value": "250px" }
                ]
            },
            {
                object: "@context-menumode0 @context-submenu > li",
                info: [
                    { "key": "width", "value": "100%" }
                ]
            },
            {
                object: "@context-menumode0 @context-navpage > a:hover + @context-submenu, @context-menumode0 @context-navpage:hover @context-submenu",
                info: [
                    { "key": "clip-path", "value": "inset(0 0 0 0)" }
                ]
            },
            {
                object: "@context-menumode0 @context-menusubicon",
                info: [
                    { "key": "display", "value": "none" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu",
                info: [
                    { "key": "left", "value": "0" },
                    { "key": "top", "value": "0" },
                    { "key": "height", "value": "100%" },
                    { "key": "transform", "value": "translateX(-100%)" }
                ]
            },
            {
                object: "@context-menumode1.ismenuopen @context-menu",
                info: [
                    { "key": "transform", "value": "translateX(0)" }
                ]
            },
            {
                object: "@context-menumode2 @context-menu",
                info: [
                    { "key": "left", "value": "0" },
                    { "key": "top", "value": "0" },
                    { "key": "height", "value": "100%" },
                    { "key": "clip-path", "value": "inset(0 100% 0 0)" }
                ]
            },
            {
                object: "@context-menumode2.ismenuopen @context-menu",
                info: [
                    { "key": "clip-path", "value": "inset(0 0 0 0)" }
                ]
            },
            {
                object: "@context-menumode3 @context-menu",
                info: [
                    { "key": "right", "value": "0" },
                    { "key": "top", "value": "0" },
                    { "key": "height", "value": "100%" },
                    { "key": "transform", "value": "translateX(100%)" }
                ]
            },
            {
                object: "@context-menumode3.ismenuopen @context-menu",
                info: [
                    { "key": "transform", "value": "translateX(0)" }
                ]
            },
            {
                object: "@context-menumode4 @context-menu",
                info: [
                    { "key": "right", "value": "0" },
                    { "key": "top", "value": "0" },
                    { "key": "height", "value": "100%" },
                    { "key": "clip-path", "value": "inset(0 0 0 100%)" }
                ]
            },
            {
                object: "@context-menumode4.ismenuopen @context-menu",
                info: [
                    { "key": "clip-path", "value": "inset(0 0 0 0)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu > ul, @context-menumode2 @context-menu > ul, @context-menumode3 @context-menu > ul, @context-menumode4 @context-menu > ul",
                info: [
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "display", "value": "flex" },
                    { "key": "justify-content", "value": "flex-start" },
                    { "key": "align-items", "value": "left" },
                    { "key": "text-align", "value": "left" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "gap", "value": "var(--site-header-layout-navMajorGap)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu, @context-menumode2 @context-menu, @context-menumode3 @context-menu, @context-menumode4 @context-menu",
                info: [
                    { "key": "position", "value": "fixed" },
                    { "key": "overflow", "value": "hidden" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "justify-content", "value": "flex-start" },
                    { "key": "align-items", "value": "flex-start" },
                    { "key": "gap", "value": "var(--site-header-layout-navMajorGap)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu @context-navpage, @context-menumode2 @context-menu @context-navpage, @context-menumode3 @context-menu @context-navpage, @context-menumode4 @context-menu @context-navpage",
                info: [
                    { "key": "width", "value": "100%" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-wrap", "value": "wrap" },
                    { "key": "justify-content", "value": "flex-start" },
                    { "key": "align-items", "value": "stretch" },
                    { "key": "gap", "value": "0 var(--site-header-layout-navMinorGap)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu @context-navpage>a, @context-menumode2 @context-menu @context-navpage>a, @context-menumode3 @context-menu @context-navpage>a, @context-menumode4 @context-menu @context-navpage>a, @context-menumode1 @context-menu @context-navpage>span, @context-menumode2 @context-menu @context-navpage>span, @context-menumode3 @context-menu @context-navpage>span, @context-menumode4 @context-menu @context-navpage>span",
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "justify-content", "value": "flex-start" },
                    { "key": "align-items", "value": "stretch" },
                    { "key": "flex", "value": "1 1 50px" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu@context-nested0 @context-submenu, @context-menumode2 @context-menu@context-nested0 @context-submenu, @context-menumode3 @context-menu@context-nested0 @context-submenu, @context-menumode4 @context-menu@context-nested0 @context-submenu",
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "padding-top", "value": "var(--site-header-layout-navMinorGap)" },
                    { "key": "gap", "value": "var(--site-header-layout-navMinorGap)" },
                    { "key": "padding-left", "value": "var(--site-header-layout-navMajorGap)" },
                    { "key": "padding-right", "value": "var(--site-header-layout-navMajorGap)" },
                    { "key": "width", "value": "100%" },
                    { "key": "flex", "value": "0 0 100%" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu@context-nested1 @context-submenu, @context-menumode2 @context-menu@context-nested1 @context-submenu, @context-menumode3 @context-menu@context-nested1 @context-submenu, @context-menumode4 @context-menu@context-nested1 @context-submenu, @context-menumode1 @context-menu@context-nested4 @context-submenu, @context-menumode2 @context-menu@context-nested4 @context-submenu, @context-menumode3 @context-menu@context-nested4 @context-submenu, @context-menumode4 @context-menu@context-nested4 @context-submenu",
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "gap", "value": "var(--site-header-layout-navMinorGap)" },
                    { "key": "padding-left", "value": "var(--site-header-layout-navMajorGap)" },
                    { "key": "padding-right", "value": "var(--site-header-layout-navMajorGap)" },
                    { "key": "width", "value": "100%" },
                    { "key": "flex", "value": "0 0 100%" },
                    { "key": "max-height", "value": "0" },
                    { "key": "padding-top", "value": "0" },
                    { "key": "clip-path", "value": "inset(0 0 100% 0)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu@context-nested1 @context-navpage.issubmenuopen, @context-menumode2 @context-menu@context-nested1 @context-navpage.issubmenuopen, @context-menumode3 @context-menu@context-nested1 @context-navpage.issubmenuopen, @context-menumode4 @context-menu@context-nested1 @context-navpage.issubmenuopen, @context-menumode1 @context-menu@context-nested4 @context-navpage.issubmenuopen, @context-menumode2 @context-menu@context-nested4 @context-navpage.issubmenuopen, @context-menumode3 @context-menu@context-nested4 @context-navpage.issubmenuopen, @context-menumode4 @context-menu@context-nested4 @context-navpage.issubmenuopen",
                info: [
                    { "key": "gap", "value": "var(--site-header-layout-navMinorGap) var(--site-header-layout-navMinorGap)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu@context-nested1 @context-navpage.issubmenuopen>@context-menusubicon, @context-menumode2 @context-menu@context-nested1 @context-navpage.issubmenuopen>@context-menusubicon, @context-menumode3 @context-menu@context-nested1 @context-navpage.issubmenuopen>@context-menusubicon, @context-menumode4 @context-menu@context-nested1 @context-navpage.issubmenuopen>@context-menusubicon, @context-menumode1 @context-menu@context-nested4 @context-navpage.issubmenuopen>@context-menusubicon, @context-menumode2 @context-menu@context-nested4 @context-navpage.issubmenuopen>@context-menusubicon, @context-menumode3 @context-menu@context-nested4 @context-navpage.issubmenuopen>@context-menusubicon, @context-menumode4 @context-menu@context-nested4 @context-navpage.issubmenuopen>@context-menusubicon",
                info: [
                    { "key": "transform", "value": "rotate(90deg)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu@context-nested1 @context-navpage.issubmenuopen @context-submenu, @context-menumode2 @context-menu@context-nested1 @context-navpage.issubmenuopen @context-submenu, @context-menumode3 @context-menu@context-nested1 @context-navpage.issubmenuopen @context-submenu, @context-menumode4 @context-menu@context-nested1 @context-navpage.issubmenuopen @context-submenu, @context-menumode1 @context-menu@context-nested4 @context-navpage.issubmenuopen @context-submenu, @context-menumode2 @context-menu@context-nested4 @context-navpage.issubmenuopen @context-submenu, @context-menumode3 @context-menu@context-nested4 @context-navpage.issubmenuopen @context-submenu, @context-menumode4 @context-menu@context-nested4 @context-navpage.issubmenuopen @context-submenu",
                info: [
                    { "key": "clip-path", "value": "inset(0 0 0 0)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu@context-nested2 @context-submenu, @context-menumode2 @context-menu@context-nested2 @context-submenu, @context-menumode3 @context-menu@context-nested2 @context-submenu, @context-menumode4 @context-menu@context-nested2 @context-submenu, @context-menumode1 @context-menu@context-nested3 @context-submenu, @context-menumode2 @context-menu@context-nested3 @context-submenu, @context-menumode3 @context-menu@context-nested3 @context-submenu, @context-menumode4 @context-menu@context-nested3 @context-submenu",
                info: [
                    { "key": "position", "value": "absolute" },
                    { "key": "top", "value": "0" },
                    { "key": "bottom", "value": "0" },
                    { "key": "left", "value": "0" },
                    { "key": "right", "value": "0" },
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "gap", "value": "var(--site-header-layout-navMajorGap)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu@context-nested2 @context-navpage @context-submenu, @context-menumode1 @context-menu@context-nested3 @context-navpage @context-submenu",
                info: [
                    { "key": "left", "value": "0" },
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "transform", "value": "translateX(-100%)" }
                ]
            },
            {
                object: "@context-menumode1 @context-menu@context-nested2 @context-navpage.issubmenuopen @context-submenu, @context-menumode1 @context-menu@context-nested3 @context-navpage.issubmenuopen @context-submenu",
                info: [
                    { "key": "transform", "value": "translateX(0)" }
                ]
            },
            {
                object: "@context-menumode2 @context-menu@context-nested2 @context-navpage @context-submenu, @context-menumode2 @context-menu@context-nested3 @context-navpage @context-submenu",
                info: [
                    { "key": "left", "value": "0" },
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "clip-path", "value": "inset(0 100% 0 0)" }
                ]
            },
            {
                object: "@context-menumode2 @context-menu@context-nested2 @context-navpage.issubmenuopen @context-submenu, @context-menumode2 @context-menu@context-nested3 @context-navpage.issubmenuopen @context-submenu",
                info: [
                    { "key": "clip-path", "value": "inset(0 0 0 0)" }
                ]
            },
            {
                object: "@context-menumode3 @context-menu@context-nested2 @context-navpage @context-submenu, @context-menumode3 @context-menu@context-nested3 @context-navpage @context-submenu",
                info: [
                    { "key": "right", "value": "0" },
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "transform", "value": "translateX(100%)" }
                ]
            },
            {
                object: "@context-menumode3 @context-menu@context-nested2 @context-navpage.issubmenuopen @context-submenu, @context-menumode3 @context-menu@context-nested3 @context-navpage.issubmenuopen @context-submenu",
                info: [
                    { "key": "transform", "value": "translateX(0)" }
                ]
            },
            {
                object: "@context-menumode4 @context-menu@context-nested2 @context-navpage @context-submenu, @context-menumode4 @context-menu@context-nested3 @context-navpage @context-submenu",
                info: [
                    { "key": "right", "value": "0" },
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "clip-path", "value": "inset(0 0 0 100%)" }
                ]
            },
            {
                object: "@context-menumode4 @context-menu@context-nested2 @context-navpage.issubmenuopen @context-submenu, @context-menumode4 @context-menu@context-nested3 @context-navpage.issubmenuopen @context-submenu",
                info: [
                    { "key": "clip-path", "value": "inset(0 0 0 0)" }
                ]
            },
            {
                object: "@context-menumode5 @context-menu, @context-menumode6 @context-menu",
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "padding-top", "value": "var(--site-header-layout-spaceBetween)" },
                    { "key": "align-items", "value": "center" },
                    { "key": "flex-wrap", "value": "nowrap" }
                ]
            },
            {
                object: "@context-menumode5 @context-menu",
                info: [
                    { "key": "position", "value": "absolute" },
                    { "key": "left", "value": "0" },
                    { "key": "right", "value": "0" },
                    { "key": "top", "value": "0" },
                    { "key": "margin", "value": "auto" },
                    { "key": "transform", "value": "translateY(-100%)" }
                ]
            },
            {
                object: "@context-menumode5.ismenuopen @context-menu",
                info: [
                    { "key": "top", "value": "100%" },
                    { "key": "transform", "value": "translateY(0)" }
                ]
            },
            {
                object: "@context-menumode6 @context-menu",
                info: [
                    { "key": "position", "value": "absolute" },
                    { "key": "left", "value": "0" },
                    { "key": "right", "value": "0" },
                    { "key": "top", "value": "100%" },
                    { "key": "margin", "value": "auto" },
                    { "key": "clip-path", "value": "inset(0 0 100% 0)" }
                ]
            },
            {
                object: "@context-menumode6.ismenuopen @context-menu",
                info: [
                    { "key": "clip-path", "value": "inset(0 0 0 0)" }
                ]
            },
            {
                object: "@context-menumode5 @context-closebutton, @context-menumode6 @context-closebutton",
                info: [
                    { "key": "display", "value": "none" }
                ]
            },
            {
                object: "@context-menumode5 @context-menu > ul, @context-menumode6 @context-menu > ul",
                info: [
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "100%" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-wrap", "value": "wrap" },
                    { "key": "flex-direction", "value": "row" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "align-items", "value": "flex-start" },
                    { "key": "text-align", "value": "center" },
                    { "key": "gap", "value": "var(--site-header-layout-navMajorGap)" }
                ]
            },
            {
                object: "@context-menumode5 @context-navpage, @context-menumode6 @context-navpage",
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "gap", "value": "var(--site-header-layout-navMajorGap)" }
                ]
            },
            {
                object: "@context-menumode5 @context-submenu, @context-menumode6 @context-submenu",
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "gap", "value": "var(--site-header-layout-navMinorGap)" }
                ]
            },
            {
                object: ".site-header",
                break: 768,
                info: [
                    { "key": "overflow-x", "value": "clip" }
                ]
            },
            {
                object: "@context-menumode0 @context-menu, @context-menumode1 @context-menu, @context-menumode2 @context-menu, @context-menumode3 @context-menu, @context-menumode4 @context-menu, @context-menumode5 @context-menu, @context-menumode6 @context-menu",
                break: 768,
                info: [
                    { "key": "position", "value": "absolute" },
                    { "key": "top", "value": "100%" },
                    { "key": "left", "value": "0" },
                    { "key": "right", "value": "0" },
                    { "key": "height", "value": "calc(100vh - 100% - 1px)" },
                    { "key": "width", "value": "calc(100% - 1px)" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "align-items", "value": "center" },
                    { "key": "justify-content", "value": "flex-start" }
                ]
            },
            {
                object: "@context-menumode5 @context-menu",
                break: 768,
                info: [
                    { "key": "top", "value": "0" }
                ]
            },
            {
                object: "@context-menumode0 @context-hamberger, @context-menumode1 @context-hamberger, @context-menumode2 @context-hamberger, @context-menumode3 @context-hamberger, @context-menumode4 @context-hamberger, @context-menumode5 @context-hamberger, @context-menumode6 @context-hamberger",
                break: 768,
                info: [
                    { "key": "display", "value": "flex" }
                ]
            },
            {
                object: "@context-menumode0 @context-closebutton, @context-menumode1 @context-closebutton, @context-menumode2 @context-closebutton, @context-menumode3 @context-closebutton, @context-menumode4 @context-closebutton, @context-menumode5 @context-closebutton, @context-menumode6 @context-closebutton",
                break: 768,
                info: [
                    { "key": "display", "value": "none" }
                ]
            },
            {
                object: "@context-menumode0 @context-menu>ul, @context-menumode1 @context-menu>ul, @context-menumode2 @context-menu>ul, @context-menumode3 @context-menu>ul, @context-menumode4 @context-menu>ul, @context-menumode5 @context-menu>ul, @context-menumode6 @context-menu>ul",
                break: 768,
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "position", "value": "relative" },
                    { "key": "justify-content", "value": "stretch" },
                    { "key": "align-items", "value": "left" },
                    { "key": "text-align", "value": "left" },
                    { "key": "width", "value": "100%" },
                    { "key": "height", "value": "auto" },
                    { "key": "gap", "value": "var(--site-header-layout-navMajorGap)" }
                ]
            },
            {
                object: "@context-menumode0 @context-menu",
                break: 768,
                info: [
                    { "key": "clip-path", "value": "inset(0 0 100% 0)" }
                ]
            },
            {
                object: "@context-menumode0.ismenuopen @context-menu",
                break: 768,
                info: [
                    { "key": "clip-path", "value": "inset(0 0 0 0)" }
                ]
            },
            {
                object: "@context-menumode0 @context-menu @context-navpage",
                break: 768,
                info: [
                    { "key": "position", "value": "static" },
                    { "key": "width", "value": "100%" }
                ]
            },
            {
                object: "@context-menumode0 @context-menu @context-navpage > a",
                break: 768,
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "height", "value": "auto" },
                    { "key": "margin-bottom", "value": "0" }
                ]
            },
            {
                object: "@context-menumode0 @context-menu @context-submenu",
                break: 768,
                info: [
                    { "key": "margin-top", "value": "0" },
                    { "key": "position", "value": "static" },
                    { "key": "clip-path", "value": "none" },
                    { "key": "text-align", "value": "unset" },
                    { "key": "left", "value": "auto" },
                    { "key": "top", "value": "auto" },
                    { "key": "padding-top", "value": "var(--site-header-layout-navMinorGap)" },
                    { "key": "gap", "value": "var(--site-header-layout-navMinorGap)" },
                    { "key": "padding-left", "value": "var(--site-header-layout-navMajorGap)" },
                    { "key": "padding-right", "value": "var(--site-header-layout-navMajorGap)" }
                ]
            },
            {
                object: "@context-hamberger, @context-closebutton",
                info: [
                    { "key": "width", "value": "30px" },
                    { "key": "height", "value": "30px" },
                    { "key": "padding", "value": "0" },
                    { "key": "border", "value": "0" },
                    { "key": "display", "value": "flex" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "align-items", "value": "center" },
                    { "key": "gap", "value": "7px" },
                    { "key": "background", "value": "transparent" },
                    { "key": "cursor", "value": "pointer" }
                ]
            },
            {
                object: "@context-hamberger span, @context-closebutton span",
                info: [
                    { "key": "display", "value": "block" },
                    { "key": "width", "value": "30px" },
                    { "key": "height", "value": "3px" },
                    { "key": "background", "value": "currentColor" },
                    { "key": "border-radius", "value": "999px" }
                ]
            },
            {
                object: "@context-closebutton span:nth-child(1)",
                info: [
                    { "key": "transform", "value": "translateY(10px) rotate(45deg)" }
                ]
            },
            {
                object: "@context-closebutton span:nth-child(2)",
                info: [
                    { "key": "opacity", "value": "0" },
                    { "key": "transform", "value": "scaleX(0)" }
                ]
            },
            {
                object: "@context-closebutton span:nth-child(3)",
                info: [
                    { "key": "transform", "value": "translateY(-10px) rotate(-45deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim1>span:nth-child(1), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim1>span:nth-child(1), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim1>span:nth-child(1)",
                info: [
                    { "key": "transform", "value": "translateY(10px) rotate(45deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim1>span:nth-child(2), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim1>span:nth-child(2), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim1>span:nth-child(2)",
                info: [
                    { "key": "opacity", "value": "0" },
                    { "key": "transform", "value": "scaleX(0)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim1>span:nth-child(3), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim1>span:nth-child(3), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim1>span:nth-child(3)",
                info: [
                    { "key": "transform", "value": "translateY(-10px) rotate(-45deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim2>span:nth-child(1), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim2>span:nth-child(1), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim2>span:nth-child(1)",
                info: [
                    { "key": "transform", "value": "translateY(10px) rotate(135deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim2>span:nth-child(2), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim2>span:nth-child(2), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim2>span:nth-child(2)",
                info: [
                    { "key": "opacity", "value": "0" },
                    { "key": "transform", "value": "scaleX(0)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim2>span:nth-child(3), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim2>span:nth-child(3), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim2>span:nth-child(3)",
                info: [
                    { "key": "transform", "value": "translateY(-10px) rotate(-135deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim3, @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim3, @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim3",
                info: [
                    { "key": "transform", "value": "rotate(90deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim3>span:nth-child(1), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim3>span:nth-child(1), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim3>span:nth-child(1)",
                info: [
                    { "key": "transform", "value": "translateY(10px) rotate(45deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim3>span:nth-child(2), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim3>span:nth-child(2), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim3>span:nth-child(2)",
                info: [
                    { "key": "opacity", "value": "0" },
                    { "key": "transform", "value": "scaleX(0) rotate(180deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-enableAnimation@context-hamAnim3>span:nth-child(3), @context-wrap.ismenuopen@context-menumode5>@context-hamberger.hamAnim3>span:nth-child(3), @context-wrap.ismenuopen@context-menumode6>@context-hamberger.hamAnim3>span:nth-child(3)",
                info: [
                    { "key": "transform", "value": "translateY(-10px) rotate(-45deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim1>span:nth-child(1)",
                break: 768,
                info: [
                    { "key": "transform", "value": "translateY(10px) rotate(45deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim1>span:nth-child(2)",
                break: 768,
                info: [
                    { "key": "opacity", "value": "0" },
                    { "key": "transform", "value": "scaleX(0)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim1>span:nth-child(3)",
                break: 768,
                info: [
                    { "key": "transform", "value": "translateY(-10px) rotate(-45deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim2>span:nth-child(1)",
                break: 768,
                info: [
                    { "key": "transform", "value": "translateY(10px) rotate(135deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim2>span:nth-child(2)",
                break: 768,
                info: [
                    { "key": "opacity", "value": "0" },
                    { "key": "transform", "value": "scaleX(0)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim2>span:nth-child(3)",
                break: 768,
                info: [
                    { "key": "transform", "value": "translateY(-10px) rotate(-135deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim3",
                break: 768,
                info: [
                    { "key": "transform", "value": "rotate(90deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim3>span:nth-child(1)",
                break: 768,
                info: [
                    { "key": "transform", "value": "translateY(10px) rotate(45deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim3>span:nth-child(2)",
                break: 768,
                info: [
                    { "key": "opacity", "value": "0" },
                    { "key": "transform", "value": "scaleX(0) rotate(180deg)" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-hamberger@context-hamAnim3>span:nth-child(3)",
                break: 768,
                info: [
                    { "key": "transform", "value": "translateY(-10px) rotate(-45deg)" }
                ]
            },
            {
                object: "@context-mbuttons",
                info: [
                    { "key": "display", "value": "none" },
                    { "key": "text-align", "value": "center" }
                ]
            },
            {
                object: "@context-mbuttons",
                break: 768,
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "justify-content", "value": "center" },
                    { "key": "align-items", "value": "center" },
                    { "key": "width", "value": "100%" },
                    { "key": "gap", "value": "var(--site-header-layout-mobileHeaderMainGap)" },
                    { "key": "position", "value": "sticky" },
                    { "key": "bottom", "value": "0" }
                ]
            },
            {
                object: "@context-mbuttons@context-stickyToBottom",
                break: 768,
                info: [
                    { "key": "margin-top", "value": "auto" }
                ]
            },
            {
                object: "@context-mbutton1",
                break: 768,
                info: [
                    { "key": "height", "value": "auto" },
                    { "key": "justify-content", "value": "space-between" },
                    { "key": "align-items", "value": "stretch" }
                ]
            },
            {
                object: "@context-mbutton1@context-mbuttons a, @context-mbutton1@context-buttons button",
                break: 768,
                info: [
                    { "key": "flex", "value": "1 1 0" },
                    { "key": "min-width", "value": "none !important" },
                    { "key": "border-radius", "value": "var(--site-header-layout-mobileButonRound)" }
                ]
            },
            {
                object: "@context-mbutton2",
                break: 768,
                info: [
                    { "key": "height", "value": "auto" },
                    { "key": "justify-content", "value": "space-between" },
                    { "key": "flex-direction", "value": "column" },
                    { "key": "align-items", "value": "stretch" }
                ]
            },
            {
                object: "@context-mbutton2@context-mbuttons a, @context-mbutton2@context-buttons button",
                break: 768,
                info: [
                    { "key": "flex", "value": "1 1 0" },
                    { "key": "min-height", "value": "none !important" },
                    { "key": "border-radius", "value": "var(--site-header-layout-mobileButonRound)" },
                    { "key": "width", "value": "100% !important" }
                ]
            },
            {
                object: "@context-buttons",
                info: [
                    { "key": "display", "value": "flex" },
                    { "key": "gap", "value": "var(--site-header-layout-mobileHeaderMainGap)" },
                    { "key": "align-items", "value": "center" }
                ]
            },
            {
                object: "@context-button button, @context-button a",
                info: [
                    { "key": "min-width", "value": "fit-content" }
                ]
            },
            {
                object: "@context-buttons @context-secondaryCTA",
                break: 768,
                info: [
                    { "key": "display", "value": "none !important" },
                    { "key": "opacity", "value": "1" }
                ]
            },
            {
                object: "@context-wrap.ismenuopen>@context-buttons>@context-primaryCTA",
                break: 768,
                info: [
                    { "key": "opacity", "value": "0" }
                ]
            },
            {
                object: "@context-space",
                info: [
                    { "key": "flex", "value": "5 5 100%" }
                ]
            }
        ],

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
                        "min-width": flexEngineDefaultVariables.space.space.render(sz.minWidth),
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
                        "min-width": flexEngineDefaultVariables.space.space.render(sz.minWidth),
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
                        "max-width": flexEngineDefaultVariables.space.space.render(sz.width),
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
                "width": `calc(100% - ${flexEngineDefaultVariables.space.space.render(sz.marginLeft)} - ${flexEngineDefaultVariables.space.space.render(sz.marginRight)})`,
                "max-width": flexEngineDefaultVariables.space.space.render(sz.maxWidth),
                "margin-top": flexEngineDefaultVariables.space.space.render(sz.marginTop),
                "margin-left": flexEngineDefaultVariables.space.space.render(sz.marginLeft),
                "margin-right": flexEngineDefaultVariables.space.space.render(sz.marginRight),
                "height": flexEngineDefaultVariables.space.space.render(sz.height)
            };
        },

        sizeMobile: (sz, isVertical) => {
            return {
                "width": `calc(100% - ${flexEngineDefaultVariables.space.space.render(sz.mobileMarginLeft)} - ${flexEngineDefaultVariables.space.space.render(sz.mobileMarginRight)})`,
                "margin-top": flexEngineDefaultVariables.space.space.render(sz.mobileMarginTop),
                "margin-left": flexEngineDefaultVariables.space.space.render(sz.mobileMarginLeft),
                "margin-right": flexEngineDefaultVariables.space.space.render(sz.mobileMarginRight),
                "height": flexEngineDefaultVariables.space.space.render(sz.mobileHeight)
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