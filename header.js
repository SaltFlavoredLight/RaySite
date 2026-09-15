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