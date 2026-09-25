
# Rules of the position for layout.

## CSS Styles
```css
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
    text-align: center; /* center text inside */
}

/* Right group */
.right {
    flex: 0 0 auto; /* fixed size */
    margin-left: 10px;
}
```

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
    text-align: center; /* center text inside */
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

## Rules

1, Logo-Nav -- -- CTAs
2, logo -- Nav -- CTAs
3, 