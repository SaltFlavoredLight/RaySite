'use strict';
import { flexEngineDefaultVariables } from './flexEngine';

/**
 * Default Appearance Settings for FlexEngine
 * this is useful when you want just use default setting.
 *
 * Fallback: Element, Category, Base.
 */
export const defaultAppearance = {
    styleQuery: [{
        name: "paddingTop",
        label: "Padding Top",
        type: "space"
    }, {
        name: "paddingBottom",
        label: "Padding Bottom",
        type: "space"
    }, {
        name: "paddingLeft",
        label: "Padding Left",
        type: "space"
    }, {
        name: "paddingRight",
        label: "Padding Right",
        type: "space"
    }, {
        name: "borderMode",
        label: "Border Style",
        type: "selection",
        choice: [{
            label: "Solid",
            value: "solid"
        }, {
            label: "None",
            value: "none"
        }, {
            label: "Dashed",
            value: "dashed"
        }, {
            label: "Dotted",
            value: "dotted"
        }, {
            label: "Double",
            value: "double"
        }]
    }, {
        name: "borderTop",
        label: "Top Border",
        type: "space"
    }, {
        name: "borderBottom",
        label: "Bottom Border",
        type: "space"
    }, {
        name: "borderLeft",
        label: "Left Border",
        type: "space"
    }, {
        name: "borderRight",
        label: "Right Border",
        type: "space"
    }, {
        name: "borderRadius",
        label: "Border Radius",
        type: "integer/noNeg"
    }, {
        name: "shadow",
        label: "Shadow",
        type: "boolean/checkmark"
    }, {
        name: "shadowInset",
        label: "Shadow Inset",
        type: "boolean/checkmark"
    }, {
        name: "shadowOffsetX",
        label: "Shadow Offset X",
        type: "integer"
    }, {
        name: "shadowOffsetY",
        label: "Shadow Offset Y",
        type: "integer"
    }, {
        name: "shadowBlur",
        label: "Shadow Blur",
        type: "integer/noNeg"
    }, {
        name: "shadowExpand",
        label: "Shadow Expand",
        type: "integer"
    }, {
        name: "shadowColor",
        label: "Shadow Color",
        type: "color/picker"
    }, {
        name: "textColor",
        label: "Text Color",
        type: "color/picker"
    }, {
        name: "background",
        label: "Background",
        type: "color/picker"
    }, {
        name: "blur",
        label: "Blur",
        type: "integer/noNeg"
    }, {
        name: "font",
        label: "Font",
        type: "string/text"
    }, {
        name: "markColor",
        label: "Caret Color",
        type: "color/picker"
    }, {
        name: "mobilePaddingTop",
        label: "Mobile Padding Top",
        type: "space"
    }, {
        name: "mobilePaddingBottom",
        label: "Mobile Padding Bottom",
        type: "space"
    }, {
        name: "mobilePaddingLeft",
        label: "Mobile Padding Left",
        type: "space"
    }, {
        name: "mobilePaddingRight",
        label: "Mobile Padding Right",
        type: "space"
    }],
    styleDefault: (s) => {
        return {
            "padding-top": flexEngineDefaultVariables.space.space.render(s.paddingTop),
            "padding-bottom": flexEngineDefaultVariables.space.space.render(s.paddingBottom),
            "padding-left": flexEngineDefaultVariables.space.space.render(s.paddingLeft),
            "padding-right": flexEngineDefaultVariables.space.space.render(s.paddingRight),
            "border-style": s.borderMode || "solid",
            "border-top": flexEngineDefaultVariables.space.space.render(s.borderTop) || "0px",
            "border-bottom": flexEngineDefaultVariables.space.space.render(s.borderBottom) || "0px",
            "border-left": flexEngineDefaultVariables.space.space.render(s.borderLeft) || "0px",
            "border-right": flexEngineDefaultVariables.space.space.render(s.borderRight) || "0px",
            "border-radius": `${s.borderRadius || 0}px`,
            "box-shadow": s.shadow ? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpand || 0}px ${flexEngineDefaultVariables.color.picker.render(s.shadowColor)}` : "none",
            "color": s.textColor
                ? flexEngineDefaultVariables.color.picker.render(s.textColor)
                : "inherit",
            "background": flexEngineDefaultVariables.color.picker.render(s.background),
            "filter": s.blur ? `blur(${s.blur}px)` : "none",
            "font-family": s.font || "inherit",
            "caret-color": s.markColor
                ? flexEngineDefaultVariables.color.picker.render(s.markColor)
                : "auto",
        };
    },
    styleMobile: (s) => {
        return {
            "padding-top": flexEngineDefaultVariables.space.space.render(s.mobilePaddingTop),
            "padding-bottom": flexEngineDefaultVariables.space.space.render(s.mobilePaddingBottom),
            "padding-left": flexEngineDefaultVariables.space.space.render(s.mobilePaddingLeft),
            "padding-right": flexEngineDefaultVariables.space.space.render(s.mobilePaddingRight)
        };
    },


    sizeQuery: [],
    sizeDefault: (sz, isVertical) => {
        return {};
    },

    sizeMobile: (sz, isVertical) => {
        return {};
    }
};
