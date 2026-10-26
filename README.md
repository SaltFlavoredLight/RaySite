# RaySite

this is offical repo of RaySite.
RaySite is a Powerful Drag-and-Drop Website Buidler that dediated for solve problems with website creating but with Finencial problems

> NOTES: 
> this currerently in Beta - In complete, as demo only, please wait till 2027 when RaySIte CMS also release to see


## Install it?
1. Clone this project
2. Download Node.js
3. Open the CMD, run:
```bash
cd /path/to/project

npm install

# then, to preview
npm run dev

# Production Ready Bulids
npm run build
```

The development server normally runs at [http://localhost:2237](http://localhost:2237).
If that port is already in use, Vite selects the next available port.

## FlexEngine JSON demo

Open `/tests/sim/import-json-guide.html` on the development server to import the
project resources and validate all four routes plus the 404 page. The resources
are listed in
[`tests/unit/test-resource/manifest.json`](./tests/unit/test-resource/manifest.json).
The sample pages use FlexEngine-native element data, including each element's
`layout`, `appearance`, and `animation` fields; styling and responsive behavior
are produced by the engine's theme, CSS, and render runtimes. See
[`docs/rs-style-infomation.md`](./docs/rs-style-infomation.md) for the JSON
resource and rendering model.

The four-page portfolio project is authored as native FlexEngine JSON under
[`tests/unit/test-resource`](./tests/unit/test-resource), with routes for Home,
About, Work, and Contact.

The app's starter resources are seeded only when the project has no pages, but
the guide imports its sample into the local project store. Use a clean browser
origin or clear the `files` object store in the `ZipContainerDB` IndexedDB
database before opening the guide if you want to avoid replacing an existing
local project. See
[`docs/native-flexengine-demo.md`](./docs/native-flexengine-demo.md) for the
resource map, JSON structure, and engine changes demonstrated by this version.

## Credits 
Following Packages is credited during devalopment, Thank you for provide packages for free.
```
+-- idb@8.0.4
+-- jszip@3.10.1
+-- quill-delta-to-html@0.12.1
+-- quill@2.0.3
+-- sortablejs@1.15.7
`-- vite@8.3.4
```


>  Love the Lord your God with all your heart and with all your soul and with all your mind.