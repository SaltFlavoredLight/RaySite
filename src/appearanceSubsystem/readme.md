```js
/**
 * ------------------------------------------------------------------------------
 * Styler Manager
 * 
 * Those were for Property like Style
 * Last Update: 1.0.0
 * ------------------------------------------------------------------------------
 *
 * Expected structure:
 *
 *
 * DATA TREE
 *
 * data
 * └─ appearance
 *    └─ [appearance]
 *       └─ [target]
 *          └─ [state]
 *             ├─ style
 *             └─ size
 *
 * EXTRA / QUERY TREE
 *
 * settings
 * └─ [element]
 *    ├─ styleDefault
 *    ├─ styleMobile
 *    ├─ sizeDefault
 *    ├─ sizeMobile
 *    └─ extras
 *       └─ [position]
 *          ├─ styleDefault
 *          ├─ styleMobile
 *          ├─ sizeDefault
 *          └─ sizeMobile
 */
```
```js

/*
Sample:
debugger;
const elementMode = "content/card";

const BUILDER_CONFIG = {
    classPrefix: "fx"
};
const flexEngineDefaultElements = {
    content: {
        styleDefault: (style) => ({
            color: style.color
        }),
        styleMobile: (style) => ({
            color: style.color
        }),
        sizeDefault: (size, isVertical) => ({
            width: isVertical ? "100%" : size.width,
            height: size.height
        }),
        sizeMobile: (size) => ({
            width: "100%",
            height: size.height
        }),
        card: {
            styleDefault: (style) => ({
                color: style.color,
                "background-color": style.background,
                "border-radius": style.radius,
                padding: style.padding
            }),
            styleMobile: (style) => ({
                color: style.color,
                "background-color": style.background,
                padding: style.padding,
                "font-size": style.fontSize
            }),
            extras: [{
                position: "2_1",
                styleDefault: (style) => ({
                    color: style.color,
                    "font-size": style.fontSize,
                    "font-weight": style.fontWeight
                }),
                sizeDefault: (size) => ({
                    width: size.width,
                    height: size.height
                })
            }, {
                position: "3"
            }]
        }
    }
};
*/
```