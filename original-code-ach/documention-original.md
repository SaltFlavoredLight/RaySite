

<!-- Keep to the JavaScript: whatever you learned and received and heard and saw in me—do it—and the God of peace will walk with you -->
# Ray Studio Sites .rswp 1.0
Here is the file **.rswp** is what it really working

it's just a **.zip**. and the structure inside is like just simple.

## structure
here is a .rswp's inside.

```
/
	main.json
	theme/
		system.json
			
	componets/
		header/
			1.json
			2.json
		footer/
			1.json
		CTA/
			1.json
			2.json
		
		reuesable_sections/
			sectionname.json


	pages/
		_.json
		_about.json
		_service.json
		_work_page1.json
		_work_page2.json
		_work_page3.json
		_blog.json

	assets/
		here_is_assets.jpg
		your_videos.mp4
		upload.pdf
		
	js/
		your_jsscript.js		
```
we will have upcoming data.

## DesignPlete:
the DesignPlete name is Default is "System". 
theme are under `designplete.json`, here is example:
```json
{
	"systems": {
		"breakPoint": "TYPE SIZE",
		"contextMax": "TYPE SIZE",
	}.
	"colors": {
		"primaryColor": "TYPE COLOR",
		"secondaryColor": "TYPE COLOR",
		"accentColor": "TYPE COLOR",
		"secondaryAccentColor": "TYPE COLOR",
		"neutralTextColor": "TYPE COLOR",
		"neutralBackgroundColor": "TYPE COLOR",
		"costomColor1": "TYPE COLOR",
		"costomColor2": "TYPE COLOR",
		"costomColor3": "TYPE COLOR",
		"costomColor4": "TYPE COLOR"
	},
	"fonts": [
		{"type": "system", "name": "TYPE FONTS NAME"},
		{"type": "googleFonts", "name": "TYPE FONTS NAME"},
		{"type": "googleFonts", "name": "TYPE FONTS NAME"}
	],
	"typography": {
		"normal": {
			"font": ["TYPE FONT NAME"],
			"size": NUMBER,
			"letterSpacing": NUMBER,
			"boldness": NUMBER,
			"color": "TYPE COLOR, HEX OR 'system1'",
			"allCaps": TRUE/FALSE,
			"align": "NULL for LEFT OR 'center' OR 'right'",
			"costomStyle": "TYPE CSS"
		},
		"normal2": {
			"font": ["TYPE FONT NAME"],
			"size": NUMBER,
			"letterSpacing": NUMBER,
			"boldness": NUMBER,
			"color": "TYPE COLOR, HEX OR 'system1'",
			"allCaps": TRUE/FALSE,
			"align": "NULL for LEFT OR 'center' OR 'right'",
			"costomStyle": "TYPE CSS"
		},
		"h1": {
			"font": ["TYPE FONT NAME"],
			"size": NUMBER,
			"letterSpacing": NUMBER,
			"boldness": NUMBER,
			"color": "TYPE COLOR, HEX OR 'system1'",
			"allCaps": TRUE/FALSE,
			"align": "NULL for LEFT OR 'center' OR 'right'",
			"costomStyle": "TYPE CSS"
		},
		"h2": {
			"font": ["TYPE FONT NAME"],
			"size": NUMBER,
			"letterSpacing": NUMBER,
			"boldness": NUMBER,
			"color": "TYPE COLOR, HEX OR 'system1'",
			"allCaps": TRUE/FALSE,
			"align": "NULL for LEFT OR 'center' OR 'right'",
			"costomStyle": "TYPE CSS"
		},
		"h3": {
			"font": ["TYPE FONT NAME"],
			"size": NUMBER,
			"letterSpacing": NUMBER,
			"boldness": NUMBER,
			"color": "TYPE COLOR, HEX OR 'system1'",
			"allCaps": TRUE/FALSE,
			"align": "NULL for LEFT OR 'center' OR 'right'",
			"costomStyle": "TYPE CSS"
		},
		"h4": {
			"font": ["TYPE FONT NAME"],
			"size": NUMBER,
			"letterSpacing": NUMBER,
			"boldness": NUMBER,
			"color": "TYPE COLOR, HEX OR 'system1'",
			"allCaps": TRUE/FALSE,
			"align": "NULL for LEFT OR 'center' OR 'right'",
			"costomStyle": "TYPE CSS"
		},
		"small": {
			"font": ["TYPE FONT NAME"],
			"size": NUMBER,
			"letterSpacing": NUMBER,
			"boldness": NUMBER,
			"color": "TYPE COLOR, HEX OR 'system1'",
			"allCaps": TRUE/FALSE,
			"align": "NULL for LEFT OR 'center' OR 'right'",
			"costomStyle": "TYPE CSS"
		}
	},
	"spacing": {
		"section": NUMBER,
		"blockgap": NUNMBER,
		"tiny": NUMBER,
		"small": NUMBER,
		"mSmall": NUMBER,
		"medium": NUMBER,
		"large": NUMBER,
		"extraLarge": NUMBER,
		"bradiusLarge": NUMBER,
		"bradiusMedium": NUMBER,
		"bradiusSmall": NUMBER,
	},
	"animation": {
		"timing": NUMBER,
		"delayTime": NUMBER,
		"animationCurve": ANIMATION CURVE
		"animation": ANIMATION,
	},
	"transition": {
		"timing": NUMBER,
		"delay": NUMBER,
		"animationCurve": ANIMATION CURVE,
	},
	"costomVaibles": {
		"varibles": "TYPE CSS",
		"varibles": "TYPE CSS",
		"varibles": "TYPE CSS",
		......
	}
}
```
here is explanation:

### System:
system show what looks like.
**breakPoint:** that is show where to change to moblie.
**contextMax:** the max context of it.

### Colors:
we using 10 color system, Primary pair, Accent pair, Natural pair and 4 more slots.
**primaryColor:** the primary color you choose.
**secondaryColor:** the secondary color you choose which is similar to primary color.
**accentColor:** the second color you choose.
**secondaryAccentColor:** the secondary color you choose which is similar to second color.
**neutralTextColor:** the neutral text color, mostly #212121 or #000000, or the color you can choose.
**neutralBackgroundColor:** the neutral text color, mostly #F4F4F4 or #FFFFFF, or the color you can choose.
**costomColor1 - costomColor4:** the 4 more color you can choose, or leave to not use it.
those 10 color can use anywhere.

### Fonts:
the Font families you can loading from 1 of the 1926 fonts across the database of [Google Fonts](https://fonts.google.com/). yes! that's is our database.
it's a list and you can choose multiple, for this theme.

### Typography:
there have 2 Normal text (second one is for sign text), H1, H2, H3, H4, Small text.
all have.
**font:** a list that can Fallback to other fonts if not available
**size:** size of the text.
**letterSpacing:** 1px is default.
**boldness:** 100-900
**color:** pick a color!
**allCaps:** True for cap all!
**align:** left(null), center or right
**costomStyle:** insert your CSS for costom
set NULL for default! 

### spacing:
that is context space.
that's how we do.

### Animation:
**timing:** the defalut time.
**delayTime:** select the time how many want to delay.
**animationCurve:** the curve of the animation. describe how it arrived.
**animation:** select animation.

### costomVaibles:
those for if you need costom CSS?

## for every webpage:
we are using Block system, called Flex Engine.
```json
{
	"title": "TYPE TEXT",
	
	"description": "TYPE TEXT",
	"coverIMG": MEDIA,
	"importence": "TYPE RANGE 0-1",
	"doNotIndex": TRUE/FALSE,

	"type": "webpage",

	“theme”: STRING

	"header": {
		"enable": TRUE/FALSE
		"index": "TYPE NAME",
		"retainHeader": TRUE/FALSE,
		"transparentBGwhenOnTop": NUMBER 0-1.,
	},

	"content": [
		{sections.....},
		{sections.....},
		{sections.....},
		......
	],

	"CTA": {
		"enable": TRUE/FALSE
		"index": "TYPE NAME",
	},

	"footer": {
		"enable": TRUE/FALSE
		"index": "TYPE NAME",
	},

	"popups": [
		{popups.....},
		{popups.....},
		{popups.....},
		......
	].

	"float": [
		{float buttons....},
		{float buttons....},
		{float buttons....},
		......
	]

	"JSscript": [
		{JS script},
		{JS script},
		{JS script},
		......
	]
}
```
### Basic infomation
**title:** the Title of this webpage.
**description:** website Keywords
**Cover IMG:** that Cover of this webapge.
**importence:** from 0 to 1, bigger then more important.
**doNotIndex:** if it's True, the Google will not search this webpage.

### Header / CTA / Footer:
**enable:** toggle false if you want no header show up.
**index:** the name of that header / CTA / Footer.
**retainHeader:** that mean I will ignore that space taken. (only for header)
**transparentcy:** make the background transparent ONLY at top. (only for header)
**override:** ADV. you can override one of the parameter. 

### content / popups / Float:
that include all sections.
see more for sections.
you can make Popups also at there
just website context

### JS script:
this infomation make your website can be programmable.

see how elements work before I tell you what's those,

---

## Elements
here are all elements that go though.

### 🟦 Section

```json
{
	"id": an 8 digit NUMBER.
	"type": "section",
	
	"content": {
		{things}...
	},
	
	"layout": {
		"spaceAcross": NUMBER 1 to 4,
		"spaceAlong": NUMBER 1 to 3,
		"overflow": NUMBER 1 to 3,
		"gap": SPACE,
		"mobileReverseDirection": TRUE/FALSE,
		"mobileGap": SPACE
	},
	"style": {
		"paddingTop": SPACE,
		"paddingBottom": SPACE,
		"paddingLeft": SPACE,
		"PaddingRight": SPACE,

		"mobilePaddingTop": SPACE,
		"mobilePaddingBottom": SPACE,
		"mobilePaddingLeft": SPACE,
		"mobilePaddingRight": SPACE,

		"textColor": COLOR,
		"markColor": COLOR,
		"background": BACKGROUND,
		"blur": NUMBER,
		"font": STRING,
	},
	"size": {
		"height": SPACE,
		"allowGrow": true/false,
		"allowShrink": true/false,
		"mobileMinHeight": SPACE 
	},
	"animation": {
		"all": {
			"animation": True / False
			"animationType": ANIMATION,
			"triggler": 1-2,
			"delayTime": TIME,
			"executionInterval": TIME,
			"duration": TIME,
			"animationCurve": ANIMATION CURVE.		
		}
		"self": {
			"animation": True / False
			"animationInherit": True / False		
			"animationType": ANIMATION,
			"triggler": 1-2,
			"delayTime": TIME,
			"duration": TIME,
			"animationCurve": ANIMATION CURVE.
		}
	},

	"CSSoverride": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"transition": [],
	"JSID": STRING
}
```
as a section, that this only can exist at Top level, and becuase that is very spaical, that you need to try.

**id:** used for position the element. used in CSS.
**type:** enter "section"

#### Context
the content that you put, which is multiple element other than Section.

#### layout
**spaceAcross:** 1 is on start, 2 means on center, 3 means on end, 4 is Stretch it out
**spaceAlong:** when you have more than enough spaces, 1 is on start, 2 means on center, 3 means on end
**overflow:** 1 is scroll, 2 is hidden it, 3 is just do not take any action 
**gap / Moblie gap:** those 2 are Gaps between objects.
**mobileReverseDirection:** if you are using Mobile, True means let those are reverse.

#### Style
**paddingTop, paddingBottom, paddingleft, PaddingRight:** the padding inside, I already set Border box.
**mobilePaddingTop, mobilePaddingBottom, mobilePaddingLeft, mobilePaddingRIght:** change for mobile.

**TextColor:** you can know how this work - the text color.
**markColor:** the Mark for heading, and Hr and some mark color.
**background:** the setting of background - allow anything.
**blur:** set a number of how hard you want to blur, to make glass effect, please also set background to one of the transparent.
**font:** the way to set string.

#### Clickable, CSSoverride, JSID, Override State and Transition
see the 'All element must have'.
on the Style the 

#### Animation.All
**animation:** if you have a animation, select to enable it.
**animationType:** you can choose an animation object, scroll down for more information.
**triggler:** if have a animation, 1 is when on load, 2 is when this section scrolled.
**delayTime:** that time delayed after the trigger toggled.
**executionInterval:** the time all element running on the time. the selection is based on how the element set. not continer
**animationCurve:** select an animation curve.

#### Animation.Self
**animation:** if you have a animation, select to enable it.
**animationInherit:** inherit all from section. when True, ignore all others below
**animationType:** you can choose an animation object, scroll down for more information.
**triggler:** if have a animation, 1 is when on load, 2 is when this section scrolled.
**delayTime:** that time delayed after the trigger toggled.
**animationCurve:** select an animation curve.

#### size

**height:** the height of this section.
**allowGrow:** true mean can grow
**allowShrink:** true mean can shrink. (it is not allowed by defalut.)
**mobileMinHeight:** the Minimum height of the system, that if in mobile mode

### 🟦 Reusable Section

this type of section put the section to the single .json file to make it work.

```json
{
	"type": "reusableSection",
	"name": STRING,
```

**name:** the name of that useable.

### 🟧 Div (Container)
```json
{
	"id": an 9 digit NUMBER.
	"type": "div",
	
	"content": {
		{things}...
	},
	
	"layout": {
		"direction": NUMBER 1 to 4,
		"wrap": NUMBER 1 to 3,
		"spaceAlong": NUMBER 1 to 6,
		"spaceAcross": NUMBER 1 to 5,
		"spaceAcrossMutiple": NUMBER 1 to 6,
		"gapX": SPACE,
		"gapY": SPACE,
		"stackAtMobile": TRUE/FALSE,
		"mobileReverseDirection": TRUE/FALSE,
		"mobileGap": SPACE
	},
	
	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"transition": [],
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "div"

#### Context
the content that you put, which is multiple element other than Section.

#### layout

**direction:** 1 is from left to right, 2 is up to down, 3 is right to left, 4 is down to up.
**wrap:** 1 mean no wrap, 2 mean have a wrap to right or down (warp), 3 means have a wrap to left or top.(warp-reverse)
**spaceAlong:** for same direction to the "direction" (1 and 3 mean this is X setting, 2 and 4 mean this is Y setting), 1 is on start, 2 means on center, 3 means on end, 4 is space-around, 5 is space-between, and 6 is space-evenly.
**spaceAcross:** for another direction to the "direction" (1 and 3 mean this is Y setting, 2 and 4 mean this is X setting), 1 is on start, 2 means on center, 3 means on end, 4 is Stretch it out, 5 is baseline.
**spaceAcrossMutiple:** reserved.

**gapX / gapY / mobileGap:** those 3 are Gaps between objects.

**stackAtMobile:** True that will stack, or otherwise nothing, countinue what he's edit.
**mobileReverseDirection:** if you are using Mobile, True means let those are reverse.

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟩 Text (`p`)

```json
{
	"id": an 9 digit NUMBER.
	"type": "text",
	
	"content": QUILL DOCUMENT
	
	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"transition": [],
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "text"

#### content:
use QUILL DOCUMENT format, scroll to buttom please.

#### Style, size, animation, CSSoverride, JSID,overrideState, transition
see the 'All element must have'.

---

### 🟩 Heading (`h`)

basicly same to **Text (`t`)** but the preset is a heading.

**type:** enter "heading"

---

### 🟩 Image (`img`)

```json
{
	"id": an 9 digit NUMBER.
	"type": "image",
	
	"content": {
		"source": MEDIA/IMG,
		"alt": STRING,
		"displayX": 1-3,
		"displayY": 1-3
	}
	
	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "text"

#### content:

**Source:** as a Media that import the source.
**alt:** Specifies an alternate text for an image

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟩 Button

```json
{
	"id": an 9 digit NUMBER.
	"type": "button",
	
	"content": {
		"label": STRING
	}
	
	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "button"

#### content:

**Label:** that label which will displayed at the Image.

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟩 Horizontal Line (`hr`)

```json
{
	"id": an 9 digit NUMBER.
	"type": "hr",
	
	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "hr"

the Color use mark color, just a note that why it not have setting.

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟩 Spacer (`space`)

```json
{
	"id": an 9 digit NUMBER.
	"type": "space",
	
	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "space"

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟩 Table (SKIP)

Currently not supported, in future we will use a Table Editor for this function.


---

### 🟪 audio

```json
{
	"id": an 9 digit NUMBER.
	"type": "audio",

	"content": {
    	"source": MEDIA,
        "hideControls": true/false,
        "loop": true/false,        
	}

	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter the 'audio'

#### content:
**source:** the source of the audio, you can enable mutiple format.
**hideControls:** JS advance user, you can let them hide it.
**loop:** if select True, it will loop once it start playing.

> NOTE: since browser restrictions, there have no autoplay method.
> NOTE: you also can use JSID to control the audio.

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

---

### 🟪 Source Video

```json
{
	"id": an 9 digit NUMBER.
	"type": "video",

	"content": {
    	"source": {MEDIA},
        "hideControls": true/false,
        "autoplay": true/false,
        "muted": true/false,
        "loop": true/false,
        "thumbnail": MEDIA,
        "disablepictureinpicture": true/false,
	}

	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "video".

#### content:
**source:** the source of this Video
**hideControls:** for advance users you can use to hide controls
**autoplay:** you can let this atuoplay the video.
**muted:** let this video muted by defalut.
> NOTE: because the browser limit, if you toggled autoplay, it also will atuomatclly mute the video unless toggled by user.

**loop:** let this video loop it.
**thumbnail:** show a cover when loading.
**disablepictureinpicture:** Picture in Picture sometimes annoying, by selet True, you can prevent this.

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟪 Vimeo Video

```json
{
	"id": an 9 digit NUMBER.
	"type": "vemioVideo",

	"content": {
    	"sourceID": NUMBER,
    	"hash": NUMBER,
      "hideControls": true/false,
      "autoplay": true/false,
      "muted": true/false,
      "loop": true/false,
      "disablepictureinpicture": true/false,
      "startTime": NUMBER,
	}

	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "video".

#### content:
**sourceID:** the source of this Video
**hash:** the hash of this Video if it's unlisted.
> NOTE: in Bulider those are getted by share link.

**hideControls:** for advance users you can use to hide controls
**autoplay:** you can let this atuoplay the video.
**muted:** let this video muted by defalut.
> NOTE: because the browser limit, if you toggled autoplay, it also will atuomatclly mute the video unless toggled by user.

**loop:** let this video loop it.
**disablepictureinpicture:** Picture in Picture sometimes annoying, by selet True, you can prevent this.
**startTime:** the start time of this video.

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

>NOTE: be default those are enabled:
> fullscreen
> picture-in-picture
> autoplay

---


### 🟪 YouTube Video

```json
{
	"id": an 9 digit NUMBER.
	"type": "YTVideo",

	"content": {
    	"videoID": NUMBER,
      "hideControls": true/false,
      "autoplay": true/false,
      "muted": true/false,
      "loop": true/false,
      "disablepictureinpicture": true/false,
      "startTime": NUMBER,
	}

	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "video".

#### content:
**videoID:** the source of this Video
> NOTE: in Bulider those are getted by share link.

**hideControls:** for advance users you can use to hide controls
**autoplay:** you can let this atuoplay the video.
**muted:** let this video muted by defalut.
> NOTE: because the browser limit, if you toggled autoplay, it also will atuomatclly mute the video unless toggled by user.

**loop:** let this video loop it.
**disablepictureinpicture:** Picture in Picture sometimes annoying, by selet True, you can prevent this.
**startTime:** the start time of this video.

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

> NOTE: be defalut those are already enabled: 
> autoplay
> encrypted-media
> picture-in-picture
> fullscreen
> clipboard-write
> accelerometer
> gyroscope
> web-share

---

### 🟪 iframe

```json
{
	"id": an 9 digit NUMBER.
	"type": "iframe",

	"content": {
    	"source": STRING,
        "embedAsHTML": true/false,
        "sandbox": 0-2.
        "allowFullScreen": true/false,
        "permission": []
	}

	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "iframe"

#### content:
**source:** that URL gonna display.
**embedAsHTML:** switch `src` to `srcdoc`, basicly is switch it.
**sandbox:** 0 is no sandbox, 1 is have sandbox but can have script, 2 is completely sandbox it.
**allowFullScreen:** on by defalut.
**permission:** a List show what is allowed, here is full list:

Media & Playback
- autoplay
- encrypted-media
- picture-in-picture
- fullscreen
- camera
- microphone
- speaker-selection

Input & Interaction
- clipboard-read
- clipboard-write
- display-capture
- gamepad
- geolocation
- hid
- idle-detection
- keyboard-map
- magnetometer
- midi
- payment
- screen-wake-lock
- serial
- usb
- xr-spatial-tracking

Storage & System
- storage-access
- web-share
- sync-xhr   (deprecated)

Experimental / Less common
- accelerometer
- gyroscope
- ambient-light-sensor
- vr   (legacy WebVR, deprecated)


#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟪 Google Docs Public API

```json
{
	"id": an 9 digit NUMBER.
	"type": "gdocs",

	"content": {
    	"gDocsID": STRING        
	}

	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "gdocs"

#### content:
**gDocsID** that doc you published to the web, just that

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟪 YTlive

```json
{
	"id": an 9 digit NUMBER.
	"type": "YTlive",

	"content": {
    	"channelID": STRING
	}

	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "YTlive"

#### content:
**channelID:** the public channel ID, check your YT studio.

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'.

---

### 🟨 Form (SKIP)
Currently not supported, in future we will use a Form Editor for this function.

---

### 🟫 HTML (Advanced)


```json
{
	"id": an 9 digit NUMBER.
	"type": "html",

	"content": {
    	"html": STRING,
	}

	"style": {......},
	"size": {......},
	"animation": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	"clickable": {......},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "html"

#### content:
**html:** enter your HTML, note that not the Body context, otherwise see iframe

#### Style, size, animation, CSSoverride, JSID, overrideState, transition
see the 'All element must have'

---

### All element must have:
```json
{
	"id": an 9 digit NUMBER.
	"type": STRING,
	
	{something in middle}
	
	"style": {
		"paddingTop": SPACE,
		"paddingBottom": SPACE,
		"paddingLeft": SPACE,
		"PaddingRight": SPACE,

		"mobilePaddingTop": SPACE,
		"mobilePaddingBottom": SPACE,
		"mobilePaddingLeft": SPACE,
		"mobilePaddingRight": SPACE,

		"borderThink": SPACE,
		"borderMode": STRING,

		"borderTop": BORDER,
		"borderBottom": BORDER,
		"borderLeft": BORDER,
		"borderRight": BORDER,	
		"borderRadiuns": NUMBER,
		
		"shadow": TRUE/FALSE,
		"shadowOffsetX": NUMBER,
		"shadowOffsetY": NUMBER,
		"shadowExpend": NUMBER,
		"ShadowColor": COLOR,
		"shadowBlur": NUMBER,
		"shadowInset": TRUE/FALSE

		"textColor": COLOR,
		"markColor": COLOR,
		"background": BACKGROUND,
		"blur": NUMBER,
		"font": STRING,
	},
	"size": {
		"along": SPACE,
		"overflowAlong": 1-3,
		"alongGrow": NUMBER,
		"alongShrink": 0-1,

		"across": SPACE,
		"overflowAcross": 1-3,
		"acrossAlign": 0-5,

		"mobileMinHeight": SPACE 
	},
	"animation": {
		"animation": True / False
		"animationInherit": True / False		
		"animationType": ANIMATION,
		"triggler": 1-3,
		"delayTime": TIME,
		"animationCurve": ANIMATION CURVE.
	},
  "hover": {......},
	"overrideState": 
		CLASS NAME: {......}
	},
	"transition": [],
	"CSSoverride": {
		{"key": STRING, "value": STRING}
		......
	},
	"clickable": {
		"enable": true/false,
		"action": ACTION
	},
	"JSID": STRING
}
```

**id:** used for position the element. used in CSS.
**type:** enter "section"

#### Style

**paddingTop, paddingBottom, paddingleft, PaddingRight:** the padding inside, I already set Border box.

**mobilePaddingTop, mobilePaddingBottom, mobilePaddingLeft, mobilePaddingRIght:** change for mobile.

**borderTop, borderBottom, borderleft, borderRight:** the padding inside, I already set Border box.

**shadow:** enable shadow.
**shadowOffsetX:** the offset of the X setting.
**shadowOffsetY:** the offset of the Y setting.
**shadowExpend:** the expend setting.
**ShadowColor:** the color of that Shadow.
**shadowBlur:** to blur the shadow.
**shadowInset:** True to make it as a inset.

**TextColor:** you can know how this work - the text color.
**markColor:** the Mark for heading, and Hr and some mark color.
**background:** the setting of background - allow anything.
**blur:** set a number of how hard you want to blur, to make glass effect, please also set background to one of the transparent.
**font:** the way to set string.

#### size

**along:** the space in original setting for the direction same to display layout of parent.
**overflowAlong:** for the space of Along if overflow, 1 is Grow to fit, 2 is Cut part, 3 is make a scroll bar.
**alongGrow:** 0 mean no grow, a number mean how much space it taken.
**alongShrink:** false means no shrink, true means shrink

**across:** the space in original setting  for the direction different to display layout of parent.
**overflowAcross:** for the space of Across if overflow, 1 is Grow to fit, 2 is Cut part, 3 is make a scroll bar.
**acrossAlign:** 1 is on start, 2 means on center, 3 means on end, 4 is Stretch it out, 5 is baseline. NOTE THIS IS AN OVERRIDE SETTING, DEFALUT IS 0

**mobileMinHeight:** the Minimum height of the system, that if in mobile mode.

#### animation
you can set an animation.

**animation:** if you have a animation, select to enable it.
**animationInherit:** inherit all from section. when True, ignore all others below
**animationType:** you can choose an animation object, scroll down for more information.
**triggler:** if have a animation, 1 is when on load, 2 is when this section scrolled, 3 is when scroll to it's self. it default is 2.
**delayTime:** that time delayed after the trigger toggled.
**animationCurve:** select an animation curve.

#### overrideStates
 override is when user hover at a element or you add the class, that they can change the state.
inside is same to like the style structure inside, where that if set to `null` of find nothing, the system assume it's inherit, otherwise, it will apply for hover.

> Note: in the editor, all defalut is like nothing. you MUST deselect element, and remember, by set the hover as same value to the standard DOES NOT WORK SAME AS turn off setting.

it is always: 
```json
{"{classname}": SAME THING TO THE Style, CSS override and maybe the outside setting.}
``` 

#### Transition:
this property can let you set the timing setting.  add a transition object that like this:
```json
{
	"property": NAME
	"animationCurve": ANIMATION CURVE
	"timing": NUMBER,
	"delay": NUMBER
}
```
remember, `timing` and `delay` set -1 means follow default.

#### CSSoverride
the Key and Value will add to CSS part of this: `key: value`.

#### Clickable
**enable:** if yes, enable the click event.
**action:** how it action? see bottom

#### JSID
make an Anchor ID.

so that's all!

## Units:
there have spacial type (the type is like NUMBER, STRINGS) called Color, Space those 2 thing, they are too strange that you can see many variables.

### Color
a Color can be represent in those:

**have already a hex:**
```json
{
	"mode": "hex",
	"hex": STRING,
}
```
where the Hex is a way to display the color.

(if can) Use a IMG:
```json
{
	"mode": "backgroundIMG",
	"src": STRING,
	"repeatX": TRUE/FALSE,
	"repeatY": TRUE/FALSE,
	"positionX": 1-3,
	"positionY": 1-3,
	"attachment": TRUE/FALSE
	"coloroverlay": HEX
}
```
that src is mean that link of IMG
**positionX** and **positionY** are 1 is left or top, 2 is middle, 3 is right or down.
**coloroverlay** be default is fully transparent.

**use a varibles:**
```json
{
	"mode": "varibles",
	"varibles": STRING,
}
```
in that string that are same as `var(--{string})`.

**inherit:**
```json
{
	"mode": "inerit",
}
```

**None (transparent):**
```json
{
	"mode": "none",
}
```

**Grident:**
```json
{
  "mode": "linearGradient",
  "angle": "45deg",
  "stops": [
    {"color": "#ff5733", "offset": "0%"},
    {"color": "#33ccff", "offset": "100%"}
  ]
}
```

### Space.

**you can set auto:**
```json
{
	"mode": "auto",
}
```

**as a units:**
```json
{
	"mode": "px (recommend, default) | rem | em | % | vw | vh | vmin | vmax | ch"
	"value": NUMBER
}
```

**use a varibles:**
```json
{
	"mode": "varibles",
	"varibles": STRING,
}
```
in that string that are same as `var(--{string})`.

### Animation
you can set animation as one of the 14 types.

gernarel format is:
```json
{
	"mode": "animation",
	"animationNumber": 1-14,
	......(then variables, EG:)......
	"intensity": 60
}
```
Here is a table showing the list:

| number | name | variables name | accape input | note |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Fade |  |  |  |
| 2 | Fly In | direction | 0-360 | as DEG. |
|  |  | intensity | NUMBER | as px shift how many. |
| 3 | Grow & Turn   | rotate | NUMBER (include negative) | as DEG for direction |
| 4 | Zoom |  |  |  |
| 5  | Basic Zoom | scale‑start   | NUMBER | 100 will be same to fade in (which start from 1), mostly you can over 100 |
| 6 | Rise  | direction  | 1-8 | 1 is top, then 45DEG rotate to right |
|  |  | intensity  | NUMBER | as px shift how many. |
| 7 | Stretch  | durection | 1-4 | 1 is top, 2 is right, 3 is down, 4 is left |
| 8 | Wipe  | durection | 1-4 | 1 is top, 2 is right, 3 is down, 4 is left |
| 9 | Peek In | durection | 1-4 | 1 is top, 2 is right, 3 is down, 4 is left |
|  |  | intensity  | NUMBER | as px shift how many. |
| 10 | Box  | X | 1-3 | 1 is left, 2 is center, 3 is  |
|  |  | Y | 1-3 | 1 is top, 2 is center, 3 is bottom |
| 11 | Expand  |  |  |  |
| 12 | Tumble  | directionRight | 1-0 | for section, can set auto |
|  |  | FromUp | True / False |  |
|  |  | intensity | NUMBER | as DEG show how many rotate |
| 13 | Rotate  | directionRight | 1-0 | for section, can set auto |
|  |  | intensity | NUMBER | as DEG show how many rotate |
| 14 | Slide Rotate | intensity | NUMBER | as DEG show how many rotate |
|  |  | slideAmontY | NUMBER |  |
|  |  | slideAmontX | NUMBER |  |

**use a varibles:**
```json
{
	"mode": "varibles",
	"varibles": STRING,
}
```
in that string that are same as `var(--{string})`.

### Animation Curve:
it is a set of property of how you set.
**Modes option:**
```json
	"mode": "system | linear | ease | ease-in | ease-out | ease-in-out",
```
NOTE: system is mean the default in design plete.

**(programmable) cubic-bezier:**
```json
{
	"mode": "cubic-bezier",
	"x1": NUMBER
	"x2": NUMBER
	"y1": NUMBER
	"y2": NUMBER
}
```
you can view this animation at [https://cubic-bezier.com/](https://cubic-bezier.com/)
editor use [https://github.com/Ju99ernaut/cubic-bezier](https://github.com/Ju99ernaut/cubic-bezier).

### QUILL DOCUMENT
which is the offical format of rich textbox, it use JSON basicly, and it named delta.
see [Quill.js for more infomation](https://quilljs.com/docs/delta)

### MEDIA***
there have system Media, or by other IMG.
here is 2 type:

**From Internal source:**
```json
{
	"mode": "internal",
	"folder": STRING,
	"name": STRING
}
```
**folder** means assets folder, that now include few type as image, video, PDF, uploads, JS those 4 folder.
**name:** is path name.

**From external source:**
```json
{
	"mode": "external",
	"url": STRING
}
```

### action:
action can let you do mutiple things together.

**new link:**
```json
{
	"mode": "a",
	"url": STRING,
	"newPage": true/false,
}
```

**download:**
```json
{
	"mode": "download",
	"source": SOURCE,
	"forceDownload": true/false,
}
```

**Open Popup:**
```json
{
	"mode": "openPopup",
	"popupID": STRING or 8 digit number,
}
```
**popupID:** that anchor link or 8 digit ID of that popup.

**close this Popup:**
```json
{
	"mode": "closeThisPopup",
}
```
NOTE: this button must inside a popup.

**Run a JS:**
```json
{
	"mode": "runJS",
	"JS": STRING,
}
```
that JS will run as `<a oncilck="{JS}">`.


## How those strutureal element in page work.

### content:
inside those, they are all sections.
see Elements > 🟦 Section

### CTA / Footer:
as a spaical type of section, but they store directly to the page. for how they struture, see Elements > 🟦 Section

### popups: 
```json
{
	"id": an 8 digit NUMBER.
	"type": "popup",
		"context": {elements}

		"style": {
			"paddingTop": SPACE,
			"paddingBottom": SPACE,
			"paddingLeft": SPACE,
			"PaddingRight": SPACE,

			"mobilePaddingTop": SPACE,
			"mobilePaddingBottom": SPACE,
			"mobilePaddingLeft": SPACE,
			"mobilePaddingRight": SPACE,

			"borderThink": SPACE,
			"borderMode": STRING,

			"borderTop": BORDER,
			"borderBottom": BORDER,
			"borderLeft": BORDER,
			"borderRight": BORDER,	
			"borderRadiuns": NUMBER,
			
			"shadow": TRUE/FALSE,
			"shadowOffsetX": NUMBER,
			"shadowOffsetY": NUMBER,
			"shadowExpend": NUMBER,
			"ShadowColor": COLOR,
			"shadowBlur": NUMBER,
			"shadowInset": TRUE/FALSE

			"textColor": COLOR,
			"markColor": COLOR,
			"background": BACKGROUND,
			"blur": NUMBER,
			"font": STRING,
		},
		"size": {
			NO THAT!
		},
		"animation": {
			(same to section)
		},

	"CSSoverride": {......},
	"overrideState": {
		":hover": {......},
		CLASS NAME: {......}
	},
	"transition": [],
	"JSID": STRING

		"size": {
			"positionX": 1-3,
			"positionY": 1-3,

			"minWidth": SPACE,
			"minHeight": SPACE,

			"maxWidth": SPACE,
			"maxHeight": SPACE,

			"mobilePositionY": 1-3,
			"mobileMinHeight": SPACE,
			"mobileMaxHeight": SPACE,	
		},


		"outerstyle": {
			"marginTop": SPACE,
			"marginBottom": SPACE,
			"marginLeft": SPACE,
			"marginRight": SPACE,

			"mobileMarginTop": SPACE,
			"mobileMarginBottom": SPACE,
			"mobileMarginLeft": SPACE,
			"mobileMarginRight": SPACE,

			"background": COLOR,
			"blur": NUMBER,
		},
		
		"outeranimation": {
			"animation": True / False
			"animationInherit": True / False		
			"animationType": ANIMATION,
			"triggler": 1-2,
			"delayTime": TIME,
			"animationCurve": ANIMATION CURVE.
		},
	
		"cilckToClose": true/false,
		"JSID": STRING

}
```
adjust: 1 is fixed, use scroll
2, is allow shink, and if large use scroll
3, is allow expend
4, is allow anything (just nothing!)

### Float element.

```json
{
	"type": "float",
	"context": ELEMENT,
	
	"stikeyTop": SPACE,
	"stikeyRight": SPACE,
	"stikeyLeft": SPACE,
	"stikeyBottom": SPACE,

	"mobileStikeyTop": SPACE,
	"mobileStikeyRight": SPACE,
	"mobileStikeyLeft": SPACE,
	"mobileStikeyBottom": SPACE,
}
```
or
use a Reusable Section

**context:** the context, can be anything other than section.
**stikeyTop:** atuo for nothing, otherwise stikey to somepart.
**stikeyRight:** atuo for nothing, otherwise stikey to somepart.
**stikeyLeft:** atuo for nothing, otherwise stikey to somepart.
**stikeyBottom:** atuo for nothing, otherwise stikey to somepart.


### JS script:

the JS script insert use RAW JS!

first here is a JS area layout:
```json
{
	"normal": {}
	"beforeDOM": {}
	"head": {}
}
```
all script should be in afterDOM area unless it should running before DOM load.


and every JS script is like this
```json
{
	"source": 0-1,
	"script": STRING or MEDIA,

	"defer": true/false,
	"integrity": STRING,
	"atuoIntegrity": true/false,
	"ESM": true/false
}
```
**Source:** 1 mean external, 0 mean incline.
**script:** when it's 0 in Source: it is a string that hold JS script
when it's 1 in source: it's a MEDIA that load string.
**defer:** open the defer.
**integrity:** 
a SHA-256 string mean enter this as SHA-256.
"auto" mean generate auto based on the resource
"none" mean do not enable the SHA-256 (not recommend).

### Header
the one complex, you will get what it looks like, remember, all element can have 4 states, that's why Quick Layout can help you. (Got it?)



## Header
The header is a important part of the system, that can control everything, there have Standard, 2Row, 2Row with Collapse and Menu those 4 layout. Brief explain:

header design inspired by Sqaurespace and some [header design](https://dribbble.com/shots/22935140-Header-Section).

**Standard:** just 1 row, that you make labels, and labels link the layout system.
**2Row:** Display 2 rows in same time, that all 2 rows will display together. (Designing!)
**2Row w/ Collapse:** Display 2 rows in same time, but the top row will automatically hidden. (Designing!)
**Menu:** same to Standard, but replace to a menu button. (designing!)

### Standard:
when you use Standard, you can create any labels and do the action, kinda funny right? but remember, every element can have 4 step!

```json
{
	"id": an 8 digit NUMBER.
	"type": "header",

	"mode": "standard"

	"context": {
		"left": {......},
		"middle": {......},
		"right": {......},
	},

	"layout": {
		"gap": SPACE,
		"mobileGap": SPACE, 
	}

		"style": {
			"paddingTop": SPACE,
			"paddingBottom": SPACE,
			"paddingLeft": SPACE,
			"PaddingRight": SPACE,

			"mobilePaddingTop": SPACE,
			"mobilePaddingBottom": SPACE,
			"mobilePaddingLeft": SPACE,
			"mobilePaddingRight": SPACE,

			"borderThink": SPACE,
			"borderMode": STRING,

			"borderTop": BORDER,
			"borderBottom": BORDER,
			"borderLeft": BORDER,
			"borderRight": BORDER,	
			"borderRadiuns": NUMBER,
			
			"shadow": TRUE/FALSE,
			"shadowOffsetX": NUMBER,
			"shadowOffsetY": NUMBER,
			"shadowExpend": NUMBER,
			"ShadowColor": COLOR,
			"shadowBlur": NUMBER,
			"shadowInset": TRUE/FALSE

			"textColor": COLOR,
			"markColor": COLOR,
			"background": BACKGROUND,
			"blur": NUMBER,
			"font": STRING,
		},
		
	"size": {		
		"maxInnerWidth": SPACE,

    "height": SPACE,
    "mobileHeight": SPACE,
    
    "maxWidth": SPACE,

    "marginTop": SPACE,
    "marginLeft": SPACE,
    "marginRIght": SPACE

    "mobileMarginTop": SPACE,
    "mobileMarginLeft": SPACE,
    "mobileMarginRIght": SPACE
	},

	"Transparent": true/false,
	
	"animation": {
		"all": {
			"animation": True / False
			"animationType": ANIMATION,
			"triggler": 1-2,
			"delayTime": TIME,
			"executionInterval": TIME,
			"duration": TIME,
			"animationCurve": ANIMATION CURVE.		
		}
		"self": {
			"animation": True / False
			"animationInherit": True / False		
			"animationType": ANIMATION,
			"triggler": 1-2,
			"delayTime": TIME,
			"duration": TIME,
			"animationCurve": ANIMATION CURVE.
		}
	},

	":hover": {......},
	"onTop": {......},
	"CSSoverride": {......},
	"overrideState": {
		CLASS NAME: {......}
	},
	"transition": [],
	"JSID": STRING

	"moblieSetting": {
		"logo": 1-3,
		"menu": 1-3,
		"others": 1-3,
		
		"openAnimation": {
			"animation": True / False
			"animationInherit": True / False		
			"animationType": ANIMATION,
			"triggler": 1-2,
			"delayTime": TIME,
			"duration": TIME,
			"animationCurve": ANIMATION CURVE
		},
		"submenuOpenType": 1-5 		
	},
	"hamberger": {
		"stripe": NUMBER,
		"animateAsCloseButton": true/false
		"lastoneHalf": true/false
	}
}
```
1 is left, 2 is center, 3 is right.

submenuOpenType:
0 as just a new like FAQ
1 is as a next menu
2 is as a slide in from left
3 is as a slide from right
4 is hover from left
5 is hover from right

in hamberger, stripe is defalut at 3, that you can see who, Minimum at 2.
if choose to, that will animate to close.

and last one stringed can be half! (checlk that setting)

## Header elements

### logo/icon
```json
{
	"id": an 5 digit NUMBER.
	"type": "image",
	
	"content": {
		"source": MEDIA/IMG,
		"alt": STRING
	}
	
	(style)  
	
	"clickable": {......},
	"toggleOpen": {......},
	"JSID": STRING
	"setting": {
		"showInMoblie": true/false,
		"asLogo": true/false,
	}
}
```
NOTE: there only 1 can be logo.

### text/button
```json
{
	"id": an 5 digit NUMBER.
	"type": "text",
	
	"content": {
		"label": STRING
	}
	
	(style)
	
	"clickable": {......},
	"enableToggles": true/false,
	"toggleOpen": {......},
	"JSID": STRING
	"setting": {
		"showInMoblie": true/false,
	}
}
```
the label is a attribute! not a Quill documents!

## For Headers, all element inside

```json
{
	"id": an 4 digit NUMBER.

	(things)
	
	
	"style": {......}, 
	"animation": {......},

		":hover": {......},
		"onTop": {......},
	"overrideState": {
		CLASS NAME: {......}
	},
	"CSSoverride": {......},
	

	"gaps": {
		"gap": SPACE,
		"incline": true/false,
		"defalutColor": COLOR,
		"currerentColor": COLOR,		
	}


	(Action)
}
```

style follow same to div.
no size
animation same to div

everything also same to.

## Header Toggle that add as 'open section'.
that's basicly inside is a div.
```json
{
	"mode": "openSection",
	"context": Elements,

	(same to div)
	
	// BUT: change the Size Setting!
	"size": {
		"minWidth": SPACE,
		"maxWidth": SPACE,
		"paddingLeft": SPACE,
		"paddingRight": SPACE,

		"minHeight": SPACE,
		"maxHeight": SPACE,
		"cutOverflow": true/false,

		"minMoblieHeight": SPACE,
	},
}
```
everything same but the Size (outerStyle) setting

## Header Toggle that add as 'openList'
```json
{
	"mode": "openList",
	"context": [
		{"attributes": STRING, "action": ACTION}
		{"attributes": STRING, "action": ACTION}
		{"attributes": STRING, "action": ACTION}
		......
	],

	"layout": {
		"gap": SPACE
	},
	
	"styles": {......},
	// include everything a normal one need.
	
	// BUT: change the Size Setting!
	"size": {
		"mobileMinWidth": SPACE
		"minWidth": SPACE,
	}
}
```


## Main.json

just like this simple setting:
```json
{
	“version”: 1.0,
	“type”: website,

	“name”: STRING,
	“icon”: SOURCE,
	"websiteKeywords": [
		String
		......
	],
	"domain": STRING
}
```