// Select your elements
const leftBarMenuToggle = document.querySelector('.app-iconmenu'); // Your Hamburger/Logo
const topLeftPageMenu = document.querySelector('.app-iconmenulist'); // The Glass Menu

leftBarMenuToggle.addEventListener('click', (e) => {
    //e.stopPropagation(); 
    
    leftBarMenuToggle.classList.toggle('active');
    topLeftPageMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!topLeftPageMenu.contains(e.target) && topLeftPageMenu.classList.contains('active')) {
        leftBarMenuToggle.classList.remove('active');
        topLeftPageMenu.classList.remove('active');
    }
});

// left menu

let leftBannerOpenWhich = null;
let closeTimeout = null;

const leftBannerOpenList = [
    {"icon": "#app-leftbarAddButton", "menu": "#app-leftAddBanner", "hold": null},
    {"icon": "#app-leftbarSectionsButton", "menu": "#app-leftSectionsBanner", "hold": null},
    {"icon": "#app-leftbarPagesButton", "menu": "#app-leftPagesBanner", "hold": null}
];

leftBannerOpenList.forEach(pair => {
    const btn = document.querySelector(pair.icon);
    const menu = document.querySelector(pair.menu);

    if (btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(closeTimeout);

            const isAlreadyOpen = menu.classList.contains('active');
            const somethingIsVisible = leftBannerOpenWhich !== null;

            // 1. Close ALL menus immediately (starts the CSS fade-out)
            leftBannerOpenList.forEach(p => {
                document.querySelector(p.menu)?.classList.remove('active');
                document.querySelector(p.icon)?.classList.remove('active');
            });

            // 2. Decide: Instant or Delayed?
            if (!isAlreadyOpen) {
                // If something was open, wait 70ms for it to disappear
                const delay = somethingIsVisible ? 70 : 0;

                closeTimeout = setTimeout(() => {
                    menu.classList.add('active');
                    btn.classList.add('active');
                    leftBannerOpenWhich = pair.icon;
                }, delay);
            } else {
                // Just closing the current one
                leftBannerOpenWhich = null;
            }
        });
    }
});

// Click outside still closes instantly (usually best for UX)
document.addEventListener('click', (e) => {
    if (leftBannerOpenWhich) {
        const isInside = leftBannerOpenList.some(p => 
            document.querySelector(p.menu)?.contains(e.target) || 
            document.querySelector(p.icon)?.contains(e.target)
        );

        if (!isInside) {
            leftBannerOpenList.forEach(p => {
                document.querySelector(p.menu)?.classList.remove('active');
                document.querySelector(p.icon)?.classList.remove('active');
            });
            leftBannerOpenWhich = null;
        }
    }
});