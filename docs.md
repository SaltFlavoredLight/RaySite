# How to Write a RaySite Project

This document answers one question:

> How should I write my JSON so that I can build a beautiful website with the RaySite FlexEngine?

A RaySite project is a ZIP containing editable JSON and the media used by that JSON. This guide describes only the project you author. It does not describe the final generated website, server behavior, HTML export, or generated CSS files.

## 1. Project folder layout

```text
project.zip
|-- main.json
|-- themes/
|   `-- default.json
|-- componets/
|   |-- header.json
|   |-- cta.json
|   `-- footer.json
|-- pages/
|   |-- _.json
|   |-- _about.json
|   |-- _work_portfolio.json
|   `-- 404.json
`-- assets/
    |-- img/
    |-- audio/
    `-- video/
```

The directory name `componets` is intentionally misspelled because that is the name used by the engine. Do not rename it to `components`.

| File | What you write there |
| --- | --- |
| `main.json` | Information shared by the whole website. |
| `themes/<name>.json` | The visual design system. |
| `componets/<name>.json` | A reusable element tree, such as a header or footer. |
| `pages/<route>.json` | One page and its complete content tree. |
| `assets/**` | Images, audio, video, and other files referenced by the JSON. |

## 2. Write `main.json`

Use `main.json` for website-wide information, not page content.

```json
{
  "version": "1.0.0",
  "type": "website",
  "name": "Northwind Studio",
  "domain": "https://northwind.example",
  "websiteKeywords": [
    "design studio",
    "web design",
    "branding"
  ],
  "favicon": "assets/img/favicon.png"
}
```

| Field | Type | Purpose |
| --- | --- | --- |
| `version` | string | Your project-format version. |
| `type` | string | Use `website`. |
| `name` | string | Website or business name. |
| `domain` | string | Public website address. |
| `websiteKeywords` | string[] | Search keywords shared across pages. |
| `favicon` | string | Website icon path. |

Keep this file small. Page titles, descriptions, cover images, themes, and content belong in page files.

## 3. Write a theme

The theme should define the website's reusable visual language. A page selects it with `"theme": "default"`, which refers to `themes/default.json`.

```json
{
  "color": {
    "primaryColor": "#183153",
    "secondaryColor": "#305A78",
    "accentColor": "#E9A23B",
    "secondaryAccentColor": "#D96C4A",
    "neutralTextColor": "#1E293B",
    "neutralBackgroundColor": "#F8FAFC",
    "customColor1": "#FFFFFF",
    "customColor2": "#E2E8F0",
    "customColor3": "#94A3B8",
    "customColor4": "#0F172A"
  },
  "fonts": [
    { "type": "system", "name": "Inter" },
    { "type": "googleFonts", "name": "DM Sans" },
    { "type": "googleFonts", "name": "Cormorant Garamond" }
  ],
  "typography": {
    "normal": {
      "font": ["Inter", "sans-serif"],
      "size": 16,
      "letterSpacing": 0,
      "boldness": 400,
      "color": "#1E293B",
      "allCaps": false,
      "align": null,
      "customStyle": "line-height: 1.7;"
    },
    "normal2": {
      "font": ["DM Sans", "sans-serif"],
      "size": 14,
      "letterSpacing": 0.2,
      "boldness": 500,
      "color": "#305A78",
      "allCaps": false,
      "align": null,
      "customStyle": "line-height: 1.5;"
    },
    "h1": {
      "font": ["Cormorant Garamond", "serif"],
      "size": 56,
      "letterSpacing": -0.8,
      "boldness": 700,
      "color": "#183153",
      "allCaps": false,
      "align": null,
      "customStyle": "line-height: 1.05;"
    },
    "h2": {
      "font": ["Cormorant Garamond", "serif"],
      "size": 40,
      "letterSpacing": -0.4,
      "boldness": 700,
      "color": "#183153",
      "allCaps": false,
      "align": null,
      "customStyle": "line-height: 1.15;"
    },
    "h3": {
      "font": ["DM Sans", "sans-serif"],
      "size": 24,
      "letterSpacing": 0,
      "boldness": 650,
      "color": "#183153",
      "allCaps": false,
      "align": null,
      "customStyle": "line-height: 1.3;"
    },
    "h4": {
      "font": ["DM Sans", "sans-serif"],
      "size": 16,
      "letterSpacing": 1,
      "boldness": 700,
      "color": "#305A78",
      "allCaps": true,
      "align": null,
      "customStyle": "line-height: 1.4;"
    },
    "small": {
      "font": ["Inter", "sans-serif"],
      "size": 13,
      "letterSpacing": 0.2,
      "boldness": 500,
      "color": "#305A78",
      "allCaps": false,
      "align": null,
      "customStyle": "line-height: 1.5;"
    }
  },
  "spacing": {
    "section": 80,
    "blockgap": 24,
    "tiny": 4,
    "small": 8,
    "mSmall": 12,
    "medium": 16,
    "large": 24,
    "extraLarge": 48,
    "bradiusLarge": 24,
    "bradiusMedium": 12,
    "bradiusSmall": 6
  },
  "animation": {
    "timing": 600,
    "delayTime": 0,
    "animationCurve": "ease-out",
    "animation": "fade"
  },
  "transition": {
    "timing": 250,
    "delay": 0,
    "animationCurve": "ease"
  },
  "customVariables": {
    "contentWidth": "1200px",
    "readingWidth": "68ch",
    "shadowSoft": "0 12px 35px rgba(15, 23, 42, 0.10)"
  }
}
```

### Theme rules

- Use a small, deliberate color palette. The named colors are easier to reuse than unrelated colors on every element.
- Use two or three font families at most.
- Give headings a visible scale: `h1` should be clearly larger than `h2`, and so on.
- Use a consistent spacing progression instead of random measurements.
- `customStyle` contains CSS declarations for that typography style.
- Extra nested scalar values are allowed in the theme and become reusable CSS variables.

Typography fields mean:

| Field | Meaning |
| --- | --- |
| `font` | Ordered font-family list. |
| `size` | Font size in pixels when it is a number. |
| `letterSpacing` | Letter spacing in pixels when it is a number. |
| `boldness` | Font weight. |
| `color` | Text color. |
| `allCaps` | Whether the text is uppercase. |
| `align` | `left`, `center`, `right`, or `null` for no theme rule. |
| `customStyle` | Additional CSS declarations. |

## 4. Write pages

### Page filenames

| Route | File |
| --- | --- |
| `/` | `pages/_.json` |
| `/about` | `pages/_about.json` |
| `/work/portfolio` | `pages/_work_portfolio.json` |
| `/404` | `pages/404.json` |

Use `/` as `_`, and replace route slashes with underscores. Avoid underscores inside route names because an underscore is decoded as a slash.

### Page object

```json
{
  "title": "Home",
  "description": "A short, useful description of this page.",
  "coverIMG": "assets/img/social-cover.jpg",
  "path": "/",
  "importence": 1,
  "doNotIndex": false,
  "type": "webpage",
  "theme": "default",
  "body": {
    "id": 0,
    "type": "@root/RaySite",
    "content": {
      "header": {
        "type": "@inherit/inherit",
        "source": "header"
      },
      "main": {
        "id": 100,
        "type": "@root/main",
        "content": [],
        "layout": {},
        "appearance": {}
      },
      "cta": {
        "type": "@inherit/inherit",
        "source": "cta"
      },
      "footer": {
        "type": "@inherit/inherit",
        "source": "footer"
      }
    },
    "layout": {},
    "appearance": {}
  }
}
```

| Field | What to write |
| --- | --- |
| `title` | A unique, human-readable page title. |
| `description` | One or two sentences describing the page. |
| `coverIMG` | Page-sharing image path. |
| `path` | Public route. |
| `importence` | Your page-priority value. Keep the existing spelling. |
| `doNotIndex` | Use `true` for private, duplicate, or utility pages. |
| `type` | Use `webpage`. |
| `theme` | Name of a file in `themes/`, without `.json`. |
| `body` | The root FlexEngine element tree. |

The page body normally owns exactly four major regions: `header`, `main`, `cta`, and `footer`. Put the page's unique sections inside `body.content.main.content`.

## 5. Write reusable components

A component file is one normal FlexEngine element. The filename becomes its reusable name.

`componets/header.json`:

```json
{
  "id": 200,
  "type": "@root/header",
  "content": {
    "logo.type": "text",
    "logo.text": "Northwind Studio",
    "nav": [
      { "name": "Home", "url": "/" },
      {
        "name": "Work",
        "url": "/work",
        "children": [
          { "name": "Websites", "url": "/work/websites" },
          { "name": "Branding", "url": "/work/branding" }
        ]
      },
      { "name": "About", "url": "/about" }
    ],
    "primaryButton.enable": true,
    "primaryButton.text": "Start a Project",
    "primaryButton.url": "/contact",
    "primaryButton.newPage": false,
    "secondaryButton.enable": false
  },
  "layout": {
    "desktopPosition": 1,
    "mobileMenuPlace": "right",
    "desktopHeaderMaxInnerWidth": { "mode": "px", "value": 1200 },
    "desktopHeaderMainGap": { "mode": "px", "value": 24 },
    "mobileHeaderMainGap": { "mode": "px", "value": 16 },
    "desktopHeaderSeparateBorderSpace": { "mode": "none" },
    "desktopMenuMode": 0,
    "desktopCoverHeaderOnMenu": false,
    "mobileCoverHeaderOnMenu": false,
    "spaceBetween": { "mode": "px", "value": 16 },
    "navMajorGap": { "mode": "px", "value": 24 },
    "navMinorGap": { "mode": "px", "value": 8 },
    "nestingSupport": 1,
    "transitionTime": 250,
    "transitionCurve": { "coords": [0.25, 0.1, 0.25, 1] },
    "mobileCtaType": 0,
    "mobileLogoPosition": "left",
    "hamAnimation": 1,
    "hamAnimationOnDesktop": false,
    "mobileButonRound": { "mode": "px", "value": 8 },
    "stickyToBottom": false
  },
  "appearance": {}
}
```

Header dotted keys such as `"logo.text"` are literal JSON keys. Do not turn them into `{ "logo": { "text": ... } }`.

A navigation item supports `name`, optional `url`, and optional one-level `children`. An item without a URL acts as a menu control.

### Header layout values

| Field | Values |
| --- | --- |
| `desktopPosition` | `1`–`7`, selecting a logo/navigation/button arrangement. |
| `mobileMenuPlace` | `left` or `right`. |
| `desktopMenuMode` | `0` on top, `1` left slide, `2` left clip, `3` right slide, `4` right clip, `5` top slide, `6` top clip. |
| `nestingSupport` | `0` none, `1` expand, `2` clickable menu, `3` non-clickable mobile expansion, `4` whole expand. |
| `mobileCtaType` | `0` standard, `1` full sticky, `2` full row. |
| `mobileLogoPosition` | `left` or `center`. |
| `hamAnimation` | `1`, `2`, or `3`. |

### Inherit a component

```json
{
  "type": "@inherit/inherit",
  "source": "header"
}
```

`source: "header"` loads `componets/header.json`. Extra properties on the placeholder override that component:

```json
{
  "type": "@inherit/inherit",
  "source": "header",
  "content": {
    "logo.text": "Special Campaign"
  }
}
```

Object overrides merge into the component. Arrays and single values replace the originals. This makes components ideal for stable site-wide structures with small page-specific changes.

## 6. Write FlexEngine elements

Every item inside a page or component follows this basic shape:

```json
{
  "id": 123456789,
  "JSID": "optional-html-id",
  "type": "container/div",
  "content": [],
  "layout": {},
  "appearance": {},
  "animation": {},
  "transition": {},
  "clickable": {}
}
```

| Field | Meaning |
| --- | --- |
| `id` | Unique non-negative element number. Use a different value for every element. |
| `JSID` | Optional human-readable HTML ID for scripts or anchors. |
| `type` | Element kind. This decides how every other field is interpreted. |
| `content` | Text, settings, or child elements. |
| `layout` | Direction, gaps, alignment, wrapping, and other structure. |
| `appearance` | Colors, spacing, borders, sizes, hover, and mobile styles. |
| `animation` | Entrance animation. |
| `transition` | Smooth changes between visual states. |
| `clickable` | Optional link or action. |

### Available element types

| Type | Content |
| --- | --- |
| `basic/text` | Quill Delta rich-text operation array. |
| `basic/heading` | Quill Delta heading operation array. |
| `basic/image` | `{ source, alt, displayX, displayY }`. |
| `basic/button` | `{ label }`. |
| `basic/line` | Empty object. |
| `basic/spacer` | Empty object. |
| `media/audio` | `source`, `hideControls`, `loop`. |
| `media/video` | `source`, `hideControls`, `autoplay`, `muted`, `loop`, `thumbnail`, `disablepictureinpicture`. |
| `media/vimeoVideo` | `sourceID`, `hash`, controls, playback flags, and `startTime`. |
| `media/ytVideo` | `videoID`, controls, playback flags, and `startTime`. |
| `media/iframe` | `source`, `embedAsHTML`, `sandboxChoice`, `allowFullScreen`, `permission`. |
| `media/gDocs` | `gDocsID`. |
| `media/ytLive` | `channelID`. |
| `media/html` | `{ html }`. |
| `container/div` | Array of child elements. |
| `section/section` | Array of child elements inside a section wrapper. |
| `@root/main` | Array of the page's main children. |
| `@root/header` | Header content and layout. |
| `@root/CTA` | Array of call-to-action children. |
| `@root/footer` | Array of footer children. |
| `@root/popup` | Array of popup children. |
| `@root/float` | Floating button content. |

### Rich text

Text and headings store Quill Delta operations, not HTML strings:

```json
{
  "id": 301,
  "type": "basic/heading",
  "content": [
    { "insert": "Design that feels unmistakably yours" },
    { "insert": "\n", "attributes": { "header": 1 } }
  ],
  "layout": {},
  "appearance": {}
}
```

```json
{
  "id": 302,
  "type": "basic/text",
  "content": [
    { "insert": "We create thoughtful brands and websites for growing teams." },
    { "insert": "\n" }
  ],
  "layout": {},
  "appearance": {}
}
```

### Images

```json
{
  "id": 303,
  "type": "basic/image",
  "content": {
    "source": {
      "mode": "internal",
      "folder": "img",
      "name": "hero.jpg"
    },
    "alt": "A designer reviewing a brand presentation",
    "displayX": 2,
    "displayY": 2
  },
  "layout": {},
  "appearance": {}
}
```

`displayX` and `displayY` use `1` start, `2` center, and `3` end. Always write meaningful `alt` text unless the image is purely decorative.

## 7. Build layouts with containers and sections

Use `section/section` for large page bands and `container/div` for rows, columns, cards, and inner groups.

### Section

```json
{
  "id": 400,
  "type": "section/section",
  "content": [],
  "layout": {
    "spaceAcross": 2,
    "spaceAlong": 2,
    "overflow": 3,
    "gap": { "mode": "px", "value": 24 },
    "mobileGap": { "mode": "px", "value": 16 },
    "mobileReverseDirection": false,
    "displayType": 0
  },
  "appearance": {}
}
```

| Field | Values |
| --- | --- |
| `spaceAcross` | `1` left, `2` center, `3` right, `4` stretch. |
| `spaceAlong` | `1` top, `2` center, `3` bottom. |
| `overflow` | `1` scroll, `2` hidden, `3` normal. |
| `displayType` | `0` standard width, `1` wide, `2` full width. |

### Container

```json
{
  "id": 401,
  "type": "container/div",
  "content": [],
  "layout": {
    "direction": 1,
    "wrap": 1,
    "spaceAlong": 1,
    "spaceAcross": 2,
    "spaceAcrossMutiple": 1,
    "gapX": { "mode": "px", "value": 32 },
    "gapY": { "mode": "px", "value": 24 },
    "stackAtMobile": true,
    "mobileReverseDirection": false,
    "mobileGap": { "mode": "px", "value": 20 }
  },
  "appearance": {}
}
```

| Field | Values |
| --- | --- |
| `direction` | `1` row, `2` column, `3` reverse row, `4` reverse column. |
| `wrap` | `1` no wrap, `2` wrap, `3` reverse wrap. |
| `spaceAlong` | `1` start, `2` center, `3` end, `4` around, `5` between, `6` evenly. |
| `spaceAcross` | `1` start, `2` center, `3` end, `4` stretch, `5` baseline. |
| `stackAtMobile` | Turn a desktop row into a mobile column. |
| `mobileReverseDirection` | Reverse the mobile order. |

For a clean responsive design, use sections for vertical rhythm, then place one or more containers inside them. Set `stackAtMobile: true` on multi-column desktop layouts.

## 8. Shared value formats

### Space

```json
{ "mode": "px", "value": 24 }
```

Supported units are `px`, `rem`, `em`, `%`, `vw`, `vh`, `vmin`, `vmax`, and `ch`.

```json
[
  { "mode": "auto" },
  { "mode": "none" },
  { "mode": "variables", "variables": "spacing-medium" }
]
```

Use `none` instead of inventing a zero value.

The current Space resolver prefixes variable names with `rs-`. For example, `"variables": "spacing-medium"` requests `--rs-spacing-medium`. Theme JSON currently generates `--spacing-medium`, without `rs-`, so use concrete Space values unless your project separately defines the prefixed variable.

### Media

Internal file:

```json
{ "mode": "internal", "folder": "img", "name": "photo.jpg" }
```

External file:

```json
{ "mode": "external", "url": "https://example.com/photo.jpg" }
```

An internal reference above points to `assets/img/photo.jpg` inside the project.

### Color and background

```json
[
  { "mode": "basic", "color": "#183153" },
  { "mode": "hex", "hex": "#183153" },
  { "mode": "variables", "variables": "color-primary-color" },
  { "mode": "inherit" },
  { "mode": "none" }
]
```

Gradient:

```json
{
  "mode": "linearGradient",
  "angle": 135,
  "stops": [
    { "color": "#183153", "offset": 0 },
    { "color": "#305A78", "offset": 100 }
  ]
}
```

Background image:

```json
{
  "mode": "backgroundIMG",
  "src": "/assets/img/hero.jpg",
  "positionX": 2,
  "positionY": 2,
  "repeatX": false,
  "repeatY": false,
  "attachment": false,
  "coloroverlay": "rgba(15, 23, 42, 0.35)"
}
```

### Curve

```json
{ "coords": [0.25, 0.1, 0.25, 1] }
```

Useful presets:

| Coordinates | Result |
| --- | --- |
| `[0, 0, 1, 1]` | linear |
| `[0.25, 0.1, 0.25, 1]` | ease |
| `[0.42, 0, 1, 1]` | ease-in |
| `[0, 0, 0.58, 1]` | ease-out |
| `[0.42, 0, 0.58, 1]` | ease-in-out |

## 9. Write appearance data

Appearance is organized as:

```text
appearance
`-- appearance name
    `-- target
        `-- state
            |-- style
            `-- size
```

```json
{
  "appearance": {
    "default": {
      "base": {
        "default": {
          "style": {
            "paddingTop": { "mode": "px", "value": 24 },
            "paddingBottom": { "mode": "px", "value": 24 },
            "paddingLeft": { "mode": "px", "value": 24 },
            "paddingRight": { "mode": "px", "value": 24 },
            "borderMode": "solid",
            "borderTop": { "mode": "none" },
            "borderBottom": { "mode": "none" },
            "borderLeft": { "mode": "none" },
            "borderRight": { "mode": "none" },
            "borderRadius": 16,
            "shadow": true,
            "shadowInset": false,
            "shadowOffsetX": 0,
            "shadowOffsetY": 12,
            "shadowBlur": 35,
            "shadowExpand": 0,
            "shadowColor": {
              "mode": "basic",
              "color": "rgba(15, 23, 42, 0.10)"
            },
            "textColor": { "mode": "variables", "variables": "color-neutral-text-color" },
            "background": { "mode": "basic", "color": "#FFFFFF" },
            "blur": 0,
            "font": "inherit",
            "markColor": { "mode": "variables", "variables": "color-accent-color" }
          },
          "size": {
            "along": { "mode": "auto" },
            "across": { "mode": "%", "value": 100 },
            "alongGrow": 0,
            "alongShrink": false,
            "overflowAlong": 1,
            "overflowAcross": 1,
            "acrossAlign": 0,
            "mobileMinHeight": { "mode": "auto" }
          }
        },
        "hover": {
          "style": {
            "background": { "mode": "basic", "color": "#F8FAFC" }
          },
          "size": {}
        },
        "onMobile": {
          "style": {
            "mobilePaddingTop": { "mode": "px", "value": 18 },
            "mobilePaddingBottom": { "mode": "px", "value": 18 },
            "mobilePaddingLeft": { "mode": "px", "value": 18 },
            "mobilePaddingRight": { "mode": "px", "value": 18 }
          },
          "size": {}
        }
      }
    }
  }
}
```

The first `default` is the appearance name. `base` styles the whole element. The recognized states are `default`, `hover`, `onMobile`, and `onMobileHover`. Complex elements may also expose named internal targets instead of `base`.

Common style fields:

- Padding: `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`, and mobile equivalents.
- Border: `borderMode`, four border widths, and `borderRadius`.
- Shadow: `shadow`, `shadowInset`, offsets, blur, expansion, and `shadowColor`.
- Color: `textColor`, `background`, and `markColor`.
- Other: `blur` and `font`.

Use appearance for meaningful variations, not for random one-off values everywhere. Repeated colors and measurements should come from the theme.

## 10. Add actions

```json
{
  "clickable": {
    "enable": true,
    "action": {
      "mode": "a",
      "url": "/about",
      "newPage": false
    }
  }
}
```

| Mode | Fields | Purpose |
| --- | --- | --- |
| `a` | `url`, `newPage` | Link. |
| `download` | `url`, `forceDownload` | Download. |
| `openPopup` | `popupID` | Open a popup. |
| `closeThisPopup` | none | Close the current popup. |
| `runJS` | `JS` | Run JavaScript. Use only in trusted projects. |

## 11. Add animation and transition carefully

For a normal element:

```json
{
  "animation": {
    "animationType": 1,
    "animationCurve": { "coords": [0, 0, 0.58, 1] },
    "duration": 0.6,
    "delayTime": 0,
    "trigger": 1
  }
}
```

| ID | Animation | Extra settings |
| --- | --- | --- |
| `-1` | inherit | none |
| `0` | showup | none |
| `1` | fade | none |
| `2` | flyIn | `direction`, `intensity` |
| `3` | growTurn | `rotate` |
| `4` | zoom | none |
| `5` | basicZoom | `scaleStart` |
| `6` | rise | `direction` 1–8, `intensity` |
| `7` | stretch | `direction` 1–4 |
| `8` | wipe | `direction` 1–4 |
| `9` | peekIn | `direction` 1–4, `intensity` |
| `10` | box | `x`, `y` 1–3 |
| `11` | expand | none |
| `12` | tumble | `directionRight`, `fromUp`, `rotateIntensity` |
| `13` | rotate | `directionRight`, `rotateIntensity` |
| `14` | slideRotate | `rotateIntensity`, `slideAmountX`, `slideAmountY` |

Section-like elements can have `animation.self` and `animation.all`. `all` applies a shared animation to participating descendants and may include `executionInterval` to stagger them.

Transitions use milliseconds:

```json
{
  "transition": {
    "self": {
      "inherit": false,
      "property": ["background-color", "color", "transform"],
      "duration": 250,
      "delay": 0,
      "curve": { "coords": [0.25, 0.1, 0.25, 1] }
    }
  }
}
```

Use animation as emphasis. A good project normally uses one or two related entrance styles, short durations, and modest movement.

## 12. A complete main-content example

Place this kind of structure inside `body.content.main.content`:

```json
[
  {
    "id": 500,
    "type": "section/section",
    "content": [
      {
        "id": 501,
        "type": "container/div",
        "content": [
          {
            "id": 502,
            "type": "container/div",
            "content": [
              {
                "id": 503,
                "type": "basic/heading",
                "content": [
                  { "insert": "Design that moves your business forward" },
                  { "insert": "\n", "attributes": { "header": 1 } }
                ],
                "layout": {},
                "appearance": {}
              },
              {
                "id": 504,
                "type": "basic/text",
                "content": [
                  { "insert": "Strategy, identity, and websites created as one clear system." },
                  { "insert": "\n" }
                ],
                "layout": {},
                "appearance": {}
              },
              {
                "id": 505,
                "type": "basic/button",
                "content": { "label": "See Our Work" },
                "layout": {},
                "appearance": {},
                "clickable": {
                  "enable": true,
                  "action": {
                    "mode": "a",
                    "url": "/work",
                    "newPage": false
                  }
                }
              }
            ],
            "layout": {
              "direction": 2,
              "wrap": 1,
              "spaceAlong": 2,
              "spaceAcross": 1,
              "gapX": { "mode": "none" },
              "gapY": { "mode": "px", "value": 20 },
              "stackAtMobile": false,
              "mobileReverseDirection": false,
              "mobileGap": { "mode": "px", "value": 16 }
            },
            "appearance": {}
          },
          {
            "id": 506,
            "type": "basic/image",
            "content": {
              "source": { "mode": "internal", "folder": "img", "name": "hero.jpg" },
              "alt": "A selection of Northwind Studio branding work",
              "displayX": 2,
              "displayY": 2
            },
            "layout": {},
            "appearance": {}
          }
        ],
        "layout": {
          "direction": 1,
          "wrap": 1,
          "spaceAlong": 5,
          "spaceAcross": 2,
          "gapX": { "mode": "px", "value": 48 },
          "gapY": { "mode": "px", "value": 24 },
          "stackAtMobile": true,
          "mobileReverseDirection": false,
          "mobileGap": { "mode": "px", "value": 32 }
        },
        "appearance": {}
      }
    ],
    "layout": {
      "spaceAcross": 2,
      "spaceAlong": 2,
      "overflow": 3,
      "gap": { "mode": "none" },
      "mobileGap": { "mode": "none" },
      "mobileReverseDirection": false,
      "displayType": 0
    },
    "appearance": {}
  }
]
```

This is the central authoring pattern:

```text
page
`-- body
    |-- reusable header
    |-- main
    |   `-- sections
    |       `-- containers
    |           `-- content elements
    |-- reusable CTA
    `-- reusable footer
```

## 13. Checklist for a beautiful, reliable project

- Give every page a unique title and useful description.
- Start with a coherent theme before styling individual nodes.
- Reuse the same color, typography, spacing, radius, and animation language.
- Use reusable components for the header, CTA, and footer.
- Give every FlexNode a unique non-negative `id`.
- Use sections for page rhythm and containers for rows, columns, and cards.
- Set `stackAtMobile: true` for desktop columns that must become readable on phones.
- Store rich text as Quill Delta, not HTML.
- Give informative images useful `alt` text.
- Match internal media references exactly to files under `assets/`.
- Use hover and animation sparingly and consistently.
- Keep raw HTML and `runJS` actions only in projects you trust.
- Preserve the exact `componets` spelling and route filename rules.
- Validate every JSON file before packaging the ZIP.

---

Concept Designed by Ray - With help of ChatGPT transform code to a clear documention
