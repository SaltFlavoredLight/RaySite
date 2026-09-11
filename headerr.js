/* ============================================================================
   FLEX ENGINE — MODULAR HEADER
   ----------------------------------------------------------------------------
   Design goals:
   - Build the menu ONCE.
   - Do not generate separate desktop/mobile copies.
   - Keep left / middle / right lists.
   - Automatically mark items that should disappear on mobile.
   - Create one dedicated mobile-controls node.
   - Keep styling / animation / transition / action systems injectable.
   ============================================================================ */


/* ============================================================================
   MODULE FACTORY
   ============================================================================ */

function createFlexHeaderModule({
    config,
    styleEngine,
    animationEngine,
    transitionEngine,
    actionEngine,
    contextEngine
}) {

    const prefix =
        config?.classPrefix || "cw-";


    /* ========================================================================
       INTERNAL HELPERS
       ======================================================================== */

    function createElement(
        documentHTML,
        tagName,
        classNames = []
    ) {
        const node =
            documentHTML.createElement(tagName);

        for (const className of classNames) {
            if (className) {
                node.classList.add(className);
            }
        }

        return node;
    }


    function appendStyle(
        element,
        attributeName,
        style
    ) {
        const existing =
            element.getAttribute(attributeName) || "";

        const cleanExisting =
            existing.trim();

        const separator =
            cleanExisting &&
            !cleanExisting.endsWith(";")
                ? ";"
                : "";

        element.setAttribute(
            attributeName,
            `${existing}${separator} ${style}`.trim()
        );
    }


    function setId(
        element,
        id
    ) {
        if (id) {
            element.id = id;
        }
    }


    function disableStructuralAnimation(
        element
    ) {
        element.setAttribute(
            `${prefix}animation-config-self`,
            ""
        );

        element.setAttribute(
            `${prefix}animation-config-self-trigger`,
            ""
        );
    }


    /* ========================================================================
       MOBILE VISIBILITY HELPERS
       ======================================================================== */

    /**
     * Determines whether an item should disappear on mobile.
     *
     * Supported examples:
     *
     * mobile:
     * {
     *     hidden: true
     * }
     *
     * OR
     *
     * mobile:
     * {
     *     hide: true
     * }
     *
     * OR
     *
     * visibility:
     * {
     *     mobile: false
     * }
     *
     * You can standardize this later.
     */
    function shouldHideOnMobile(
        data
    ) {

        if (
            data?.mobile?.hidden === true
        ) {
            return true;
        }

        if (
            data?.mobile?.hide === true
        ) {
            return true;
        }

        if (
            data?.visibility?.mobile === false
        ) {
            return true;
        }

        /*
         * Convenience rule:
         *
         * Buttons / logos can explicitly request
         * hiding on mobile without affecting
         * normal text navigation.
         */
        if (
            data?.mobileHidden === true
        ) {
            return true;
        }

        return false;
    }


    /**
     * Applies the mobile-hidden class.
     */
    function applyMobileVisibility(
        element,
        data
    ) {
        if (
            shouldHideOnMobile(data)
        ) {
            element.classList.add(
                `${prefix}mobile-hidden`
            );

            element.setAttribute(
                "data-mobile-hidden",
                "true"
            );
        }
    }


    /* ========================================================================
       HEADER ROOT
       ======================================================================== */

    function createHeader(
        data,
        documentHTML
    ) {

        const header =
            createElement(
                documentHTML,
                "header",
                [
                    `${prefix}header`,
                    `${prefix}h${data?.id || "default"}`
                ]
            );

        setId(
            header,
            data?.JSID
        );


        /*
         * Root styling
         */
        styleEngine.apply(
            data,
            header,
            true,
            0,
            "header"
        );


        /*
         * Single header row.
         *
         * IMPORTANT:
         * There is no desktop row + mobile row.
         */
        const row =
            createHeaderRow(
                data,
                documentHTML
            );


        header.appendChild(
            row
        );


        /*
         * Root animation / transition
         */
        animationEngine.section(
            data,
            header
        );

        transitionEngine.context(
            data,
            header
        );


        return header;
    }


    /* ========================================================================
       HEADER ROW
       ======================================================================== */

    function createHeaderRow(
        data,
        documentHTML
    ) {

        const row =
            createElement(
                documentHTML,
                "div",
                [
                    `${prefix}header-row`
                ]
            );


        const maxWidth =
            styleEngine.space(
                data?.size?.maxInnerWidth ??
                "none"
            );

        const desktopGap =
            styleEngine.space(
                data?.layout?.gap ??
                "0"
            );

        const mobileGap =
            styleEngine.space(
                data?.layout?.mobileGap ??
                "0"
            );


        /*
         * Desktop layout attributes
         */
        appendStyle(
            row,
            `${prefix}styles-node`,
            `max-width: ${maxWidth};`
        );

        appendStyle(
            row,
            `${prefix}styles-node`,
            `gap: ${desktopGap};`
        );


        /*
         * Mobile layout attribute
         *
         * Your styling engine can consume this
         * however it wants.
         */
        appendStyle(
            row,
            `${prefix}styles-node-onMobile`,
            `gap: ${mobileGap};`
        );


        disableStructuralAnimation(
            row
        );


        /*
         * Three persistent menu containers.
         */
        const left =
            createHeaderPanel(
                "left",
                documentHTML
            );

        const middle =
            createHeaderPanel(
                "middle",
                documentHTML
            );

        const right =
            createHeaderPanel(
                "right",
                documentHTML
            );


        /*
         * Dedicated mobile controls.
         *
         * This is the only additional mobile-specific
         * element.
         */
        const mobile =
            createMobilePanel(
                data,
                documentHTML
            );


        /*
         * Render menu lists ONCE.
         */
        renderPanelItems(
            left,
            data?.context?.left,
            data,
            documentHTML
        );

        renderPanelItems(
            middle,
            data?.context?.middle,
            data,
            documentHTML
        );

        renderPanelItems(
            right,
            data?.context?.right,
            data,
            documentHTML
        );


        /*
         * Assemble.
         *
         * The order is intentionally:
         *
         * left
         * middle
         * right
         * mobile
         */
        row.append(
            left,
            middle,
            right,
            mobile
        );


        return row;
    }


    /* ========================================================================
       HEADER PANEL
       ======================================================================== */

    function createHeaderPanel(
        position,
        documentHTML
    ) {

        const panel =
            createElement(
                documentHTML,
                "div",
                [
                    `${prefix}header-${position}`
                ]
            );


        const list =
            createElement(
                documentHTML,
                "ul",
                [
                    `${prefix}header-${position}-list`
                ]
            );


        panel.appendChild(
            list
        );


        disableStructuralAnimation(
            panel
        );


        return panel;
    }


    /* ========================================================================
       GET LIST FROM PANEL
       ======================================================================== */

    function getPanelList(
        panel
    ) {
        return panel.querySelector(
            `.${prefix}header-${getPanelPosition(panel)}-list`
        );
    }


    function getPanelPosition(
        panel
    ) {

        if (
            panel.classList.contains(
                `${prefix}header-left`
            )
        ) {
            return "left";
        }

        if (
            panel.classList.contains(
                `${prefix}header-middle`
            )
        ) {
            return "middle";
        }

        return "right";
    }


    /* ========================================================================
       RENDER ITEMS
       ======================================================================== */

    function renderPanelItems(
        panel,
        items,
        headerData,
        documentHTML
    ) {

        if (
            !Array.isArray(items)
        ) {
            return;
        }


        const position =
            getPanelPosition(
                panel
            );


        const list =
            panel.querySelector(
                `.${prefix}header-${position}-list`
            );


        if (!list) {
            return;
        }


        for (
            const itemData
            of items
        ) {

            const item =
                createHeaderItem(
                    itemData,
                    headerData,
                    documentHTML
                );


            if (item) {
                list.appendChild(
                    item
                );
            }
        }
    }


    /* ========================================================================
       HEADER ITEM
       ======================================================================== */

    function createHeaderItem(
        data,
        headerData,
        documentHTML
    ) {

        const li =
            createElement(
                documentHTML,
                "li",
                [
                    `${prefix}header-item`,

                    data?.id
                        ? `${prefix}header-${data.id}`
                        : null
                ]
            );


        setId(
            li,
            data?.JSID
        );


        /*
         * Mark item for mobile hiding.
         */
        applyMobileVisibility(
            li,
            data
        );


        /*
         * Create actual content.
         */
        const content =
            createHeaderContent(
                data,
                headerData,
                documentHTML
            );


        if (content) {

            li.appendChild(
                content
            );
        }


        /*
         * Border / gap handling.
         */
        applyItemStyles(
            li,
            data,
            headerData
        );


        /*
         * Engine integrations.
         */
        styleEngine.apply(
            data,
            li,
            true,
            0,
            "header"
        );

        animationEngine.context(
            data,
            li
        );

        transitionEngine.context(
            data,
            li
        );


        return li;
    }


    /* ========================================================================
       HEADER CONTENT
       ======================================================================== */

    function createHeaderContent(
        data,
        headerData,
        documentHTML
    ) {

        /*
         * TEXT
         */
        if (
            data?.type === "text"
        ) {

            const node =
                actionEngine.create(
                    documentHTML,
                    data?.clickable,
                    "span"
                );


            node.classList.add(
                `${prefix}header-label`
            );


            node.textContent =
                data?.content?.label ??
                "";


            applyLabelEngine(
                data,
                node
            );


            return node;
        }


        /*
         * IMAGE / LOGO
         */
        if (
            data?.type === "img"
        ) {

            const actionNode =
                actionEngine.create(
                    documentHTML,
                    data?.clickable,
                    "span"
                );


            actionNode.classList.add(
                `${prefix}header-label`
            );


            const img =
                documentHTML.createElement(
                    "img"
                );


            img.classList.add(
                `${prefix}header-labels-img`
            );


            img.src =
                data?.content?.source ??
                "";


            img.alt =
                data?.content?.alt ??
                "";


            actionNode.appendChild(
                img
            );


            applyLabelEngine(
                data,
                actionNode
            );


            return actionNode;
        }


        /*
         * CUSTOM BUTTON
         */
        if (
            data?.type === "button"
        ) {

            const button =
                documentHTML.createElement(
                    "button"
                );


            button.type =
                "button";


            button.classList.add(
                `${prefix}header-button`
            );


            button.textContent =
                data?.content?.label ??
                "Button";


            return button;
        }


        /*
         * CUSTOM CONTEXT
         */
        if (
            data?.type === "custom"
        ) {

            const wrapper =
                documentHTML.createElement(
                    "span"
                );


            if (
                contextEngine &&
                typeof contextEngine.render ===
                    "function"
            ) {

                contextEngine.render(
                    data,
                    documentHTML,
                    wrapper
                );
            }


            return wrapper;
        }


        /*
         * Fallback
         */
        const fallback =
            documentHTML.createElement(
                "span"
            );


        fallback.textContent =
            data?.content?.label ??
            "";


        return fallback;
    }


    /* ========================================================================
       LABEL ENGINE
       ======================================================================== */

    function applyLabelEngine(
        data,
        element
    ) {

        styleEngine.apply(
            data,
            element,
            true,
            0,
            "header"
        );


        animationEngine.context(
            data,
            element
        );


        transitionEngine.context(
            data,
            element
        );
    }


    /* ========================================================================
       ITEM STYLES
       ======================================================================== */

    function applyItemStyles(
        item,
        data,
        headerData
    ) {

        const paddingBottom =
            styleEngine.space(
                headerData?.style?.paddingBottom ??
                "0"
            );


        const borderWidth =
            styleEngine.space(
                data?.gaps?.gap ??
                "0"
            );


        const borderStyle =
            data?.gaps?.incline
                ? "inset"
                : "solid";


        const borderColor =
            data?.gaps?.defaultColor ??
            "transparent";


        appendStyle(
            item,
            `${prefix}styles-node`,
            [
                `padding-bottom: ${paddingBottom}`,
                `border-bottom-width: ${borderWidth}`,
                `border-bottom-style: ${borderStyle}`,
                `border-bottom-color: ${borderColor}`
            ].join("; ") + ";"
        );
    }


    /* ========================================================================
       MOBILE PANEL
       ======================================================================== */

    function createMobilePanel(
        headerData,
        documentHTML
    ) {

        const mobile =
            createElement(
                documentHTML,
                "div",
                [
                    `${prefix}header-mobile`
                ]
            );


        /*
         * Hidden by default.
         *
         * CSS:
         *
         * .cw-header-mobile {
         *     display: none;
         * }
         *
         * @media (...) {
         *     .cw-header-mobile {
         *         display: flex;
         *     }
         * }
         */
        mobile.setAttribute(
            "data-mobile-control",
            "true"
        );


        const button =
            documentHTML.createElement(
                "button"
            );


        button.type =
            "button";


        button.classList.add(
            `${prefix}header-mobile-toggle`
        );


        button.setAttribute(
            "aria-label",
            "Toggle navigation"
        );


        button.setAttribute(
            "aria-expanded",
            "false"
        );


        /*
         * Build hamburger.
         */
        button.innerHTML = `
            <span
                class="${prefix}header-mobile-icon"
                aria-hidden="true"
            >
                <span></span>
                <span></span>
                <span></span>
            </span>
        `;


        /*
         * The mobile panel does not contain
         * another copy of the menu.
         *
         * It controls the existing panels.
         */
        button.addEventListener(
            "click",
            () => {
                toggleMobileMenu(
                    mobile
                );
            }
        );


        mobile.appendChild(
            button
        );


        disableStructuralAnimation(
            mobile
        );


        return mobile;
    }


    /* ========================================================================
       MOBILE MENU STATE
       ======================================================================== */

    function toggleMobileMenu(
        mobilePanel
    ) {

        const header =
            mobilePanel.closest(
                `.${prefix}header`
            );


        if (!header) {
            return;
        }


        const open =
            header.classList.toggle(
                `${prefix}mobile-menu-open`
            );


        const button =
            mobilePanel.querySelector(
                `.${prefix}header-mobile-toggle`
            );


        if (button) {

            button.setAttribute(
                "aria-expanded",
                String(open)
            );
        }


        /*
         * The IMPORTANT part:
         *
         * We are not generating another menu.
         *
         * We simply change the state of
         * the existing header.
         */
        return open;
    }


    /* ========================================================================
       OPTIONAL API
       ======================================================================== */

    function setMobileMenu(
        header,
        open
    ) {

        if (!header) {
            return;
        }


        header.classList.toggle(
            `${prefix}mobile-menu-open`,
            Boolean(open)
        );


        const button =
            header.querySelector(
                `.${prefix}header-mobile-toggle`
            );


        if (button) {

            button.setAttribute(
                "aria-expanded",
                String(Boolean(open))
            );
        }
    }


    function getMobileMenuState(
        header
    ) {

        return Boolean(
            header?.classList.contains(
                `${prefix}mobile-menu-open`
            )
        );
    }


    /* ========================================================================
       PUBLIC API
       ======================================================================== */

    return {

        render:
            createHeader,

        createHeader,

        createHeaderRow,

        createHeaderItem,

        createHeaderContent,

        toggleMobileMenu,

        setMobileMenu,

        getMobileMenuState
    };
}