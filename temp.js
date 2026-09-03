const flexEngineAppearance = {
    styleQuery: [
		{
			name: "paddingTop",
			label: "Padding Top",
			type: "space"
		},
		{
			name: "paddingBottom",
			label: "Padding Bottom",
			type: "space"
		},
		{
			name: "paddingLeft",
			label: "Padding Left",
			type: "space"
		},
		{
			name: "paddingRight",
			label: "Padding Right",
			type: "space"
		},

		{
			name: "borderMode",
			label: "Border Style",
			type: "selection",
			choice: [
				{ label: "Solid", value: "solid" },
				{ label: "None", value: "none" },
				{ label: "Dashed", value: "dashed" },
				{ label: "Dotted", value: "dotted" },
				{ label: "Double", value: "double" }
			]
		},
		{
			name: "borderTop",
			label: "Top Border",
			type: "space"
		},
		{
			name: "borderBottom",
			label: "Bottom Border",
			type: "space"
		},
		{
			name: "borderLeft",
			label: "Left Border",
			type: "space"
		},
		{
			name: "borderRight",
			label: "Right Border",
			type: "space"
		},
		{
			name: "borderRadius",
			label: "Border Radius",
			type: "integer/noNeg"
		},

		{
			name: "shadow",
			label: "Shadow",
			type: "boolean/checkmark"
		},
		{
			name: "shadowInset",
			label: "Shadow Inset",
			type: "boolean/checkmark"
		},
		{
			name: "shadowOffsetX",
			label: "Shadow Offset X",
			type: "integer"
		},
		{
			name: "shadowOffsetY",
			label: "Shadow Offset Y",
			type: "integer"
		},
		{
			name: "shadowBlur",
			label: "Shadow Blur",
			type: "integer/noNeg"
		},
		{
			name: "shadowExpand",
			label: "Shadow Expand",
			type: "integer"
		},
		{
			name: "shadowColor",
			label: "Shadow Color",
			type: "color/picker"
		},

		{
			name: "textColor",
			label: "Text Color",
			type: "color/picker"
		},
		{
			name: "background",
			label: "Background",
			type: "color/picker"
		},
		{
			name: "blur",
			label: "Blur",
			type: "integer/noNeg"
		},
		{
			name: "font",
			label: "Font",
			type: "string/text"
		},
		{
			name: "markColor",
			label: "Caret Color",
			type: "color/picker"
		},

		{
			name: "mobilePaddingTop",
			label: "Mobile Padding Top",
			type: "space"
		},
		{
			name: "mobilePaddingBottom",
			label: "Mobile Padding Bottom",
			type: "space"
		},
		{
			name: "mobilePaddingLeft",
			label: "Mobile Padding Left",
			type: "space"
		},
		{
			name: "mobilePaddingRight",
			label: "Mobile Padding Right",
			type: "space"
		}
	],

	styleDefault: (s) => {
		return {
			"padding-top": flexEngineStyleVarible.space(s.paddingTop),
			"padding-bottom": flexEngineStyleVarible.space(s.paddingBottom),
			"padding-left": flexEngineStyleVarible.space(s.paddingLeft),
			"padding-right": flexEngineStyleVarible.space(s.paddingRight),
			"border-style": s.borderMode || "solid",
			"border-top": flexEngineStyleVarible.space(s.borderTop) || "0px",
			"border-bottom": flexEngineStyleVarible.space(s.borderBottom) || "0px",
			"border-left": flexEngineStyleVarible.space(s.borderLeft) || "0px",
			"border-right": flexEngineStyleVarible.space(s.borderRight) || "0px",
			"border-radius": `${s.borderRadius || 0}px`,
			"box-shadow": s.shadow
				? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpand || 0}px ${engine.color(s.shadowColor)}`
				: "none",
			"color": engine.color(s.textColor),
			"background": engine.color(s.background),
			"filter": s.blur ? `blur(${s.blur}px)` : "none",
			"font-family": s.font || "inherit",
			"caret-color": engine.color(s.markColor),
		};
	},

	styleMobile: (s) => {
		return {
			"padding-top": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingTop),
			"padding-bottom": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingBottom),
			"padding-left": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingLeft),
			"padding-right": flexEngineStyleVarible.space(dataArray.style?.mobilePaddingRight)
		};
	}
};
