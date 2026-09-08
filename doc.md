# Transition System — Technical Explanation

## 1. Purpose

This code implements a **transition configuration system** for a CSS builder.

Its job is to take configuration data such as:

```js
{
    property: ["opacity", "transform"],
    duration: 300,
    delay: 0,
    curve: ...
}
```

and turn it into CSS like:

```css
transition:opacity 0.3s ease 0s,transform 0.3s ease 0s;
```

The system has two conceptual transition targets:

* **SELF** — transition applied to the current element.
* **ALL / SECTION** — transition configuration owned by a section and potentially applied more broadly.

The important architectural point is that **this code does not directly apply CSS styles to the element**. It generates transition CSS strings and stores them in attributes.

---

# 2. High-Level Architecture

There are two main parts:

```text
flexEngineTransition
        │
        ├── selfQuery
        ├── allQuery
        ├── renderSingle()
        └── render()
                │
                ▼
flexEngineTransitionContextsNode()
                │
                ▼
       DOM data attributes
```

For example:

```html
<div
    data-transition-config-self="transition:opacity 0.3s ease 0s;"
    data-transition-config-all="">
</div>
```

The renderer decides **what CSS should exist**.

The context function decides **where that generated result is stored**.

---

# 3. Configuration Schema

There are two configuration definitions.

## SELF

```js
selfQuery: [...]
```

The data is expected under:

```js
transition.self
```

For example:

```js
transition: {
    self: {
        property: ["opacity"],
        duration: 300,
        delay: 0,
        curve: ...
    }
}
```

This represents:

> "When this element changes, transition these properties on itself."

---

## ALL

```js
allQuery: [...]
```

The data is expected under:

```js
transition.all
```

For example:

```js
transition: {
    all: {
        property: ["opacity", "transform"],
        duration: 500,
        delay: 100,
        curve: ...
    }
}
```

This represents the transition configuration owned by the **section/all-level system**.

---

# 4. Property Selection

Both `selfQuery` and `allQuery` expose the same property categories.

For example:

```js
{
    name: "opacity",
    label: "Opacity"
}
```

means the internal value is:

```js
"opacity"
```

while the UI displays:

```text
Opacity
```

The available properties are grouped into:

```text
Basic
Transform
Size
Spacing
Background & Color
Border
Shadow & Filter
Other
```

So this:

```js
property: ["opacity", "transform", "background-color"]
```

could produce:

```css
transition:
    opacity 0.3s ease 0s,
    transform 0.3s ease 0s,
    background-color 0.3s ease 0s;
```

---

# 5. `renderSingle()` — The Core Renderer

This is the most important function:

```js
renderSingle: function(transition) {
```

Its responsibility is very narrow:

> Take **one transition object** and convert it into the value of a CSS `transition` declaration.

It does not care whether the transition is SELF or ALL.

---

## 5.1 Null Protection

First:

```js
if (!transition) {
    return "";
}
```

If there is no transition configuration, nothing is generated.

Example:

```js
renderSingle(null)
```

returns:

```js
""
```

---

# 6. Property Validation

Next:

```js
if (!Array.isArray(transition.property)) {
    return "";
}
```

The system expects:

```js
property: [...]
```

not:

```js
property: "opacity"
```

So this works:

```js
property: ["opacity", "transform"]
```

but this doesn't:

```js
property: "opacity"
```

Then:

```js
if (transition.property.length === 0) {
    return "";
}
```

An empty property array means:

```js
property: []
```

and therefore no transition CSS is generated.

---

# 7. Duration

Duration is normalized here:

```js
const duration =
    Math.max(
        0,
        Number(transition.duration) || 0
    );
```

Suppose:

```js
duration: 300
```

Then:

```js
duration = 300
```

Suppose:

```js
duration: -100
```

Then:

```js
duration = 0
```

Suppose:

```js
duration: "500"
```

Then:

```js
duration = 500
```

The internal unit is **milliseconds**.

---

# 8. Delay

Delay follows the same logic:

```js
const delay =
    Math.max(
        0,
        Number(transition.delay) || 0
    );
```

For example:

```js
delay: 200
```

becomes:

```js
200
```

Negative values become:

```js
0
```

---

# 9. Curve Rendering

This section:

```js
let curve = "";

try {
    curve =
        flexEngineDefaultVaribles
            .curve
            .curve
            .render(
                transition.curve
            ) || "ease";
}
catch (e) {
    curve = "ease";
}
```

delegates timing-function generation to another system:

```js
flexEngineDefaultVaribles.curve.curve.render()
```

So this transition system **does not define how a curve is rendered**.

It asks the curve system:

> "Given this curve configuration, what CSS timing function should I use?"

For example, the result could be:

```css
ease
```

or:

```css
linear
```

or:

```css
cubic-bezier(...)
```

If the curve renderer fails, it falls back to:

```css
ease
```

---

# 10. Milliseconds → Seconds

CSS transition syntax normally uses seconds here.

The configuration uses milliseconds:

```js
duration = 300
delay = 100
```

So the code converts them:

```js
const durationSeconds =
    duration / 1000;

const delaySeconds =
    delay / 1000;
```

Result:

```text
300ms → 0.3s
100ms → 0.1s
```

---

# 11. Building Each Transition

This is the actual CSS generation:

```js
for (const property of transition.property) {
```

For every selected property:

```js
parts.push(
    `${property} ${durationSeconds}s ${curve} ${delaySeconds}s`
);
```

For:

```js
property: ["opacity", "transform"]
duration: 300
delay: 100
curve: "ease"
```

the loop generates:

```js
[
    "opacity 0.3s ease 0.1s",
    "transform 0.3s ease 0.1s"
]
```

Then:

```js
return parts.join(",");
```

produces:

```css
opacity 0.3s ease 0.1s,transform 0.3s ease 0.1s
```

Notice that `renderSingle()` **does not add**:

```css
transition:
```

It only returns the value.

That distinction is important.

---

# 12. `render()` — Deciding Which Configuration Is Active

The next layer is:

```js
render: function(transition, mode)
```

This function understands the concept of modes.

There are four modes:

```text
0 = None
1 = Self
2 = Section
3 = Inherit
```

The function always returns:

```js
{
    self: "...",
    all: "..."
}
```

This is important because the caller expects two independent outputs.

---

# 13. Mode 0 — None

```js
if (renderMode === 0) {
    return {
        self: "",
        all: ""
    };
}
```

Nothing is active.

Result:

```js
{
    self: "",
    all: ""
}
```

So no transition CSS is produced.

---

# 14. Mode 1 — Self

Mode 1 activates only:

```js
transition.self
```

The code does:

```js
const selfCSS =
    this.renderSingle(
        transition &&
        transition.self
    );
```

Conceptually:

```text
transition
    │
    └── self
          │
          ▼
    renderSingle()
          │
          ▼
    CSS transition value
```

Then:

```js
return {
    self: selfCSS
        ? `transition:${selfCSS};`
        : "",
    all: ""
};
```

So if:

```js
transition.self = {
    property: ["opacity"],
    duration: 300,
    delay: 0,
    curve: ...
}
```

the result is approximately:

```js
{
    self: "transition:opacity 0.3s ease 0s;",
    all: ""
}
```

The ALL configuration is completely ignored.

---

# 15. Mode 2 — Section

This is the only mode that renders both configurations.

```js
const selfCSS =
    this.renderSingle(
        transition &&
        transition.self
    );

const allCSS =
    this.renderSingle(
        transition &&
        transition.all
    );
```

So:

```text
transition
 ├── self ──→ renderSingle()
 │
 └── all ──→ renderSingle()
```

The result is:

```js
{
    self: "...",
    all: "..."
}
```

For example:

```js
{
    self: "transition:opacity 0.3s ease 0s;",
    all: "transition:transform 0.5s linear 0.1s;"
}
```

The important point is that **SELF and ALL are independently rendered**.

---

# 16. Mode 3 — Inherit

Mode 3 is intentionally different:

```js
if (renderMode === 3) {
    return {
        self: "inherit",
        all: ""
    };
}
```

It does **not** call `renderSingle()`.

It does not generate:

```css
transition:...
```

Instead, it returns the special value:

```text
inherit
```

The comment explains the architecture:

```js
/*
 * Controlled by a SECTION.
 *
 * Do not generate actual transition CSS.
 *
 * The section will later write it.
 */
```

So mode 3 means roughly:

> "This element does not own the transition configuration. A section-level system will control it later."

That distinction will matter if you modify this system.

---

# 17. Unknown Mode

Anything other than:

```text
0
1
2
3
```

falls through to:

```js
return {
    self: "",
    all: ""
};
```

So invalid modes safely produce no CSS.

---

# 18. `flexEngineTransitionContextsNode()`

Now we reach the second major component:

```js
const flexEngineTransitionContextsNode = function(
    dataArray,
    node,
    mode
)
```

This function connects the transition renderer to the DOM.

Think of it as:

```text
Configuration
      ↓
flexEngineTransition.render()
      ↓
CSS strings
      ↓
DOM attributes
```

---

# 19. Node Validation

First:

```js
if (!node) {
    return;
}
```

No DOM node means nothing can be applied.

---

# 20. Attribute Names

The code gets the builder's class prefix:

```js
const prefix =
    BUILDER_CONFIG.classPrefix;
```

Then creates two attribute names:

```js
const attrSelf =
    `${prefix}transition-config-self`;

const attrAll =
    `${prefix}transition-config-all`;
```

Suppose:

```js
BUILDER_CONFIG.classPrefix = "flex-";
```

Then:

```js
attrSelf = "flex-transition-config-self";
attrAll  = "flex-transition-config-all";
```

So the builder can use its own naming convention.

---

# 21. Extracting Transition Data

Then:

```js
const transition =
    dataArray &&
    dataArray.transition;
```

The expected data structure is therefore something like:

```js
dataArray = {
    transition: {
        self: {...},
        all: {...}
    }
}
```

---

# 22. Rendering

Next:

```js
const result =
    flexEngineTransition.render(
        transition,
        mode
    );
```

This is where the previous logic is invoked.

For example:

```js
mode = 2
```

might produce:

```js
result = {
    self: "transition:opacity 0.3s ease 0s;",
    all: "transition:transform 0.5s ease 0s;"
}
```

---

# 23. Writing to the DOM

Finally:

```js
node.setAttribute(
    attrSelf,
    result.self || ""
);
```

and:

```js
node.setAttribute(
    attrAll,
    result.all || ""
);
```

So the renderer doesn't directly do:

```js
node.style.transition = ...
```

Instead it creates attributes.

Conceptually:

```html
<div
    flex-transition-config-self="transition:opacity 0.3s ease 0s;"
    flex-transition-config-all="transition:transform 0.5s ease 0s;"
>
</div>
```

Some other part of the builder presumably interprets these attributes later.

---

# 24. Complete Data Flow

A complete example makes the architecture clearer.

Suppose the configuration is:

```js
const dataArray = {
    transition: {
        self: {
            property: ["opacity"],
            duration: 300,
            delay: 0,
            curve: ...
        },

        all: {
            property: ["transform"],
            duration: 500,
            delay: 100,
            curve: ...
        }
    }
};
```

And:

```js
mode = 2;
```

The execution is:

```text
flexEngineTransitionContextsNode()
              │
              ▼
    dataArray.transition
              │
              ▼
    flexEngineTransition.render()
              │
       ┌──────┴──────┐
       ▼             ▼
 transition.self  transition.all
       │             │
       ▼             ▼
 renderSingle()   renderSingle()
       │             │
       ▼             ▼
 opacity 0.3s...  transform 0.5s...
       │             │
       └──────┬──────┘
              ▼
       result.self
       result.all
              │
              ▼
       node.setAttribute()
              │
              ▼
             DOM
```

---

# 25. Mode Behavior Matrix

The behavior can be summarized as:

| Mode        | `transition.self` | `transition.all` | Output            |
| ----------- | ----------------- | ---------------- | ----------------- |
| `0` None    | ignored           | ignored          | nothing           |
| `1` Self    | rendered          | ignored          | `self`            |
| `2` Section | rendered          | rendered         | `self` + `all`    |
| `3` Inherit | not rendered      | ignored          | `self: "inherit"` |
| Other       | ignored           | ignored          | nothing           |

This is probably the most important thing to understand before modifying the code.

---

# 26. Separation of Responsibilities

The design is actually split into several layers.

### Layer 1 — Query/UI definition

```js
selfQuery
allQuery
```

Defines what the editor can configure.

It does **not** render CSS.

---

### Layer 2 — Single transition renderer

```js
renderSingle()
```

Converts:

```js
{
    property: [...],
    duration: ...,
    delay: ...,
    curve: ...
}
```

into:

```text
property duration curve delay
```

It does not know about modes.

---

### Layer 3 — Mode controller

```js
render()
```

Decides whether SELF, ALL, neither, or inheritance is active.

---

### Layer 4 — DOM context

```js
flexEngineTransitionContextsNode()
```

Takes the result and stores it on the node.

---

# 27. One Important Architectural Detail

There are actually **two different meanings of "transition"** in this code.

The first is the actual CSS:

```css
transition: opacity 0.3s ease 0s;
```

The second is the configuration stored in the DOM:

```html
data-transition-config-self="transition:opacity 0.3s ease 0s;"
```

The function you showed stops at the second stage.

It does **not** demonstrate the code that ultimately turns that attribute into an actual CSS rule/style.

So somewhere else in the builder there is likely another mechanism that reads:

```text
*-transition-config-self
*-transition-config-all
```

and uses those values.

That code is important if your goal is to change **how transitions actually affect elements**, rather than merely changing their configuration/rendering.

---

# 28. One Subtle Point About `all`

The name `all` here does **not necessarily mean**:

```css
transition: all ...
```

It means an **ALL/section configuration bucket**.

For example:

```js
transition.all.property
```

could contain:

```js
["opacity", "transform"]
```

and generate:

```css
transition:opacity 0.3s ease 0s,transform 0.3s ease 0s;
```

The property named `"all"` inside the property selector is a separate concept:

```js
{ name: "all", label: "All" }
```

which corresponds to CSS:

```css
transition-property: all;
```

So there are two meanings:

```text
transition.all
        ↑
configuration scope

property: "all"
        ↑
CSS transition property
```

They should not be confused.

---

# 29. Potentially Important Detail Before Changes

There is a typo in the query schema:

```js
catergory:
```

rather than:

```js
category:
```

Whether that matters depends entirely on the UI system consuming this object. If the framework expects `category`, this would prevent those groups from being recognized. If `catergory` is intentionally the framework's schema name, then it is fine.

I would **not change it yet** without checking the code that consumes `selfQuery` / `allQuery`.

---

# 30. Mental Model

The easiest way to remember this system is:

```text
                 USER CONFIGURATION
                        │
                        ▼
              ┌───────────────────┐
              │ selfQuery/allQuery │
              │   Editor Schema    │
              └─────────┬─────────┘
                        │
                        ▼
                transition object
                        │
                        ▼
              ┌───────────────────┐
              │   renderSingle()  │
              │                   │
              │ config → CSS      │
              └─────────┬─────────┘
                        │
                        ▼
                  render(mode)
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
           None        Self      Section
             │          │          │
             ▼          ▼          ▼
           none       self       self + all
                        │
                        ▼
          flexEngineTransitionContextsNode()
                        │
                        ▼
                      DOM
                        │
                        ▼
             transition config attrs
                        │
                        ▼
            another system consumes it
```

## In short

**`selfQuery` / `allQuery` define the editor.**

**`renderSingle()` converts one configuration into CSS transition syntax.**

**`render()` determines which configuration scope is active based on `mode`.**

**`flexEngineTransitionContextsNode()` puts the resulting CSS strings onto the DOM as attributes.**

The actual transition behavior is therefore a **pipeline**, and this file primarily owns the **configuration → rendered transition → DOM attribute** portion of that pipeline. 🔧📐🧩💻




