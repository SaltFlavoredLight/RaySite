## Todo:
[] add animation the second version.

[] for render part, just migrate them each to correspond to the new version, note that some of them were different

[] start the UI and AppAPIs - remember appAPIs is different than App.js since one handle UI and another one handle the appAPIs,

[] also need web-render.js

[] lastly, get tested by teacher!

## Reminders:

Part A — Options reference
For each entry in styleQuery, use:

name: the variable name received by the style function as s.name.
label: human-readable label shown to the user.
type: determines what kind of input/control is used.
default: exists as an optional field, but skip it for this task.
choice: required for selection.
Other type-specific fields are only added when required by that type.
Integer types
integer

Required fields: name, label, type
No additional fields required.
Allows integer values.
integer/noNeg

Required fields: name, label, type
This variant requires its non-negative constraint.
Use it when negative numbers don't make sense.
integer/slide

Required fields: name, label, type, min, max, step
Used for a slider/range of integer values.
min, max, and step must all be supplied.
integer/segment

Used when there are only a small number of discrete numeric options.
Requires the same configuration as the segment control expects.
Best suited for values such as 0, 1, 2, 3, etc., rather than a large continuous numeric range.
Boolean
boolean/checkmark
Required fields: name, label, type
No additional fields required.
Used for true/false options.
String types
string/text

Required fields: name, label, type
No additional fields required.
string/url

Required fields: name, label, type
No additional fields required.
Intended for URLs.
string/textbox

Required fields: name, label, type
No additional fields required.
Intended for larger/multiline text.
Selection
selection
Required fields: name, label, type, choice
choice is an array of options.
Each option has:
{
    label: "Human readable name",
    value: 123
}

The value can be whatever value the specific property needs.
Space
space
Required fields: name, label, type
No additional fields required.
defaultAsFull: true can be added when that behavior is desired, as shown in your example.
Color
color/picker
Required fields: name, label, type
backgroundIMG: false is optional.
Set backgroundIMG: false when background-image mode should not be available for that particular color field.