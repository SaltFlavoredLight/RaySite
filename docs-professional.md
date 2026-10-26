# RaySite Project Schema Reference

## 1. Scope

This document defines the editable RaySite project schema consumed by FlexEngine. It specifies archive paths, JSON document contracts, reusable value types, element discriminators, content payloads, layout payloads, appearance data, actions, animations, transitions, and inheritance.

It does not specify rendered HTML, generated CSS, browser storage, project import/export procedures, or server behavior.

## 2. Schema notation

| Notation | Meaning |
| --- | --- |
| `T?` | Optional value of type `T`. |
| `T[]` | Array whose entries are of type `T`. |
| `A \| B` | Either schema `A` or schema `B`. |
| `Record<string, T>` | Object with arbitrary string keys and values of type `T`. |
| `integer[a..b]` | Integer in the inclusive range `a` through `b`. |
| `enum(...)` | One literal value from the listed set. |
| discriminator | A field whose value selects a more specific schema. |

Unless stated otherwise:

- JSON objects may contain additional properties.
- A missing optional field and a field containing `null` are not necessarily equivalent.
- FlexEngine does not perform complete archive-wide schema validation before reading a project.
- Field names are case-sensitive.
- Dotted field names are literal JSON keys.

## 3. Archive schema

```text
/
|-- main.json
|-- themes/<ThemeName>.json
|-- componets/<ComponentName>.json
|-- pages/<PageFileName>.json
`-- assets/<AssetPath>
```

| Path expression | Cardinality | Content schema |
| --- | --- | --- |
| `/main.json` | zero or one | `MainDocument` |
| `/themes/*.json` | zero or more | `ThemeDocument` |
| `/componets/*.json` | zero or more | `FlexNode` |
| `/pages/*.json` | zero or more | `PageDocument` |
| `/assets/**` | zero or more | Arbitrary binary or text data |

The directory name `/componets/` is normative. `/components/` is not recognized by the component API.

### 3.1 Page route encoding

| Route | Page filename |
| --- | --- |
| empty route or `/` | `_.json` |
| `404` or `/404` | `404.json` |
| any other route | `_` + route without its leading `/`, with each `/` replaced by `_` + `.json` |

The encoding is not bijective when a route segment contains `_`. Schema-compatible route segments therefore exclude underscores.

## 4. Document schemas

### 4.1 `MainDocument`

| Property | Type | Required | Semantics |
| --- | --- | --- | --- |
| `version` | string | no | Project or application version metadata. |
| `type` | string | no | Project classification; conventional value is `website`. |
| `name` | string | yes for a complete site | Website name. |
| `domain` | string | no | Public site base used by page metadata. |
| `websiteKeywords` | string[] | no | Website keyword list. |
| `favicon` | string | no | Favicon path consumed by the header metadata generator. |
| `icon` | string \| `MediaValue` | no | Legacy/editor-facing icon field. |

### 4.2 `PageDocument`

| Property | Type | Required | Semantics |
| --- | --- | --- | --- |
| `title` | string | no | Page title. Default behavior uses `Untitled Page`. |
| `description` | string | no | Page description metadata. |
| `coverIMG` | string | no | Page social-image path. |
| `path` | string | no | Canonical page path. |
| `importence` | number | no | Page-priority metadata. The spelling is normative for existing data. |
| `doNotIndex` | boolean | no | Search-index exclusion flag. |
| `type` | string | no | Page classification; conventional value is `webpage`. |
| `theme` | string | no | Theme name without `.json`. |
| `body` | `RootBodyNode` | yes | Root page element. |

### 4.3 `ThemeDocument`

`ThemeDocument` is an extensible JSON object. The following properties are conventional and directly supported.

| Property | Type | Required |
| --- | --- | --- |
| `color` | `ThemeColorSet` | no |
| `fonts` | `ThemeFont[]` | no |
| `typography` | `Record<string, TypographyStyle>` | no |
| `spacing` | `ThemeSpacingSet` | no |
| `animation` | `ThemeAnimationDefaults` | no |
| `transition` | `ThemeTransitionDefaults` | no |
| `customVariables` | `Record<string, JSONScalar>` | no |

All scalar leaves outside `typography` are eligible to become theme custom properties. Nested object keys form a hyphen-separated property name; camelCase segments are converted to kebab-case. Arrays are serialized as comma-separated values.

#### `ThemeColorSet`

| Property | Type |
| --- | --- |
| `primaryColor` | string |
| `secondaryColor` | string |
| `accentColor` | string |
| `secondaryAccentColor` | string |
| `neutralTextColor` | string |
| `neutralBackgroundColor` | string |
| `customColor1` | string |
| `customColor2` | string |
| `customColor3` | string |
| `customColor4` | string |

All properties are optional at the parser level.

#### `ThemeFont`

| Property | Type | Required |
| --- | --- | --- |
| `type` | enum(`system`, `googleFonts`) \| string | yes |
| `name` | string | yes |

#### `TypographyStyle`

| Property | Type | CSS interpretation |
| --- | --- | --- |
| `font` | string \| string[] | `font-family` |
| `size` | number \| string | `font-size`; numeric values receive `px` |
| `letterSpacing` | number \| string | `letter-spacing`; numeric values receive `px` |
| `boldness` | number \| string | `font-weight` |
| `color` | string | `color` |
| `allCaps` | boolean | `text-transform` |
| `align` | string \| null | `text-align`; `null` omits the property |
| `customStyle` | string | Raw declarations appended to the typography rule |

Conventional typography keys are `normal`, `normal2`, `h1`, `h2`, `h3`, `h4`, and `small`. Additional keys are permitted.

#### `ThemeSpacingSet`

| Property | Type |
| --- | --- |
| `section` | number |
| `blockgap` | number |
| `tiny` | number |
| `small` | number |
| `mSmall` | number |
| `medium` | number |
| `large` | number |
| `extraLarge` | number |
| `bradiusLarge` | number |
| `bradiusMedium` | number |
| `bradiusSmall` | number |

#### `ThemeAnimationDefaults`

| Property | Type |
| --- | --- |
| `timing` | number |
| `delayTime` | number |
| `animationCurve` | string \| `CurveValue` |
| `animation` | string |

#### `ThemeTransitionDefaults`

| Property | Type |
| --- | --- |
| `timing` | number |
| `delay` | number |
| `animationCurve` | string \| `CurveValue` |

### 4.4 Component document

Every `/componets/<ComponentName>.json` document has the schema `FlexNode`. The basename without `.json` is the component identifier used by `InheritanceNode.source`.

## 5. Common scalar and value schemas

### 5.1 `JSONScalar`

```text
string | number | boolean | null
```

### 5.2 `JSONValue`

```text
JSONScalar | JSONValue[] | Record<string, JSONValue>
```

### 5.3 `SpaceValue`

`SpaceValue` is a discriminated union on `mode`.

| `mode` | Additional properties | Meaning |
| --- | --- | --- |
| `px` | `value: number` | Pixels |
| `rem` | `value: number` | Root em |
| `em` | `value: number` | Em |
| `%` | `value: number` | Percentage |
| `vw` | `value: number` | Viewport width |
| `vh` | `value: number` | Viewport height |
| `vmin` | `value: number` | Minimum viewport dimension |
| `vmax` | `value: number` | Maximum viewport dimension |
| `ch` | `value: number` | Character width |
| `auto` | none | Automatic sizing |
| `none` | none | Zero pixels |
| `variables` | `variables: string` | Custom property reference |

The current Space resolver prefixes `variables` with `rs-`. A value `spacing-medium` therefore requests `--rs-spacing-medium`.

### 5.4 `MediaValue`

`MediaValue` is a discriminated union on `mode`.

| `mode` | Required properties | Semantics |
| --- | --- | --- |
| `internal` | `folder: string`, `name: string` | File below `/assets/<folder>/<name>` |
| `external` | `url: string` | External resource URL |

### 5.5 `CurveValue`

Canonical schema:

| Property | Type | Required |
| --- | --- | --- |
| `coords` | `[number, number, number, number]` \| `["theme"]` | yes |

Some input/editor paths also accept the coordinate tuple directly. Recognized tuples correspond to `linear`, `ease`, `ease-in`, `ease-out`, and `ease-in-out`; every other four-number tuple is interpreted as a cubic Bézier curve.

### 5.6 `ColorValue`

`ColorValue` is a discriminated union on `mode`.

| `mode` | Additional properties |
| --- | --- |
| `basic` | `color: string` |
| `hex` | `hex: string` |
| `variables` | `variables: string` |
| `linearGradient` | `angle: number`, `stops: GradientStop[]` |
| `backgroundIMG` | `src: string`, `positionX?: integer[1..3]`, `positionY?: integer[1..3]`, `repeatX?: boolean`, `repeatY?: boolean`, `attachment?: boolean`, `coloroverlay?: string` |
| `inherit` | none |
| `none` | none |

#### `GradientStop`

| Property | Type | Required |
| --- | --- | --- |
| `color` | string | yes |
| `offset` | number | yes |

`offset` represents a percentage. Background positions map `1` to start/top, `2` to center, and `3` to end/bottom.

## 6. Base element schema

### 6.1 `FlexNode`

`FlexNode` is a discriminated union on `type`.

| Property | Type | Required | Semantics |
| --- | --- | --- | --- |
| `id` | non-negative safe integer \| numeric string | recommended | Element identity and style scope. |
| `JSID` | string | no | Literal DOM identifier. |
| `type` | `ElementType` | yes | Element discriminator. |
| `content` | type-dependent | yes for most types | Element content. |
| `layout` | type-dependent object | no | Structural configuration. |
| `appearance` | `AppearanceMap` | no | Responsive and state-based visual data. |
| `animation` | `AnimationValue` \| `SectionAnimationValue` | no | Entrance animation data. |
| `transition` | `SectionTransitionValue` | no | Transition data. |
| `clickable` | `ClickableValue` | no | Action data. |
| `inherited` | string | no | Resolution marker. |
| `source` | string | no | Resolved component source. |

### 6.2 `ElementType`

```text
basic/text
basic/heading
basic/image
basic/button
basic/line
basic/spacer
media/audio
media/video
media/vimeoVideo
media/ytVideo
media/iframe
media/gDocs
media/ytLive
media/html
container/div
section/section
@root/popup
@root/float
@root/CTA
@root/footer
@root/header
@root/main
@root/RaySite
@inherit/inherit
```

Root lookup accepts a registry key or registered class name. Consequently, existing data may vary in capitalization for root type suffixes.

## 7. Inheritance schema

### 7.1 `InheritanceNode`

| Property | Type | Required |
| --- | --- | --- |
| `type` | literal `@inherit/inherit` | yes |
| `source` | string | yes |
| any other property | any valid node property | no |

Resolution rules:

1. `source` addresses `/componets/<source>.json`.
2. The component document is cloned.
3. Properties other than `type` and `source` are applied as overrides.
4. Plain objects are merged recursively.
5. Arrays, primitive values, and inheritance nodes replace the corresponding base value.
6. Nested inheritance is resolved recursively.
7. Missing, non-object, circular, or otherwise invalid sources remove the affected branch.
8. A resolved node receives `inherited: "inherit"` and retains `source`.

## 8. Content and layout schemas by element type

### 8.1 Basic elements

#### `basic/text`

| Field | Schema |
| --- | --- |
| `content` | `QuillDeltaOperation[]` |
| `layout` | empty or extension object |

#### `basic/heading`

| Field | Schema |
| --- | --- |
| `content` | `QuillDeltaOperation[]` |
| `layout` | empty or extension object |

#### `QuillDeltaOperation`

| Property | Type | Required |
| --- | --- | --- |
| `insert` | string \| object | yes for content operations |
| `retain` | number | operation-dependent |
| `delete` | number | operation-dependent |
| `attributes` | `Record<string, JSONValue>` | no |

FlexEngine passes the operation array to the Quill Delta-to-HTML converter.

#### `basic/image`

`content` schema:

| Property | Type | Required |
| --- | --- | --- |
| `source` | `MediaValue` | yes |
| `alt` | string | no |
| `displayX` | integer[1..3] | no |
| `displayY` | integer[1..3] | no |

Alignment values map to start, center, and end.

#### `basic/button`

`content` schema:

| Property | Type | Required |
| --- | --- | --- |
| `label` | string | no |

#### `basic/line`

`content` is empty or omitted.

#### `basic/spacer`

`content` is empty or omitted.

### 8.2 Media elements

#### `media/audio` content

| Property | Type |
| --- | --- |
| `source` | `MediaValue` |
| `hideControls` | boolean |
| `loop` | boolean |

#### `media/video` content

| Property | Type |
| --- | --- |
| `source` | `MediaValue` |
| `hideControls` | boolean |
| `autoplay` | boolean |
| `muted` | boolean |
| `loop` | boolean |
| `thumbnail` | `MediaValue` |
| `disablepictureinpicture` | boolean |

#### `media/vimeoVideo` content

| Property | Type |
| --- | --- |
| `sourceID` | string |
| `hash` | string |
| `hideControls` | boolean |
| `autoplay` | boolean |
| `muted` | boolean |
| `loop` | boolean |
| `disablepictureinpicture` | boolean |
| `startTime` | non-negative integer |

#### `media/ytVideo` content

| Property | Type |
| --- | --- |
| `videoID` | string |
| `hideControls` | boolean |
| `autoplay` | boolean |
| `muted` | boolean |
| `loop` | boolean |
| `disablepictureinpicture` | boolean |
| `startTime` | non-negative integer |

#### `media/iframe` content

| Property | Type |
| --- | --- |
| `source` | string |
| `embedAsHTML` | boolean |
| `sandboxChoice` | integer[0..2] |
| `allowFullScreen` | boolean |
| `permission` | `IframePermission[]` |

`sandboxChoice`: `0` means no sandbox, `1` permits scripts and same-origin behavior, and `2` applies a strict sandbox.

`IframePermission` is one of:

```text
autoplay
encrypted-media
picture-in-picture
fullscreen
camera
microphone
speaker-selection
clipboard-read
clipboard-write
display-capture
gamepad
geolocation
hid
idle-detection
keyboard-map
magnetometer
midi
payment
screen-wake-lock
serial
usb
xr-spatial-tracking
storage-access
web-share
sync-xhr
accelerometer
gyroscope
ambient-light-sensor
vr
```

#### `media/gDocs` content

| Property | Type |
| --- | --- |
| `gDocsID` | string |

#### `media/ytLive` content

| Property | Type |
| --- | --- |
| `channelID` | string |

#### `media/html` content

| Property | Type |
| --- | --- |
| `html` | string |

### 8.3 Shared basic/media size schema

Basic and media types inherit the category size contract.

| Property | Type | Semantics |
| --- | --- | --- |
| `along` | `SpaceValue` | Width in a horizontal parent; height in a vertical parent. |
| `overflowAlong` | integer[1..3] | `1` visible, `2` hidden, `3` automatic scrolling. |
| `alongGrow` | number | Flex growth factor. |
| `alongShrink` | boolean \| integer[0..1] | Flex shrink control. |
| `across` | `SpaceValue` | Height in a horizontal parent; width in a vertical parent. |
| `overflowAcross` | integer[1..3] | `1` visible, `2` hidden, `3` automatic scrolling. |
| `acrossAlign` | integer[0..5] | `0` auto, `1` start, `2` center, `3` end, `4` stretch, `5` baseline. |
| `mobileMinHeight` | `SpaceValue` | Mobile minimum height. |

These fields occur in an appearance state's `size` object, not at the node root.

### 8.4 `container/div`

| Field | Schema |
| --- | --- |
| `content` | `FlexNode[]` |
| `layout` | `ContainerLayout` |

#### `ContainerLayout`

| Property | Type | Default semantics |
| --- | --- | --- |
| `direction` | integer[1..4] | `1` row, `2` column, `3` row-reverse, `4` column-reverse |
| `wrap` | integer[1..3] | `1` nowrap, `2` wrap, `3` wrap-reverse |
| `spaceAlong` | integer[1..6] | start, center, end, space-around, space-between, space-evenly |
| `spaceAcross` | integer[1..5] | start, center, end, stretch, baseline |
| `spaceAcrossMutiple` | integer[1..6] | Multi-line alignment; currently stored but not applied by the renderer |
| `gapX` | `SpaceValue` | Horizontal gap |
| `gapY` | `SpaceValue` | Vertical gap |
| `stackAtMobile` | boolean | Switch to a column on mobile |
| `mobileReverseDirection` | boolean | Reverse mobile direction |
| `mobileGap` | `SpaceValue` | Mobile gap |

### 8.5 `section/section`

| Field | Schema |
| --- | --- |
| `content` | `FlexNode[]` |
| `layout` | `SectionLayout` |

#### `SectionLayout`

| Property | Type | Value mapping |
| --- | --- | --- |
| `spaceAcross` | integer[1..4] | left, center, right, stretch |
| `spaceAlong` | integer[1..3] | top, center, bottom |
| `overflow` | integer[1..3] | scroll, hidden, no special rule |
| `gap` | `SpaceValue` | Desktop gap |
| `mobileGap` | `SpaceValue` | Mobile gap |
| `mobileReverseDirection` | boolean | Reverse children on mobile |
| `displayType` | integer[0..2] | standard, wide, full |

Section-specific appearance size properties:

| Property | Type |
| --- | --- |
| `height` | `SpaceValue` |
| `alongGrow` | boolean |
| `alongShrink` | boolean |
| `mobileMinHeight` | `SpaceValue` |

### 8.6 Root elements

#### `@root/RaySite` (`RootBodyNode`)

| Field | Schema |
| --- | --- |
| `content.header` | `FlexNode` |
| `content.main` | `FlexNode` |
| `content.cta` | `FlexNode` |
| `content.footer` | `FlexNode` |
| `layout` | empty or extension object |

Conventional child types are `@root/header`, `@root/main`, `@root/CTA`, and `@root/footer`, or inheritance nodes resolving to those types.

#### `@root/main`

| Field | Schema |
| --- | --- |
| `content` | `FlexNode[]` |
| `layout` | empty or extension object |

#### `@root/CTA`

| Field | Schema |
| --- | --- |
| `content` | `FlexNode[]` |
| `layout` | `SectionLayout` |

#### `@root/footer`

| Field | Schema |
| --- | --- |
| `content` | `FlexNode[]` |
| `layout` | `SectionLayout` |

#### `@root/popup`

| Field | Schema |
| --- | --- |
| `content` | `FlexNode[]` |
| `layout` | `PopupLayout` |

`PopupLayout` includes `spaceAcross`, `spaceAlong`, `overflow`, `gap`, `mobileGap`, and `mobileReverseDirection`, with the same mappings as `SectionLayout` except that it has no `displayType`.

Popup-specific appearance size properties include `height`, `alongGrow`, `alongShrink`, `mobileMinHeight`, desktop margins, and mobile margins.

#### `@root/float`

| Field | Schema |
| --- | --- |
| `content.label` | string |
| `layout` | empty or extension object |

Float-specific appearance size properties:

| Property | Type |
| --- | --- |
| `minHeight` | `SpaceValue` |
| `minWidth` | `SpaceValue` |
| `floatOn` | integer |
| `widthPadding` | `SpaceValue` |
| `heightPadding` | `SpaceValue` |

#### `@root/header`

| Field | Schema |
| --- | --- |
| `content` | `HeaderContent` |
| `layout` | `HeaderLayout` |

##### `HeaderContent`

All dotted names below are literal properties.

| Property | Type | Conditional rule |
| --- | --- | --- |
| `logo.type` | enum(`text`, `image`) | — |
| `logo.text` | string | Used when `logo.type` is `text` |
| `logo.image` | `MediaValue` | Used when `logo.type` is `image` |
| `nav` | `NavigationItem[]` | — |
| `primaryButton.enable` | boolean | — |
| `primaryButton.text` | string | Used when enabled |
| `primaryButton.url` | string | Used when enabled |
| `primaryButton.newPage` | boolean | Used when enabled |
| `secondaryButton.enable` | boolean | Secondary CTA enablement |
| `secondaryButton.text` | string | Used when secondary is enabled |
| `secondaryButton.url` | string | Used when secondary is enabled |
| `secondaryButton.newPage` | boolean | Used when secondary is enabled |

##### `NavigationItem`

| Property | Type | Required |
| --- | --- | --- |
| `name` | string | yes |
| `url` | string | no |
| `children` | `NavigationItem[]` | no |

The renderer explicitly processes the first child level. Deeper levels are valid JSON but are not recursively rendered by the current header implementation.

##### `HeaderLayout`

| Property | Type | Value mapping |
| --- | --- | --- |
| `desktopPosition` | integer[1..7] | Registered logo/navigation/CTA arrangement |
| `mobileMenuPlace` | enum(`left`, `right`) | Mobile menu side |
| `desktopHeaderMaxInnerWidth` | `SpaceValue` | Inner maximum width |
| `desktopHeaderMainGap` | `SpaceValue` | Desktop primary gap |
| `mobileHeaderMainGap` | `SpaceValue` | Mobile primary gap |
| `desktopHeaderSeparateBorderSpace` | `SpaceValue` | Separate-border spacing |
| `desktopMenuMode` | integer[0..6] | on-top, left-slide, left-clip, right-slide, right-clip, top-slide, top-clip |
| `desktopCoverHeaderOnMenu` | boolean | Desktop menu cover flag |
| `mobileCoverHeaderOnMenu` | boolean | Mobile menu cover flag |
| `spaceBetween` | `SpaceValue` | Navigation spacing |
| `navMajorGap` | `SpaceValue` | Major navigation gap |
| `navMinorGap` | `SpaceValue` | Minor navigation gap |
| `nestingSupport` | integer[0..4] | none, expand, clickable, non-clickable mobile expansion, whole expand |
| `transitionTime` | number | Menu transition time |
| `transitionCurve` | `CurveValue` | Menu transition curve |
| `mobileCtaType` | integer[0..2] | standard, full sticky, full row |
| `mobileLogoPosition` | enum(`left`, `center`) | Mobile logo alignment |
| `hamAnimation` | integer[1..3] | Hamburger animation selection |
| `hamAnimationOnDesktop` | boolean | Desktop hamburger-animation flag |
| `mobileButonRound` | `SpaceValue` | Mobile button rounding; spelling is normative |
| `stickyToBottom` | boolean | Mobile bottom-sticky flag |

Header-specific appearance size properties include desktop/mobile margins, `maxWidth`, `height`, and `mobileHeight`. Registered internal appearance targets include primary CTA, secondary CTA, and menu styling targets.

## 9. Appearance schema

### 9.1 `AppearanceMap`

```text
Record<AppearanceName, AppearanceDefinition>
```

### 9.2 `AppearanceDefinition`

```text
Record<AppearanceTarget, AppearanceTargetStates>
```

`base` is the node-level target. Other target strings address internal parts registered by complex element types.

### 9.3 `AppearanceTargetStates`

| Property | Type | Semantics |
| --- | --- | --- |
| `default` | `AppearanceState` | Default desktop state |
| `hover` | `AppearanceState` | Desktop hover state |
| `onMobile` | `AppearanceState` | Mobile state |
| `onMobileHover` | `AppearanceState` | Mobile hover state |

### 9.4 `AppearanceState`

| Property | Type |
| --- | --- |
| `style` | `StyleValue` |
| `size` | Type-dependent size object |

### 9.5 `StyleValue`

| Property | Type |
| --- | --- |
| `paddingTop` | `SpaceValue` |
| `paddingBottom` | `SpaceValue` |
| `paddingLeft` | `SpaceValue` |
| `paddingRight` | `SpaceValue` |
| `mobilePaddingTop` | `SpaceValue` |
| `mobilePaddingBottom` | `SpaceValue` |
| `mobilePaddingLeft` | `SpaceValue` |
| `mobilePaddingRight` | `SpaceValue` |
| `borderMode` | enum(`solid`, `none`, `dashed`, `dotted`, `double`) |
| `borderTop` | `SpaceValue` |
| `borderBottom` | `SpaceValue` |
| `borderLeft` | `SpaceValue` |
| `borderRight` | `SpaceValue` |
| `borderRadius` | non-negative number |
| `shadow` | boolean |
| `shadowInset` | boolean |
| `shadowOffsetX` | number |
| `shadowOffsetY` | number |
| `shadowBlur` | non-negative number |
| `shadowExpand` | number |
| `shadowColor` | `ColorValue` |
| `textColor` | `ColorValue` |
| `background` | `ColorValue` |
| `blur` | non-negative number |
| `font` | string |
| `markColor` | `ColorValue` |

## 10. Action schema

### 10.1 `ClickableValue`

| Property | Type | Required |
| --- | --- | --- |
| `enable` | boolean | yes |
| `action` | `ActionValue` | required when enabled |

### 10.2 `ActionValue`

`ActionValue` is discriminated by `mode`.

| `mode` | Additional properties |
| --- | --- |
| `a` | `url?: string`, `newPage?: boolean` |
| `download` | `url?: string`, `forceDownload?: boolean \| string` |
| `openPopup` | `popupID?: string` |
| `closeThisPopup` | none |
| `runJS` | `JS?: string` |

## 11. Animation schema

### 11.1 `AnimationValue`

| Property | Type | Required |
| --- | --- | --- |
| `animationType` | integer[-1..14] | yes |
| `animationCurve` | `CurveValue` \| coordinate tuple | no |
| `duration` | number | no |
| `delayTime` | number | no |
| `trigger` | integer | no |
| animation-specific fields | see registry | conditional |

`duration` and `delayTime` are expressed in seconds by the current animation renderer.

### 11.2 Animation registry

| ID | Name | Additional schema |
| --- | --- | --- |
| `-1` | inherit | none |
| `0` | showup | none; duration is overridden to zero |
| `1` | fade | none |
| `2` | flyIn | `direction: number`, `intensity: non-negative number` |
| `3` | growTurn | `rotate: number` |
| `4` | zoom | none |
| `5` | basicZoom | `scaleStart: number` |
| `6` | rise | `direction: integer[1..8]`, `intensity: non-negative number` |
| `7` | stretch | `direction: integer[1..4]` |
| `8` | wipe | `direction: integer[1..4]` |
| `9` | peekIn | `direction: integer[1..4]`, `intensity: non-negative number` |
| `10` | box | `x: integer[1..3]`, `y: integer[1..3]` |
| `11` | expand | none |
| `12` | tumble | `directionRight: boolean \| integer[0..1]`, `fromUp: boolean \| integer[0..1]`, `rotateIntensity: number` |
| `13` | rotate | `directionRight: boolean \| integer[0..1]`, `rotateIntensity: number` |
| `14` | slideRotate | `rotateIntensity: number`, `slideAmountX: number`, `slideAmountY: number` |

### 11.3 `SectionAnimationValue`

| Property | Type |
| --- | --- |
| `self` | `AnimationValue` |
| `all` | `AnimationValue` plus `executionInterval?: number` |

`all.delayTime` is the first descendant delay. `executionInterval` is added between successive participating descendants.

## 12. Transition schema

### 12.1 `TransitionValue`

| Property | Type |
| --- | --- |
| `inherit` | boolean |
| `property` | string[] |
| `duration` | non-negative number |
| `delay` | non-negative number |
| `curve` | `CurveValue` \| coordinate tuple |

`duration` and `delay` are expressed in milliseconds.

### 12.2 `SectionTransitionValue`

| Property | Type |
| --- | --- |
| `self` | `TransitionValue` |
| `all` | `TransitionValue` |

## 13. Schema integrity constraints

A schema-conformant project should satisfy all of the following:

1. Every JSON document is syntactically valid UTF-8 JSON.
2. `/main.json`, when present, contains a JSON object.
3. Every page document contains a `body` compatible with `RootBodyNode`.
4. Every component document contains one `FlexNode` object.
5. Every `FlexNode.type` names a registered type or is `@inherit/inherit`.
6. Every inheritance `source` has a corresponding component document unless the branch is intentionally removable.
7. Component inheritance is acyclic.
8. Element `id` values are unique non-negative safe integers within a rendered document.
9. Every internal `MediaValue` resolves to an existing path under `/assets/`.
10. Every page `theme` resolves to `/themes/<theme>.json`.
11. Page routes avoid underscores to preserve reversible filename decoding.
12. Header dotted properties remain literal keys.
13. Content and layout payloads match the schema selected by `type`.
14. Appearance size data matches the selected element category or type.
15. Executable fields, including raw HTML, raw CSS, iframe permissions, and `runJS`, originate only from trusted project authors.

## 14. Completeness profile

A conventional complete website project contains:

| Resource | Recommended cardinality |
| --- | --- |
| `main.json` | exactly one |
| `themes/default.json` | at least one theme total |
| `pages/_.json` | exactly one home page |
| `pages/404.json` | zero or one |
| `componets/header.json` | one when referenced |
| `componets/cta.json` | one when referenced |
| `componets/footer.json` | one when referenced |
| assets | every file referenced by an internal media value |

---

Concept Designed by Ray - With help of ChatGPT transform code to a clear documention
