# Ray Studio Sites Documentation v1.0
Welcome! This is Ray Studio Sites!

Ray Studio Website builder (or Ray Studio Sites) have a format called .rswp
**What it include:**

## Structure:

It’s a .zip with a .rswp tag!
This is file structure:
```
/assets
    logo.png
    custom.js
    titleOG.png
    ...... (more)
   
/pages
    _.json
    _about.json
    _about_team.json
    _christian.json
    ...... (more)

theme.json
main.json
```
main.json controls site settings and that we choose to save at web IndexDB. or the desktop version. at the local.

## Assets
those can be edited at **Assets** panel.

all the things are saved at assets, that the assets panel shows up about that!
we will save at the assets panel.

## Pages
those can be edited at **Pages** and **Edit** panel.

inside there, we have a route name, example:

Route in real website | Route in file 
--------------------- | -------------
`/`                   | `_.json`
`/about`              | `_about.json`
`/contact`            | `_contact.json`
`/about/team`         | `_about_team.json`
`/the-best`           | `_the-best.json`
(anything)            | (route replace `/` to `_`)

and you see? Now it needs to say what's our page?

```
{
	"title": "About Us",
	"includeInSitemap": true,
	"blockForRobots": "",
	"OGImage": "assets/OGs",
	"OGdescription": "this is us that we can..."
	"tags": null,
	"hideHeaders": false,
	"hideFooters": false,
	
	"section": [
		{sections},
		{sections}, 
		......
	]

	"addingHead": "<html head part>"
}
```
1.0 settings:
Title: appeal at `<title>`, OGs, X card.
IncludeInSitemap: **normally yes**, if no hide from Sitemap.xml
BlockForRobots: all the things that hide them......
OGImage: for OG and X card it's like that, `null` = follow general
OGdescription: same thing......  `null` = follow general
tags: same,  `null` = follow general
hideHeaders: yes we will hide the header for you.
hideFooters: same.
section: the contact there! that we choose using a section.

so now it's about Section......

## Sections: how to layout? 

basically just a section and frames......
maybe hard to explain but:

a page is built with sections.
and a section can have elements, and all elements are placed in a row...
an element can be a text, a media, or something else, even a blank or container!

the json in the section (should in `"section"` of the webpages......

```
{
	"type": "section"
	"fullSection": false,
	"paddingLeft": "40px",
	"paddingRight": "40px",
	"paddingTop": "40px",
	"paddingBottom": "40px",
	"background": "var(--theme1)",
	"textColor": "var(--themetext)"
	"mobileVersionReverse": false,
	"gap": "30px",
	"maxWidth": null,
	
	"sectionData": [
		{section data}...
	],

	"divider": {
		"dividerOpen": true,
		"dividerColor":  "var(--theme1)",
		"dividerBold": "3px",
		"dividerMaxLength": "800px",
		"dividerPaddingLeft": "null",
		"dividerPaddingRight": "null",
		"dividerPositionMode": "up",
		"dividerPositiondistance": "3px",
	}

	"customJS": "/assets/js/something.js"
}
```

**general info:**
**fullSection:** if True, ignore everything and full screen it! (padding 0, color and text follow general and all things fill it!) only for a single section......
**paddingLeft, paddingRight, paddingTop, paddingBottom:** padding for them.
**background:** set background, it's written in CSS.
**textColor:** same thing...... but for text......
**mobileVersionReverse:** select yes to reverse the order in mobile.
**gap:** the thing between them
**maxWidth:** `null` is unlimited, or a number for max length. also a `"screen"` is the following screen size in desktop. 

**sectionData:** the data inside......

**dividerOpen:** if yes look down, if no ignore all the things.
**dividerColor:** this shows up a color......
**dividerBold:** this is a length
**dividerMaxLength:** this is a max length of that line length. `null` is unlimited
**dividerPaddingLeft, dividerPaddingRight:** set a number or  `null` for the same section padding...
**dividerPositionMode:** `"none"` as just a line, `"up"` or `"down"` as push up or down.
**dividerPositiondistance:** this is the way to push it.......
**customJS:** where the JS is!

Now let's talk about Section Data......

## Section Data: the thing inside
you can set many things in the data.
all things should have layouts + property, that we will show later!

### Text / Head / Quote / Blockquote / Code block:
save your text now!
```
{
	"type": "text",
	"data": {
		"text": "In recent decades, many regions around the world have seen a noticeable decline in the number of people identifying as Christian. <nl> This document explores the <b>five major reasons</b> behind this shift and why it matters today. <nl divider>",
		"gDocLink": null,
	}
	"layouts": {}
	"property": {}
}
```
**Text:** We are using .rsd format!
**gDocLink:** a link, if available, you can choose a link that will be replaced after done......

### Images
insert your images!
```
{
	"type": "image",
	"data": {
		"image": "/assets/hero.png",
		"alt": "hero",
		"length": "300px",
		"basedOnWidth": false,
		"fill": false
	}
	"layouts": {}
	"property": {}
}
```
**Image:** image text on here!
**alt:** For SEO, this is alt text.
**length basedOnWidth:** what's the width (or height, based on basedOnWidth) of that image?
**fill:** ignore more things that can fill the image!

### Button
you can set up a button and hit that to open a URL or a JS script! (yeah! using onclick and inserting JS!)
```
{
	"type": "button",
	"data": {
		"Mode": 1,
		"Modecustom": {},
		"text": "Open My Gift!"
		"bold": false,
		"toggleURL": null,
		"toggleBlankPage": false,
		"toggleJS": "",
		"assignID": "clickbutton"
	}
	"layouts": {}
	"property": {}
}
```
**Mode:** 1 to 3 = version of theme. on future, 0 =custom
**Modecustom:** placeholder.
**text:** What do you want to input?
**bold:** true for `<strong>` it

**toggleURL:** `"null"` to hide it! or a URL.
**toggleBlankPage:** if you click, is that taking a new page or not?
**toggleJS:** JS onclick!
**assignID:** use that for easy control in DOM.
    
### Embed / HTML / Spacer / 3rd party
just a blank space? NO! it's official called HTML insert! for user insert the HTML!
```
{
	"type": "htmlInsert",
	"data": {
		"asFullHTML": false,
		"HTML": "",
		"minHeight": 200px
	}
	"layouts": {}
	"property": {}
}
```
you should can understand:
**asFullHTML:** make sure that enable if you have a `<html>` or `<body>`. that will determine for using `<iframe>` or not.
don't want to say another 2 mean......

for HTML, you can insert:
your embed
your custom HTML
or just like example (blank)
or those are our built-in service embed:

 -  youtube.com video
 - sporify.com playlist
 - google map

### Video
**IMPORTANT NOTE: I DO NOT SUPPORT PUT VIDEO IN RAY STUDIO SITES, THAT MEAN YOU NEED A EXTERNAL storage!**
```
{
	"type": "video",
	"data": {
		"videoURL": "https://www.pexels.com/download/video/1560989/",
		"autoplay": true,
		"loop": true,
		"showControl": true,
	}
	"layouts": {}
	"property": {}
}
```
### Audio
Sorry we do not support

### Google Form (not the embed one Jeez!)
with Google you need a setup:
start a blank form, click prefill link, and show up something...
Yes, it's using Google Form API!

### Input field (for developer)
make an ID , then control your DOM!
```
{
	"type": "input",
	"data": {
		"prefilled": "type here......",
		"multipleLine": false,
		"mode": 1
	}
	"layouts": {}
	"property": {}
}
```
    
### Table and Chart, Countdown timer, Progress bar, Search bar
not supported, or you can using HTML insert

### Flex Row 
this is a container that you can add more!
```
{
	"type": "flexRow",
	"data": {
		"reverseInMobile": false,
		"align": "left",
		"justify": "center",
		"minLength": "0px"
		
		"datas": [
			<another elements>
		]
	}
	"layouts": {}
	"property": {}
}
```
**reverseInMobile:** reverse the order in mobile.
**align:** all the thing can lie in which direction?
**justify:** if you have a new space, those can form in center.
**data:** what's the new section in.
**minLength:** this is the min length.

### Flex Column Standard
and this is the Flex Column.
```
{
	"type": "flexColumn",
	"data": {
		"reverseInMobile": false,
		"align": "top",
		"justify": "center",
		"minLength": "0px"

		"datas": [
			<another elements>
		]
	}
	"layouts": {}
	"property": {}
}
```
**reverseInMobile:** reverse the order in mobile.
**align:** all the thing can lie in which direction?
**justify:** if you have a new space, those can form in center.
**data:** what's the new section in.
lastly: for everything in this container, you need to add:
```
{
	"space": 6,
}
```
yes that is what grow from the space, it take that number of 12.

### Flex Column Grow
like the standard, but if it out the way you can choose:
if choose `scroll` at "overflow" you will see.
or recommend `nextLine` that you can push into another ones...
```
{
	"type": "flexColumnGrow",
	"data": {
		"reverseInMobile": false,
		"justify": "center",
		"overflow" : "nextLine",

		"datas": [
			<another elements>
		]
	}
	"layouts": {}
	"property": {}
}
```
**reverseInMobile:** reverse the order in mobile.
**align:** all the thing can lie in which direction?
**justify:** if you have a new space, those can form in center.
**data:** what's the new section in.
lastly: for everything in this container, you need to add:
```
{
	"space": 6,
}
```
yes that is what grow from the space, it take that number of 12.
if there you cannot to push, it will atuomatclly goes to next line, Not worry, the CSS flexbox will handle that!.

### FAQ
it's another container, that notice it's container inside only 1 element! (I am not saying this can not to be container)
```
{
	"type": "flexColumn",
	"data": {
		"hoverColor" : "#FFFFFF",
		"textColor" : "#000000",
		"stroke" : 1,

		"datas": [
			<another elements>
		]
	}
	"layouts": {}
	"property": {}
}
```
**reverseInMobile:** reverse the order in mobile.
**align:** all the thing can lie in which direction?
**justify:** if you have a new space, those can form in center.
**data:** what's the new section in.
lastly: for everything in this container, you need to add:
```
{
	"questionTitle": "what's is Ray Studio Sites?",
	"defaultOpen": false
}
```
yes that is what grow from the space, it take that number of 12.
if there you cannot to push, it will atuomatclly goes to next line, Not worry, the CSS flexbox will handle that!.

### Image slide
```
{
	"type": "imgslide",
	"data": {
		"height": "300px",
		"images": [
			"slide1_URL",
			"slide2_URL",
			"slide3_URL"
		]
		"allowArrow": true,
		"allowDots": true
		"timeShift": 3,
	}
	"layouts": {}
	"property": {}
}
```

## property of site data
let's explain!
```
{
	"ID": <custom ID you want to insert (for developer), or null for nothing>,
	"Class": <custom class you need to add, or null for nothing>,
	"backgroundColor": <background color, if you failed for loading will show that color, or null for nothing>
	"fade": <a number from 0 to 1 show how to fade, or null for nothing>
	"borderRadius": <how do you want to radius? or null for nothing>
	"shadow": {
		"enable": <choose true if you want shadow>
		"offsetX": <the offset of X>
		"offsetY": <the offset of Y>
		"blur": <how you want to blur? or null for nothing>
		"spread": <do you want more? or null for nothing>
		"color": <what's color?>
		"inset": <choose true if you want>
	}
	"opacity": <0 to 1>
	"textShadow": null <note: not developed yet :) >
	
	"toggleURL": <if click, what's the A you want?  or null for nothing>
	"toggleBlankPage": <based on the toggle URL, will you choose to open a blank page? true or false>
	"toggleJS": <that's JS OK?>
	
	"hover": {
		<insert anything that you changed......>
	}
	
	"animation": null <note: not developed yet :) >
}
```
this is one that you need to use!

## Theme control `theme.json`
those can be edited at **Theme** panel.
We have over 300 cars!
this is example:
```
{
	"colorPalette": [
		"theme1": <theme1>
		"theme2": <theme2>
		"theme3": <theme3>
		"theme4": <theme4>
		"theme5": <theme5, from there you can leave a blank.>
		"theme6": <theme6>
		"theme7": <theme7>
		"theme8": <theme8>
		"theme9": <theme9>
		"theme10": <theme10>
		"theme11": <theme11>
		"theme12": <theme12>
	],
	"gFontsURLs": <fonts>,
	"Text": {
		"H1: {
			"fontSize": <Font size>,
			"fontWeight": <a number or just say bold>,
			"fontFamily": <a name that point to gFontsURLs>,
			"color": <what's your color?>,
			"textAlign": <left, center or Right?>
			"lineHeight": 1.5,
			"letterSpacing": 1px,
			"uppercase": false
		},
		"H2": {
			"fontSize": <Font size>,
			"fontWeight": <a number or just say bold>,
			"fontFamily": <a name that point to gFontsURLs>,
			"color": <what's your color?>,
			"textAlign": <left, center or Right?>
			"lineHeight": 1.5,
			"letterSpacing": 1px,
			"uppercase": false
		},
		"H3": {
			"fontSize": <Font size>,
			"fontWeight": <a number or just say bold>,
			"fontFamily": <a name that point to gFontsURLs>,
			"color": <what's your color?>,
			"textAlign": <left, center or Right?>
			"lineHeight": 1.5,
			"letterSpacing": 1px,
			"uppercase": false
		},
		"P": {
			"fontSize": <Font size>,
			"fontWeight": <a number or just say bold>,
			"fontFamily": <a name that point to gFontsURLs>,
			"color": <what's your color?>,
			"textAlign": <left, center or Right?>
			"lineHeight": 1.5,
			"letterSpacing": 1px,
			"uppercase": false
		},
	},
	"layout": {
		"maxWidthContent": <what's your maximum context>
		"mobileSize": <what's the mobile size? 768 is default> 
	},
	"buttons": {
		"systemGlobal": {
			"translation": <the time: 0.4>,
			"strokeBorder": <EG: 4>,
			"height": <the height: 40px>,
			"margin": <the margin, like "10px">
			"minWidth": <the min width, like 130px>
			"fontWeight": <the weight, like normal>
			"fontSize": <fontSize>
			"paddingX": <X like 20>
			"paddingY": <Y like 0>
		},
		"systemButton": {
			"borderRadius": <you can use var(- spaces)>
			"backgroundColor": <backgroundColor>
			"textColor": <text color>
			"hoverTextColor": <hover Text Color>
			"hoverTextColor": <hover Text Color>
		},
		"systemReverseButton": {
			"borderRadius": <you can use var(- spaces)>
			"backgroundColor": <backgroundColor>
			"textColor": <text color>
			"hoverTextColor": <hover Text Color>
			"hoverTextColor": <hover Text Color>
		}
	}
	"footer": {
		<this is a section OK?!>
	}
	"header": {
		"mode": "static",
		"data": {
			"mode": "headerbar",

			"headerOuterTop": "0px",
			"headerOuterLeft": "0px",
			"headerOuterRight": "0px",
			"headerOuterradius": "0px",
			"headerColor": "var(--theme1)",
			"headerBlur": "5px"
			"headerStrokeDown": true,
			"headerStrokeDownColor": "var(--theme1)",
			"headerInnerTop": "10px",
			"headerInnerBottom": "10px",
			"headerInnerLeft": "50px",
			"headerInnerRight": "50px",
			"minimumHeight": "50px",
			"contextSetting": {
				"left": ["logo", link],
				"center": [],
				"right": ["social"]
			}
			"spaceBetweenVertical": "40px",
			"spaceBetweenInternal": "20px",
			"spaceBetweenLink": "20px",
			"linkColor": "var(--theme1)",
			"linkHoverColor": "var(--theme2)",
			"buttonColor": "var(--theme1)"
			"buttonHoverColor": "var(--theme2)",
			"buttonTextColor": "var(--theme3)",
			"subpageMenuColor": "var(--theme2)"
			"subpageMenuColorText": "var(--theme1)"
			"spaceBetweenMenu": "40px",
			"aroundMenuPadding": "15px"

			"sticky": {
				"headerOuterTop": "15px",
				"headerOuterLeft": "15px",
				"headerOuterRight": "15px",
				"headerOuterradius": "15px",
				"headerColor": "var(--theme1)",
				"headerBlur": "5px"
				"headerStrokeDown": true,
				"headerStrokeDownColor": "var(--theme1)",
				"headerInnerTop": "10px",
				"headerInnerBottom": "10px",
				"headerInnerLeft": "50px",
				"headerInnerRight": "50px",
				"minimumHeight": "50px",
				
				"spaceBetweenVertical": "40px",
				"spaceBetweenInternal": "20px",
				"spaceBetweenLink": "20px",
				"linkColor": "var(--theme1)",
				"linkHoverColor": "var(--theme2)",
				"buttonColor": "var(--theme1)"
				"buttonHoverColor": "var(--theme2)",
				"buttonTextColor": "var(--theme3)",
				"subpageMenuColor": "var(--theme2)"
				"subpageMenuColorText": "var(--theme1)"
				"spaceBetweenMenu": "40px",
				"aroundMenuPadding": "15px"
			}

			"animationSec": "0.4s"

			"mobile": {
				"headerOuterTop": "15px",
				"headerOuterLeft": "15px",
				"headerOuterRight": "15px",
				"headerOuterradius": "15px",
				"headerColor": "var(--theme1)",
				"headerBlur": "5px"
				"headerStrokeDown": true,
				"headerStrokeDownColor": "var(--theme1)",

				"height": "50px",
				"spaceBetweenLink": "20px",
				
				"CenterLogo": false,
				"menuFullScreen": true,
				"menuAnimationFrom": "left",
				"fade": false,

				"linkColor": "var(--theme1)",
				"linkHoverColor": "var(--theme2)",
				"buttonColor": "var(--theme1)"
				"buttonHoverColor": "var(--theme2)",
				"buttonTextColor": "var(--theme3)",

				"menuFrontPadding": "20px"
			}
		},
		
	}
}
```
    
**colorPalette:** where that puts your color plete up to 12!  EG: `#FFFFFF` 
**gFontsURLs:** the fonts you choose from Google Fonts. the first one will be choosed to system fonts. EG: `https://fonts.google.com/share?selection.family=Lilex:ital,wght@0,100..700;1,100..700|Roboto:ital,wght@0,100..900;1,100..900`

for the typography: they work for all things in red!
**fontSize:** EG: `"25px"`
**fontWeight:** EG: `650`
**fontFamily:** EG: `"Roboto"`
**color:** this color of that text. EG: `"var(--theme1)"`
**textAlign:** you already see!
**lineHeight:** advanced!
**letterSpacing:** make sure that you view it well!
**uppercase:** select true if you want......
**WebkitTextStroke:** and reserved this
**maxWidthContent:** the context the max, just a note that null is unlimited!
**mobileSize:** if device below that width 

**button:** setting like the text.
**systemButton:** There are 3 types of buttons: 1 is fill-in,  2 is border, 3 is text only.

for button:
```
		"specialButton": {
			"borderRadius": <you can use var(- spaces)>
			"underline": <true if you want an underline......
			"backgroundColor": <backgroundColor>
			"hoverBackgroundColor": <hover background color>
			"textColor": <text color>
			"hoverTextColor": <hover Text Color>
			"borderColor": <what's your border Color>
			"hoverBorderColor": <what's your border Color if hovered>
		}
```
WE RESERVED THE WAY TOcustomIZE!
and this is another one we will add:
```
	"spacing": {
		"xs": <very small>
		"sm": <small>
		"md": <medium>
		"lg": <large>
		"xl": <very large>
		"radiusSm": <small radius>
		"radius Md": <medium radius>
		"radiusLg": <large>
	},
```
**mode:** reserved.
**Header:** example on top!

## Main.json

This is the heart of that!
First the `version` tag will show up!

```
{
	"version": 1.0

	"siteTitle": <what's your title? EG: Ray Studio>
	"siteHomeTitle": <for home page. EG: Ray Studio: Go Beyond>
	"siteIcon": <icon URL, that I choose>
	"siteLangs": <langs of this website like ["en", "zh-CN"]>

	"HeadMenu": {
		"dataIsHtml":false
		"data": {
			"logo": <logo URL>
			"links": [
				{"link": "/", "name": "home", "sub": []},
				{"link": "/about", "name": "about", "sub": [
					{"link": "/about/team", "name": "Our Team"},
					{"link": "/about/faith", "name": "what's our faith"}
				]},
				{"link": "/", "name": "home", "sub": []},
				{"link": "<what's link>", "name": "home", "sub": <subhere!> }			
			],
			"rightbutton": [
				{"link": "/connect", "name": "Let's Connect", "type":1 }
				{"link": "<route!>", "name": "<what's name you put", "type": <show what's your layout>}
			],
			"social": [
				{"icon": "YouTube", "URL": "youtube.com/@RayStudioSites"}
				{"icon": "<name of a social media>", "URL": "<URL>"}
				{"icon": "<or a image link of assets.>", "URL": "<URL>"}
			]
		}
	}
		
	"event": [
		{"name": <what's the event name? in .rsd!>, "button": {"link": "<link?>", "name": "<what's that name?>"},
		{"name": <what's the event name? in .rsd!>, "button": {},
	],

	"domain": "raystudio.net"
	"websiteTag": "faith, Christian, Believe"

	"ver.htmlNote": "<thing in .rsd>",
	"scrollSpeed": "<speed>"
}
```
just a note!
1, a button can just be a purse to hide it! like the second example.

