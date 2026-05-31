const engine = flexEngineStyleVarible;
const isVertical = dataArray.parentLayout === 'vertical';

/**
 * Maps the style, size, and CSSoverride blocks into a standard CSS object.
 */
function processStyle(data) {
    if (!data) return {};
    
    const s = data.style || {};
    const sz = data.size || {};
    // Note: data.CSSoverride is an array of objects based on your latest prompt
    const overrides = {};
    if (Array.isArray(data.CSSoverride)) {
        data.CSSoverride.forEach(item => {
            if (item.key) overrides[item.key] = item.value;
        });
    }

    return {
        "padding-top": engine.space(s.paddingTop),
        "padding-bottom": engine.space(s.paddingBottom),
        "padding-left": engine.space(s.paddingLeft),
        "padding-right": engine.space(s.PaddingRight),

        "border-width": engine.space(s.borderThink),
        "border-style": s.borderMode || "solid",
        "border-top": s.borderTop || "none",
        "border-bottom": s.borderBottom || "none",
        "border-left": s.borderLeft || "none",
        "border-right": s.borderRight || "none",
        "border-radius": `${s.borderRadiuns || 0}px`,

        "box-shadow": s.shadow 
            ? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpend || 0}px ${engine.color(s.ShadowColor)}`
            : "none",

        "color": engine.color(s.textColor),
        "background": engine.color(s.background),
        "filter": s.blur ? `blur(${s.blur}px)` : "none",
        "font-family": s.font || "inherit",
        "caret-color": engine.color(s.markColor),

        "width": isVertical ? engine.space(sz.across) : engine.space(sz.along),
        "height": isVertical ? engine.space(sz.along) : engine.space(sz.across),
        "flex-grow": sz.alongGrow || 0,
        "flex-shrink": sz.alongShrink === true ? 1 : 0, 

        "overflow-x": isVertical 
            ? (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible')
            : (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible'),
        "overflow-y": isVertical 
            ? (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible')
            : (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible'),
        
        "align-self": (sz.acrossAlign > 0) 
            ? ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'][sz.acrossAlign - 1] 
            : 'auto',

        ...overrides
    };
}

/**
 * Extracts mobile-specific overrides (padding and min-height).
 */
function getMobileStyles(data) {
    if (!data || !data.style || !data.size) return {};
    return {
        "padding-top": engine.space(data.style.mobilePaddingTop),
        "padding-bottom": engine.space(data.style.mobilePaddingBottom),
        "padding-left": engine.space(data.style.mobilePaddingLeft),
        "padding-right": engine.space(data.style.mobilePaddingRight),
        "min-height": engine.space(data.size.mobileMinHeight)
    };
}

/**
 * Constructs a full state object including defalut, mobile, and hover.
 */
function buildStateBundle(data) {
    return {
        defalut: processStyle(data),
        onMoblie: getMobileStyles(data),
        onHover: processStyle(data.hover)
    };
}

const nodeStyle = {
    // Primary state bundle
    defalut: buildStateBundle(dataArray),
    
    // Map each custom class in overrideState to its own bundle
    ...Object.keys(dataArray.overrideState || {}).reduce((acc, className) => {
        acc[className] = buildStateBundle(dataArray.overrideState[className]);
        return acc;
    }, {}),

    startAnimation: {} 
};



/// @ND VERSION!

const engine = flexEngineStyleVarible;
const isVertical = dataArray.parentLayout === 'vertical';

const nodeStyle = {
    // Primary state bundle (defalut)
    defalut: {
        defalut: ((data) => {
            const s = data.style || {};
            const sz = data.size || {};
            const overrides = {};

            // We can use multiple lines here to process logic safely
            if (Array.isArray(data.CSSoverride)) {
                data.CSSoverride.forEach(item => {
                    if (item && item.key) {
                        overrides[item.key] = item.value;
                    }
                });
            }

            // Define the core CSS properties
            const css = {
                "padding-top": engine.space(s.paddingTop),
                "padding-bottom": engine.space(s.paddingBottom),
                "padding-left": engine.space(s.paddingLeft),
                "padding-right": engine.space(s.PaddingRight),
                "border-width": engine.space(s.borderThink),
                "border-style": s.borderMode || "solid",
                "border-top": s.borderTop || "none",
                "border-bottom": s.borderBottom || "none",
                "border-left": s.borderLeft || "none",
                "border-right": s.borderRight || "none",
                "border-radius": `${s.borderRadiuns || 0}px`,
                "box-shadow": s.shadow ? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpend || 0}px ${engine.color(s.ShadowColor)}` : "none",
                "color": engine.color(s.textColor),
                "background": engine.color(s.background),
                "filter": s.blur ? `blur(${s.blur}px)` : "none",
                "font-family": s.font || "inherit",
                "caret-color": engine.color(s.markColor),
                "width": isVertical ? engine.space(sz.across) : engine.space(sz.along),
                "height": isVertical ? engine.space(sz.along) : engine.space(sz.across),
                "flex-grow": sz.alongGrow || 0,
                "flex-shrink": sz.alongShrink === true ? 1 : 0,
                "overflow-x": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible'),
                "overflow-y": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible'),
                "align-self": (sz.acrossAlign > 0) ? ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'][sz.acrossAlign - 1] : 'auto'
            };

            return { ...css, ...overrides };
        })(dataArray),

        onMoblie: {
            "padding-top": engine.space(dataArray.style?.mobilePaddingTop),
            "padding-bottom": engine.space(dataArray.style?.mobilePaddingBottom),
            "padding-left": engine.space(dataArray.style?.mobilePaddingLeft),
            "padding-right": engine.space(dataArray.style?.mobilePaddingRight),
            "min-height": engine.space(dataArray.size?.mobileMinHeight)
        },

        onHover: ((data) => {
            if (!data) return {};
            const s = data.style || {};
            const sz = data.size || {};
            const overrides = {};

            if (Array.isArray(data.CSSoverride)) {
                data.CSSoverride.forEach(item => {
                    if (item && item.key) overrides[item.key] = item.value;
                });
            }

            const css = {
                "padding-top": engine.space(s.paddingTop),
                "padding-bottom": engine.space(s.paddingBottom),
                "padding-left": engine.space(s.paddingLeft),
                "padding-right": engine.space(s.PaddingRight),
                "border-width": engine.space(s.borderThink),
                "border-style": s.borderMode || "solid",
                "border-radius": `${s.borderRadiuns || 0}px`,
                "color": engine.color(s.textColor),
                "background": engine.color(s.background),
                "width": isVertical ? engine.space(sz.across) : engine.space(sz.along),
                "height": isVertical ? engine.space(sz.along) : engine.space(sz.across)
            };

            return { ...css, ...overrides };
        })(dataArray.hover)
    },

    // Map each custom class in overrideState to its own bundle
    ...Object.keys(dataArray.overrideState || {}).reduce((acc, key) => {
        const stateData = dataArray.overrideState[key];
        
        acc[key] = {
            defalut: ((data) => {
                const s = data.style || {};
                const sz = data.size || {};
                const overrides = {};
                if (Array.isArray(data.CSSoverride)) {
                    data.CSSoverride.forEach(item => { if (item.key) overrides[item.key] = item.value; });
                }
                return {
                    "padding-top": engine.space(s.paddingTop),
                    "padding-bottom": engine.space(s.paddingBottom),
                    "padding-left": engine.space(s.paddingLeft),
                    "padding-right": engine.space(s.PaddingRight),
                    "border-width": engine.space(s.borderThink),
                    "border-style": s.borderMode || "solid",
                    "border-radius": `${s.borderRadiuns || 0}px`,
                    "color": engine.color(s.textColor),
                    "background": engine.color(s.background),
                    "width": isVertical ? engine.space(sz.across) : engine.space(sz.along),
                    "height": isVertical ? engine.space(sz.along) : engine.space(sz.across),
                    ...overrides
                };
            })(stateData),
            onMoblie: {
                "padding-top": engine.space(stateData.style?.mobilePaddingTop),
                "padding-bottom": engine.space(stateData.style?.mobilePaddingBottom),
                "padding-left": engine.space(stateData.style?.mobilePaddingLeft),
                "padding-right": engine.space(stateData.style?.mobilePaddingRight),
                "min-height": engine.space(stateData.size?.mobileMinHeight)
            },
            onHover: ((data) => {
                if (!data) return {};
                const s = data.style || {};
                return {
                    "color": engine.color(s.textColor),
                    "background": engine.color(s.background)
                };
            })(stateData.hover)
        };
        return acc;
    }, {}),

    startAnimation: {}
};