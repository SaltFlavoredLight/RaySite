const body = {
        name: "Page",
        className: "RaySite",
        alts: [],
        icon: `
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                class="RaySiteUI-c-svg">
                <path d="M120-120v-80h480v80H120Zm0-160v-80h720v80H120Zm80-160q-33 0-56.5-23.5T120-520v-240q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v240q0 33-23.5 56.5T760-440H200Zm0-80h560v-240H200v240Zm0 0v-240 240Z"/>
            </svg>
        `,

        contentQuery: [
            {
                name: "header",
                label: "Header",
                type: "interactiveElements/static",
                elementNumber: 1
            },
            {
                name: "main",
                label: "Main",
                type: "interactiveElements/static",
                elementNumber: 2
            },
            {
                name: "cta",
                label: "CTA",
                type: "interactiveElements/static",
                elementNumber: 3
            },
            {
                name: "footer",
                label: "Footer",
                type: "interactiveElements/static",
                elementNumber: 4
            },
            {
                name: "popupshell",
                label: "Popups",
                type: "interactiveElements/static",
                allowedTypes: ["@root/popup"],
                elementNumber: 5
            },
            {
                name: "float",
                label: "float",
                type: "interactiveElements/noSortable",
                allowedTypes: ["@root/float"],
                elementNumber: 6
            }
        ],

        layoutQuery: [],

        initQuery: [],

        initFunction: function (dataArray, element) {
            debugger; // in future we will add some default views
        },

        contentFunction: function (
            dataArray,
            documentHTML,
            node,
            createAnotherNode
        ) {
            const headerDOM = createAnotherNode(dataArray.content.header, documentHTML, true);
            const mainDOM = createAnotherNode(dataArray.content.main, documentHTML, true);
            const ctaDOM = createAnotherNode(dataArray.content.cta, documentHTML, true);
            const footerDOM = createAnotherNode(dataArray.content.footer, documentHTML, true);
            const popupshellDOM = createAnotherNode(dataArray.content.popupshell, documentHTML, true);
            const float = createAnotherNode(dataArray.content.float, documentHTML, true);

            node.appendChild(headerDOM);
            node.appendChild(mainDOM);
            node.appendChild(ctaDOM);
            node.appendChild(footerDOM);
            node.appendChild(popupshellDOM);
            node.appendChild(float);
        },


        //createAnotherNode(dataArray, documentHTML, true)

        // nothing we needed, meh........ Oh shoot, forgot some!
        jsRuntime: {},

        cssStyles: [
            {
                "object": "html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video",
                "info": [
                    { "key": "margin", "value": "0" },
                    { "key": "padding", "value": "0" },
                    { "key": "border", "value": "0" },
                    { "key": "vertical-align", "value": "baseline" }
                ]
            },
            {
                "object": "html, body, div, span, applet, object, iframe, p, blockquote, pre, a, abbr, acronym, address, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, strike, sub, sup, tt, var, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video",
                "info": [
                    { "key": "font-size", "value": "100%" },
                    { "key": "font", "value": "inherit" }
                ]
            },
            {
                "object": "article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section",
                "info": [
                    { "key": "display", "value": "block" }
                ]
            },
            {
                "object": "body",
                "info": [
                    { "key": "line-height", "value": "1" },
                    { key: "width", value: "100%" },
                    { key: "height", value: "100%" }
                ]
            },
            {
                "object": "ol, ul",
                "info": [
                    { "key": "list-style", "value": "none" }
                ]
            }
        ],

        styleQuery: {},

        styleDefault: (sz, isVertical) => {
            return {};
        },


        styleMobile: (sz, isVertical) => {
            return {};
        },

        sizeQuery: [],

        sizeDefault: (sz, isVertical) => {
            return {};
        },

        sizeMobile: (sz, isVertical) => {
            return {};
        },

        settings: {
            elementPart: function (element) {
                return  {
                    1: element.closest("header"),
                    2: element.querySelector("main"),
                    3: element.querySelector(
                        `.${BUILDER_CONFIG.classPrefix}cta`
                    ),
                    4: element.querySelector("footer"),
                    5: element.querySelector(
                        `.${BUILDER_CONFIG.classPrefix}popupshell`
                    ),
                    6: element.querySelector(
                        `.${BUILDER_CONFIG.classPrefix}float`
                    ),
                };
            },

            systemClass: true,
            allowedSortIn: true,
            hide: true,
            noDelete: true,
            animation: 0,
            noStyles: true,
            disableAction: true,
            elementType: "html",
            skipPrefix: true
        }
    }