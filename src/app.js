import Quill from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Sortable from "sortablejs";

import { flexEngineFileSystem } from "./flexEngine.js";


export async function initProject() {

    // Step 1: Initialize main project metadata
    const mainData = `{
        "version": "0.9.0",
        "type": "website",
        "name": "RaySite",
        "icon": "raysite.net/icon.png",
        "websiteKeywords": [],
        "domain": "example.com"
    }`;

    await flexEngineFileSystem.updateMain(mainData);


    // Step 2: Initialize the default theme
    const themeData = `{
        "color": {
            "primaryColor": "#8F2338",
            "secondaryColor": "#876D60",
            "accentColor": "#C7A45D",
            "secondaryAccentColor": "#B86A78",
            "neutralTextColor": "#352A27",
            "neutralBackgroundColor": "#F7F0E5",
            "customColor1": "#FFFCF5",
            "customColor2": "#E8DCC7",
            "customColor3": "#D8C5A6",
            "customColor4": "#57202B"
        },
        "fonts": [
            {
                "type": "system",
                "name": "Inter"
            },
            {
                "type": "googleFonts",
                "name": "DM Sans"
            },
            {
                "type": "googleFonts",
                "name": "Cormorant Garamond"
            }
        ],
        "typography": {
            "normal": {
                "font": ["Inter", "sans-serif"],
                "size": 15,
                "letterSpacing": 0.05,
                "boldness": 400,
                "color": "#352A27",
                "allCaps": false,
                "align": null,
                "customStyle": "line-height: 1.75;"
            },
            "normal2": {
                "font": ["DM Sans", "sans-serif"],
                "size": 14,
                "letterSpacing": 0.15,
                "boldness": 400,
                "color": "#876D60",
                "allCaps": false,
                "align": null,
                "customStyle": "line-height: 1.65;"
            },
            "h1": {
                "font": ["Cormorant Garamond", "serif"],
                "size": 42,
                "letterSpacing": -0.6,
                "boldness": 700,
                "color": "#57202B",
                "allCaps": false,
                "align": null,
                "customStyle": "line-height: 1.12;"
            },
            "h2": {
                "font": ["Cormorant Garamond", "serif"],
                "size": 28,
                "letterSpacing": -0.3,
                "boldness": 700,
                "color": "#8F2338",
                "allCaps": false,
                "align": null,
                "customStyle": "line-height: 1.3;"
            },
            "h3": {
                "font": ["Inter", "sans-serif"],
                "size": 17,
                "letterSpacing": 0.1,
                "boldness": 650,
                "color": "#8F2338",
                "allCaps": false,
                "align": null,
                "customStyle": "line-height: 1.45;"
            },
            "h4": {
                "font": ["Inter", "sans-serif"],
                "size": 13,
                "letterSpacing": 0.8,
                "boldness": 650,
                "color": "#876D60",
                "allCaps": true,
                "align": null,
                "customStyle": "line-height: 1.5;"
            },
            "small": {
                "font": ["Inter", "sans-serif"],
                "size": 12,
                "letterSpacing": 0.2,
                "boldness": 500,
                "color": "#876D60",
                "allCaps": false,
                "align": null,
                "customStyle": "line-height: 1.5;"
            }
        },
        "spacing": {
            "section": 40,
            "blockgap": 20,
            "tiny": 4,
            "small": 8,
            "mSmall": 12,
            "medium": 16,
            "large": 24,
            "extraLarge": 40,
            "bradiusLarge": 12,
            "bradiusMedium": 8,
            "bradiusSmall": 4
        },
        "animation": {
            "timing": 280,
            "delayTime": 0,
            "animationCurve": "ease-in-out",
            "animation": "fade"
        },
        "transition": {
            "timing": 200,
            "delay": 0,
            "animationCurve": "ease"
        },
        "customVariables": {
            "surfaceRaised": "#FFFCF5",
            "surfaceElevated": "#F0E5D4",
            "contentWidth": "1200px",
            "readingMeasure": "68ch",
            "fontDisplay": "Cormorant Garamond, serif",
            "fontBody": "Inter, sans-serif",
            "fontSecondary": "DM Sans, sans-serif",
            "ornamentalGold": "#C7A45D",
            "ornamentalBorder": "#D8C5A6",
            "shadowSoft": "0 4px 18px rgba(87, 32, 43, 0.08)",
            "focusRing": "0 0 0 3px rgba(143, 35, 56, 0.22)"
        }
    }`;

    await flexEngineFileSystem.updateTheme("default", themeData);


    // Step 3: Initialize the home page
    const pageData = `{
        "title": "Welcome",
        "description": "This is a Home Page",
        "coverIMG": null,
        "importence": 1,
        "doNotIndex": false,
        "type": "webpage",
        "theme": "default",
        "body": {
            "header": {
                "type": "@inherit/inherit",
                "source": "header"
            },
            "main": {
                "type": "@root/main",
                "content": {}
            },
            "cta": {
                "type": "@inherit/inherit",
                "source": "cta"
            },
            "footer": {
                "type": "@inherit/inherit",
                "source": "footer"
            }
        }
    }`;

    await flexEngineFileSystem.updatePage("/", pageData);


    // Step 4: Initialize the three components with empty JSON data
    const emptyComponentData = "{}";

    debugger;

    await flexEngineFileSystem.updateComponent(
        "header",
        emptyComponentData
    );

    await flexEngineFileSystem.updateComponent(
        "cta",
        emptyComponentData
    );

    await flexEngineFileSystem.updateComponent(
        "footer",
        emptyComponentData
    );

}