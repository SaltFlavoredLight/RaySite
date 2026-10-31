'use strict';

/**
 * Default Mapping - if there have a pre-defined system, this one is just for mapping.
 *
 * @type {Object<string, string>}
 */
export const defaultMapping = {
    "!": "e",
    "@": "a",
    "#": "n",
    "$": "m",
    "%": "p",
    "^": "c",
    "&": "and",
    "*": "star",

    "(": "lp",
    ")": "rp",

    "_": "u",
    "+": "plus",

    "{": "lb",
    "}": "rb",

    "|": "pipe",

    "\"": "dq",
    ":": "colon",
    "?": "q",
    ">": "gt",
    "<": "lt",

    "-": "h",
    "=": "eq",

    "\\": "bs",

    "]": "rsb",
    "[": "lsb",

    "'": "sq",
    ";": "semi",
    "/": "slash",
    ".": "d",
    ",": "comma",

    "`": "bt",
    "~": "tilde",

    " ": "s",

    "\n": "nl",
    "\r": "cr",
    "\t": "tab",

    // Of course, easter egg, Good job you find it!
    "✝️": "inri"
};
