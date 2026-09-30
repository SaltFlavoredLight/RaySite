function createHeader(dataArray, documentHTML, node, createAnotherNode) {

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
        logoLink.textContent = content[`logo.text`] ?? ``;
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

    const navItems = Array.isArray(content.nav)
        ? content.nav
        : [];

    navItems.forEach(navData => {
        const navItem = documentHTML.createElement(`li`);
        navItem.classList.add(`${prefix}content-header-navpage`);

        const navLink = documentHTML.createElement(`a`);
        navLink.textContent = navData.name ?? ``;

        if (navData.url != null) {
            navLink.href = navData.url;
        }

        navItem.appendChild(navLink);

        debugger; // I am unsure about should I enter a 
        // close button in submenu or not? 
        // well, we will use layout for help

        // Submenu
        if (
            Array.isArray(navData.children) &&
            navData.children.length > 0
        ) {
            const submenu = documentHTML.createElement(`ul`);
            submenu.classList.add(`${prefix}content-header-submenu`);

            navData.children.forEach(childData => {
                const submenuItem = documentHTML.createElement(`li`);

                const submenuLink = documentHTML.createElement(`a`);
                submenuLink.textContent = childData.name ?? ``;

                if (childData.url != null) {
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
        mobileSecondary.classList.add(
            `${prefix}content-header-secondaryCTA`
        );
        mobileSecondary.textContent =
            content[`secondaryButton.text`] ?? ``;

        if (content[`secondaryButton.url`] != null) {
            mobileSecondary.href =
                content[`secondaryButton.url`];
        }

        if (content[`secondaryButton.newPage`]) {
            mobileSecondary.target = `_blank`;
            mobileSecondary.rel = `noopener noreferrer`;
        }

        mobileButtons.appendChild(mobileSecondary);
    }

    if (content[`primaryButton.enable`]) {
        const mobilePrimary = documentHTML.createElement(`a`);
        mobilePrimary.classList.add(
            `${prefix}content-header-primaryCTA`
        );
        mobilePrimary.textContent =
            content[`primaryButton.text`] ?? ``;

        if (content[`primaryButton.url`] != null) {
            mobilePrimary.href =
                content[`primaryButton.url`];
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
        secondary.classList.add(
            `${prefix}content-header-secondaryCTA`
        );
        secondary.textContent =
            content[`secondaryButton.text`] ?? ``;

        if (content[`secondaryButton.url`] != null) {
            secondary.href =
                content[`secondaryButton.url`];
        }

        if (content[`secondaryButton.newPage`]) {
            secondary.target = `_blank`;
            secondary.rel = `noopener noreferrer`;
        }

        buttons.appendChild(secondary);
    }

    if (content[`primaryButton.enable`]) {
        const primary = documentHTML.createElement(`a`);
        primary.classList.add(
            `${prefix}content-header-primaryCTA`
        );
        primary.textContent =
            content[`primaryButton.text`] ?? ``;

        if (content[`primaryButton.url`] != null) {
            primary.href =
                content[`primaryButton.url`];
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
    debugger;
    const cssVaribles = `
            --${prefix}header-layout-desktopHeaderMaxInnerWidth: 1200px;
            --${prefix}header-layout-desktopHeaderMainGap: 24px;
            --${prefix}header-layout-mobileHeaderMainGap: 16px;
            --${prefix}header-layout-desktopHeaderSeparateBorderSpace: 1px;
            --${prefix}header-layout-spaceBetween: 12px;
            --${prefix}header-layout-navMajorGap: 24px;
            --${prefix}header-layout-navMinorGap: 8px;
            --${prefix}header-layout-transitionTime: 300ms;
            --${prefix}header-layout-transitionCurve: ease;
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
        logoWrap.classList.add(
            `${prefix}content-header-${position.logo}`
        );

        nav.classList.add(
            `${prefix}content-header-${position.nav}`
        );

        buttons.classList.add(
            `${prefix}content-header-${position.cta}`
        );
        
        spaceWrap.classList.add(
        	`${prefix}content-header-${position.space}`
        );
    }


    /*
       MobileMenuPlace:
       it is either left or right, it will add:
       .site-content-header-mobile-onleft or onright

       mobileLogoPosition:
       Almost same, but is left or center.
    */
    hamburger.classList.add(
        `${prefix}-content-header-mobile-${(layout.MobileMenuPlace === "left") ? "onleft" : "onright"}`
    );
    logoWrap.classList.add(
        `${prefix}-content-header-mobile-${(layout.mobileLogoPosition === "left") ? "onleft" : "oncenter"}`
    );
    buttons.classList.add(
        `${prefix}-content-header-mobile-onright`
    );

    const resultForSpace = (layout.MobileMenuPlace === "left") 
        ? 
        (layout.mobileLogoPosition === "left") ? "oncenter" : "onhidden" 
        : 
        (layout.mobileLogoPosition === "left") ? "oncenter" : "onleft";

    spaceWrap.classList.add(
        `${prefix}-content-header-mobile-${resultForSpace}`
    )
       
    /*
       desktopMenuMode:
        as .site-content-header-menumode{number} on wrap
    */
    contentWrap.classList.add(
        `${prefix}content-header-menumode${layout.desktopMenuMode}`
    );

    /*
       nestingSupport:
       as .site-content-header-nested{mode} on menu
    */
    debugger; // remember, it is not enough - 
    // we still need to add a close button when in 2 or 3

    nav.classList.add(
        `${prefix}content-header-nested${layout.nestingSupport}`
    );

    /*
       mobileMenuMode:
       as .site-content-header-mobileMenuAnimamtion{mode} on menu
    */
    nav.classList.add(
        `${prefix}content-header-mobileMenuAnimamtion${layout.mobileMenuMode}`
    );
    
    /*
       mobileCtaType:
       as .site-content-header-mbutton{mode} on mbotton
    */
    mobileButtons.classList.add(
        `${prefix}content-header-mbutton${layout.mobileCtaType}`
    );

    /*
       hamAnimation:
       as .site-content-header-hamAnim{mode} on hamberger desktop.
    */
    hamburger.classList.add(
        `${prefix}content-header-hamAnim${layout.hamAnimation}`
    )

    // End Layout Creation
}