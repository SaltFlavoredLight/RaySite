# Alpha Escape System

Purpose: to transform any text to Base64 without any problems.

Esp. useful if your content requires to store without "%", "/" or "-".

## Santax

EG: `@content-sample` to `_a_content_h_sample`

it use a `_xxx_` mean a char. that is being transformed by alphaEscape System.

## How to use it?

Put any code using:

```js
const text = "@content-sample"

const result = toAlphaEscape(text);
// result is "_a_content_h_sample"

const original = fromAlphaEscape(result);
// original is "@content-sample"
```

