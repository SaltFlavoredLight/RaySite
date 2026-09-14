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
        contentQuery: [],
        layoutQuery: [],

        initQuery: [],
        initFunction: function(dataArray, element) {
            debugger; // in future we will add some default views
        },

        contentFunction: function(dataArray, documentHTML, node, createAnotherNode) {
            const mainContent = documentHTML.createElement("div");
            mainContent.className = "rs-content-header-maincontent";

            const left = documentHTML.createElement("div");
            left.className = "rs-content-header-left";

            const center = documentHTML.createElement("div");
            center.className = "rs-content-header-center";

            const right = documentHTML.createElement("div");
            right.className = "rs-content-header-right";

            mainContent.appendChild(left);
            mainContent.appendChild(center);
            mainContent.appendChild(right);

            const mobileContent = documentHTML.createElement("div");
            mobileContent.className = "rs-content-header-mobliecontent";

            const mobileLeft = documentHTML.createElement("div");
            mobileLeft.className = "rs-content-header-mleft";

            const mobileCenter = documentHTML.createElement("div");
            mobileCenter.className = "rs-content-header-mcenter";

            const mobileRight = documentHTML.createElement("div");
            mobileRight.className = "rs-content-header-mright";

            mobileContent.appendChild(mobileLeft);
            mobileContent.appendChild(mobileCenter);
            mobileContent.appendChild(mobileRight);

            node.appendChild(mainContent);
            node.appendChild(mobileContent);
        },

        jsRuntime: {},

        cssStyles: [],

        sizeQuery: [],

        sizeDefault: (sz, isVertical) => {},

        sizeMobile: (sz, isVertical) => {},
        
        settings: {
            elementType: "header",
            noDelete: true,
            hide: true,
            animation: 2,
            systemClass: true,
            allowedSortIn: true
        }
    }