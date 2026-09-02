const flexEngineAnimationQueries = {

    // =========================================================
    // 0. showup
    // =========================================================
    showup: [],


    // =========================================================
    // 1. fade
    // =========================================================
    fade: [],


    // =========================================================
    // 2. flyIn
    // =========================================================
    flyIn: [
        {
            name: "direction",
            label: "Direction",
            type: "integer/slide",
            min: 0,
            max: 359,
            step: 1,
            default: 0
        },
        {
            name: "intensity",
            label: "Distance",
            type: "integer/noNeg",
            default: 60
        }
    ],


    // =========================================================
    // 3. growTurn
    // =========================================================
    growTurn: [
        {
            name: "rotate",
            label: "Rotate Deg",
            type: "integer",
            default: -25
        }
    ],


    // =========================================================
    // 4. zoom
    // =========================================================
    zoom: [],


    // =========================================================
    // 5. basicZoom
    // =========================================================
    basicZoom: [
        {
            name: "scaleStart",
            label: "Starting Scale %",
            type: "integer/slide",
            min: 0,
            max: 100,
            step: 1,
            default: 85
        }
    ],


    // =========================================================
    // 6. rise
    // =========================================================
    rise: [
        {
            name: "direction",
            label: "Direction",
            type: "selection",
            choice: [
                { label: "Top", value: 1 },
                { label: "Top Right", value: 2 },
                { label: "Right", value: 3 },
                { label: "Bottom Right", value: 4 },
                { label: "Bottom", value: 5 },
                { label: "Bottom Left", value: 6 },
                { label: "Left", value: 7 },
                { label: "Top Left", value: 8 }
            ]
        },
        {
            name: "intensity",
            label: "Distance",
            type: "integer/noNeg",
            default: 25
        }
    ],


    // =========================================================
    // 7. stretch
    // =========================================================
    stretch: [
        {
            name: "direction",
            label: "Direction",
            type: "selection",
            choice: [
                { label: "Top", value: 1 },
                { label: "Right", value: 2 },
                { label: "Bottom", value: 3 },
                { label: "Left", value: 4 }
            ]
        }
    ],


    // =========================================================
    // 8. wipe
    // =========================================================
    wipe: [
        {
            name: "direction",
            label: "Direction",
            type: "selection",
            choice: [
                { label: "Top", value: 1 },
                { label: "Right", value: 2 },
                { label: "Bottom", value: 3 },
                { label: "Left", value: 4 }
            ]
        }
    ],


    // =========================================================
    // 9. peekIn
    // =========================================================
    peekIn: [
        {
            name: "direction",
            label: "Direction",
            type: "selection",
            choice: [
                { label: "Top", value: 1 },
                { label: "Right", value: 2 },
                { label: "Bottom", value: 3 },
                { label: "Left", value: 4 }
            ]
        },
        {
            name: "intensity",
            label: "Distance",
            type: "integer/noNeg",
            default: 40
        }
    ],


    // =========================================================
    // 10. box
    // =========================================================
    box: [
        {
            name: "x",
            label: "Horizontal Origin",
            type: "selection",
            choice: [
                { label: "Right", value: 1 },
                { label: "Center", value: 2 },
                { label: "Left", value: 3 }
            ]
        },
        {
            name: "y",
            label: "Vertical Origin",
            type: "selection",
            choice: [
                { label: "Bottom", value: 1 },
                { label: "Center", value: 2 },
                { label: "Top", value: 3 }
            ]
        }
    ],


    // =========================================================
    // 11. expand
    // =========================================================
    expand: [],


    // =========================================================
    // 12. tumble
    // =========================================================
    tumble: [
        {
            name: "directionRight",
            label: "Direction Right?",
            type: "selection",
            choice: [
                { label: "Left", value: 0 },
                { label: "Right", value: 1 }
            ]
        },
        {
            name: "fromUp",
            label: "From Up?",
            type: "selection",
            choice: [
                { label: "No", value: 0 },
                { label: "Yes", value: 1 }
            ]
        },
        {
            name: "intensity",
            label: "Rotate Deg",
            type: "integer",
            default: -120
        }
    ],


    // =========================================================
    // 13. rotate
    // =========================================================
    rotate: [
        {
            name: "directionRight",
            label: "Direction Right?",
            type: "selection",
            choice: [
                { label: "Left", value: 0 },
                { label: "Right", value: 1 }
            ]
        },
        {
            name: "intensity",
            label: "Rotate Deg",
            type: "integer",
            default: 180
        }
    ],


    // =========================================================
    // 14. slideRotate
    // =========================================================
    slideRotate: [
        {
            name: "intensity",
            label: "Rotate Deg",
            type: "integer",
            default: 180
        },
        {
            name: "slideAmountX",
            label: "Slide X",
            type: "integer",
            default: 0
        },
        {
            name: "slideAmountY",
            label: "Slide Y",
            type: "integer",
            default: 100
        }
    ]
};