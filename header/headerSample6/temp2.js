function startRuntime(element) {
	if (element) {
		const hamburger = element.querySelector(".site-content-header-hamberger");
		const menuWrap = element.querySelector(".site-content-header-wrap");
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

		document.addEventListener("click", (event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const closeButton = target.closest(".site-content-header-closebutton");
			if (!closeButton) return;
			const navPage = closeButton.closest(".site-content-header-navpage");
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
				const match = className.match(/^site-content-header-nested(\d+)$/);
				if (match) {
					return Number(match[1]);
				}
			}
			return 0;
		}

		element.querySelectorAll('[class*="site-content-header-nested"]').forEach((nested) => {
			const level = getNestedLevel(nested);
			if (level !== 1 && level !== 2 && level !== 3 && level !== 4) {
				return;
			}

			const menu = nested.querySelector(".site-content-header-menu") || element.querySelector(".site-content-header-menu");
			if (!menu) return;

			const navPages = Array.from(menu.querySelectorAll(".site-content-header-navpage"));

			const toggleSubmenu = (navPage) => {
				const isOpen = navPage.classList.contains("issubmenuopen");

				if (!isOpen && (level == 2 || level == 3)) {
					navPages.forEach((page) => {
						if (page !== navPage) {
							page.classList.remove("issubmenuopen");
						}
					});
				}

				const submenu = navPage.querySelector(".site-content-header-submenu");

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
				const submenuIcon = navPage.querySelector(".site-content-header-menusubicon");

				if (submenuIcon) {
					submenuIcon.addEventListener("click", (event) => {
						event.preventDefault();
						event.stopPropagation();
						toggleSubmenu(navPage);
					});
				}

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

			const closeButton = target.closest(".site-content-header-closebutton");
			if (!closeButton) return;

			const navPage = closeButton.closest(".site-content-header-navpage");

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
}
