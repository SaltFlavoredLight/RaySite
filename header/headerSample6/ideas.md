
# Rules of the position for layout.

## Rules for Layout.

### Position:
**Desktop:**
Logo - cannot be on the Right
CTA buttons - Cannot be on the Left
Navs - Cannot be on the Center for Menu Mode, Can be anywhere in all mode
Center - Maximum 1 allowed

**Moblie**
Logo - choice on Left or Center
CTA button - primary only - always on Right
Menu Place - can be in Left and Right

### Styles & Size:
**Desktop:**

Banner it's self - that's needed one!

Logo - nothing

CTA button - can contorl the Background, Text Color font size, Border Thinking, however it cannot contorl the padding (and also no Size).

Inner Menu - it have 2 mode, but they control the same version:
Menu in 0 for desktop: it controls the region of submenu, support open mutiple.
Menu in 1-6: (same to 0) it controls the region of whole menu, support open mutiple.
it have Color, Background,  Padding, border (everything in styles), size however only support "Width" and a toggle option called (Let All Supported!).

**Moblie:**
everything inherit, BUT treat Moblie as mode 1-6 version of the setting (therefore this style is always appear!) 


### Layout:
(Desktop Only) Header it's self - have max inner width, and main gap, and seperate border space.
for moblie, there only have main gap apply.

(None) Logo and CTA don't apply anything, becuase again, things don't apply. 

Menu:
**(Desktop Only) mode support 0-6: None (on top), Left Slide, Left Clip, Right Slide, Right Clip, Top Slide, Top Clip.**

(Both-seperate, desktop limitation) COver Header On Menu = False/true
0: Nothing happend.
1-6: the menu will cover the header.
Moblie: same to 1-6

(Both-unified, desktop limitation) Space between = Space
0: That's the gap between the list and item
1-6: nothing
Moblie: same to 1-6

(Both-unified) Nav Major Gap and Minor Gap = Space
0: Major Gap is the Gap inbetween the navs, whlie the manor gap is for list.
1-4: Major Gap is the Gap inbetween the Nav vertically, and Gap is for the list inbetween.
5-6: same to 1-4, but the Gap can also represent harozal thing.
MOblie: same to 1-4

(Both-Unified, desktop limitation) Nesting Support = 0-3, which is None (nothing), Expend (Default), Clickable Menu, nonClickable Menu
(mode)
0: nothing happend
1-4: that will be the trditional menu for nesting choice
5-6: nothing happend - only support 0!
Moblie: same to 1-4

(Both-Unified) Transisuation TIme and Curve = Integer + Curve.
Keep in mind that inherit = theme.

(Moblie Only) Menu have few types of opening animation, support 1-6 as Left Slide, Left Clip, Right Slide, Right Clip, Top Slide, Top Clip.

(Moblie Only) CTA buttons support 0-2: Call to Action on Standard Button, Call to Action on Full Stick and Call to Action On Full Row.


## HTML sample 1:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>3 Areas in One Div</title>
<style>
.container {
    display: flex;
    align-items: center; /* vertical alignment */
    justify-content: space-between; /* distribute sections */
}

/* Left group */
.left {
    flex: 0 0 auto; /* fixed size */
    margin-right: 10px;
    width: 60px;
}

/* Center group */
.center {
    flex: 1 1 auto; /* take remaining space */
    align-items: center; /* center text inside */
}

/* Right group */
.right {
    flex: 0 0 auto; /* fixed size */
    margin-left: 10px;
}
</style>
</head>
<body>

<div class="container">
  <!-- Left area elements -->
  <button class="left">L1</button>
  <button class="left">L2</button>

  <!-- Center area elements -->
  <span class="center">Center 1</span>
  <span class="center">Center 2</span>

  <!-- Right area elements -->
  <button class="right">R1</button>
  <button class="right">R2</button>
</div>

</body>
</html>
```

a crazy tricks!
```html
<div class="container">
  <div class="item a">Item 1</div>
  <div class="item b">Item 2</div>
  <div class="item c">Item 3</div>
</div>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* optional spacing */
}

.item {
  background: #ddd;
  padding: 20px;
  border: 1px solid #aaa;
}

/* First two items share the row */
.a {
  flex: 1 1 auto; /* grow and shrink normally */
}

/* Third item takes full width */
.c {
  flex: 0 0 100%;
}
</style>
```