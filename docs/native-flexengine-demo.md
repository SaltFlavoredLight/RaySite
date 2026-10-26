# Native FlexEngine demo

This update demonstrates a project built from FlexEngine JSON resources rather
than opaque HTML fragments. The package version remains `0.9.0`; this document
describes the current source behavior and the focused renderer updates.

## Run the demo

1. Start the app with `npm run dev`.
2. For a clean demo, clear the `files` object store in the `ZipContainerDB`
   IndexedDB database for the app's origin. This removes the locally saved
   project for that origin.
3. Open `/tests/sim/import-json-guide.html`.
4. Select **Import JSON and render /about** to validate and render all four
   public pages plus the 404 page. Use the route buttons to preview a page.

The guide verifies every manifest resource, checks that native elements include
their `layout`, `appearance`, and `animation` objects, renders the 404 page,
and checks generated theme typography and runtime styles. A successful render
reports `PASS` on the page.

The guide imports the listed sample resources into the browser's local project
store. Use a clean browser origin or clear its `files` object store before the
demo if you want to avoid replacing an existing local project.

## Resource map

All demo JSON is under [`tests/unit/test-resource`](../tests/unit/test-resource)
and is described by `manifest.json`. The route filenames follow
`FlexEngineFileSystem`:

| Resource file | Route or role |
| --- | --- |
| `pages/_.json` | `/` |
| `pages/_about.json` | `/about` |
| `pages/_work.json` | `/work` |
| `pages/_contact.json` | `/contact` |
| `pages/404.json` | 404 page |
| `componets/header.json` | Shared Header |
| `componets/cta.json` | Shared call-to-action |
| `componets/footer.json` | Shared Footer |
| `themes/default.json` | Shared colors and typography |
| `main.json` | Project metadata |

The project is authored as FlexEngine JSON, with routes for Home, About, Work,
and Contact. The previous simulation fixture is preserved in
`tests/sim/test-resource2`.

The page tree uses `@root/RaySite` and `@root/main`; Header, CTA, and Footer
are shared through `@inherit/inherit` component references. Text and headings
use Quill Delta, while images and buttons use their registered element data.
Heading block formatting belongs on the newline operation:

```json
"content": [
  { "insert": "A page title" },
  { "insert": "\n", "attributes": { "header": 1 } }
]
```

Rendered elements carry their own `layout`, `appearance`, and `animation`
objects. These settings are type-specific: for example, `container/div` uses
direction, wrapping, alignment, and gaps, while `section/section` uses section
alignment and display width. Appearance values are organized by variant,
target, and state, such as
`appearance.default.base.default.style` and
`appearance.default.base.default.size`. Empty objects defer to the registered
element defaults and theme.

## Focused engine updates

- Root elements now resolve from either their registry key or `className`, so
  `@root/CTA` matches the registered CTA element.
- Element content rendering accepts both `contentFunction` and
  `contextFunction`, which lets the registered `container/div` renderer build
  its native children.
- Section and root-component gaps now pass through the engine's space-value
  resolver, including mobile gaps.
- Theme typography targets rendered semantic `h1`–`h4` elements as well as
  named classes, so native headings receive the theme font and size.
- The service worker recovers a lost engine client by preferring a focused or
  visible builder tab. A builder tab must remain open for preview requests to
  be proxied.

The JSON import guide tests `flexEngineServers.render` directly for `/about`
and `/`, then renders with FlexEngine's common, theme, animation, and page CSS
plus its generated style and header runtimes. The grouped
`flexEngineServers.editor` and `flexEngineServers.render` exports preserve the
existing individual server exports.

Rendered system classes now use each element's registered `className`, keeping
root components such as `@root/CTA` aligned with generated CSS selectors.
Section, CTA, and Footer wrappers use their matching
`rs-context-section-*`, `rs-context-cta-*`, and `rs-context-footer-*` classes,
so standard and wide content receive the intended maximum widths.

For more detail on style and runtime attributes, see
[`rs-style-infomation.md`](./rs-style-infomation.md).
