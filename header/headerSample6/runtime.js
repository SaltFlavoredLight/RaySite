// Now is JS runtime.
function startRuntime(element) {
	if (element) {
		const hamburger = element.querySelector(".site-content-header-hamberger");
		const menuWrap = element.querySelector(".site-content-header-wrap");
		/*
		 * --------------------------------------------------
		 * 1. OPEN / CLOSE MAIN MENU
		 * --------------------------------------------------
		 */
		const clearSubmenus = (scope = element) => {
			scope.querySelectorAll(".site-content-header-navpage.issubmenuopen").forEach((navPage) => {
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
				element.querySelectorAll(".site-content-header-navpage.issubmenuopen").length > 0
			) {
				clearSubmenus();
				return;
			}

			menuWrap?.classList.toggle("ismenuopen");
		});

		/*
		 * --------------------------------------------------
		 * 2. CLOSE BUTTONS
		 * --------------------------------------------------
		 *
		 * There are TWO different types:
		 *
		 * A. GLOBAL CLOSE BUTTON
		 *
		 *    .site-content-header-closebutton
		 *    located directly in / under the main WRAP,
		 *    but NOT inside a navpage.
		 *
		 *    => closes the ENTIRE menu.
		 *
		 *
		 * B. NAVPAGE CLOSE BUTTON
		 *
		 *    .site-content-header-closebutton
		 *    located inside a .site-content-header-navpage.
		 *
		 *    => closes ONLY that navpage's submenu.
		 *
		 * This listener is document-level because the global
		 * close button / Subpage can exist outside `element`.
		 * --------------------------------------------------
		 */
		document.addEventListener("click", (event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const closeButton = target.closest(".site-content-header-closebutton");
			if (!closeButton) return;
			/*
			 * First determine whether this close button
			 * belongs to a navpage.
			 */
			const navPage = closeButton.closest(".site-content-header-navpage");
			/*
			 * ------------------------------------------------
			 * NAVPAGE CLOSE BUTTON
			 * ------------------------------------------------
			 *
			 * Only close THIS submenu level.
			 */
			if (navPage) {
				navPage.classList.remove("issubmenuopen");
				/*
				 * Do NOT close the main menu.
				 * Do NOT clear other submenu levels.
				 */
				return;
			}
			/*
			 * ------------------------------------------------
			 * GLOBAL CLOSE BUTTON
			 * ------------------------------------------------
			 *
			 * It is not inside a navpage, so it closes
			 * the entire menu.
			 */
			if (menuWrap && (menuWrap.contains(closeButton) || element.contains(closeButton))) {
				closeMenu();
			}
		});
		/*
		 * --------------------------------------------------
		 * 3. NESTED MENU BEHAVIOR
		 * --------------------------------------------------
		 *
		 * Mode 1:
		 *   Opening a submenu does NOT close other submenus.
		 *
		 * Mode 2 / 3 / 4:
		 *   Opening a submenu closes other submenus
		 *   in the SAME menu level.
		 *
		 * Clicking an already-open submenu toggles it closed.
		 * --------------------------------------------------
		 */
		function getNestedLevel(nested) {
			if (!nested) return 0;
			for (const className of nested.classList) {
				const match = className.match(/^site-content-header-nested(\d+)$/);
				if (match) {
					return Number(match[1]);
				}
			}
			return 0;
		}
		/*
		 * Find every nested mode.
		 */
		element.querySelectorAll('[class*="site-content-header-nested"]').forEach((nested) => {
			const level = getNestedLevel(nested);
			if (level !== 1 && level !== 2 && level !== 3 && level !== 4) {
				return;
			}
			/*
			 * Find the menu bar belonging to this mode.
			 */
			const menu = nested.querySelector(".site-content-header-menu") || element.querySelector(".site-content-header-menu");
			if (!menu) return;
			/*
			 * Find every navpage in this menu.
			 */
			const navPages = Array.from(menu.querySelectorAll(".site-content-header-navpage"));
			/*
			 * ------------------------------------------------
			 * Toggle one submenu.
			 * ------------------------------------------------
			 */
			const toggleSubmenu = (navPage) => {
				const isOpen = navPage.classList.contains("issubmenuopen");
				/*
				 * If opening:
				 *
				 * Mode 1:
				 *   Leave all other submenus alone.
				 *
				 * Mode 2/3/4:
				 *   Close other navpages in this menu.
				 */
				if (!isOpen && (level == 2 || level == 3)) {
					navPages.forEach((page) => {
						if (page !== navPage) {
							page.classList.remove("issubmenuopen");
						}
					});
				}
				const element = navPage.querySelector(".site-content-header-submenu");
				if (element && (level == 1 || level == 4)) {
					if (!isOpen) {
						element.style.maxHeight = element.scrollHeight + "px";
					} else {
						element.style.maxHeight = element.scrollHeight + "px";
						requestAnimationFrame(() => {
							element.style.maxHeight = null;
						});
					}
				}
				debugger;
				/*
				 * This is the ONLY state change.
				 * CSS handles the animation.
				 */
				navPage.classList.toggle("issubmenuopen");
			};
			/*
			 * Configure every navpage.
			 */
			navPages.forEach((navPage) => {
				/*
				 * Find submenu icon.
				 *
				 * No icon = no submenu trigger.
				 */
				const submenuIcon = navPage.querySelector(".site-content-header-menusubicon");
				/*
				 * ------------------------------------------------
				 * SUBMENU ICON
				 * ------------------------------------------------
				 */
				if (submenuIcon) {
					submenuIcon.addEventListener("click", (event) => {
						event.preventDefault();
						event.stopPropagation();
						toggleSubmenu(navPage);
					});
				}
				/*
				 * ------------------------------------------------
				 * MODE 3 / 4
				 *
				 * The FIRST direct element of the navpage
				 * becomes another trigger.
				 *
				 * It can be:
				 *   <a>
				 *   <span>
				 *   etc.
				 *
				 * Its normal action is prevented.
				 *
				 * It performs EXACTLY the same toggle as
				 * clicking the submenu icon.
				 * ------------------------------------------------
				 */
				if (
					(level === 3 || level === 4) &&
					navPage.querySelector(":scope > .site-content-header-submenu")
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
		/*
		 * --------------------------------------------------
		 * 4. .onTop
		 * --------------------------------------------------
		 */
		const updateOnTop = () => {
			if (!menuWrap) return;
			const menuIsOpen = menuWrap.classList.contains("ismenuopen");
			/*
			 * Menu open = never onTop.
			 */
			if (menuIsOpen) {
				element.classList.remove("onTop");
				return;
			}
			/*
			 * Menu closed = onTop depends on scroll.
			 */
			const isAtTop = window.scrollY <= 0;
			element.classList.toggle("onTop", isAtTop);
		};
		window.addEventListener("scroll", updateOnTop, {
			passive: true
		});
		hamburger?.addEventListener("click", updateOnTop);
		/*
		 * A global close button changes the main menu state,
		 * so update .onTop after it is clicked.
		 *
		 * A navpage close button does NOT affect the main
		 * menu state, so it does not need updateOnTop().
		 */
		document.addEventListener("click", (event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const closeButton = target.closest(".site-content-header-closebutton");
			if (!closeButton) return;
			const navPage = closeButton.closest(".site-content-header-navpage");
			/*
			 * Only global close buttons update the main
			 * header state.
			 */
			if (!navPage) {
				updateOnTop();
			}
		});
		updateOnTop();

		function applyMenuStyle(header) {
		const targetClass = "site-content-header-menustyleapply";

		const hasTargetMode = [
			"site-content-header-menumode5",
			"site-content-header-menumode6"
		].some(className =>
			header.matches(`.${className}`) ||
			header.querySelector(`.${className}`)
		);

		if (!hasTargetMode) return;

		const styleElement = [
			...(header.matches(`.${targetClass}`) ? [header] : []),
			...header.querySelectorAll(`.${targetClass}`)
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
}