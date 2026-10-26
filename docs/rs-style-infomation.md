# RaySite style, animation, and transition attributes

This note documents the current renderer behavior in `src/flexEngine.js`.
The `rs-` prefix is `BUILDER_CONFIG.classPrefix`; it is currently `rs-`.

## Native JSON resources and element data

The JSON demo resources are listed in
[`../tests/unit/test-resource/manifest.json`](../tests/unit/test-resource/manifest.json).
The filesystem maps `/` to `pages/_.json`, `/about` to `pages/_about.json`,
`/work` to `pages/_work.json`, `/contact` to `pages/_contact.json`, and the
not-found route to `pages/404.json`. The project defines the Home, About,
Work, and Contact pages as JSON documents.

A page's `body` is a native FlexEngine tree. The sample uses the registered
`@root/RaySite` page element, which contains `@root/main` and shared component
references such as `{ "type": "@inherit/inherit", "source": "header" }`.
Regular elements use registered types such as `section/section`,
`container/div`, and `basic/heading`. The type determines how `content` is
interpreted: it can contain child elements, Quill Delta text, or element
specific data such as an image source or button label.

Text and headings use Quill Delta operations. For a heading, keep the text
operation separate from its formatted newline, for example:

```json
"content": [
  { "insert": "A page title" },
  { "insert": "\n", "attributes": { "header": 1 } }
]
```

Each rendered element carries its identity and its own configuration:

| Field | Purpose |
| --- | --- |
| `id` | Stable numeric element identifier used by the renderer and generated scope classes. |
| `JSID` | Optional stable DOM `id` for links, navigation, or scripts. |
| `type` | The element registry type; root aliases match their registered name or `className`. |
| `content` | Type-specific text, child nodes, or component data. |
| `layout` | Type-specific flow, alignment, gaps, size, and responsive layout values. |
| `appearance` | Style and size values for named variants, targets, and states. |
| `animation` | Type-specific animation configuration; `{}` means no custom animation. |
| `clickable` | Optional action configuration, commonly used for button links. |

Layout is deliberately element-specific rather than a universal property set.
For example, `container/div` uses direction, wrapping, alignment, and `gapX`
and `gapY`; `section/section` uses section alignment and display width. The
engine invokes an element's `contentFunction` or `contextFunction` to render
its content and layout.

Appearance data is nested by variant, target, and state. For example,
`appearance.default.base.default` contains the default state's `style` and
`size` values. Other supported states include `onMobile`, `hover`, and
`onMobileHover`. Empty appearance objects use the registry's element defaults;
the theme JSON separately supplies shared colors and typography. Theme
typography rules match both named classes and the rendered semantic `h1`–`h4`
elements.

The `/tests/sim/import-json-guide.html` demo exercises these resources through
`flexEngineRenderPage()`, injects the engine-generated common, theme,
animation, and page CSS, and runs the generated style and header runtimes. It
does not render the sample pages as opaque `media/html` blobs.

## `rs-styles-*`

`flexEngineStylingSystem()` turns an element's `appearance` data into
attributes such as `rs-styles-default` and `rs-styles-default-onMobile`.
The attribute value is a CSS declaration string produced by the selected
style and size processors. These attributes are intermediate render data,
not native HTML attributes with built-in browser behavior.

Supported name components are:

| Attribute suffix | Meaning |
| --- | --- |
| `default`, `base`, or `node` | Apply declarations to the element itself. |
| Another target name, such as `text` | Scope declarations to the same element when it also has the target class. |
| `-onMobile` | Apply in the renderer's mobile media query (max-width: 768px). |
| `-onHover` | Apply while the styled element is hovered. |
| `-onMobileHover` | Combine the mobile and hover conditions. |
| `-at<encoded-selector>` | Apply to a nested selector beneath the target. The selector is encoded with `toAlphaEscape()`. |

`extractBuilderStyles()` parses these attributes, assigns or reuses a unique
numeric `rs-*` scope class, and emits scoped CSS. It removes the intermediate
style attributes by default. The RenderServer requests preservation so its
response can ship the matching scoped CSS. Both the direct editor-canvas render
and the generated HTML path run the style runtime after stylesheets load. The
editor omits the route-specific page stylesheet (`_.css` for `/`) so the
editor's live hover handler can apply the stored hover declarations directly;
Preview/RenderServer still loads it. The runtime
scans the whole document, applies `default`/`base`/`node` declarations to
`element.style`, and applies target classes, encoded nested selectors, hover,
and mobile conditions inline to matching elements while their state is active.
In Editor mode, `src/ui.js` listens to pointer entry/exit on the canvas and
asks the runtime to recalculate matching style declarations; hover properties
without an existing transition receive a short editor-only transition. The
runtime then removes RaySite configuration attributes while retaining classes
needed by the normal site stylesheets. The style-attribute prefix is normalized
so `rs-` generates `rs-styles-*`, not `rs--styles-*`.
The global header uses a 60px fallback height when its saved size is unset and
does not receive a zero max-width unless one was explicitly configured.

## `rs-animation-*`

`flexEngineDefaultAnimation` defines animation IDs and keyframes:

| ID | Name | Keyframe effect |
| ---: | --- | --- |
| 0 | `showup` | Fade from transparent to opaque; configured to override duration to zero. |
| 1 | `fade` | Fade from transparent to opaque. |
| 2 | `flyIn` | Fade and translate from a configurable direction and distance. |
| 3 | `growTurn` | Fade, scale up, and rotate from a configurable angle. |
| 4 | `zoom` | Fade and scale from 0.4 to 1. |
| 5 | `basicZoom` | Fade and scale from a configurable starting scale. |
| 6 | `rise` | Fade and translate from a configurable direction and distance. |
| 7 | `stretch` | Stretch/transform using a configured origin. |
| 8 | `wipe` | Reveal using a configured clipping edge. |
| 9 | `peekIn` | Reveal and translate from a configured direction. |
| 10 | `box` | Reveal using configurable horizontal and vertical origins. |
| 11 | `expand` | Expand/transform into the final state. |
| 12 | `tumble` | Fade, translate, and rotate from a configurable direction. |
| 13 | `rotate` | Rotate into the final state. |
| 14 | `slideRotate` | Translate and rotate into the final state. |

The animation property renderer writes configuration attributes including:

- `rs-animation-config-self` and `rs-animation-config-self-trigger`
- `rs-animation-config-all` and `rs-animation-config-all-trigger`
- `rs-animation-config-all-firstdelay` and
  `rs-animation-config-all-timeRange`
- `rs-animation-self-inherit`

The values encode the animation keyframe name, duration, curve, delay,
trigger, and (for parameterized animations) CSS custom properties. Generated
keyframe names use the `rs-animation-` prefix referenced by the configuration.
Section animation inheritance writes per-descendant values and stagger delays
using `applySectionAnimation()`. `animation.css` serves the keyframe definitions.

The render runtime reads these attributes across the whole document. Trigger
`1` starts after style configurations are applied; trigger `2` starts when the
element enters the viewport (using `IntersectionObserver`, with a scroll/resize
fallback when it is unavailable). Section-level `all` animations are propagated
to inheriting descendants with their configured stagger delays. RaySite
configuration attributes are removed after the runtime has consumed them.

## `rs-transition-*`

The transition property writes:

- `rs-transition-config-self`
- `rs-transition-config-all`
- `rs-transition-self-inherit`

`renderSingle()` serializes selected CSS properties as transition entries
with duration and delay converted from milliseconds to seconds, and a curve
converted to a CSS timing function. Section inheritance is propagated by
`applySectionTransition()`. However, the current source has no call site for
`applySectionTransition()` and no runtime reader of these transition
configuration attributes. Thus, these attributes currently describe
transition intent; emitting them alone does not activate a CSS transition.

Transitions that are directly emitted by an element's CSS declarations (for
example, component styles) remain ordinary CSS and do not depend on these
configuration attributes.

## Server split

- `SimEditorServer` is the service-worker target for normal app/preview requests.
  `simServer` and `webServer` remain aliases for backwards compatibility.
- The service worker keeps an engine client for proxying requests and recovers
  to the focused or visible builder tab if that in-memory client is lost. This
  supports multiple open builder tabs.
- `SimRenderServer` serves generated page responses, including the page
  stylesheet (including the root `_.css` path), common main, theme, and
  animation resources, plus `/rs-assets/script/renderStyles.js`.
- Preview loads `/rs-build/index.html?page=...`; the service worker routes that
  document and its `/rs-assets/` requests to `SimRenderServer`. Ordinary editor
  requests continue to use `SimEditorServer`.
