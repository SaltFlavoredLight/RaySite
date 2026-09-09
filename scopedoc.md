# Scope of AppAPIs:

## Create one
to create an AppAPIs for Website, use:
```js
import AppAPIs from "AppAPIs.js";

// start an App, keep it here.
const app = new AppAPIs("RaySite", {
	
});

// set canvas
app.setCanvas(element);

// run everytime when things changed!
const dataArray = app.currentPage;
const currentFocus = app.currentFocused;
```
remember that field of name is just a placeholder.

## Pages & Assets
those were all about Pages

### `app.listPages()`
this will list all of the page in the index form:
```js
const responce = [
	{
		path: "/",
		title: "Start with RaySite!",
		type: "page"
	},
	{
		path: "/about",
		title: "About RaySite.",
		type: "page"
	}
]
```

### `app.getPageContent(pageURL)`
it will return a JS object (**editable**) as what the page is.

### `app.setAsCurrentPage(pageURL)`
**Important Operation**
set current page to this page, when user click page switch do this.

### `app.listAssets(assetsCatergory)`
list all the assets at same time. `/` just list all of them.

### `app.updateAssets(assetsCatergory, name, updatedInfomation)`
Update them, it it is not, create one.


## Pages