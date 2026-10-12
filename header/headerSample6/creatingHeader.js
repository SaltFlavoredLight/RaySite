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
            --${prefix}header-layout-desktopHeaderMaxInnerWidth: ${flexEngineStyleVarible.space(layout.desktopHeaderMaxInnerWidth)};
            --${prefix}header-layout-desktopHeaderMainGap: ${flexEngineStyleVarible.space(layout.desktopHeaderMainGap)};
            --${prefix}header-layout-mobileHeaderMainGap: ${flexEngineStyleVarible.space(layout.mobileHeaderMainGap)};
            --${prefix}header-layout-desktopHeaderSeparateBorderSpace: ${flexEngineStyleVarible.space(layout.desktopHeaderSeparateBorderSpace)};
            --${prefix}header-layout-spaceBetween: ${flexEngineStyleVarible.space(layout.spaceBetween)};
            --${prefix}header-layout-navMajorGap: ${flexEngineStyleVarible.space(layout.navMajorGap)};
            --${prefix}header-layout-navMinorGap: ${flexEngineStyleVarible.space(layout.navMinorGap)};
            --${prefix}header-layout-transitionTime: ${layout.transitionTime};
            --${prefix}header-layout-transitionCurve: ${flexEngineStyleVarible.curve(layout.transitionCurve)};
            --${prefix}header-layout-mobileButonRound: ${flexEngineStyleVarible.space(layout.mobileButonRound)};
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
}