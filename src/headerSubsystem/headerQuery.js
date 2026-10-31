'use strict';
/**
 * Query about the page, including title, description and cover image.
 */
const pageArrayQuery = [
    {
        name: "title",
        label: "Page Title",
        type: "string/text"
    },
    {
        name: "description",
        label: "Page Description",
        type: "string/text"
    },
    {
        name: "coverIMG",
        label: "Cover Image",
        type: "media/img"
    }
];/**
 * Query about the website, including name, domain, keywords and icon.
 */
const mainArrayQuery = [
    {
        name: "name",
        label: "Website Name",
        type: "string/text"
    },
    {
        name: "domain",
        label: "Website Domain",
        type: "string/text"
    },
    {
        name: "websiteKeywords",
        label: "Website Keywords",
        type: "list"
    },
    {
        name: "icon",
        label: "Website Icon",
        type: "media/img"
    }
];

