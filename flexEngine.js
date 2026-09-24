// Flex Engine!
'use strict';

// need Flies
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';
import JSZip from 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm';

// Nesserary for have a Quill delta element
import quill from 'https://cdn.jsdelivr.net/npm/quill@2.0.3/+esm';
import quillDeltaToHtml from 'https://cdn.jsdelivr.net/npm/quill-delta-to-html@0.12.1/+esm';

// And Sortable, another important part.
import Sortable from 'https://cdn.jsdelivr.net/npm/sortablejs/+esm';


// Builder Configs
export const BUILDER_CONFIG = {
	brandName: "RaySite",
	classPrefix: "rs-",
	attribution: "Spread the message with RaySite! RaySite is a Free Website builder for you!"
};



/**
 * ------------------------------------------------------------------------------
 * Web Tools (Helper Functions)
 * 
 * there are many simple tools that everyone reliy on them, 
 * this is a collaction to thing that useful.
 * ------------------------------------------------------------------------------
 */

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const num = v => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};

const flexEngineCheckContext = function(contextSetting, label) {

	// Normalize into array
	let list = [];

	if (Array.isArray(contextSetting)) {
		list = contextSetting.map(s => String(s).trim());
	}
	else if (typeof contextSetting === "string") {
		list = contextSetting
			.replace(/,/g, " ")
			.split(/\s+/)
			.map(s => s.trim())
			.filter(s => s.length > 0);
	}

	return list.includes(label);
};


/**
 * ------------------------------------------------------------------------------ 
 * LEGACY MODULE
 * 
 * Do not add new features here.
 * It will be removed from flexEngine and flexEngine Modules
 * ------------------------------------------------------------------------------
 */

// Note: replace it by flexEngineDefaultVariables
// Variable system
const flexEngineStyleVarible = {
	color: function(colorObj) {
                if (!colorObj || !colorObj.mode) {
                    return "transparent";
                }
                const resolveColor = cStr => {
                    if (!cStr || cStr === "transparent") {
                        return "transparent";
                    }
                    return cStr.startsWith("color-") ? `var(--${cStr})` : cStr;
                };
                switch (colorObj.mode) {
                    case "basic":
                        return resolveColor(colorObj.color);
                    case "hex":
                        return colorObj.hex;
                    case "variables":
                        return `var(--${colorObj.variables})`;
                    case "linearGradient": {
                        const gradientStops = (colorObj.stops || []).map(stop => `${resolveColor(stop.color)} ${stop.offset}%`).join(", ");
                        return `linear-gradient(
                                    ${colorObj.angle}deg,
                                    ${gradientStops}
                                )`;
                    }
                    case "backgroundIMG": {
                        const repeat = `
                                    ${colorObj.repeatX ? "repeat-x" : ""}
                                    ${colorObj.repeatY ? "repeat-y" : ""}
                                `.trim() || "no-repeat";
                        const posX = ["left", "center", "right"][colorObj.positionX - 1] || "center";
                        const posY = ["top", "center", "bottom"][colorObj.positionY - 1] || "center";
                        const attachment = colorObj.attachment ? "fixed" : "scroll";
                        if (colorObj.coloroverlay && colorObj.coloroverlay !== "transparent") {
                            const overlayStr = resolveColor(colorObj.coloroverlay);
                            return `
                                        linear-gradient(
                                            ${overlayStr},
                                            ${overlayStr}
                                        ),
                                        url("${colorObj.src}")
                                        ${posX}
                                        ${posY}
                                        / auto
                                        ${repeat}
                                        ${attachment}
                                    `;
                        }
                        return `
                                    url("${colorObj.src}")
                                    ${posX}
                                    ${posY}
                                    / auto
                                    ${repeat}
                                    ${attachment}
                                `;
                    }
                    case "inherit":
                        return "inherit";
                    case "none":
                    default:
                        return "transparent";
                }
	},

	space: function(spaceObj) {
		if (!spaceObj || !spaceObj.mode) return '0px';

		switch (spaceObj.mode) {
			case 'auto':
				return 'auto';

            case 'none':
                return '0px';

			case 'variables':
				return `var(--${BUILDER_CONFIG.classPrefix + spaceObj.variables})`;

				// Handles: px, rem, em, %, vw, vh, vmin, vmax, ch
			default:
				const validUnits = ['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax', 'ch'];
				if (validUnits.includes(spaceObj.mode)) {
					return `${spaceObj.value}${spaceObj.mode}`;
				}

				// Fallback for unexpected modes
				return '0px';
		}
	},

	media: function(mediaObj) {
		if (!mediaObj || !mediaObj.mode) return '';

		switch (mediaObj.mode) {
			case 'internal':
				const prefix = BUILDER_CONFIG.classPrefix;

				// Constructing: prefix/assets/folder/name
				return `/${prefix}assets/${mediaObj.folder}/${mediaObj.name}`;

			case 'external':
				return mediaObj.url;

			default:
				return '';
		}
	},

	// for Head only
	absMedia: function(mediaObj, mainArray, selfSlug) {
		if (!mediaObj || !mediaObj.mode) return '';

		switch (mediaObj.mode) {
			case 'internal':

				const prefix = BUILDER_CONFIG.classPrefix;

				const absoluteDomainEnable = (selfSlug !== null && mainArray.domain !== null && selfSlug !== "" && mainArray.domain !== "");
				const absoluteDomain = (absoluteDomainEnable) ? `https://${mainArray.domain}` : "/";

				// Constructing: prefix/assets/folder/name
				return `${absoluteDomain}/${prefix}assets/${mediaObj.folder}/${mediaObj.name}`;

			case 'external':
				return mediaObj.url;

			default:
				return '';
		}
	},

	curve: function(curveObj) {
                // Return CSS variable if set to theme mode
                if (Array.isArray(coords) && coords.length === 1 && coords[0] === 'theme') {
                    const prefix = (typeof BUILDER_CONFIG !== 'undefined' && BUILDER_CONFIG.classPrefix) 
                        ? BUILDER_CONFIG.classPrefix 
                        : 'default';
                    return `var(--${prefix}-animation-animationCurve)`;
                }

                const presetMap = {
                    '0,0,1,1': 'linear',
                    '0.25,0.1,0.25,1': 'ease',
                    '0.42,0,1,1': 'ease-in',
                    '0,0,0.58,1': 'ease-out',
                    '0.42,0,0.58,1': 'ease-in-out'
                };

                const key = Array.isArray(coords) ? coords.join(',') : '';

                return presetMap[key] || `cubic-bezier(${key})`;
	},
};


/**
 * ------------------------------------------------------------------------------
 * Flie System for Website
 * 
 * a 2 part program where 1 provide a vitual File System
 * and another program edit Theme, Assets and Many More.
 * Important Module since it's foundation of Module 
 * Last Update: 1.0.0
 * ------------------------------------------------------------------------------
 */


class openDBFlieMaagement {

    constructor(dbName = 'ZipContainerDB', storeName = 'files') {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }

    _normalizePath(path) {
        return path.startsWith('/') ? path : '/' + path;
    }

    async _checkPersistence() {
        if (navigator.storage && navigator.storage.persisted) {
            let isPersisted = await navigator.storage.persisted();
            if (!isPersisted && navigator.storage.persist) {

                isPersisted = await navigator.storage.persist();
            }
            return isPersisted;
        }
        return false;
    }

    async _execute(actionFunc) {
        try {
            const data = await actionFunc();
            const isPersistent = await this._checkPersistence();
            return {
                code: isPersistent ? 0 : 2,
                data: data
            };
        } catch (error) {
            console.error("[ZipContainer Error]:", error);
            return {
                code: 1,
                error: error.message || "Unknown error occurred"
            };
        }
    }

    async register() {
        return this._execute(async () => {
            this.db = await openDB(this.dbName, 1, {
                upgrade: (db) => {
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                    }
                },
            });
            return { message: "Database registered and connected successfully." };
        });
    }

    async read(path) {
        return this._execute(async () => {
            const normPath = this._normalizePath(path);
            const data = await this.db.get(this.storeName, normPath);
            return data;
        });
    }

    async add(path, fileData) {
        return this._execute(async () => {
            const normPath = this._normalizePath(path);
            await this.db.put(this.storeName, fileData, normPath);
            return { path: normPath, status: "Added/Replaced" };
        });
    }

    async edit(path, fileData) {
        return this.add(path, fileData);
    }

    async change(path, fileData) {
        return this.add(path, fileData);
    }

    async bulkAdd(files) {
        return this._execute(async () => {
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);

            const promises = files.map(file => {
                const normPath = this._normalizePath(file.path);
                return store.put(file.data, normPath);
            });

            await Promise.all([...promises, tx.done]);
            return { addedCount: files.length };
        });
    }

    async delete(path) {
        return this._execute(async () => {
            const normPath = this._normalizePath(path);
            await this.db.delete(this.storeName, normPath);
            return { path: normPath, status: "Deleted" };
        });
    }

    async clear() {
        return this._execute(async () => {
            await this.db.clear(this.storeName);
            return { status: "Database cleared completely." };
        });
    }

    async list() {
        return this._execute(async () => {
            const keys = await this.db.getAllKeys(this.storeName);
            return keys;
        });
    }

    async importZip(zipBlob) {
        return this._execute(async () => {
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(zipBlob);
            const filesToAdd = [];
            const readPromises = [];

            loadedZip.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir) {
                    readPromises.push(
                        zipEntry.async('blob').then(blob => {
                            filesToAdd.push({
                                path: '/' + relativePath, 
                                data: blob
                            });
                        })
                    );
                }
            });

            await Promise.all(readPromises);

            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            filesToAdd.forEach(file => {
                store.put(file.data, file.path);
            });
            await tx.done;

            return { importedCount: filesToAdd.length };
        });
    }

    async exportZip() {
        return this._execute(async () => {
            const zip = new JSZip();
            const tx = this.db.transaction(this.storeName, 'readonly');
            const store = tx.objectStore(this.storeName);

            let cursor = await store.openCursor();
            let fileCount = 0;

            while (cursor) {
                const path = cursor.key;
                const data = cursor.value;

                const zipPath = path.startsWith('/') ? path.slice(1) : path;
                zip.file(zipPath, data);

                fileCount++;
                cursor = await cursor.continue();
            }

            const blob = await zip.generateAsync({ type: 'blob' });
            return { 
                blob: blob,
                exportedCount: fileCount,
                filename: `export_${new Date().getTime()}.zip`
            };
        });
    }
};

export class FlexEngineFileSystem {
    constructor(dbName = 'ZipContainerDB', storeName = 'files') {
        this.zipManager = new openDBFlieMaagement(dbName, storeName);
    }

    async init() {
        return await this.zipManager.register();
    }


    _routeToPagePath(route) {
        let cleanRoute = route.trim();
        if (cleanRoute === '404' || cleanRoute === '/404') {
            return '/pages/404.json';
        }
        if (cleanRoute.startsWith('/')) {
            cleanRoute = cleanRoute.substring(1);
        }
        if (cleanRoute === '') {
            return '/pages/_.json';
        }
        const filename = '_' + cleanRoute.replace(/\//g, '_') + '.json';
        return `/pages/${filename}`;
    }

    _pagePathToRoute(filePath) {
        const parts = filePath.split('/');
        const filename = parts[parts.length - 1];

        if (filename === '404.json') {
            return '404';
        }

        if (filename === '_.json') {
            return '/';
        }

        if (filename.startsWith('_') && filename.endsWith('.json')) {
            const rawName = filename.slice(1, -5);
            return '/' + rawName.replace(/_/g, '/');
        }

        return null;
    }

    async _readJson(path) {
        const res = await this.zipManager.read(path);
        if (res.code === 1) return res;
        if (!res.data) {
            return { code: 1, error: `File not found at path: ${path}` };
        }

        try {
            let jsonText = '';
            if (typeof res.data === 'string') {
                jsonText = res.data;
            } else if (res.data instanceof Blob) {
                jsonText = await res.data.text();
            } else {
                return { code: res.code, data: res.data };
            }
            const parsed = JSON.parse(jsonText);
            return { code: res.code, data: parsed };
        } catch (e) {
            return { code: 1, error: `Failed to parse JSON at path: ${path}. ${e.message}` };
        }
    }

    async _writeJson(path, jsonData) {
        let textData = '';
        if (typeof jsonData === 'string') {
            textData = jsonData;
        } else {
            textData = JSON.stringify(jsonData, null, 2);
        }
        const blob = new Blob([textData], { type: 'application/json' });
        return await this.zipManager.add(path, blob);
    }



    async listPages() {
        const res = await this.zipManager.list();
        if (res.code === 1) return res;

        const allPaths = res.data || [];
        const routes = allPaths
            .filter(p => p.startsWith('/pages/') && p.endsWith('.json'))
            .map(p => this._pagePathToRoute(p))
            .filter(Boolean);

        return { code: res.code, data: routes };
    }

    async readPage(route) {
        const filePath = this._routeToPagePath(route);
        return await this._readJson(filePath);
    }

    async updatePage(route, pageData) {
        const filePath = this._routeToPagePath(route);
        return await this._writeJson(filePath, pageData);
    }

    async deletePage(route) {
        const filePath = this._routeToPagePath(route);
        return await this.zipManager.delete(filePath);
    }



    async listAssets(folderPath = '') {
        const res = await this.zipManager.list();
        if (res.code === 1) return res;

        let cleanFolder = folderPath.trim();
        if (!cleanFolder.startsWith('/')) cleanFolder = '/' + cleanFolder;
        if (!cleanFolder.startsWith('/assets')) cleanFolder = '/assets' + cleanFolder;
        if (!cleanFolder.endsWith('/')) cleanFolder += '/';

        const allPaths = res.data || [];
        const assets = allPaths.filter(p => p.startsWith(cleanFolder));

        const formattedAssets = assets.map(p => p.replace(/^\/assets/, ''));

        return { code: res.code, data: formattedAssets };
    }

    async updateAsset(assetPath, assetData) {
        const cleanPath = assetPath.startsWith('/') ? assetPath : '/' + assetPath;
        const fullPath = `/assets${cleanPath}`;
        return await this.zipManager.add(fullPath, assetData);
    }

    async deleteAsset(assetPath) {
        const cleanPath = assetPath.startsWith('/') ? assetPath : '/' + assetPath;
        const fullPath = `/assets${cleanPath}`;
        return await this.zipManager.delete(fullPath);
    }

    async readAsset(assetPath) {
        const cleanPath = assetPath.startsWith('/') ? assetPath : '/' + assetPath;
        const fullPath = `/assets${cleanPath}`;
        return await this.zipManager.read(fullPath);
    }



    async listThemes() {
        const res = await this.zipManager.list();
        if (res.code === 1) return res;

        const allPaths = res.data || [];
        const themes = allPaths
            .filter(p => p.startsWith('/themes/') && p.endsWith('.json'))
            .map(p => p.replace('/themes/', '').replace('.json', ''));

        return { code: res.code, data: themes };
    }

    async readTheme(themeName) {
        const cleanName = themeName.replace('.json', '');
        const filePath = `/themes/${cleanName}.json`;
        return await this._readJson(filePath);
    }

    async updateTheme(themeName, themeData) {
        const cleanName = themeName.replace('.json', '');
        const filePath = `/themes/${cleanName}.json`;
        return await this._writeJson(filePath, themeData);
    }

    async deleteTheme(themeName) {
        const cleanName = themeName.replace('.json', '');
        const filePath = `/themes/${cleanName}.json`;
        return await this.zipManager.delete(filePath);
    }



    async listComponents() {
        const res = await this.zipManager.list();
        if (res.code === 1) return res;

        const allPaths = res.data || [];
        const components = allPaths
            .filter(p => p.startsWith('/componets/') && p.endsWith('.json'))
            .map(p => p.replace('/componets/', '').replace('.json', ''));

        return { code: res.code, data: components };
    }

    async readComponent(componentName) {
        const cleanName = componentName.replace('.json', '');
        const filePath = `/componets/${cleanName}.json`;
        return await this._readJson(filePath);
    }

    async updateComponent(componentName, componentData) {
        const cleanName = componentName.replace('.json', '');
        const filePath = `/componets/${cleanName}.json`;
        return await this._writeJson(filePath, componentData);
    }

    async deleteComponent(componentName) {
        const cleanName = componentName.replace('.json', '');
        const filePath = `/componets/${cleanName}.json`;
        return await this.zipManager.delete(filePath);
    }



    async readMain() {
        return await this._readJson('/main.json');
    }

    async updateMain(mainData) {
        return await this._writeJson('/main.json', mainData);
    }



    async exportFile() {
        return await this.zipManager.exportZip();
    }

    async deleteWholeFile() {
        return await this.zipManager.clear();
    }

    async importZipFile(zipBlob) {
        const listRes = await this.zipManager.list();
        if (listRes.code === 1) {
            return listRes;
        }

        if (listRes.data && listRes.data.length > 0) {
            return {
                code: 1,
                error: "Cannot import zip: Storage is not empty. Delete whole file first."
            };
        }

        return await this.zipManager.importZip(zipBlob);
    }
};



/**
 * ------------------------------------------------------------------------------
 * Cubic Bezier Editor
 * 
 * a simple JS program that allows you to create anomation curve
 * Nesserary in some part of the software.
 * Last Update: 1.0.0
 * ------------------------------------------------------------------------------
 */

// Helper
class CubicBezierCanvas {
    constructor(canvas, bezier) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bezier = bezier;
    }

    plot() {
        const ctx = this.ctx;
        const theme = this.bezier.theme;
        const [x1, y1, x2, y2] = this.bezier.coordinates;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (theme.backgroundColor && theme.backgroundColor !== 'transparent') {
            ctx.fillStyle = theme.backgroundColor;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        ctx.save();
        ctx.translate(0, this.canvas.height);
        ctx.scale(this.canvas.width, -this.canvas.height);

        ctx.lineWidth = 0.01;
        ctx.strokeStyle = theme.lineColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.moveTo(1, 1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = theme.handleColor;
        ctx.beginPath();
        ctx.arc(x1, y1, 0.015, 0, Math.PI * 2);
        ctx.arc(x2, y2, 0.015, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = theme.curveColor;
        ctx.lineWidth = 0.02;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(x1, y1, x2, y2, 1, 1);
        ctx.stroke();

        ctx.restore();
    }

    canvasToBezier(px, py) {
        const clampedPx = Math.max(0, Math.min(this.canvas.width, Math.round(px)));
        const clampedPy = Math.max(0, Math.min(this.canvas.height, Math.round(py)));
        return [clampedPx / this.canvas.width, 1 - clampedPy / this.canvas.height];
    }

    bezierToCanvas(x, y) {
        return [
            Math.round(x * this.canvas.width),
            Math.round((1 - y) * this.canvas.height)
        ];
    }
};

// Main Program for the editor.
export class CubicBezierEditor {
    /**
     * container: DOM element where the editor will be mounted
     * options: {
     *   entry: [x1, y1, x2, y2], // initial coordinates (numbers 0..1)
     *   easyMode: false,         // toggle easy mode
     *   roundTo: 2,              // decimal places precision
     *   size: 'auto',            // 'width', 'height', 'auto', or CSS size (e.g. '400px')
     *   showPreview: false,      // toggle text output label
     *   theme: {
     *     handleColor: '#ff4080',     // color of the control handles & points
     *     backgroundColor: '#fafafa', // canvas background (set 'transparent' for no fill)
     *     curveColor: '#000000',      // bezier curve stroke color
     *     lineColor: '#aaaaaa'        // handle connecting lines color
     *   },
     *   onChange: function(data)
     * }
     */
    constructor(container, options = {}) {
        if (!container || !(container instanceof Element)) {
            throw new Error('CubicBezierEditor requires a DOM container element');
        }

        this.container = container;
        this.options = options;
        this.easyMode = Boolean(options.easyMode);
        this.roundTo = typeof options.roundTo === 'number' && options.roundTo >= 0 ? options.roundTo : 2;
        this.sizeOption = options.size || 'auto';
        this.showPreview = Boolean(options.showPreview);

        const defaultTheme = {
            handleColor: '#ff4080',
            backgroundColor: '#fafafa',
            curveColor: '#000000',
            lineColor: '#aaaaaa'
        };
        this.theme = Object.assign({}, defaultTheme, options.theme || {});

        const initialEntry = Array.isArray(options.entry) && options.entry.length === 4 ?
            options.entry.map(Number) :
            [0.25, 0.1, 0.25, 1];

        this.coordinates = this._roundCoords(initialEntry);
        this.onChange = typeof options.onChange === 'function' ? options.onChange : null;

        this.presets = {
            'linear': [0, 0, 1, 1],
            'ease': [0.25, 0.1, 0.25, 1],
            'ease-in': [0.42, 0, 1, 1],
            'ease-out': [0, 0, 0.58, 1],
            'ease-in-out': [0.42, 0, 0.58, 1]
        };

        this._elements = {};
        this._listeners = [];
        this._isInitialized = false;
        this._resizeObserver = null;
    }

    get coords() {
        return this.coordinates;
    }
    set coords(val) {
        this.coordinates = val;
    }

    toString() {
        return `cubic-bezier(${this.coordinates.join(',')})`;
    }

    init() {
        if (this._isInitialized) return;
        this._isInitialized = true;

        if (getComputedStyle(this.container).overflow === 'visible') {
            this.container.style.overflow = 'hidden';
        }

        // Outer root wrapper to manage flex flow
        const mainWrap = document.createElement('div');
        mainWrap.className = 'cbe-main-wrap';
        Object.assign(mainWrap.style, {
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%'
        });

        const wrap = document.createElement('div');
        wrap.className = 'cbe-wrap';
        Object.assign(wrap.style, {
            position: 'relative',
            display: 'block',
            lineHeight: '0',
            fontSize: '0',
            verticalAlign: 'top',
            flexShrink: '0'
        });

        const canvas = document.createElement('canvas');
        canvas.className = 'cbe-canvas';
        Object.assign(canvas.style, {
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            background: this.theme.backgroundColor === 'transparent' ? 'none' : this.theme.backgroundColor,
            display: 'block',
            verticalAlign: 'bottom'
        });

        const handle1 = document.createElement('div');
        const handle2 = document.createElement('div');
        [handle1, handle2].forEach(h => {
            h.className = 'cbe-handle';
            Object.assign(h.style, {
                width: '14px',
                height: '14px',
                background: this.theme.handleColor,
                borderRadius: '50%',
                position: 'absolute',
                cursor: 'pointer',
                transform: 'translate(-7px, -7px)',
                touchAction: 'none',
                zIndex: '2'
            });
        });

        wrap.appendChild(canvas);
        wrap.appendChild(handle1);
        wrap.appendChild(handle2);
        mainWrap.appendChild(wrap);

        this._elements = {
            mainWrap,
            wrap,
            canvas,
            handle1,
            handle2
        };

        if (this.showPreview) {
            const output = document.createElement('p');
            output.className = 'cbe-output';
            Object.assign(output.style, {
                marginTop: '8px',
                marginBottom: '0',
                fontFamily: 'sans-serif',
                fontSize: '14px',
                lineHeight: '1.4',
                textAlign: 'center',
                boxSizing: 'border-box',
                flexShrink: '0'
            });
            mainWrap.appendChild(output);
            this._elements.output = output;
        }

        this.container.appendChild(mainWrap);

        this._bc = new CubicBezierCanvas(canvas, this);

        this._updateDimensions();
        this._setupResizeObserver();

        this._makeDraggable(handle1, 0);
        this._makeDraggable(handle2, 1);
        this._addTouchSupport(handle1, 0);
        this._addTouchSupport(handle2, 1);
    }

    _updateDimensions() {
        if (!this._elements.canvas) return;

        const parentRect = this.container.getBoundingClientRect();

        // Subtract preview element height + top margin if visible
        let reservedHeight = 0;
        if (this.showPreview && this._elements.output) {
            const outputRect = this._elements.output.getBoundingClientRect();
            reservedHeight = outputRect.height + 8; // 8px margin
        }

        const availWidth = parentRect.width;
        const availHeight = Math.max(0, parentRect.height - reservedHeight);

        let targetSize = 300;

        if (this.sizeOption === 'width') {
            targetSize = availWidth;
        } else if (this.sizeOption === 'height') {
            targetSize = availHeight;
        } else if (this.sizeOption === 'auto') {
            if (availWidth > 0 && availHeight > 0) {
                targetSize = Math.min(availWidth, availHeight);
            } else {
                targetSize = availWidth || availHeight || 300;
            }
        } else {
            const tempEl = document.createElement('div');
            tempEl.style.width = this.sizeOption;
            tempEl.style.position = 'absolute';
            tempEl.style.visibility = 'hidden';
            document.body.appendChild(tempEl);
            targetSize = tempEl.getBoundingClientRect().width || 300;
            document.body.removeChild(tempEl);
        }

        const sizePx = Math.max(50, Math.floor(targetSize));

        // Force strict square bounds for canvas and handle wrap
        this._elements.canvas.width = sizePx;
        this._elements.canvas.height = sizePx;
        this._elements.canvas.style.width = `${sizePx}px`;
        this._elements.canvas.style.height = `${sizePx}px`;

        this._elements.wrap.style.width = `${sizePx}px`;
        this._elements.wrap.style.height = `${sizePx}px`;

        this._updateHandles();
        this._redraw();
    }

    _setupResizeObserver() {
        if (typeof ResizeObserver !== 'undefined') {
            this._resizeObserver = new ResizeObserver(() => {
                this._updateDimensions();
            });
            this._resizeObserver.observe(this.container);
        }
    }

    getResult() {
        return this.coordinates.slice();
    }

    getPreview() {
        const coordsStr = this.coordinates.join(', ');
        if (this.easyMode) {
            const match = this._getMatchingPreset();
            if (match) return `${coordsStr} - ${match}`;
        }
        return coordsStr;
    }

    getHTML() {
        if (this.easyMode) {
            const match = this._getMatchingPreset();
            if (match) return match;
        }
        return `cubic-bezier(${this.coordinates.join(', ')})`;
    }

    setPreset(name) {
        if (this.presets[name]) {
            this.setEntry(this.presets[name]);
        }
    }

    setEntry(entry) {
        if (!Array.isArray(entry) || entry.length !== 4) {
            throw new Error('setEntry expects an array of 4 numbers');
        }
        this.coordinates = this._roundCoords(entry);
        if (this._bc) {
            this._updateHandles();
            this._redraw();
            this._emitChange();
        }
    }

    destroy() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }

        this._listeners.forEach(({
            target,
            type,
            fn
        }) => target.removeEventListener(type, fn));
        this._listeners = [];

        if (this._elements.mainWrap && this._elements.mainWrap.parentNode) {
            this._elements.mainWrap.parentNode.removeChild(this._elements.mainWrap);
        }

        this._elements = {};
        this._isInitialized = false;
    }

    _roundNumber(val) {
        return Number(Math.round(val + 'e' + this.roundTo) + 'e-' + this.roundTo);
    }

    _roundCoords(coords) {
        return coords.map(n => this._roundNumber(Number(n)));
    }

    _getMatchingPreset() {
        const [x1, y1, x2, y2] = this.coordinates;

        if (Math.abs(x1 - y1) <= 0.001 && Math.abs(x2 - y2) <= 0.001) {
            return 'linear';
        }

        for (const [name, values] of Object.entries(this.presets)) {
            if (name === 'linear') continue;
            if (values.every((v, i) => Math.abs(v - this.coordinates[i]) <= 0.001)) {
                return name;
            }
        }
        return null;
    }

    _emitChange() {
        const css = `cubic-bezier(${this.coordinates.join(',')})`;
        const preview = this.getPreview();
        const html = this.getHTML();

        if (this._elements.output) {
            this._elements.output.textContent = html;
        }
        if (this.onChange) {
            try {
                this.onChange({
                    coords: this.getResult(),
                    css,
                    preview,
                    html
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

    _updateHandles() {
        const [x1, y1, x2, y2] = this.coordinates;
        const [cx1, cy1] = this._bc.bezierToCanvas(x1, y1);
        const [cx2, cy2] = this._bc.bezierToCanvas(x2, y2);

        this._elements.handle1.style.left = Math.round(cx1) + 'px';
        this._elements.handle1.style.top = Math.round(cy1) + 'px';
        this._elements.handle2.style.left = Math.round(cx2) + 'px';
        this._elements.handle2.style.top = Math.round(cy2) + 'px';
    }

    _redraw() {
        this._bc.plot();
        this._emitChange();
    }

    _makeDraggable(handle, index) {
        const onMouseDown = (e) => {
            e.preventDefault();
            const move = (ev) => {
                const rect = this._elements.canvas.getBoundingClientRect();
                const px = Math.round(ev.clientX - rect.left);
                const py = Math.round(ev.clientY - rect.top);
                this._applyPointerToCoord(px, py, index);
            };
            const up = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        };
        handle.addEventListener('mousedown', onMouseDown);
        this._listeners.push({
            target: handle,
            type: 'mousedown',
            fn: onMouseDown
        });
    }

    _addTouchSupport(handle, index) {
        const onTouchStart = (e) => {
            e.preventDefault();
            const move = (ev) => {
                const touch = ev.touches[0];
                if (!touch) return;
                const rect = this._elements.canvas.getBoundingClientRect();
                const px = Math.round(touch.clientX - rect.left);
                const py = Math.round(touch.clientY - rect.top);
                this._applyPointerToCoord(px, py, index);
            };
            const end = () => {
                document.removeEventListener('touchmove', move);
                document.removeEventListener('touchend', end);
                document.removeEventListener('touchcancel', end);
            };
            document.addEventListener('touchmove', move, {
                passive: false
            });
            document.addEventListener('touchend', end);
            document.addEventListener('touchcancel', end);
        };
        handle.addEventListener('touchstart', onTouchStart, {
            passive: false
        });
        this._listeners.push({
            target: handle,
            type: 'touchstart',
            fn: onTouchStart
        });
    }

    _applyPointerToCoord(px, py, index) {
        const [bx, by] = this._bc.canvasToBezier(px, py);
        const cx = Math.max(0, Math.min(1, bx));
        const cy = Math.max(0, Math.min(1, by));

        this.coordinates[index * 2] = this._roundNumber(cx);
        this.coordinates[index * 2 + 1] = this._roundNumber(cy);

        this._updateHandles();
        this._redraw();
    }
}



/**
 * ------------------------------------------------------------------------------
 * Input Registery
 * 
 * Those were for Input format
 * Also can contorl the system to use this registery and don't need to update for too long
 * Last Update: 1.0.0
 * ------------------------------------------------------------------------------
 * 
 * one note: 
 * {Width/Height} when is along, {Height/Width} when is across
 * 
 * All query need include:
 * name, label, mode, visibleIf and optional choice.
 * visibleIf is mean when name visibleIf.name match any of the node in string (wither string or array), otherwise, visibleIf.otherwise will use that value
 * ------------------------------------------------------------------------------
 */


// Input Registery
export const flexEngineDefaultVariables = {
    /*
    Let system pass out first.
    */
    interactiveTextBox: {
        interactiveTextBox: {
            system: true
        }
    },

    interactiveElements: {
        interactiveElements: {
            system: true
        }
    },

    integer: {
        // remember: same name will be collapse to same name, EG: integer/integer = integer.
        integer: {
            strutureSample: 0,
            // this is a Sample to prectice, you can put anything you want. that is default.

            displayType: "small",
            // small: just a field
            // medium: take one line (still 100%)
            // large: take a big space for that question (Custom height)
            // extraLarge: take the expend option
            // extraExtraLarge: expend option with full screen notice 
            // custom: follow the space of how it taken
            // popup: prepare for the popup of the system
            // popupMedium: same to that, but it display preview.
            // popupMediumWithInteractive
            // interactive: it completely work differently!
            // picker: Just like how things pick

            cssStyles: {},

            component: class {
                // Constructor: pass dataArray & entryElement, data is that piece, and entryElement is what the field is, different depending on time
                constructor(dataArray, entryElement, elementSetting) { 
                    this.dataArray = dataArray; // regieter it
                    this.entryElement = entryElement; // remember it!

                    const input = document.createElement('input');

                    input.type = 'number';
                    input.step = '1';
                    input.style.height = '100%';
                    input.style.width = '100%';

                    input.addEventListener('keydown', (event) => {
                    if (event.key === '.' || event.key === ',' ) {
                        event.preventDefault();
                    }
                    });

                    input.addEventListener('input', (event) => {
                        event.target.value = event.target.value.replace(/[^0-9-]/g, '');

                        this.dataArray = Number(input.value);
                    });       
                    
                    input.value = this.dataArray;

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(input);
                }

                initResult() {
                    return { code: 0 };
                    // 0: everything OK!
                    // 1: No, happend the error.
                    // another JSON array: change my layout type please.
                    // another Function: OK, this is an aynsc function, tell system run it after
                }

                onSave(){
                    return this.dataArray;
                }
            },

            render: function(dataArray, elementSetting, elementSetting) {
                return dataArray; // Good, since it is just Number.
            }
        },

        noNeg: {
            strutureSample: 0,

            displayType: "small",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = dataArray;
                    this.entryElement = entryElement;

                    const input = document.createElement('input');

                    input.type = 'number';
                    input.step = '1';
                    input.style.height = '100%';
                    input.style.width = '100%';

                    // Prevent typing "-" or any non-digit
                    input.addEventListener('keydown', (event) => {
                        if (event.key === '.' || event.key === ',' || event.key === '-') {
                            event.preventDefault();
                        }
                    });

                    input.addEventListener('input', (event) => {
                        // Remove anything not a digit
                        event.target.value = event.target.value.replace(/[^0-9-]/g, '');
                        if (Number(input.value) < 0) {
                            input.value = Number(input.value) * -1;
                        } 

                        // Convert to number
                        this.dataArray = Number(input.value);
                    });

                    input.value = this.dataArray;

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(input);
                    
                    return { code: 0};
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray, elementSetting) {
                return dataArray;
            }
        },

        slide: {
            strutureSample: 0,
            displayType: "large",

            cssStyles: [{
                object: ".slide-numbers-container",
                info: [
                    { key: "height", value: "60px" },
                    { key: "max-height", value: "60px" },
                    { key: "width", value: "100%" },
                    { key: "display", value: "flex" },
                    { key: "align-items", value: "center" },
                    { key: "justify-content", value: "flex-end" },
                    { key: "gap", value: "10px" },
                    { key: "padding", value: "0 12px" },
                    { key: "box-sizing", value: "border-box" },
                    { key: "overflow", value: "hidden" },
                    { key: "background", value: "#ffffff" },
                    { key: "border", value: "1px solid #d2d2d7" },
                    { key: "border-radius", value: "8px" }
                ]
            }, {
                object: ".slide-numbers-slider-wrap",
                info: [
                    { key: "position", value: "relative" },
                    { key: "flex", value: "1" },
                    { key: "height", value: "100%" },
                    { key: "display", value: "flex" },
                    { key: "align-items", value: "center" }
                ]
            }, {
                object: ".slide-numbers-ticks-bg",
                info: [
                    { key: "position", value: "absolute" },
                    { key: "width", value: "100%" },
                    { key: "height", value: "4px" },
                    { key: "display", value: "flex" },
                    { key: "gap", value: "3px" },
                    { key: "pointer-events", value: "none" },
                    { key: "z-index", value: "1" }
                ]
            }, {
                object: ".slide-numbers-tick-seg",
                info: [
                    { key: "flex", value: "1" },
                    { key: "height", value: "100%" },
                    { key: "background", value: "#e5e7eb" },
                    { key: "border-radius", value: "2px" }
                ]
            }, {
                object: ".slide-numbers-tick-seg.active",
                info: [
                    { key: "background", value: "#2563eb" }
                ]
            }, {
                object: ".slide-numbers-range-input",
                info: [
                    { key: "-webkit-appearance", value: "none" },
                    { key: "appearance", value: "none" },
                    { key: "width", value: "100%" },
                    { key: "height", value: "4px" },
                    { key: "background", value: "#e5e7eb" },
                    { key: "border-radius", value: "2px" },
                    { key: "outline", value: "none" },
                    { key: "cursor", value: "pointer" },
                    { key: "position", value: "relative" },
                    { key: "z-index", value: "2" },
                    { key: "margin", value: "0" }
                ]
            }, {
                object: ".slide-numbers-slider-tooltip",
                info: [
                    { key: "position", value: "absolute" },
                    { key: "bottom", value: "4px" },
                    { key: "transform", value: "translateX(-50%)" },
                    { key: "background", value: "#262626" },
                    { key: "color", value: "#ffffff" },
                    { key: "font-size", value: "11px" },
                    { key: "font-weight", value: "600" },
                    { key: "padding", value: "2px 6px" },
                    { key: "border-radius", value: "4px" },
                    { key: "white-space", value: "nowrap" },
                    { key: "pointer-events", value: "none" },
                    { key: "z-index", value: "10" }
                ]
            }],

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = Number(dataArray) || 0;
                    this.entryElement = entryElement;

                    this.min = Number(elementSetting.min);
                    this.max = Number(elementSetting.max);
                    this.gap = Number(elementSetting.gap);
                    this.nameList = Array.isArray(elementSetting.name) ? elementSetting.name : [];

                    this.steps = [];
                    let current = this.min;

                    while (current < this.max) {
                        this.steps.push(current);
                        current += this.gap;
                    }
                    this.steps.push(this.max);

                    const container = document.createElement("div");
                    container.className = "slide-numbers-container";

                    const sliderWrap = document.createElement("div");
                    sliderWrap.className = "slide-numbers-slider-wrap";

                    const ticksBg = document.createElement("div");
                    ticksBg.className = "slide-numbers-ticks-bg";

                    for (let i = 0; i < this.steps.length; i++) {
                        const seg = document.createElement("div");
                        seg.className = "slide-numbers-tick-seg";
                        ticksBg.appendChild(seg);
                    }

                    const slider = document.createElement("input");
                    slider.type = "range";
                    slider.className = "slide-numbers-range-input";
                    slider.min = 0;
                    slider.max = this.steps.length - 1;
                    slider.step = 1;

                    const tooltip = document.createElement("div");
                    tooltip.className = "slide-numbers-slider-tooltip";

                    sliderWrap.appendChild(ticksBg);
                    sliderWrap.appendChild(slider);
                    sliderWrap.appendChild(tooltip);

                    container.appendChild(sliderWrap);

                    const updateTicks = (idx) => {
                        const segs = ticksBg.querySelectorAll(".slide-numbers-tick-seg");
                        segs.forEach((seg, i) => {
                            if (i <= idx) seg.classList.add("active");
                            else seg.classList.remove("active");
                        });
                    };

                    const findLabel = (value) => {
                        const found = this.nameList.find(n => Number(n.value) === Number(value));
                        return found ? found.label : value;
                    };

                    const updateTooltip = (idx) => {
                        const value = this.steps[idx];
                        tooltip.textContent = findLabel(value);
                        const pct = idx / (this.steps.length - 1);
                        tooltip.style.left = `calc(${pct * 100}% - ${(pct - 0.5) * 16}px)`;
                    };

                    slider.addEventListener("input", (e) => {
                        const idx = Number(e.target.value);
                        const value = this.steps[idx];

                        this.dataArray = value;

                        updateTicks(idx);
                        updateTooltip(idx);
                    });

                    const initialIndex = this.steps.indexOf(this.dataArray);
                    slider.value = initialIndex === -1 ? 0 : initialIndex;

                    updateTicks(slider.value);
                    updateTooltip(slider.value);

                    entryElement.innerHTML = "";
                    entryElement.appendChild(container);
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return Number(dataArray);
            }
        },

        segment: {
            strutureSample: 0,
            displayType: "large",

            cssStyles: [
                {
                    object: ".slide-numbers-container",
                    info: [
                        { key: "height", value: "60px" },
                        { key: "max-height", value: "60px" },
                        { key: "width", value: "100%" },
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "justify-content", value: "flex-end" },
                        { key: "gap", value: "10px" },
                        { key: "padding", value: "0 12px" },
                        { key: "box-sizing", value: "border-box" },
                        { key: "overflow", value: "hidden" },
                        { key: "background", value: "#ffffff" },
                        { key: "border", value: "1px solid #d2d2d7" },
                        { key: "border-radius", value: "8px" }
                    ]
                },
                {
                    object: ".slide-numbers-slider-wrap",
                    info: [
                        { key: "position", value: "relative" },
                        { key: "flex", value: "1" },
                        { key: "height", value: "100%" },
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" }
                    ]
                },
                {
                    object: ".slide-numbers-ticks-bg",
                    info: [
                        { key: "position", value: "absolute" },
                        { key: "top", value: "50%" },
                        { key: "transform", value: "translateY(-50%)" },
                        { key: "width", value: "100%" },
                        { key: "height", value: "4px" },
                        { key: "display", value: "flex" },
                        { key: "gap", value: "3px" },
                        { key: "pointer-events", value: "none" },
                        { key: "z-index", value: "1" }
                    ]
                },
                {
                    object: ".slide-numbers-tick-seg",
                    info: [
                        { key: "flex", value: "1" },
                        { key: "height", value: "100%" },
                        { key: "background", value: "#e5e7eb" },
                        { key: "border-radius", value: "2px" }
                    ]
                },
                {
                    object: ".slide-numbers-tick-seg.active",
                    info: [
                        { key: "background", value: "#2563eb" }
                    ]
                },
                {
                    object: ".slide-numbers-range-input",
                    info: [
                        { key: "-webkit-appearance", value: "none" },
                        { key: "appearance", value: "none" },
                        { key: "width", value: "100%" },
                        { key: "height", value: "4px" },
                        { key: "background", value: "transparent" },
                        { key: "border-radius", value: "2px" },
                        { key: "outline", value: "none" },
                        { key: "cursor", value: "pointer" },
                        { key: "position", value: "relative" },
                        { key: "z-index", value: "2" },
                        { key: "margin", value: "0" }
                    ]
                },
                {
                    object: ".slide-numbers-slider-tooltip",
                    info: [
                        { key: "position", value: "absolute" },
                        { key: "bottom", value: "4px" },
                        { key: "transform", value: "translateX(-50%)" },
                        { key: "background", value: "#262626" },
                        { key: "color", value: "#ffffff" },
                        { key: "font-size", value: "11px" },
                        { key: "font-weight", value: "600" },
                        { key: "padding", value: "2px 6px" },
                        { key: "border-radius", value: "4px" },
                        { key: "white-space", value: "nowrap" },
                        { key: "pointer-events", value: "none" },
                        { key: "z-index", value: "10" }
                    ]
                }
            ],


            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = Number(dataArray) || 0;
                    this.entryElement = entryElement;

                    this.min = Number(elementSetting.min);
                    this.max = Number(elementSetting.max);
                    this.gap = Number(elementSetting.gap);
                    this.nameList = Array.isArray(elementSetting.name) ? elementSetting.name : [];

                    this.steps = [];
                    let current = this.min;

                    while (current < this.max) {
                        this.steps.push(current);
                        current += this.gap;
                    }
                    this.steps.push(this.max);

                    const container = document.createElement("div");
                    container.className = "slide-numbers-container";

                    const sliderWrap = document.createElement("div");
                    sliderWrap.className = "slide-numbers-slider-wrap";

                    const ticksBg = document.createElement("div");
                    ticksBg.className = "slide-numbers-ticks-bg";

                    for (let i = 0; i < this.steps.length - 1; i++) {
                        const seg = document.createElement("div");
                        seg.className = "slide-numbers-tick-seg";
                        ticksBg.appendChild(seg);
                    }

                    const slider = document.createElement("input");
                    slider.type = "range";
                    slider.className = "slide-numbers-range-input";
                    slider.min = 0;
                    slider.max = this.steps.length - 1;
                    slider.step = 1;

                    const tooltip = document.createElement("div");
                    tooltip.className = "slide-numbers-slider-tooltip";

                    sliderWrap.appendChild(ticksBg);
                    sliderWrap.appendChild(slider);
                    sliderWrap.appendChild(tooltip);

                    container.appendChild(sliderWrap);

                    const updateTicks = (idx) => {
                        const segs = ticksBg.querySelectorAll(".slide-numbers-tick-seg");
                        segs.forEach((seg, i) => {
                            if (i < idx) seg.classList.add("active");
                            else seg.classList.remove("active");
                        });
                    };

                    const findLabel = (value) => {
                        const found = this.nameList.find(n => Number(n.value) === Number(value));
                        return found ? found.label : value;
                    };

                    const updateTooltip = (idx) => {
                        const value = this.steps[idx];
                        tooltip.textContent = findLabel(value);

                        const pct = idx / (this.steps.length - 1);
                        tooltip.style.left = `calc(${pct * 100}% - ${(pct - 0.5) * 16}px)`;
                    };

                    slider.addEventListener("input", (e) => {
                        const idx = Number(e.target.value);
                        const value = this.steps[idx];

                        this.dataArray = value;

                        updateTicks(idx);
                        updateTooltip(idx);
                    });

                    const initialIndex = this.steps.indexOf(this.dataArray);
                    slider.value = initialIndex === -1 ? 0 : initialIndex;

                    updateTicks(slider.value);
                    updateTooltip(slider.value);

                    entryElement.innerHTML = "";
                    entryElement.appendChild(container);
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return Number(dataArray);
            }
        }
    },

    boolean: {
        checkmark: {
            strutureSample: true,

            displayType: "small",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = Boolean(dataArray);
                    this.entryElement = entryElement;

                    const box = document.createElement('input');
                    box.type = 'checkbox';

                    // 1:1 ratio, full height
                    box.style.height = '100%';
                    box.style.aspectRatio = '1 / 1';
                    box.style.width = 'auto';

                    // Set initial state
                    box.checked = this.dataArray;

                    // Live update
                    box.addEventListener('input', () => {
                        this.dataArray = box.checked;
                    });

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(box);
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return Boolean(dataArray);
            }         
        }
    },

    string: {
        text: {
            strutureSample: "Love the Lord your God with all your heart and with all your soul and with all your mind",

            displayType: "medium",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = String(dataArray);
                    this.entryElement = entryElement;

                    const input = document.createElement('input');
                    input.type = 'text';

                    // full size
                    input.style.width = '100%';
                    input.style.height = '100%';

                    // initial value
                    input.value = this.dataArray;

                    // live update
                    input.addEventListener('input', () => {
                        this.dataArray = input.value;
                    });

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(input);
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray, elementSetting) {
                return String(dataArray);
            }
        },

        url: {
            strutureSample: "https://www.raysite.app",

            displayType: "medium",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = String(dataArray);
                    this.entryElement = entryElement;

                    const input = document.createElement('input');
                    input.type = 'url';

                    // full size
                    input.style.width = '100%';
                    input.style.height = '100%';

                    // initial value
                    input.value = this.dataArray;

                    // live update
                    input.addEventListener('input', () => {
                        this.dataArray = input.value;
                    });

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(input);
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray, elementSetting) {
                return String(dataArray);
            }
        },

        textbox: {
            strutureSample: "",

            displayType: "large",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = String(dataArray || "");
                    this.entryElement = entryElement;

                    // Create textarea
                    this.textarea = document.createElement('textarea');
                    this.textarea.style.width = "100%";
                    this.textarea.style.height = "300px";
                    this.textarea.value = this.dataArray;

                    // Live update
                    this.textarea.addEventListener('input', () => {
                        this.dataArray = this.textarea.value;
                    });

                    // Mount
                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(this.textarea);
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return String(dataArray);
            }
        }
    },

    selection: {
        selection: {
            strutureSample: 0,

            displayType: "small",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    // If null → use default
                    const defaultValue = Number(elementSetting.default);
                    this.dataArray = (dataArray === null || dataArray === undefined)
                        ? defaultValue
                        : Number(dataArray);

                    this.entryElement = entryElement;

                    // Create <select>
                    const select = document.createElement('select');
                    select.style.width = "100%";
                    select.style.height = "100%";

                    // Build options
                    if (Array.isArray(elementSetting.choice)) {
                        elementSetting.choice.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = Number(opt.value);   // ALWAYS number
                            option.textContent = opt.label;
                            select.appendChild(option);
                        });
                    }

                    // Set initial value (default or existing)
                    select.value = this.dataArray;

                    // Live update
                    select.addEventListener('input', () => {
                        this.dataArray = Number(select.value);
                    });

                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(select);
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return Number(dataArray);
            }
        },

        popup: {
            strutureSample: [],

            displayType: "popupMedium",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    // entryElement = [previewElement, popupElement]
                    this.previewElement = entryElement[0];
                    this.popupElement = entryElement[1];
                    this.elementSetting = elementSetting;

                    // If null → use default
                    this.dataArray = Array.isArray(dataArray)
                        ? dataArray
                        : (elementSetting.default || []);

                    // -----------------------------
                    // PREVIEW AREA
                    // -----------------------------
                    this.previewText = document.createElement('p');
                    this.updatePreview();

                    this.previewElement.innerHTML = "";
                    this.previewElement.appendChild(this.previewText);

                    // -----------------------------
                    // POPUP AREA
                    // -----------------------------
                    this.popupElement.innerHTML = "";

                    elementSetting.catergory.forEach(cat => {
                        // Category title
                        const title = document.createElement('h3');
                        title.textContent = cat.label;
                        this.popupElement.appendChild(title);

                        // Choices list
                        cat.choice.forEach(opt => {
                            const label = document.createElement('label');
                            label.setAttribute('data-value', opt.name);

                            const checkbox = document.createElement('input');
                            checkbox.type = "checkbox";
                            checkbox.value = opt.name;
                            checkbox.checked = this.dataArray.includes(opt.name);

                            label.appendChild(checkbox);
                            label.appendChild(document.createTextNode(opt.label));

                            this.popupElement.appendChild(label);
                        });
                    });
                }

                initResult() {
                    return { code: 0 };
                }                

                // -----------------------------
                // PREVIEW UPDATE METHOD
                // -----------------------------
                updatePreview() {
                    this.previewText.textContent = this.dataArray.join(", ");
                }

                // -----------------------------
                // POPUP CLOSE CALLBACK (NOW A METHOD)
                // -----------------------------
                onPopupClose() {
                    const selected = [];

                    const inputs = this.popupElement.querySelectorAll('input[type="checkbox"]');
                    inputs.forEach(cb => {
                        if (cb.checked) selected.push(cb.value);
                    });

                    this.dataArray = selected;
                    this.updatePreview();
                }

                // -----------------------------
                // SAVE
                // -----------------------------
                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                return Array.isArray(dataArray) ? dataArray : [];
            }
        }
    },

    media: {
		img: {
		    strutureSample: { mode: "internal", folder: "img", name: "" },

		    displayType: "popup",

		    cssStyles: [
		        {
		            object: ".media-img-preview",
		            info: [
		                { key: "width", value: "100%" },
		                { key: "height", value: "100%" },
		                { key: "object-fit", value: "cover" },
		                { key: "object-position", value: "center" },
		                { key: "display", value: "block" },
		                { key: "user-select", value: "none" }
		            ]
		        },
		        {
		            object: ".media-img-row",
		            info: [
		                { key: "display", value: "flex" },
		                { key: "align-items", value: "center" },
		                { key: "gap", value: "12px" },
		                { key: "height", value: "60px" },
		                { key: "padding", value: "6px 8px" },
		                { key: "border-bottom", value: "1px solid #eee" },
		                { key: "cursor", value: "pointer" },
		                { key: "user-select", value: "none" }
		            ]
		        },
		        {
		            object: ".media-img-thumb",
		            info: [
		                { key: "width", value: "100px" },
		                { key: "height", value: "60px" },
		                { key: "object-fit", value: "cover" },
		                { key: "object-position", value: "center" },
		                { key: "display", value: "block" },
		                { key: "user-select", value: "none" }
		            ]
		        },
		        {
		            object: ".media-img-title",
		            info: [
		                { key: "flex", value: "1" },
		                { key: "overflow", value: "hidden" },
		                { key: "text-overflow", value: "ellipsis" },
		                { key: "white-space", value: "nowrap" }
		            ]
		        },
		        {
		            object: ".media-img-overlay",
		            info: [
		                { key: "position", value: "absolute" },
		                { key: "top", value: "0" },
		                { key: "left", value: "0" },
		                { key: "width", value: "100%" },
		                { key: "height", value: "100%" },
		                { key: "background", value: "rgba(0,0,0,0.85)" },
		                { key: "display", value: "flex" },
		                { key: "align-items", value: "center" },
		                { key: "justify-content", value: "center" },
		                { key: "z-index", value: "9999" }
		            ]
		        },
		        {
		            object: ".media-img-overlay img",
		            info: [
		                { key: "max-width", value: "95%" },
		                { key: "max-height", value: "95%" },
		                { key: "object-fit", value: "contain" }
		            ]
		        }
		    ],

		    component: class {
		        constructor(dataArray, entryElement, elementSetting) {
		            this.previewElement = entryElement[0];
		            this.popupElement = entryElement[1];
		            this.elementSetting = elementSetting;

		            this.dataArray = dataArray || { mode: "internal", folder: "img", name: "" };
		            this._activeTab = this.dataArray.mode === "external" ? "external" : "internal";

		            this._selected =
		                this.dataArray.mode === "internal"
		                    ? { mode: "internal", folder: "img", name: this.dataArray.name }
		                    : (this.dataArray.mode === "external"
		                        ? { mode: "external", url: this.dataArray.url }
		                        : null);

		            this._objectUrls = new Set();

		            this.previewText = document.createElement("div");
		            this.previewText.className = "media-img-preview";
		            this.updatePreview();

		            this.previewElement.innerHTML = "";
		            this.previewElement.appendChild(this.previewText);
		        }

                initResult() {
		            // RETURN ASYNC POPUP INITIALIZER
		            return async () => {
		                this.popupElement.innerHTML = "";
                
		                if (window.getComputedStyle(this.popupElement).position === "static") {
		                    this.popupElement.style.position = "relative";
		                }

		                let tabBar = document.createElement("div");
		                let tabInternal = document.createElement("button");
		                tabInternal.textContent = "Internal";
		                let tabExternal = document.createElement("button");
		                tabExternal.textContent = "External";
		                let tabUpload = document.createElement("button");
		                tabUpload.textContent = "Upload";

		                tabBar.appendChild(tabInternal);
		                tabBar.appendChild(tabExternal);
		                tabBar.appendChild(tabUpload);

		                let internalContainer = document.createElement("div");
		                internalContainer.style.maxHeight = "320px";
		                internalContainer.style.overflowY = "auto";

		                let externalContainer = document.createElement("div");
		                let externalInput = document.createElement("input");
		                externalInput.type = "url";
		                externalInput.style.width = "100%";
		                externalInput.value =
		                    this.dataArray.mode === "external" ? (this.dataArray.url || "") : "";
		                externalContainer.appendChild(externalInput);

		                // UPLOAD TAB UI
		                let uploadContainer = document.createElement("div");
		                uploadContainer.style.padding = "10px";

		                let fileInput = document.createElement("input");
		                fileInput.type = "file";
		                fileInput.accept = "image/*";
		                fileInput.style.marginBottom = "10px";
		                fileInput.style.display = "block";

		                let nameInput = document.createElement("input");
		                nameInput.type = "text";
		                nameInput.placeholder = "(optional) Name of this asset";
		                nameInput.style.width = "100%";
		                nameInput.style.padding = "6px";

		                uploadContainer.appendChild(fileInput);
		                uploadContainer.appendChild(nameInput);

		                this.popupElement.appendChild(tabBar);
		                this.popupElement.appendChild(internalContainer);
		                this.popupElement.appendChild(externalContainer);
		                this.popupElement.appendChild(uploadContainer);

		                let overlay = document.createElement("div");
		                overlay.className = "media-img-overlay";
		                overlay.style.display = "none";
		                let overlayImg = document.createElement("img");
		                overlay.appendChild(overlayImg);
		                this.popupElement.appendChild(overlay);

		                const closeOverlay = () => {
		                    overlay.style.display = "none";
		                    overlayImg.src = "";
		                };
		                overlay.onclick = closeOverlay;
		                overlayImg.onclick = (e) => { e.stopPropagation(); closeOverlay(); };

		                let showInternal = () => {
		                    this._activeTab = "internal";
		                    internalContainer.style.display = "block";
		                    externalContainer.style.display = "none";
		                    uploadContainer.style.display = "none";
		                };
		                let showExternal = () => {
		                    this._activeTab = "external";
		                    internalContainer.style.display = "none";
		                    externalContainer.style.display = "block";
		                    uploadContainer.style.display = "none";
		                };
		                let showUpload = () => {
		                    this._activeTab = "upload";
		                    internalContainer.style.display = "none";
		                    externalContainer.style.display = "none";
		                    uploadContainer.style.display = "block";
		                };

		                if (this.dataArray.mode === "external") showExternal();
		                else showInternal();

		                tabInternal.onclick = showInternal;
		                tabExternal.onclick = showExternal;
		                tabUpload.onclick = showUpload;

		                let assets = await flexEngineFileSystem.listAssets("img");

		                const processAssetChunk = async (items, index = 0) => {
		                    const chunkSize = 5;
		                    const limit = Math.min(index + chunkSize, items.length);

		                    for (let i = index; i < limit; i++) {
		                        let file = items[i];

		                        let row = document.createElement("div");
		                        row.className = "media-img-row";
		                        row.dataset.assetName = file.name;

		                        let thumb = document.createElement("img");
		                        thumb.className = "media-img-thumb";

		                        let title = document.createElement("div");
		                        title.className = "media-img-title";
		                        title.textContent = file.name;

		                        let selectRow = () => {
		                            this._selected = { mode: "internal", folder: "img", name: row.dataset.assetName };
		                            let siblings = internalContainer.querySelectorAll(".media-img-row");
		                            siblings.forEach(s => s.style.background = "");
		                            row.style.background = "rgba(0,120,215,0.08)";
		                        };

		                        row.onclick = () => selectRow();
		                        title.onclick = (e) => { e.stopPropagation(); selectRow(); };

		                        try {
		                            let blob = await flexEngineFileSystem.readAsset("/img/" + file.name);
		                            let url = URL.createObjectURL(blob);
		                            thumb.src = url;
		                            thumb.dataset.objectUrl = url;
		                            this._objectUrls.add(url);
		                        } catch (e) {
		                            thumb.src = "https://raystudio.net/404img.png";
		                        }

		                        thumb.onclick = (e) => {
		                            e.stopPropagation();
		                            selectRow();
		                            if (thumb.dataset.objectUrl || thumb.src) {
		                                overlayImg.src = thumb.dataset.objectUrl || thumb.src;
		                                overlay.style.display = "flex";
		                            }
		                        };

		                        row.appendChild(thumb);
		                        row.appendChild(title);
		                        internalContainer.appendChild(row);
		                    }

		                    if (limit < items.length) {
		                        setTimeout(() => processAssetChunk(items, limit), 20);
		                    }
		                };

		                if (assets && assets.length > 0) {
		                    await processAssetChunk(assets);
		                }

		                externalInput.addEventListener("input", () => {
		                    let v = externalInput.value.trim();
		                    if (v && this._activeTab === "external") {
		                        this._selected = { mode: "external", url: v };
		                    }
		                });

		                this._popupExternalInput = externalInput;
		                this._popupFileInput = fileInput;
		                this._popupNameInput = nameInput;
		            };
                }

		        updatePreview() {
		            if (this.dataArray.mode === "internal") {
		                this.previewText.textContent = this.dataArray.name || "(no image)";
		            } else if (this.dataArray.mode === "external") {
		                this.previewText.textContent = this.dataArray.url || "(no external URL)";
		            } else {
		                this.previewText.textContent = "(no image)";
		            }
		        }

		        async onPopupClose() {
		            if (this._activeTab === "external" && this._popupExternalInput && this._popupExternalInput.value.trim() !== "") {
		                this.dataArray = {
		                    mode: "external",
		                    url: this._popupExternalInput.value.trim()
		                };
		            } else if (this._activeTab === "upload" && this._popupFileInput && this._popupFileInput.files.length > 0) {
		                let file = this._popupFileInput.files[0];
		                let customName = this._popupNameInput ? this._popupNameInput.value.trim() : "";
                
		                let ext = "";
		                let baseName = file.name;
		                const dotIndex = file.name.lastIndexOf(".");
		                if (dotIndex !== -1) {
		                    baseName = file.name.substring(0, dotIndex);
		                    ext = file.name.substring(dotIndex);
		                }

		                if (customName !== "") {
		                    baseName = customName;
		                }

		                let finalName = baseName + ext;

		                try {
		                    let assets = await flexEngineFileSystem.listAssets("img");
		                    let existingNames = new Set(assets ? assets.map(a => a.name) : []);

		                    let counter = 1;
		                    while (existingNames.has(finalName)) {
		                        finalName = `${baseName} (${counter})${ext}`;
		                        counter++;
		                    }

		                    let resCode = await flexEngineFileSystem.updateAsset("img", finalName, file);

		                    if (resCode === 0 || resCode === 2) {
		                        this.dataArray = {
		                            mode: "internal",
		                            folder: "img",
		                            name: finalName
		                        };
		                    }
		                } catch (err) {
		                    console.error("Failed to upload image asset:", err);
		                }
		            } else if (this._selected) {
		                this.dataArray = this._selected;
		            }

		            this._objectUrls.forEach(u => URL.revokeObjectURL(u));
		            this._objectUrls.clear();

		            const dynamicOverlay = this.popupElement.querySelector(".media-img-overlay");
		            if (dynamicOverlay) {
		                dynamicOverlay.remove();
		            }

		            this.updatePreview();
		        }

		        onSave() {
		            return this.dataArray;
		        }
		    },

		    render: function(dataArray) {
		        if (!dataArray || !dataArray.mode)
		            return "https://raystudio.net/404img.png";

		        switch (dataArray.mode) {
		            case "internal":
		                let prefix = BUILDER_CONFIG.classPrefix;
		                return "/" + prefix + "assets/img/" + dataArray.name;

		            case "external":
		                return dataArray.url;

		            default:
		                return "https://raystudio.net/404img.png";
		        }
		    }
		},

        audio: {
            strutureSample: { mode: "internal", folder: "audio", name: "" },

            displayType: "popup",

            cssStyles: [
                {
                    object: ".media-audio-preview",
                    info: [
                        { key: "width", value: "100%" },
                        { key: "height", value: "100%" },
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "user-select", value: "none" }
                    ]
                },
                {
                    object: ".media-audio-row",
                    info: [
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "gap", value: "12px" },
                        { key: "height", value: "50px" },
                        { key: "padding", value: "6px 8px" },
                        { key: "border-bottom", value: "1px solid #eee" },
                        { key: "cursor", value: "pointer" },
                        { key: "user-select", value: "none" }
                    ]
                },
                {
                    object: ".media-audio-thumb-icon",
                    info: [
                        { key: "width", value: "48px" },
                        { key: "height", value: "48px" },
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "justify-content", value: "center" },
                        { key: "cursor", value: "pointer" }
                    ]
                },
                {
                    object: ".media-audio-title",
                    info: [
                        { key: "flex", value: "1" },
                        { key: "overflow", value: "hidden" },
                        { key: "text-overflow", value: "ellipsis" },
                        { key: "white-space", value: "nowrap" }
                    ]
                },
                {
                    object: ".media-audio-overlay",
                    info: [
                        { key: "position", value: "absolute" },
                        { key: "top", value: "0" },
                        { key: "left", value: "0" },
                        { key: "width", value: "100%" },
                        { key: "height", value: "100%" },
                        { key: "background", value: "rgba(0,0,0,0.85)" },
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "justify-content", value: "center" },
                        { key: "z-index", value: "9999" }
                    ]
                },
                {
                    object: ".media-audio-error",
                    info: [
                        { key: "color", value: "#ff4d4f" },
                        { key: "margin-top", value: "8px" },
                        { key: "font-size", value: "14px" }
                    ]
                }
            ],

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.previewElement = entryElement[0];
                    this.popupElement = entryElement[1];
                    this.elementSetting = elementSetting;

                    this.dataArray = dataArray || { mode: "internal", folder: "audio", name: "" };
                    this._activeTab = this.dataArray.mode === "external" ? "external" : "internal";

                    this._selected =
                        this.dataArray.mode === "internal"
                            ? { mode: "internal", folder: "audio", name: this.dataArray.name }
                            : (this.dataArray.mode === "external"
                                ? { mode: "external", url: this.dataArray.url }
                                : null);

                    this._objectUrls = new Set();
                    this._isFileValid = true;

                    this.previewText = document.createElement("div");
                    this.previewText.className = "media-audio-preview";
                    this.updatePreview();

                    this.previewElement.innerHTML = "";
                    this.previewElement.appendChild(this.previewText);
		        }

                initResult() {
                    // RETURN ASYNC POPUP INITIALIZER
                    return async () => {
                        this.popupElement.innerHTML = "";
                        
                        if (window.getComputedStyle(this.popupElement).position === "static") {
                            this.popupElement.style.position = "relative";
                        }

                        let tabBar = document.createElement("div");
                        let tabInternal = document.createElement("button");
                        tabInternal.textContent = "Internal";
                        let tabExternal = document.createElement("button");
                        tabExternal.textContent = "External";
                        let tabUpload = document.createElement("button");
                        tabUpload.textContent = "Upload";

                        tabBar.appendChild(tabInternal);
                        tabBar.appendChild(tabExternal);
                        tabBar.appendChild(tabUpload);

                        let internalContainer = document.createElement("div");
                        internalContainer.style.maxHeight = "320px";
                        internalContainer.style.overflowY = "auto";

                        let externalContainer = document.createElement("div");
                        let externalInput = document.createElement("input");
                        externalInput.type = "url";
                        externalInput.style.width = "100%";
                        externalInput.value =
                            this.dataArray.mode === "external" ? (this.dataArray.url || "") : "";
                        externalContainer.appendChild(externalInput);

                        // UPLOAD TAB UI
                        let uploadContainer = document.createElement("div");
                        uploadContainer.style.padding = "10px";

                        let fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.accept = "audio/*";
                        fileInput.style.marginBottom = "10px";
                        fileInput.style.display = "block";

                        let nameInput = document.createElement("input");
                        nameInput.type = "text";
                        nameInput.placeholder = "(optional) Name of this asset";
                        nameInput.style.width = "100%";
                        nameInput.style.padding = "6px";

                        let errorMsg = document.createElement("div");
                        errorMsg.className = "media-audio-error";

                        uploadContainer.appendChild(fileInput);
                        uploadContainer.appendChild(nameInput);
                        uploadContainer.appendChild(errorMsg);

                        this.popupElement.appendChild(tabBar);
                        this.popupElement.appendChild(internalContainer);
                        this.popupElement.appendChild(externalContainer);
                        this.popupElement.appendChild(uploadContainer);

                        // OVERLAY FOR AUDIO PREVIEW
                        let overlay = document.createElement("div");
                        overlay.className = "media-audio-overlay";
                        overlay.style.display = "none";
                        let overlayAudio = document.createElement("audio");
                        overlayAudio.controls = true;
                        overlay.appendChild(overlayAudio);
                        this.popupElement.appendChild(overlay);

                        const closeOverlay = () => {
                            overlay.style.display = "none";
                            overlayAudio.pause();
                            overlayAudio.src = "";
                        };
                        overlay.onclick = closeOverlay;
                        overlayAudio.onclick = (e) => { e.stopPropagation(); };

                        // DYNAMIC FILE SIZE CHECK ON CHANGE
                        fileInput.addEventListener("change", () => {
                            errorMsg.innerHTML = "";
                            if (fileInput.files.length > 0) {
                                let file = fileInput.files[0];
                                const maxBytes = 25 * 1024 * 1024; // 25 MB
                                if (file.size > maxBytes) {
                                    errorMsg.innerHTML = "<p>this File is Larger than 25 MB, RaySite rejected your file because it may broke the system</p>";
                                    this._isFileValid = false;
                                } else {
                                    this._isFileValid = true;
                                }
                            } else {
                                this._isFileValid = true;
                            }
                        });

                        let showInternal = () => {
                            this._activeTab = "internal";
                            internalContainer.style.display = "block";
                            externalContainer.style.display = "none";
                            uploadContainer.style.display = "none";
                        };
                        let showExternal = () => {
                            this._activeTab = "external";
                            internalContainer.style.display = "none";
                            externalContainer.style.display = "block";
                            uploadContainer.style.display = "none";
                        };
                        let showUpload = () => {
                            this._activeTab = "upload";
                            internalContainer.style.display = "none";
                            externalContainer.style.display = "none";
                            uploadContainer.style.display = "block";
                        };

                        if (this.dataArray.mode === "external") showExternal();
                        else showInternal();

                        tabInternal.onclick = showInternal;
                        tabExternal.onclick = showExternal;
                        tabUpload.onclick = showUpload;

                        let assets = await flexEngineFileSystem.listAssets("audio");

                        const processAssetChunk = async (items, index = 0) => {
                            const chunkSize = 5;
                            const limit = Math.min(index + chunkSize, items.length);

                            for (let i = index; i < limit; i++) {
                                let file = items[i];

                                let row = document.createElement("div");
                                row.className = "media-audio-row";
                                row.dataset.assetName = file.name;

                                // FIXED SVG AUDIO ICON
                                let iconContainer = document.createElement("div");
                                iconContainer.className = "media-audio-thumb-icon";
                                iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f"><path d="M427-192q41 0 70-28.31T526-290v-202h116v-60H486v187q-11-9-26.38-14-15.39-5-32.62-5-39.27 0-66.13 27.5Q334-329 334-289.5t26.87 68.5q26.86 29 66.13 29ZM220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h361l219 219v521q0 24-18 42t-42 18H220Zm331-554v-186H220v680h520v-494H551ZM220-820v186-186 680-680Z"/></svg>`;

                                let title = document.createElement("div");
                                title.className = "media-audio-title";
                                title.textContent = file.name;

                                let selectRow = () => {
                                    this._selected = { mode: "internal", folder: "audio", name: row.dataset.assetName };
                                    let siblings = internalContainer.querySelectorAll(".media-audio-row");
                                    siblings.forEach(s => s.style.background = "");
                                    row.style.background = "rgba(0,120,215,0.08)";
                                };

                                row.onclick = () => selectRow();
                                title.onclick = (e) => { e.stopPropagation(); selectRow(); };

                                // CLICK ICON TO PREVIEW AUDIO
                                iconContainer.onclick = async (e) => {
                                    e.stopPropagation();
                                    selectRow();
                                    try {
                                        let blob = await flexEngineFileSystem.readAsset("/audio/" + file.name);
                                        let url = URL.createObjectURL(blob);
                                        overlayAudio.src = url;
                                        this._objectUrls.add(url);
                                        overlay.style.display = "flex";
                                        overlayAudio.play();
                                    } catch (err) {
                                        console.error("Could not load audio for preview", err);
                                    }
                                };

                                row.appendChild(iconContainer);
                                row.appendChild(title);
                                internalContainer.appendChild(row);
                            }

                            if (limit < items.length) {
                                setTimeout(() => processAssetChunk(items, limit), 20);
                            }
                        };

                        if (assets && assets.length > 0) {
                            await processAssetChunk(assets);
                        }

                        externalInput.addEventListener("input", () => {
                            let v = externalInput.value.trim();
                            if (v && this._activeTab === "external") {
                                this._selected = { mode: "external", url: v };
                            }
                        });

                        this._popupExternalInput = externalInput;
                        this._popupFileInput = fileInput;
                        this._popupNameInput = nameInput;
                    };
                }

                updatePreview() {
                    if (this.dataArray.mode === "internal") {
                        this.previewText.textContent = this.dataArray.name || "";
                    } else if (this.dataArray.mode === "external") {
                        this.previewText.textContent = this.dataArray.url || "";
                    } else {
                        this.previewText.textContent = "";
                    }
                }

                async onPopupClose() {
                    if (this._activeTab === "external" && this._popupExternalInput && this._popupExternalInput.value.trim() !== "") {
                        this.dataArray = {
                            mode: "external",
                            url: this._popupExternalInput.value.trim()
                        };
                    } else if (this._activeTab === "upload" && this._popupFileInput && this._popupFileInput.files.length > 0) {
                        // CANCEL SAVE IF FILE EXCEEDS 25 MB
                        if (!this._isFileValid) {
                            return;
                        }

                        let file = this._popupFileInput.files[0];
                        let customName = this._popupNameInput ? this._popupNameInput.value.trim() : "";
                        
                        let ext = "";
                        let baseName = file.name;
                        const dotIndex = file.name.lastIndexOf(".");
                        if (dotIndex !== -1) {
                            baseName = file.name.substring(0, dotIndex);
                            ext = file.name.substring(dotIndex);
                        }

                        if (customName !== "") {
                            baseName = customName;
                        }

                        let finalName = baseName + ext;

                        try {
                            let assets = await flexEngineFileSystem.listAssets("audio");
                            let existingNames = new Set(assets ? assets.map(a => a.name) : []);

                            let counter = 1;
                            while (existingNames.has(finalName)) {
                                finalName = `${baseName} (${counter})${ext}`;
                                counter++;
                            }

                            let resCode = await flexEngineFileSystem.updateAsset("audio", finalName, file);

                            if (resCode === 0 || resCode === 2) {
                                this.dataArray = {
                                    mode: "internal",
                                    folder: "audio",
                                    name: finalName
                                };
                            }
                        } catch (err) {
                            console.error("Failed to upload audio asset:", err);
                        }
                    } else if (this._selected) {
                        this.dataArray = this._selected;
                    }

                    this._objectUrls.forEach(u => URL.revokeObjectURL(u));
                    this._objectUrls.clear();

                    const dynamicOverlay = this.popupElement.querySelector(".media-audio-overlay");
                    if (dynamicOverlay) {
                        dynamicOverlay.remove();
                    }

                    this.updatePreview();
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                if (!dataArray || !dataArray.mode)
                    return "";

                switch (dataArray.mode) {
                    case "internal":
                        let prefix = BUILDER_CONFIG.classPrefix;
                        return "/" + prefix + "assets/audio/" + dataArray.name;

                    case "external":
                        return dataArray.url || "";

                    default:
                        return "";
                }
            }
        },      
        
        video: {
            strutureSample: { mode: "internal", folder: "video", name: "" },

            displayType: "popup",

            cssStyles: [
                {
                    object: ".media-video-preview",
                    info: [
                        { key: "width", value: "100%" },
                        { key: "height", value: "100%" },
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "user-select", value: "none" }
                    ]
                },
                {
                    object: ".media-video-row",
                    info: [
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "gap", value: "12px" },
                        { key: "height", value: "60px" },
                        { key: "padding", value: "6px 8px" },
                        { key: "border-bottom", value: "1px solid #eee" },
                        { key: "cursor", value: "pointer" },
                        { key: "user-select", value: "none" }
                    ]
                },
                {
                    object: ".media-video-thumb-icon",
                    info: [
                        { key: "width", value: "48px" },
                        { key: "height", value: "48px" },
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "justify-content", value: "center" },
                        { key: "cursor", value: "pointer" },
                        { key: "overflow", value: "hidden" },
                        { key: "border-radius", value: "4px" },
                        { key: "background", value: "#f0f0f0" }
                    ]
                },
                {
                    object: ".media-video-title",
                    info: [
                        { key: "flex", value: "1" },
                        { key: "overflow", value: "hidden" },
                        { key: "text-overflow", value: "ellipsis" },
                        { key: "white-space", value: "nowrap" }
                    ]
                },
                {
                    object: ".media-video-overlay",
                    info: [
                        { key: "position", value: "absolute" },
                        { key: "top", value: "0" },
                        { key: "left", value: "0" },
                        { key: "width", value: "100%" },
                        { key: "height", value: "100%" },
                        { key: "background", value: "rgba(0,0,0,0.85)" },
                        { key: "display", value: "flex" },
                        { key: "align-items", value: "center" },
                        { key: "justify-content", value: "center" },
                        { key: "z-index", value: "9999" }
                    ]
                },
                {
                    object: ".media-video-error",
                    info: [
                        { key: "color", value: "#ff4d4f" },
                        { key: "margin-top", value: "8px" },
                        { key: "font-size", value: "14px" }
                    ]
                }
            ],

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.previewElement = entryElement[0];
                    this.popupElement = entryElement[1];
                    this.elementSetting = elementSetting;

                    this.dataArray = dataArray || { mode: "internal", folder: "video", name: "" };
                    this._activeTab = this.dataArray.mode === "external" ? "external" : "internal";

                    this._selected =
                        this.dataArray.mode === "internal"
                            ? { mode: "internal", folder: "video", name: this.dataArray.name }
                            : (this.dataArray.mode === "external"
                                ? { mode: "external", url: this.dataArray.url }
                                : null);

                    this._objectUrls = new Set();
                    this._isFileValid = true;

                    this.previewText = document.createElement("div");
                    this.previewText.className = "media-video-preview";
                    this.updatePreview();

                    this.previewElement.innerHTML = "";
                    this.previewElement.appendChild(this.previewText);
		        }

                initResult() {
                    // RETURN ASYNC POPUP INITIALIZER
                    return async () => {
                        this.popupElement.innerHTML = "";
                        
                        if (window.getComputedStyle(this.popupElement).position === "static") {
                            this.popupElement.style.position = "relative";
                        }

                        let tabBar = document.createElement("div");
                        let tabInternal = document.createElement("button");
                        tabInternal.textContent = "Internal";
                        let tabExternal = document.createElement("button");
                        tabExternal.textContent = "External";
                        let tabUpload = document.createElement("button");
                        tabUpload.textContent = "Upload";

                        tabBar.appendChild(tabInternal);
                        tabBar.appendChild(tabExternal);
                        tabBar.appendChild(tabUpload);

                        let internalContainer = document.createElement("div");
                        internalContainer.style.maxHeight = "320px";
                        internalContainer.style.overflowY = "auto";

                        let externalContainer = document.createElement("div");
                        let externalInput = document.createElement("input");
                        externalInput.type = "url";
                        externalInput.style.width = "100%";
                        externalInput.value =
                            this.dataArray.mode === "external" ? (this.dataArray.url || "") : "";
                        externalContainer.appendChild(externalInput);

                        // UPLOAD TAB UI
                        let uploadContainer = document.createElement("div");
                        uploadContainer.style.padding = "10px";

                        let fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.accept = "video/*";
                        fileInput.style.marginBottom = "10px";
                        fileInput.style.display = "block";

                        let nameInput = document.createElement("input");
                        nameInput.type = "text";
                        nameInput.placeholder = "(optional) Name of this asset";
                        nameInput.style.width = "100%";
                        nameInput.style.padding = "6px";

                        let errorMsg = document.createElement("div");
                        errorMsg.className = "media-video-error";

                        uploadContainer.appendChild(fileInput);
                        uploadContainer.appendChild(nameInput);
                        uploadContainer.appendChild(errorMsg);

                        this.popupElement.appendChild(tabBar);
                        this.popupElement.appendChild(internalContainer);
                        this.popupElement.appendChild(externalContainer);
                        this.popupElement.appendChild(uploadContainer);

                        // OVERLAY FOR VIDEO PREVIEW
                        let overlay = document.createElement("div");
                        overlay.className = "media-video-overlay";
                        overlay.style.display = "none";
                        let overlayVideo = document.createElement("video");
                        overlayVideo.controls = true;
                        overlayVideo.style.maxWidth = "90%";
                        overlayVideo.style.maxHeight = "90%";
                        overlay.appendChild(overlayVideo);
                        this.popupElement.appendChild(overlay);

                        const closeOverlay = () => {
                            overlay.style.display = "none";
                            overlayVideo.pause();
                            if (overlayVideo.src) {
                                URL.revokeObjectURL(overlayVideo.src);
                                this._objectUrls.delete(overlayVideo.src);
                                overlayVideo.src = "";
                            }
                        };
                        overlay.onclick = closeOverlay;
                        overlayVideo.onclick = (e) => { e.stopPropagation(); };

                        // DYNAMIC FILE SIZE CHECK ON CHANGE
                        fileInput.addEventListener("change", () => {
                            errorMsg.innerHTML = "";
                            if (fileInput.files.length > 0) {
                                let file = fileInput.files[0];
                                const maxBytes = 25 * 1024 * 1024; // 25 MB
                                if (file.size > maxBytes) {
                                    errorMsg.innerHTML = "<p>this File is Larger than 25 MB, RaySite rejected your file because it may broke the system</p>";
                                    this._isFileValid = false;
                                } else {
                                    this._isFileValid = true;
                                }
                            } else {
                                this._isFileValid = true;
                            }
                        });

                        let showInternal = () => {
                            this._activeTab = "internal";
                            internalContainer.style.display = "block";
                            externalContainer.style.display = "none";
                            uploadContainer.style.display = "none";
                        };
                        let showExternal = () => {
                            this._activeTab = "external";
                            internalContainer.style.display = "none";
                            externalContainer.style.display = "block";
                            uploadContainer.style.display = "none";
                        };
                        let showUpload = () => {
                            this._activeTab = "upload";
                            internalContainer.style.display = "none";
                            externalContainer.style.display = "none";
                            uploadContainer.style.display = "block";
                        };

                        if (this.dataArray.mode === "external") showExternal();
                        else showInternal();

                        tabInternal.onclick = showInternal;
                        tabExternal.onclick = showExternal;
                        tabUpload.onclick = showUpload;

                        let assets = await flexEngineFileSystem.listAssets("video");

                        // HELPER FUNCTION: EXTRACT 2.5s FRAME AS DATA URL
                        const captureFrame = (blob) => {
                            return new Promise((resolve) => {
                                let tempVideo = document.createElement("video");
                                tempVideo.preload = "metadata";
                                tempVideo.muted = true;
                                tempVideo.playsInline = true;
                                let url = URL.createObjectURL(blob);

                                tempVideo.onloadedmetadata = () => {
                                    let seekTime = 2.5;
                                    if (tempVideo.duration < 2.5) {
                                        seekTime = tempVideo.duration / 2;
                                    }
                                    tempVideo.currentTime = seekTime;
                                };

                                tempVideo.onseeked = () => {
                                    try {
                                        let canvas = document.createElement("canvas");
                                        canvas.width = tempVideo.videoWidth || 100;
                                        canvas.height = tempVideo.videoHeight || 100;
                                        let ctx = canvas.getContext("2d");
                                        ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
                                        let dataUrl = canvas.toDataURL("image/jpeg");
                                        URL.revokeObjectURL(url);
                                        resolve(dataUrl);
                                    } catch (e) {
                                        URL.revokeObjectURL(url);
                                        resolve(null);
                                    }
                                };

                                tempVideo.onerror = () => {
                                    URL.revokeObjectURL(url);
                                    resolve(null);
                                };

                                tempVideo.src = url;
                            });
                        };

                        const processAssetChunk = async (items, index = 0) => {
                            const chunkSize = 5;
                            const limit = Math.min(index + chunkSize, items.length);

                            for (let i = index; i < limit; i++) {
                                let file = items[i];

                                let row = document.createElement("div");
                                row.className = "media-video-row";
                                row.dataset.assetName = file.name;

                                let iconContainer = document.createElement("div");
                                iconContainer.className = "media-video-thumb-icon";
                                // DEFAULT SVG FALLBACK ICON
                                let defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f"><path d="M352-240h175q14 0 24.5-10.5T562-275v-55l80 46v-152l-80 46v-55q0-14-10.5-24.5T527-480H352q-14 0-24.5 10.5T317-445v170q0 14 10.5 24.5T352-240ZM220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h361l219 219v521q0 24-18 42t-42 18H220Zm331-554v-186H220v680h520v-494H551ZM220-820v186-186 680-680Z"/></svg>`;
                                iconContainer.innerHTML = defaultSVG;

                                let title = document.createElement("div");
                                title.className = "media-video-title";
                                title.textContent = file.name;

                                let selectRow = () => {
                                    this._selected = { mode: "internal", folder: "video", name: row.dataset.assetName };
                                    let siblings = internalContainer.querySelectorAll(".media-video-row");
                                    siblings.forEach(s => s.style.background = "");
                                    row.style.background = "rgba(0,120,215,0.08)";
                                };

                                row.onclick = () => selectRow();
                                title.onclick = (e) => { e.stopPropagation(); selectRow(); };

                                // TRY TO LOAD 2.5s FRAME PREVIEW
                                flexEngineFileSystem.readAsset("/video/" + file.name)
                                    .then(blob => captureFrame(blob))
                                    .then(frameUrl => {
                                        if (frameUrl) {
                                            iconContainer.innerHTML = `<img src="${frameUrl}" style="width:100%;height:100%;object-fit:cover;" />`;
                                        }
                                    })
                                    .catch(() => {});

                                // CLICK ICON TO SHOW FULL VIDEO PREVIEW
                                iconContainer.onclick = async (e) => {
                                    e.stopPropagation();
                                    selectRow();
                                    try {
                                        let blob = await flexEngineFileSystem.readAsset("/video/" + file.name);
                                        let url = URL.createObjectURL(blob);
                                        overlayVideo.src = url;
                                        this._objectUrls.add(url);
                                        overlay.style.display = "flex";
                                        overlayVideo.play();
                                    } catch (err) {
                                        console.error("Could not load video for preview", err);
                                    }
                                };

                                row.appendChild(iconContainer);
                                row.appendChild(title);
                                internalContainer.appendChild(row);
                            }

                            if (limit < items.length) {
                                setTimeout(() => processAssetChunk(items, limit), 20);
                            }
                        };

                        if (assets && assets.length > 0) {
                            await processAssetChunk(assets);
                        }

                        externalInput.addEventListener("input", () => {
                            let v = externalInput.value.trim();
                            if (v && this._activeTab === "external") {
                                this._selected = { mode: "external", url: v };
                            }
                        });

                        this._popupExternalInput = externalInput;
                        this._popupFileInput = fileInput;
                        this._popupNameInput = nameInput;
                    };
                }

                updatePreview() {
                    if (this.dataArray.mode === "internal") {
                        this.previewText.textContent = this.dataArray.name || "";
                    } else if (this.dataArray.mode === "external") {
                        this.previewText.textContent = this.dataArray.url || "";
                    } else {
                        this.previewText.textContent = "";
                    }
                }

                async onPopupClose() {
                    if (this._activeTab === "external" && this._popupExternalInput && this._popupExternalInput.value.trim() !== "") {
                        this.dataArray = {
                            mode: "external",
                            url: this._popupExternalInput.value.trim()
                        };
                    } else if (this._activeTab === "upload" && this._popupFileInput && this._popupFileInput.files.length > 0) {
                        // CANCEL SAVE IF FILE EXCEEDS 25 MB
                        if (!this._isFileValid) {
                            return;
                        }

                        let file = this._popupFileInput.files[0];
                        let customName = this._popupNameInput ? this._popupNameInput.value.trim() : "";
                        
                        let ext = "";
                        let baseName = file.name;
                        const dotIndex = file.name.lastIndexOf(".");
                        if (dotIndex !== -1) {
                            baseName = file.name.substring(0, dotIndex);
                            ext = file.name.substring(dotIndex);
                        }

                        if (customName !== "") {
                            baseName = customName;
                        }

                        let finalName = baseName + ext;

                        try {
                            let assets = await flexEngineFileSystem.listAssets("video");
                            let existingNames = new Set(assets ? assets.map(a => a.name) : []);

                            let counter = 1;
                            while (existingNames.has(finalName)) {
                                finalName = `${baseName} (${counter})${ext}`;
                                counter++;
                            }

                            let resCode = await flexEngineFileSystem.updateAsset("video", finalName, file);

                            if (resCode === 0 || resCode === 2) {
                                this.dataArray = {
                                    mode: "internal",
                                    folder: "video",
                                    name: finalName
                                };
                            }
                        } catch (err) {
                            console.error("Failed to upload video asset:", err);
                        }
                    } else if (this._selected) {
                        this.dataArray = this._selected;
                    }

                    // REVOKE ALL CREATED TEMP OBJECT URLS
                    this._objectUrls.forEach(u => URL.revokeObjectURL(u));
                    this._objectUrls.clear();

                    const dynamicOverlay = this.popupElement.querySelector(".media-video-overlay");
                    if (dynamicOverlay) {
                        dynamicOverlay.remove();
                    }

                    this.updatePreview();
                }

                onSave() {
                    return this.dataArray;
                }
            },

            render: function(dataArray) {
                if (!dataArray || !dataArray.mode)
                    return "";

                switch (dataArray.mode) {
                    case "internal":
                        let prefix = BUILDER_CONFIG.classPrefix;
                        return "/" + prefix + "assets/video/" + dataArray.name;

                    case "external":
                        return dataArray.url || "";

                    default:
                        return "";
                }
            }
        }        
    },

    space: {
        space: {
            structureSample: {
                mode: "px",
                value: 60
            },
            displayType: "large",
            cssStyles: [{
                object: ".space-control-container",
                info: [{
                    key: "height",
                    value: "60px"
                }, {
                    key: "max-height",
                    value: "60px"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "flex-end"
                }, {
                    key: "gap",
                    value: "10px"
                }, {
                    key: "padding",
                    value: "0 12px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "overflow",
                    value: "hidden"
                }, {
                    key: "background",
                    value: "#ffffff"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "8px"
                }]
            }, {
                object: ".space-slider-wrap",
                info: [{
                    key: "position",
                    value: "relative"
                }, {
                    key: "flex",
                    value: "1"
                }, {
                    key: "height",
                    value: "100%"
                }, {
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }]
            }, {
                object: ".space-ticks-bg",
                info: [{
                    key: "position",
                    value: "absolute"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "4px"
                }, {
                    key: "display",
                    value: "flex"
                }, {
                    key: "gap",
                    value: "3px"
                }, {
                    key: "pointer-events",
                    value: "none"
                }, {
                    key: "z-index",
                    value: "1"
                }]
            }, {
                object: ".space-tick-seg",
                info: [{
                    key: "flex",
                    value: "1"
                }, {
                    key: "height",
                    value: "100%"
                }, {
                    key: "background",
                    value: "#e5e7eb"
                }, {
                    key: "border-radius",
                    value: "2px"
                }]
            }, {
                object: ".space-tick-seg.active",
                info: [{
                    key: "background",
                    value: "#2563eb"
                }]
            }, {
                object: ".space-range-input",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "4px"
                }, {
                    key: "background",
                    value: "#e5e7eb"
                }, {
                    key: "border-radius",
                    value: "2px"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "position",
                    value: "relative"
                }, {
                    key: "z-index",
                    value: "2"
                }, {
                    key: "margin",
                    value: "0"
                }]
            }, {
                object: ".space-range-input.theme-mode",
                info: [{
                    key: "background",
                    value: "transparent"
                }]
            }, {
                object: ".space-slider-tooltip",
                info: [{
                    key: "position",
                    value: "absolute"
                }, {
                    key: "bottom",
                    value: "4px"
                }, {
                    key: "transform",
                    value: "translateX(-50%)"
                }, {
                    key: "background",
                    value: "#262626"
                }, {
                    key: "color",
                    value: "#ffffff"
                }, {
                    key: "font-size",
                    value: "11px"
                }, {
                    key: "font-weight",
                    value: "600"
                }, {
                    key: "padding",
                    value: "2px 6px"
                }, {
                    key: "border-radius",
                    value: "4px"
                }, {
                    key: "white-space",
                    value: "nowrap"
                }, {
                    key: "pointer-events",
                    value: "none"
                }, {
                    key: "z-index",
                    value: "10"
                }]
            }, {
                object: ".space-number-input",
                info: [{
                    key: "width",
                    value: "64px"
                }, {
                    key: "height",
                    value: "32px"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "6px"
                }, {
                    key: "padding",
                    value: "0 6px"
                }, {
                    key: "font-size",
                    value: "13px"
                }, {
                    key: "text-align",
                    value: "center"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".space-mode-select",
                info: [{
                    key: "height",
                    value: "32px"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "6px"
                }, {
                    key: "padding",
                    value: "0 8px"
                }, {
                    key: "font-size",
                    value: "13px"
                }, {
                    key: "background",
                    value: "#ffffff"
                }, {
                    key: "color",
                    value: "#1d1d1f"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }],

            component: class {
                constructor(dataArray, entryElement) {
                    this.THEME_LEVELS = ["tiny", "small", "mSmall", "medium", "large", "extraLarge"];
                    this.VALID_UNITS = ['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax', 'ch'];
                    debugger; // later you need replace 60px to what should it be.
                    this.dataArray = dataArray && typeof dataArray === 'object' ? dataArray : {
                        mode: "px",
                        value: 60
                    };
                    this.entryElement = entryElement;
                    this.updateData = (newData) => {
                        Object.keys(this.dataArray).forEach(k => delete this.dataArray[k]);
                        Object.assign(this.dataArray, newData);
                    };
                    const container = document.createElement("div");
                    container.className = "space-control-container";
                    const sliderWrap = document.createElement("div");
                    sliderWrap.className = "space-slider-wrap";
                    const ticksBg = document.createElement("div");
                    ticksBg.className = "space-ticks-bg";
                    for (let i = 0; i < 5; i++) {
                        const seg = document.createElement("div");
                        seg.className = "space-tick-seg";
                        ticksBg.appendChild(seg);
                    }
                    const slider = document.createElement("input");
                    slider.type = "range";
                    slider.className = "space-range-input";
                    const tooltip = document.createElement("div");
                    tooltip.className = "space-slider-tooltip";
                    sliderWrap.appendChild(ticksBg);
                    sliderWrap.appendChild(slider);
                    sliderWrap.appendChild(tooltip);
                    const numInput = document.createElement("input");
                    numInput.type = "number";
                    numInput.className = "space-number-input";
                    
                    const select = document.createElement("select");
                    select.className = "space-mode-select";
                    const options = [{
                        label: "theme",
                        value: "variables"
                    }, {
                        label: "px",
                        value: "px"
                    }, {
                        label: "auto",
                        value: "auto"
                    }, {
                        label: "none",
                        value: "none"
                    }, {
                        label: "rem",
                        value: "rem"
                    }, {
                        label: "em",
                        value: "em"
                    }, {
                        label: "%",
                        value: "%"
                    }, {
                        label: "vw",
                        value: "vw"
                    }, {
                        label: "vh",
                        value: "vh"
                    }, {
                        label: "vmin",
                        value: "vmin"
                    }, {
                        label: "vmax",
                        value: "vmax"
                    }, {
                        label: "ch",
                        value: "ch"
                    }];
                    options.forEach(opt => {
                        const o = document.createElement("option");
                        o.value = opt.value;
                        o.textContent = opt.label;
                        select.appendChild(o);
                    });
                    container.appendChild(sliderWrap);
                    container.appendChild(numInput);
                    container.appendChild(select);

                    const updateTicks = (idx) => {
                        const segs = ticksBg.querySelectorAll(".space-tick-seg");
                        segs.forEach((seg, i) => {
                            if (i < idx) seg.classList.add("active");
                            else seg.classList.remove("active");
                        });
                    };
                    const updateTooltipPosition = (idx) => {
                        const pct = idx / 5;
                        tooltip.style.left = `calc(${pct * 100}% - ${(pct - 0.5) * 16}px)`;
                        tooltip.textContent = this.THEME_LEVELS[idx];
                    };
                    const syncUI = () => {
                        const mode = select.value;
                        if (mode === "variables") {
                            sliderWrap.style.display = "flex";
                            numInput.style.display = "none";
                            ticksBg.style.display = "flex";
                            tooltip.style.display = "block";
                            slider.classList.add("theme-mode");
                            slider.min = "0";
                            slider.max = "5";
                            slider.step = "1";
                            let idx = this.THEME_LEVELS.indexOf(this.dataArray.variables);
                            if (idx === -1) idx = 3;
                            slider.value = idx;
                            this.updateData({
                                mode: "variables",
                                variables: this.THEME_LEVELS[idx]
                            });
                            updateTicks(idx);
                            updateTooltipPosition(idx);
                        } else if (this.VALID_UNITS.includes(mode)) {
                            sliderWrap.style.display = "none";
                            numInput.style.display = "block";
                            ticksBg.style.display = "none";
                            tooltip.style.display = "none";
                            let val = this.dataArray.value !== undefined ? Number(this.dataArray.value) : 60;
                            numInput.value = val;
                            this.updateData({
                                mode: mode,
                                value: val
                            });
                        } else {
                            sliderWrap.style.display = "none";
                            numInput.style.display = "none";
                            tooltip.style.display = "none";
                            this.updateData({
                                mode: mode
                            });
                        }
                    };

                    select.value = this.dataArray.mode || "px";
                    select.addEventListener("change", syncUI);
                    
                    slider.addEventListener("input", (e) => {
                        const val = Number(e.target.value);
                        if (select.value === "variables") {
                            this.updateData({
                                mode: "variables",
                                variables: this.THEME_LEVELS[val]
                            });
                            updateTicks(val);
                            updateTooltipPosition(val);
                        }
                    });

                    numInput.addEventListener("input", (e) => {
                        let val = Number(e.target.value);
                        this.updateData({
                            mode: select.value,
                            value: val
                        });
                    });

                    syncUI();
                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(container);
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    return this.dataArray;
                }
            },
            render: function(spaceObj) {
                if (!spaceObj || !spaceObj.mode) return '0px';
                switch (spaceObj.mode) {
                    case 'auto':
                        return 'auto';
                    case 'none':
                        return '0px';
                    case 'variables':
                        return `var(--rs-theme-${spaceObj.variables})`;
                    default:
                        const validUnits = ['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax', 'ch'];
                        if (validUnits.includes(spaceObj.mode)) {
                            return `${spaceObj.value}${spaceObj.mode}`;
                        }
                        return '0px';
                }
            }
        }
    },

    // Require CubicBezierEditor.js
    curve: {
        curve: {
            structureSample: [0, 0, 1, 1],
            // this is the Cubic Bezier Animation

            displayType: "large",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = dataArray;

                    // Check if initial value is the theme keyword
                    this.isTheme = Array.isArray(this.dataArray) && 
                        this.dataArray.length === 1 && 
                        this.dataArray[0] === 'theme';

                    const PRESETS = {
                        '0,0,1,1': 'linear',
                        '0.25,0.1,0.25,1': 'ease',
                        '0.42,0,1,1': 'ease-in',
                        '0,0,0.58,1': 'ease-out',
                        '0.42,0,0.58,1': 'ease-in-out'
                    };

                    const PRESET_COORDS = {
                        'linear': [0, 0, 1, 1],
                        'ease': [0.25, 0.1, 0.25, 1],
                        'ease-in': [0.42, 0, 1, 1],
                        'ease-out': [0, 0, 0.58, 1],
                        'ease-in-out': [0.42, 0, 0.58, 1]
                    };

                    this.PRESETS = PRESETS;
                    this.PRESET_COORDS = PRESET_COORDS;

                    const initialCoords = this.isTheme
                        ? [0.42, 0, 0.58, 1]
                        : (Array.isArray(this.dataArray) && this.dataArray.length === 4 
                            ? [...this.dataArray] 
                            : [0.42, 0, 0.58, 1]);

                    this.entryElement = entryElement;
                    this.editor = null;

                    // Root wrapper
                    this.wrapper = document.createElement('div');
                    this.wrapper.style.width = '100%';

                    // Top control bar
                    const controlBar = document.createElement('div');
                    controlBar.style.marginBottom = '8px';

                    this.select = document.createElement('select');
                    this.select.style.width = '100%';
                    this.select.style.padding = '4px 8px';
                    this.select.style.boxSizing = 'border-box';

                    const options = [
                        { value: 'theme', label: 'Theme Curve' },
                        { value: 'custom', label: 'Custom' },
                        { value: 'ease-in-out', label: 'Preset: ease-in-out' },
                        { value: 'ease', label: 'Preset: ease' },
                        { value: 'linear', label: 'Preset: linear' },
                        { value: 'ease-in', label: 'Preset: ease-in' },
                        { value: 'ease-out', label: 'Preset: ease-out' }
                    ];

                    options.forEach(opt => {
                        const el = document.createElement('option');
                        el.value = opt.value;
                        el.textContent = opt.label;
                        this.select.appendChild(el);
                    });

                    // Set initial select value based on initial coordinates
                    this.select.value = this.isTheme 
                        ? 'theme' 
                        : (PRESETS[initialCoords.join(',')] || 'custom');

                    controlBar.appendChild(this.select);
                    this.wrapper.appendChild(controlBar);

                    // Container for the canvas editor
                    this.editorContainer = document.createElement('div');
                    this.editorContainer.style.width = '100%';
                    this.wrapper.appendChild(this.editorContainer);

                    // Handle dropdown change
                    this.select.addEventListener('change', (e) => {
                        const val = e.target.value;
                        if (val === 'theme') {
                            this.isTheme = true;
                            this.dataArray.splice(0, this.dataArray.length, "theme");
                            this._destroyEditor();
                        } else {
                            this.isTheme = false;
                            if (val === 'custom') {
                                const startCoords = [0.42, 0, 0.58, 1];
                                this.dataArray.splice(0, this.dataArray.length, ...startCoords);
                                this._initEditor(startCoords);
                            } else {
                                const targetCoords = PRESET_COORDS[val];
                                this.dataArray.splice(0, this.dataArray.length, ...targetCoords);
                                if (this.editor) {
                                    this.editor.setPreset(val);
                                } else {
                                    this._initEditor(targetCoords);
                                }
                            }
                        }
                    });

                    // Append to DOM container if passed directly
                    if (this.entryElement) {
                        this.entryElement.appendChild(this.wrapper);
                    }

                    // Mount editor initially if not on theme mode
                    if (!this.isTheme) {
                        this._initEditor(initialCoords);
                    }
                }

                _initEditor(coords) {
                    this._destroyEditor();

                    this.editor = new CubicBezierEditor(this.editorContainer, {
                        entry: coords,
                        size: 'auto',
                        easyMode: true,
                        showPreview: true,
                        onChange: (data) => {
                            const currentCoords = data.coords;

                            // Update shared dataArray in-place
                            this.dataArray.splice(0, this.dataArray.length, ...currentCoords);

                            // Automatically sync dropdown selection (Preset vs Custom)
                            const matchedPreset = this.PRESETS[currentCoords.join(',')];
                            const targetOption = matchedPreset || 'custom';

                            if (this.select.value !== targetOption) {
                                this.select.value = targetOption;
                            }
                        }
                    });

                    this.editor.init();
                }

                _destroyEditor() {
                    if (this.editor) {
                        this.editor.destroy();
                        this.editor = null;
                    }
                    this.editorContainer.innerHTML = '';
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    const result = this.isTheme ? ["theme"] : this.dataArray;

                    // Clean up resources on save
                    this._destroyEditor();

                    return result;
                }
            },

            render: function(coords) {
                // Return CSS variable if set to theme mode
                if (Array.isArray(coords) && coords.length === 1 && coords[0] === 'theme') {
                    const prefix = (typeof BUILDER_CONFIG !== 'undefined' && BUILDER_CONFIG.classPrefix) 
                        ? BUILDER_CONFIG.classPrefix 
                        : 'default';
                    return `var(--${prefix}-animation-animationCurve)`;
                }

                const presetMap = {
                    '0,0,1,1': 'linear',
                    '0.25,0.1,0.25,1': 'ease',
                    '0.42,0,1,1': 'ease-in',
                    '0,0,0.58,1': 'ease-out',
                    '0.42,0,0.58,1': 'ease-in-out'
                };

                const key = Array.isArray(coords) ? coords.join(',') : '';

                return presetMap[key] || `cubic-bezier(${key})`;
            }
        },

        pure: {
            structureSample: [0, 0, 1, 1],
            // this is the Cubic Bezier Animation

            displayType: "large",

            cssStyles: {},

            component: class {
                constructor(dataArray, entryElement, elementSetting) {
                    this.dataArray = dataArray ? dataArray : [0.42, 0, 0.58, 1];
                    this.entryElement = entryElement;

                    const container = document.createElement('div')

                    container.style.width = '100%';

                    this.editor = new CubicBezierEditor(container, {
                        entry: this.dataArray,
                        size: 'auto',
                        easyMode: true,
                        showPreview: true,
                        onChange: (data) => {
                            this.dataArray = data.coords;
                        }
                    });

                    this.editor.init();
                }

                initResult() {
                    return { code: 0 };
                }

                onSave() {
                    this.editor.destroy();
                    return this.dataArray;
                }                
            },

            render: function(coords) {
                const presetMap = {
                    '0,0,1,1': 'linear',
                    '0.25,0.1,0.25,1': 'ease',
                    '0.42,0,1,1': 'ease-in',
                    '0,0,0.58,1': 'ease-out',
                    '0.42,0,0.58,1': 'ease-in-out'
                };

                const key = coords.join(',');

                return presetMap[key] || `cubic-bezier(${key})`;
            }
        }
    },

    color: {
        picker: {
            structureSample: {
                mode: "basic",
                color: "color-primaryColor"
            },
            displayType: "picker",
            cssStyles: [{
                object: ".color-control-container",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-direction",
                    value: "column"
                }, {
                    key: "gap",
                    value: "10px"
                }, {
                    key: "padding",
                    value: "12px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "background",
                    value: "#ffffff"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "8px"
                }]
            }, {
                object: ".color-header",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "justify-content",
                    value: "space-between"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "gap",
                    value: "4px"
                }, {
                    key: "background",
                    value: "#f2f2f7"
                }, {
                    key: "padding",
                    value: "4px"
                }, {
                    key: "border-radius",
                    value: "8px"
                }, {
                    key: "border",
                    value: "1px solid #e5e5ea"
                }]
            }, {
                object: ".color-switch-btn",
                info: [{
                    key: "flex",
                    value: "1 1 0"
                }, {
                    key: "text-align",
                    value: "center"
                }, {
                    key: "padding",
                    value: "6px 4px"
                }, {
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "font-weight",
                    value: "500"
                }, {
                    key: "color",
                    value: "#3a3a3c"
                }, {
                    key: "border-radius",
                    value: "6px"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "border",
                    value: "none"
                }, {
                    key: "background",
                    value: "transparent"
                }, {
                    key: "transition",
                    value: "all 0.2s ease-in-out"
                }, {
                    key: "user-select",
                    value: "none"
                }, {
                    key: "white-space",
                    value: "nowrap"
                }]
            }, {
                object: ".color-switch-btn.active",
                info: [{
                    key: "background",
                    value: "#ffffff"
                }, {
                    key: "color",
                    value: "#000000"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.12)"
                }, {
                    key: "font-weight",
                    value: "600"
                }]
            }, {
                object: ".color-content-area",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-direction",
                    value: "column"
                }, {
                    key: "gap",
                    value: "10px"
                }]
            }, {
                object: ".color-row",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "gap",
                    value: "8px"
                }, {
                    key: "font-size",
                    value: "13px"
                }, {
                    key: "flex-wrap",
                    value: "wrap"
                }]
            }, {
                object: ".color-input",
                info: [{
                    key: "height",
                    value: "32px"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "6px"
                }, {
                    key: "padding",
                    value: "0 8px"
                }, {
                    key: "flex",
                    value: "1"
                }, {
                    key: "outline",
                    value: "none"
                }]
            }, {
                object: ".btn-action",
                info: [{
                    key: "padding",
                    value: "4px 8px"
                }, {
                    key: "background",
                    value: "#f3f4f6"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "4px"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "font-size",
                    value: "12px"
                }]
            }, {
                object: ".color-angle-slider",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "6px"
                }, {
                    key: "background",
                    value: "#e5e5ea"
                }, {
                    key: "border-radius",
                    value: "3px"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-angle-slider::-webkit-slider-thumb",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "width",
                    value: "16px"
                }, {
                    key: "height",
                    value: "16px"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#007aff"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.3)"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-angle-slider::-moz-range-thumb",
                info: [{
                    key: "width",
                    value: "16px"
                }, {
                    key: "height",
                    value: "16px"
                }, {
                    key: "border",
                    value: "none"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#007aff"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.3)"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-overlay-section",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-direction",
                    value: "column"
                }, {
                    key: "gap",
                    value: "10px"
                }, {
                    key: "padding",
                    value: "10px"
                }, {
                    key: "background",
                    value: "#fdfdfd"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "8px"
                }, {
                    key: "margin-top",
                    value: "2px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".color-overlay-toggle",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "space-between"
                }, {
                    key: "padding",
                    value: "8px 10px"
                }, {
                    key: "background",
                    value: "#f3f4f6"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "6px"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "font-weight",
                    value: "600"
                }, {
                    key: "color",
                    value: "#3a3a3c"
                }, {
                    key: "text-align",
                    value: "left"
                }, {
                    key: "transition",
                    value: "all 0.2s ease-in-out"
                }, {
                    key: "user-select",
                    value: "none"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".color-overlay-toggle.active",
                info: [{
                    key: "background",
                    value: "#eaf3ff"
                }, {
                    key: "border-color",
                    value: "#b8d9ff"
                }, {
                    key: "color",
                    value: "#007aff"
                }]
            }, {
                object: ".color-overlay-toggle-indicator",
                info: [{
                    key: "width",
                    value: "8px"
                }, {
                    key: "height",
                    value: "8px"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#c7c7cc"
                }, {
                    key: "flex",
                    value: "0 0 auto"
                }, {
                    key: "transition",
                    value: "background 0.2s ease-in-out"
                }]
            }, {
                object: ".color-overlay-toggle.active .color-overlay-toggle-indicator",
                info: [{
                    key: "background",
                    value: "#007aff"
                }]
            }, {
                object: ".color-overlay-label",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "gap",
                    value: "8px"
                }]
            }, {
                object: ".color-overlay-color-label",
                info: [{
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "color",
                    value: "#666"
                }, {
                    key: "margin-bottom",
                    value: "2px"
                }]
            }, {
                object: ".color-overlay-opacity-row",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "gap",
                    value: "8px"
                }, {
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "color",
                    value: "#666"
                }]
            }, {
                object: ".color-overlay-opacity-slider",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "flex",
                    value: "1"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "6px"
                }, {
                    key: "background",
                    value: "#e5e5ea"
                }, {
                    key: "border-radius",
                    value: "3px"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-overlay-opacity-slider::-webkit-slider-thumb",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "width",
                    value: "16px"
                }, {
                    key: "height",
                    value: "16px"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#007aff"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.3)"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-overlay-opacity-slider::-moz-range-thumb",
                info: [{
                    key: "width",
                    value: "16px"
                }, {
                    key: "height",
                    value: "16px"
                }, {
                    key: "border",
                    value: "none"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#007aff"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.3)"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-overlay-opacity-value",
                info: [{
                    key: "width",
                    value: "42px"
                }, {
                    key: "text-align",
                    value: "right"
                }, {
                    key: "font-variant-numeric",
                    value: "tabular-nums"
                }, {
                    key: "color",
                    value: "#666"
                }]
            }, {
                object: ".color-custom-picker",
                info: [{
                    key: "width",
                    value: "32px"
                }, {
                    key: "height",
                    value: "32px"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "overflow",
                    value: "hidden"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "position",
                    value: "relative"
                }, {
                    key: "flex",
                    value: "0 0 auto"
                }]
            }, {
                object: ".color-custom-picker input[type=\"color\"]",
                info: [{
                    key: "appearance",
                    value: "none"
                }, {
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "100%"
                }, {
                    key: "padding",
                    value: "0"
                }, {
                    key: "margin",
                    value: "0"
                }, {
                    key: "border",
                    value: "none"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "background",
                    value: "transparent"
                }, {
                    key: "display",
                    value: "block"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-custom-picker input[type=\"color\"]::-webkit-color-swatch-wrapper",
                info: [{
                    key: "padding",
                    value: "0"
                }, {
                    key: "border",
                    value: "none"
                }]
            }, {
                object: ".color-custom-picker input[type=\"color\"]::-webkit-color-swatch",
                info: [{
                    key: "border",
                    value: "none"
                }, {
                    key: "border-radius",
                    value: "50%"
                }]
            }, {
                object: ".color-custom-picker-brush",
                info: [{
                    key: "position",
                    value: "absolute"
                }, {
                    key: "left",
                    value: "50%"
                }, {
                    key: "top",
                    value: "50%"
                }, {
                    key: "transform",
                    value: "translate(-50%, -50%)"
                }, {
                    key: "font-size",
                    value: "14px"
                }, {
                    key: "line-height",
                    value: "1"
                }, {
                    key: "pointer-events",
                    value: "none"
                }, {
                    key: "user-select",
                    value: "none"
                }, {
                    key: "z-index",
                    value: "2"
                }]
            }],
            component: class {
                constructor(dataArray, entryElement, entryConfig = {}, ctx) {
                    /*
                    * IMPORTANT:
                    *
                    * Keep the exact object supplied by the caller.
                    *
                    * If it is a Proxy, the Proxy stays the Proxy.
                    *
                    * The component does NOT create another Proxy.
                    */
                    this.thisPageObject = ctx;

                    this.dataArray = dataArray && Object.keys(dataArray).length > 0 ? dataArray : {
                        mode: "basic",
                        color: "color-primaryColor"
                    };
                    if (this.dataArray.mode === "none") {
                        this.dataArray.mode = "inherit";
                    }
                    // replace the entry element to picker element
                    this.entryElement = entryElement[1];
                    this.previewElement = entryElement[0];

                    this.allowBackgroundIMG = entryConfig.backgroundIMG !== false;
                    this.themeColors = null;
                    this.container = document.createElement("div");
                    this.container.className = "color-control-container";
                    this.header = document.createElement("div");
                    this.header.className = "color-header";
                    const modes = [{
                        label: "Basic",
                        value: "basic"
                    }, {
                        label: "Gradient",
                        value: "linearGradient"
                    }, {
                        label: "Image",
                        value: "backgroundIMG",
                        hidden: !this.allowBackgroundIMG
                    }, {
                        label: "Inherit",
                        value: "inherit"
                    }];
                    this.modeButtons = {};
                    let activeMode = ["inherit"].includes(this.dataArray.mode) ? "inherit" : (this.dataArray.mode || "basic");
                    modes.forEach(mode => {
                        if (mode.hidden) return;
                        const btn = document.createElement("div");
                        btn.className = `color-switch-btn ${
                                    activeMode === mode.value ? "active" : ""
                                }`;
                        btn.textContent = mode.label;
                        btn.addEventListener("click", () => {
                            if (activeMode === mode.value) return;
                            Object.values(this.modeButtons).forEach(button => {
                                button.classList.remove("active");
                            });
                            btn.classList.add("active");
                            activeMode = mode.value;
                            this.initializeDataForMode(mode.value);
                            this.renderUI();
                        });
                        this.modeButtons[mode.value] = btn;
                        this.header.appendChild(btn);
                    });
                    this.container.appendChild(this.header);
                    this.contentArea = document.createElement("div");
                    this.contentArea.className = "color-content-area";
                    this.container.appendChild(this.contentArea);
                    this.renderUI();
                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(this.container);

                    // call a preview:
                    this.updatePreview(this.dataArray);
                }
                // Stop offset calculation
                recalculateStopsOffsets() {
                    if (!this.dataArray.stops || this.dataArray.stops.length === 0) {
                        return;
                    }
                    const count = this.dataArray.stops.length;
                    if (count === 1) {
                        this.dataArray.stops[0].offset = 0;
                        return;
                    }
                    const step = 100 / (count - 1);
                    this.dataArray.stops.forEach((stop, index) => {
                        stop.offset = Math.round(index * step);
                    });
                }
                // Initialize mode
                initializeDataForMode(mode) {
                    let newData = {
                        mode
                    };
                    switch (mode) {
                        case "basic":
                            newData.color = this.dataArray.color || "color-primaryColor";
                            break;
                        case "backgroundIMG":
                            newData.src = this.dataArray.src || "";
                            newData.repeatX = this.dataArray.repeatX ?? true;
                            newData.repeatY = this.dataArray.repeatY ?? false;
                            newData.positionX = this.dataArray.positionX || 2;
                            newData.positionY = this.dataArray.positionY || 2;
                            newData.attachment = this.dataArray.attachment ?? false;
                            newData.coloroverlay = this.dataArray.coloroverlay || "transparent";
                            break;
                        case "linearGradient":
                            newData.angle = this.dataArray.angle || 90;
                            newData.stops = this.dataArray.stops?.length >= 2 ? this.dataArray.stops : [{
                                color: "color-primaryColor",
                                offset: 0
                            }, {
                                color: "color-secondaryColor",
                                offset: 100
                            }];
                            break;
                        case "inherit":
                            break;
                    }
                    /*
                    * These are ordinary mutations.
                    *
                    * If dataArray is a Proxy,
                    * the external Proxy sees them.
                    */
                    Object.keys(this.dataArray).forEach(key => {
                        delete this.dataArray[key];
                    });
                    Object.assign(this.dataArray, newData);
                    if (mode === "linearGradient") {
                        this.recalculateStopsOffsets();
                    }
                }
                // Render UI
                renderUI() {
                    this.contentArea.innerHTML = "";
                    const mode = this.dataArray.mode;
                    if (!this.themeColors) {
                        const loadingMsg = document.createElement("div");
                        loadingMsg.className = "color-row";
                        loadingMsg.style.color = "#888";
                        loadingMsg.textContent = "Loading theme variables...";
                        this.contentArea.appendChild(loadingMsg);
                        return;
                    }
                    if (mode === "basic") {
                        this.buildBasicUI();
                    } else if (mode === "backgroundIMG") {
                        this.buildBackgroundImgUI();
                    } else if (mode === "linearGradient") {
                        this.buildGradientUI();
                    } else if (mode === "inherit") {
                        this.buildInheritUI();
                    }
                }
                // Color resolution
                getDisplayColor(colorVal) {
                    if (!colorVal || colorVal === "transparent") {
                        return "transparent";
                    }
                    if (colorVal.startsWith("color-")) {
                        const key = colorVal.replace("color-", "");
                        const raw = this.themeColors ? this.themeColors[key] : null;
                        return typeof raw === "object" && raw !== null ? (raw.hex || "#e5e5ea") : (raw || "#e5e5ea");
                    }
                    return colorVal;
                }
                // Palette
                buildPaletteSelector(currentValue, onSelectCallback) {
                    const container = document.createElement("div");
                    container.style.display = "grid";
                    container.style.gridTemplateColumns = "repeat(4, 1fr)";
                    container.style.gap = "8px";
                    container.style.padding = "10px";
                    container.style.background = "#f9f9fb";
                    container.style.borderRadius = "8px";
                    container.style.border = "1px solid #eaeaea";
                    container.style.justifyItems = "center";
                    const keys = ["primaryColor", "secondaryColor", "accentColor", "secondaryAccentColor", "costomColor1", "costomColor2", "costomColor3", "costomColor4", "neutralTextColor", "neutralBackgroundColor"];
                    const renderSwatch = (displayBg, isSelected, icon = "", title = "") => {
                        const swatch = document.createElement("div");
                        swatch.style.width = "32px";
                        swatch.style.height = "32px";
                        swatch.style.borderRadius = "50%";
                        swatch.style.background = displayBg;
                        swatch.style.cursor = "pointer";
                        swatch.style.display = "flex";
                        swatch.style.alignItems = "center";
                        swatch.style.justifyContent = "center";
                        swatch.title = title;
                        if (icon) {
                            swatch.innerHTML = icon;
                            swatch.style.fontSize = "14px";
                        }
                        if (isSelected) {
                            swatch.style.border = "2px solid #007aff";
                            swatch.style.boxShadow = "0 0 0 2px rgba(0,122,255,0.2)";
                        } else {
                            swatch.style.border = "1px solid rgba(0,0,0,0.15)";
                        }
                        return swatch;
                    };
                    const isTransparent = currentValue === "transparent";
                    const isThemeColor = currentValue && currentValue.startsWith("color-");
                    const isCustomHex = currentValue && !isThemeColor && !isTransparent;
                    keys.forEach(key => {
                        const expectedVar = `color-${key}`;
                        const rawColor = this.themeColors[key];
                        const displayColor = typeof rawColor === "object" && rawColor !== null ? (rawColor.hex || "#e5e5ea") : (rawColor || "#e5e5ea");
                        const isSelected = currentValue === expectedVar;
                        const swatch = renderSwatch(displayColor, isSelected, "", expectedVar);
                        swatch.addEventListener("click", () => onSelectCallback(expectedVar));
                        container.appendChild(swatch);
                    });
                    const customBg = isCustomHex ? currentValue : "#000000";
                    const customWrap = document.createElement("div");
                    customWrap.className = "color-custom-picker";
                    customWrap.style.border = isCustomHex ? "2px solid #007aff" : "1px solid rgba(0,0,0,0.15)";
                    customWrap.style.boxShadow = isCustomHex ? "0 0 0 2px rgba(0,122,255,0.2)" : "none";
                    const nativePicker = document.createElement("input");
                    nativePicker.type = "color";
                    nativePicker.value = customBg;
                    nativePicker.title = "Custom Color";
                    nativePicker.addEventListener("input", e => {
                        this.dataArray.color = e.target.value;
                    });
                    nativePicker.addEventListener("blur", e => {
                        // Stop this event from reaching the surrounding color-system controls.
                        e.stopPropagation();
                        // Save the selected value BEFORE anything causes the UI to re-render.
                        const selectedColor = e.target.value;
                        // IMPORTANT:
                        // Close the native color picker FIRST.
                        //
                        // onSelectCallback() can cause renderUI(),
                        // which destroys this input element.
                        //
                        // Therefore blur MUST happen before onSelectCallback().
                        nativePicker.blur();
                        // Now allow the color system to process the new value and re-render.
                        onSelectCallback(selectedColor);
                    });
                    customWrap.appendChild(nativePicker);
                    const brushOverlay = document.createElement("span");
                    brushOverlay.className = "color-custom-picker-brush";
                    brushOverlay.textContent = "🖌️";
                    customWrap.appendChild(brushOverlay);
                    container.appendChild(customWrap);
                    const checkerboard = "repeating-linear-gradient(" + "45deg, #e0e0e0 25%, transparent 25%, " + "transparent 75%, #e0e0e0 75%, #e0e0e0), " + "repeating-linear-gradient(" + "45deg, #e0e0e0 25%, #ffffff 25%, " + "#ffffff 75%, #e0e0e0 75%, #e0e0e0)";
                    const transparentSwatch = renderSwatch("transparent", isTransparent, "🚫", "Transparent / None");
                    transparentSwatch.style.backgroundImage = checkerboard;
                    transparentSwatch.style.backgroundPosition = "0 0, 6px 6px";
                    transparentSwatch.style.backgroundSize = "12px 12px";
                    transparentSwatch.addEventListener("click",
                        () => onSelectCallback("transparent"));
                    container.appendChild(transparentSwatch);
                    return container;
                }
                // Basic
                buildBasicUI() {
                    const palette = this.buildPaletteSelector(this.dataArray.color, newVal => {
                        /*
                        * This mutation goes directly
                        * through the external Proxy.
                        */
                        this.dataArray.color = newVal;
                        this.renderUI();
                    });
                    this.contentArea.appendChild(palette);
                }
                // Gradient
                buildGradientUI() {
                    /* =========================================================
                    ENSURE VALID STOPS
                    ========================================================= */

                    if (
                        !Array.isArray(this.dataArray.stops) ||
                        this.dataArray.stops.length < 2
                    ) {
                        this.dataArray.stops = [{
                                color: "color-primaryColor",
                                offset: 0
                            },
                            {
                                color: "color-secondaryColor",
                                offset: 100
                            }
                        ];
                    }

                    /* =========================================================
                    ACTIVE STOP
                    ========================================================= */

                    if (
                        typeof this.openStopIndex !== "number" ||
                        this.openStopIndex < 0 ||
                        this.openStopIndex >= this.dataArray.stops.length
                    ) {
                        this.openStopIndex = 0;
                    }


                    /* =========================================================
                    ANGLE
                    ========================================================= */

                    const angleRow = document.createElement("div");
                    angleRow.className = "color-row";

                    const range = document.createElement("input");
                    range.type = "range";
                    range.className = "color-angle-slider";
                    range.min = "0";
                    range.max = "360";
                    range.value = this.dataArray.angle ?? 90;
                    range.style.flex = "1";

                    const num = document.createElement("input");
                    num.type = "number";
                    num.min = "0";
                    num.max = "360";
                    num.className = "color-input";
                    num.style.width = "60px";
                    num.style.flex = "none";
                    num.value = this.dataArray.angle ?? 90;

                    const syncAngle = value => {
                        let safeValue = Number(value);

                        if (!Number.isFinite(safeValue)) {
                            safeValue = 90;
                        }

                        safeValue = Math.max(
                            0,
                            Math.min(360, safeValue)
                        );

                        this.dataArray.angle = safeValue;

                        range.value = safeValue;
                        num.value = safeValue;
                    };

                    range.addEventListener("input", event => {
                        syncAngle(event.target.value);
                    });

                    num.addEventListener("input", event => {
                        syncAngle(event.target.value);
                    });

                    angleRow.appendChild(
                        document.createTextNode("Angle (°):")
                    );

                    angleRow.appendChild(range);
                    angleRow.appendChild(num);

                    this.contentArea.appendChild(angleRow);


                    /* =========================================================
                    STOP TABS CONTAINER
                    ========================================================= */

                    const stopsTabsContainer =
                        document.createElement("div");

                    stopsTabsContainer.className =
                        "color-header";

                    stopsTabsContainer.style.marginTop = "10px";
                    stopsTabsContainer.style.display = "flex";
                    stopsTabsContainer.style.alignItems = "center";
                    stopsTabsContainer.style.gap = "4px";


                    /* =========================================================
                    SORTABLE STOP GROUP

                    IMPORTANT:
                    Only stopsGroup is sortable.
                    The "+" button is outside it.
                    ========================================================= */

                    const stopsGroup =
                        document.createElement("div");

                    stopsGroup.style.display = "flex";
                    stopsGroup.style.alignItems = "center";
                    stopsGroup.style.gap = "4px";
                    stopsGroup.style.minWidth = "0";
                    stopsGroup.style.flex = "1";
                    stopsGroup.style.overflowX = "auto";


                    /* =========================================================
                    BUILD STOP TABS
                    ========================================================= */

                    this.dataArray.stops.forEach((stop, index) => {

                        const tab =
                            document.createElement("div");

                        tab.className =
                            "color-switch-btn" +
                            (
                                this.openStopIndex === index ?
                                " active" :
                                ""
                            );

                        /*
                        * Allow the stop itself to receive focus.
                        */
                        tab.tabIndex = 0;

                        tab.dataset.stopIndex = index;

                        tab.style.flex = "0 0 auto";
                        tab.style.display = "flex";
                        tab.style.alignItems = "center";
                        tab.style.justifyContent = "center";
                        tab.style.padding = "6px 10px";
                        tab.style.cursor = "grab";
                        tab.style.userSelect = "none";


                        /* =====================================================
                        COLOR SWATCH
                        ===================================================== */

                        const iconSwatch =
                            document.createElement("div");

                        iconSwatch.style.width = "18px";
                        iconSwatch.style.height = "18px";
                        iconSwatch.style.borderRadius = "50%";
                        iconSwatch.style.border =
                            "1px solid rgba(0,0,0,0.2)";
                        iconSwatch.style.flex = "0 0 auto";

                        if (stop.color === "transparent") {

                            iconSwatch.style.backgroundImage =
                                "repeating-linear-gradient(" +
                                "45deg, #e0e0e0 25%, transparent 25%, " +
                                "transparent 75%, #e0e0e0 75%, #e0e0e0), " +
                                "repeating-linear-gradient(" +
                                "45deg, #e0e0e0 25%, #ffffff 25%, " +
                                "#ffffff 75%, #e0e0e0 75%, #e0e0e0)";

                            iconSwatch.style.backgroundSize =
                                "8px 8px";

                        } else {

                            iconSwatch.style.background =
                                this.getDisplayColor(stop.color);
                        }

                        tab.appendChild(iconSwatch);


                        /* =====================================================
                        TOOLTIP
                        ===================================================== */

                        tab.title =
                            `Stop ${index + 1} (${stop.offset}%)`;


                        /* =====================================================
                        CLICK / SELECT
                        ===================================================== */

                        tab.addEventListener("click", event => {

                            /*
                            * If Sortable is currently finishing a drag,
                            * don't treat the generated click as a normal
                            * selection.
                            */
                            if (tab.dataset.dragging === "true") {
                                event.preventDefault();
                                event.stopPropagation();
                                return;
                            }

                            const currentIndex =
                                Array.from(
                                    stopsGroup.children
                                ).indexOf(tab);

                            if (currentIndex < 0) {
                                return;
                            }

                            this.openStopIndex =
                                currentIndex;

                            this.renderUI();
                        });


                        /* =====================================================
                        KEYBOARD SELECTION
                        ===================================================== */

                        tab.addEventListener("keydown", event => {

                            if (
                                event.key === "Enter" ||
                                event.key === " "
                            ) {

                                event.preventDefault();

                                const currentIndex =
                                    Array.from(
                                        stopsGroup.children
                                    ).indexOf(tab);

                                if (currentIndex < 0) {
                                    return;
                                }

                                this.openStopIndex =
                                    currentIndex;

                                this.renderUI();
                            }
                        });


                        stopsGroup.appendChild(tab);
                    });


                    /* =========================================================
                    ADD STOP BUTTON
                    ========================================================= */

                    const addTab =
                        document.createElement("div");

                    addTab.className =
                        "color-switch-btn";

                    addTab.style.flex =
                        "0 0 auto";

                    addTab.style.fontWeight =
                        "bold";

                    addTab.style.padding =
                        "6px 10px";

                    addTab.style.cursor =
                        "pointer";

                    addTab.textContent =
                        "+";

                    addTab.title =
                        "Add Stop";


                    addTab.addEventListener("click", () => {

                        this.dataArray.stops.push({
                            color: "transparent",
                            offset: 100
                        });

                        /*
                        * Redistribute offsets.
                        */
                        this.recalculateStopsOffsets();

                        /*
                        * Select the newly-created stop.
                        */
                        this.openStopIndex =
                            this.dataArray.stops.length - 1;

                        this.renderUI();
                    });


                    /* =========================================================
                    HEADER
                    ========================================================= */

                    stopsTabsContainer.appendChild(
                        stopsGroup
                    );

                    stopsTabsContainer.appendChild(
                        addTab
                    );

                    this.contentArea.appendChild(
                        stopsTabsContainer
                    );


                    /* =========================================================
                    SORTABLE.JS
                    ========================================================= */

                    if (typeof Sortable !== "undefined") {

                        new Sortable(stopsGroup, {

                            animation: 150,

                            direction: "horizontal",

                            ghostClass: "gradient-stop-ghost",

                            chosenClass: "gradient-stop-chosen",

                            dragClass: "gradient-stop-drag",

                            forceFallback: false,

                            draggable: ".color-switch-btn",


                            /* =================================================
                            DRAG START

                            THIS IS THE IMPORTANT PART.

                            As soon as Sortable detects dragging:

                            1. Find dragged stop.
                            2. Make it active.
                            3. Focus it.
                            4. Do NOT renderUI().
                            ================================================= */

                            onStart: event => {

                                const draggedTab =
                                    event.item;


                                /*
                                * Find its current position.
                                */
                                const currentIndex =
                                    Array.from(
                                        stopsGroup.children
                                    ).indexOf(draggedTab);

                                if (currentIndex < 0) {
                                    return;
                                }


                                /*
                                * Make dragged stop the active stop
                                * immediately.
                                */
                                this.openStopIndex =
                                    currentIndex;


                                /*
                                * Remove active state from every
                                * other stop.
                                */
                                Array.from(
                                    stopsGroup.children
                                ).forEach(tab => {

                                    tab.classList.remove(
                                        "active"
                                    );
                                });


                                /*
                                * Make dragged stop active.
                                */
                                draggedTab.classList.add(
                                    "active"
                                );


                                /*
                                * Focus the dragged stop immediately.
                                *
                                * This is effectively the same focus
                                * behavior as clicking the menu.
                                */
                                draggedTab.focus({
                                    preventScroll: true
                                });


                                /*
                                * Mark as dragging so the click event
                                * generated by Sortable doesn't cause
                                * another selection.
                                */
                                draggedTab.dataset.dragging =
                                    "true";


                                /*
                                * Change cursor.
                                */
                                draggedTab.style.cursor =
                                    "grabbing";
                            },


                            /* =================================================
                            DRAG END
                            ================================================= */

                            onEnd: event => {

                                const draggedTab =
                                    event.item;

                                draggedTab.style.cursor =
                                    "grab";


                                /*
                                * The DOM order has already been changed
                                * by Sortable.
                                *
                                * Use newIndex as the final stop index.
                                */
                                this.openStopIndex =
                                    event.newIndex;


                                /* =================================================
                                NOTHING MOVED
                                ================================================= */

                                if (
                                    event.oldIndex ===
                                    event.newIndex
                                ) {

                                    /*
                                    * Clear dragging state after the
                                    * current pointer/click cycle.
                                    */
                                    setTimeout(() => {

                                        draggedTab.dataset.dragging =
                                            "false";

                                    }, 0);


                                    /*
                                    * Keep focus on the same element.
                                    */
                                    requestAnimationFrame(() => {

                                        draggedTab.focus({
                                            preventScroll: true
                                        });

                                    });

                                    return;
                                }


                                /* =================================================
                                MOVE DATA ARRAY
                                ================================================= */

                                const movedStop =
                                    this.dataArray.stops.splice(
                                        event.oldIndex,
                                        1
                                    )[0];


                                this.dataArray.stops.splice(
                                    event.newIndex,
                                    0,
                                    movedStop
                                );


                                /* =================================================
                                RECALCULATE OFFSETS
                                ================================================= */

                                this.recalculateStopsOffsets();


                                /* =================================================
                                REBUILD UI
                                ================================================= */

                                /*
                                * The current DOM belongs to Sortable and is
                                * about to be destroyed by renderUI().
                                */
                                this.renderUI();


                                /*
                                * renderUI() creates a new tab.
                                *
                                * Focus that newly-created tab after the
                                * new DOM is ready.
                                */
                                requestAnimationFrame(() => {

                                    const newTabs =
                                        this.contentArea.querySelectorAll(
                                            ".color-switch-btn[data-stop-index]"
                                        );

                                    const newActiveTab =
                                        newTabs[this.openStopIndex];

                                    if (newActiveTab) {

                                        newActiveTab.focus({
                                            preventScroll: true
                                        });
                                    }
                                });


                                /*
                                * Prevent Sortable's generated click from
                                * being interpreted as a normal click.
                                */
                                setTimeout(() => {

                                    if (newTabsAreStillDragging()) {
                                        return;
                                    }

                                }, 0);
                            }
                        });

                    } else {

                        console.warn(
                            "Sortable.js is not loaded. " +
                            "Gradient stops will not be draggable."
                        );
                    }


                    /* =========================================================
                    ACTIVE STOP EDITOR
                    ========================================================= */

                    const activeStop =
                        this.dataArray.stops[
                            this.openStopIndex
                        ];

                    if (!activeStop) {
                        return;
                    }


                    const editorArea =
                        document.createElement("div");

                    editorArea.style.padding =
                        "10px";

                    editorArea.style.background =
                        "#fdfdfd";

                    editorArea.style.border =
                        "1px solid #d2d2d7";

                    editorArea.style.borderRadius =
                        "8px";

                    editorArea.style.marginTop =
                        "4px";


                    /* =========================================================
                    CONTROLS ROW
                    ========================================================= */

                    const controlsRow =
                        document.createElement("div");

                    controlsRow.className =
                        "color-row";

                    controlsRow.style.marginBottom =
                        "10px";

                    controlsRow.style.justifyContent =
                        "space-between";


                    /* =========================================================
                    OFFSET
                    ========================================================= */

                    const offsetWrap =
                        document.createElement("div");

                    offsetWrap.className =
                        "color-row";

                    offsetWrap.style.fontSize =
                        "12px";

                    offsetWrap.style.color =
                        "#666";

                    offsetWrap.textContent =
                        `Offset: ${activeStop.offset}% (Auto)`;

                    controlsRow.appendChild(
                        offsetWrap
                    );


                    /* =========================================================
                    REMOVE STOP
                    ========================================================= */

                    const delBtn =
                        document.createElement("button");

                    delBtn.className =
                        "btn-action";

                    delBtn.type =
                        "button";

                    delBtn.textContent =
                        "Remove Stop";

                    delBtn.style.color =
                        "#d93025";

                    delBtn.disabled =
                        this.dataArray.stops.length <= 2;

                    if (delBtn.disabled) {

                        delBtn.style.opacity =
                            "0.5";

                        delBtn.style.cursor =
                            "not-allowed";
                    }


                    delBtn.addEventListener("click", () => {

                        if (
                            this.dataArray.stops.length <= 2
                        ) {
                            return;
                        }


                        this.dataArray.stops.splice(
                            this.openStopIndex,
                            1
                        );


                        this.recalculateStopsOffsets();


                        this.openStopIndex =
                            Math.min(
                                this.openStopIndex,
                                this.dataArray.stops.length - 1
                            );


                        this.renderUI();
                    });


                    controlsRow.appendChild(
                        delBtn
                    );

                    editorArea.appendChild(
                        controlsRow
                    );


                    /* =========================================================
                    COLOR PALETTE
                    ========================================================= */

                    const palette =
                        this.buildPaletteSelector(
                            activeStop.color,
                            newVal => {

                                activeStop.color =
                                    newVal;

                                this.renderUI();
                            }
                        );

                    editorArea.appendChild(
                        palette
                    );


                    /* =========================================================
                    APPEND EDITOR
                    ========================================================= */

                    this.contentArea.appendChild(
                        editorArea
                    );
                }
                // Image
                // Image
                buildBackgroundImgUI() {
                    /* ---------------------------------------------
                    HEX COLOR HELPERS
                    --------------------------------------------- */
                    const normalizeHex = value => {
                        if (!value || typeof value !== "string") {
                            return null;
                        }
                        let hex = value.trim();
                        // #RGB -> #RRGGBB
                        if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
                            hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
                        }
                        // #RGBA -> #RRGGBBAA
                        else if (/^#[0-9a-fA-F]{4}$/.test(hex)) {
                            hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] + hex[4] + hex[4];
                        }
                        if (!/^#[0-9a-fA-F]{6}$/.test(hex) && !/^#[0-9a-fA-F]{8}$/.test(hex)) {
                            return null;
                        }
                        return hex.toLowerCase();
                    };
                    const hexToOverlayState = value => {
                        const hex = normalizeHex(value);
                        if (!hex) {
                            return {
                                color: "#000000",
                                opacity: 100,
                                enabled: false
                            };
                        }
                        if (hex.length === 7) {
                            return {
                                color: hex,
                                opacity: 100,
                                enabled: true
                            };
                        }
                        const color = hex.substring(0, 7);
                        const alphaHex = hex.substring(7, 9);
                        const alpha = parseInt(alphaHex, 16);
                        return {
                            color,
                            opacity: Math.round((alpha / 255) * 100),
                            enabled: alpha > 0
                        };
                    };
                    const overlayState = hexToOverlayState(this.dataArray.coloroverlay);
                    /*
                    * IMPORTANT:
                    *
                    * Do not modify dataArray here.
                    *
                    * Existing JSON should be read as-is.
                    */
                    let overlayColor = overlayState.color;
                    let overlayOpacity = overlayState.opacity;
                    let overlayEnabled = this.dataArray.coloroverlay !== "transparent" && overlayState.enabled;
                    const opacityToHex = opacity => {
                        const safeOpacity = Math.max(0, Math.min(100, Number(opacity)));
                        return Math.round(
                            (safeOpacity / 100) * 255).toString(16).padStart(2, "0").toLowerCase();
                    };
                    const writeOverlayColor = () => {
                        if (!overlayEnabled) {
                            this.dataArray.coloroverlay = "transparent";
                            return;
                        }
                        const hex = normalizeHex(overlayColor);
                        if (!hex) {
                            this.dataArray.coloroverlay = "transparent";
                            return;
                        }
                        /*
                        * 100% opacity keeps the original
                        * six-digit HEX representation.
                        *
                        * This is important for backward compatibility.
                        */
                        if (overlayOpacity >= 100) {
                            this.dataArray.coloroverlay = hex.substring(0, 7);
                            return;
                        }
                        /*
                        * Less than 100% becomes HEX8:
                        *
                        * #RRGGBBAA
                        */
                        const alphaHex = opacityToHex(overlayOpacity);
                        this.dataArray.coloroverlay = hex.substring(0, 7) + alphaHex;
                    };
                    /* ---------------------------------------------
                    IMAGE SOURCE
                    --------------------------------------------- */
                    const srcRow = document.createElement("div");
                    srcRow.className = "color-row";
                    const srcInput = document.createElement("input");
                    srcInput.type = "text";
                    srcInput.className = "color-input";
                    srcInput.placeholder = "Image URL (src)";
                    srcInput.value = this.dataArray.src || "";
                    srcInput.addEventListener("input", e => {
                        this.dataArray.src = e.target.value;
                    });
                    srcRow.appendChild(srcInput);
                    this.contentArea.appendChild(srcRow);
                    /* ---------------------------------------------
                    REPEAT / ATTACHMENT
                    --------------------------------------------- */
                    const repeatRow = document.createElement("div");
                    repeatRow.className = "color-row";
                    repeatRow.innerHTML = `
                                
                            <label>
                                <input type="checkbox" id="rx">
                                    Repeat X
                                
                                </label>
                                <label>
                                    <input type="checkbox" id="ry">
                                    Repeat Y
                                
                                    </label>
                                    <label>
                                        <input type="checkbox" id="atch">
                                    Fixed Attach
                                
                                        </label>
                            `;
                    const rx = repeatRow.querySelector("#rx");
                    const ry = repeatRow.querySelector("#ry");
                    const atch = repeatRow.querySelector("#atch");
                    rx.checked = !!this.dataArray.repeatX;
                    ry.checked = !!this.dataArray.repeatY;
                    atch.checked = !!this.dataArray.attachment;
                    rx.addEventListener("change", e => {
                        this.dataArray.repeatX = e.target.checked;
                    });
                    ry.addEventListener("change", e => {
                        this.dataArray.repeatY = e.target.checked;
                    });
                    atch.addEventListener("change", e => {
                        this.dataArray.attachment = e.target.checked;
                    });
                    this.contentArea.appendChild(repeatRow);
                    /* ---------------------------------------------
                    POSITION
                    --------------------------------------------- */
                    const posRow = document.createElement("div");
                    posRow.className = "color-row";
                    const posX = document.createElement("select");
                    posX.className = "color-mode-select";
                    posX.innerHTML = `
                                
                                        <option value="1">Left</option>
                                        <option value="2">Center</option>
                                        <option value="3">Right</option>
                            `;
                    posX.value = this.dataArray.positionX || 2;
                    posX.addEventListener("change", e => {
                        this.dataArray.positionX = Number(e.target.value);
                    });
                    const posY = document.createElement("select");
                    posY.className = "color-mode-select";
                    posY.innerHTML = `
                                
                                        <option value="1">Top</option>
                                        <option value="2">Center</option>
                                        <option value="3">Bottom</option>
                            `;
                    posY.value = this.dataArray.positionY || 2;
                    posY.addEventListener("change", e => {
                        this.dataArray.positionY = Number(e.target.value);
                    });
                    posRow.appendChild(document.createTextNode("PosX:"));
                    posRow.appendChild(posX);
                    posRow.appendChild(document.createTextNode("PosY:"));
                    posRow.appendChild(posY);
                    this.contentArea.appendChild(posRow);
                    /* ---------------------------------------------
                    COLOR OVERLAY TOGGLE
                    --------------------------------------------- */
                    const toggle = document.createElement("button");
                    toggle.type = "button";
                    toggle.className = "color-overlay-toggle" + (overlayEnabled ? " active" : "");
                    const toggleLabel = document.createElement("span");
                    toggleLabel.className = "color-overlay-label";
                    const toggleIndicator = document.createElement("span");
                    toggleIndicator.className = "color-overlay-toggle-indicator";
                    const toggleText = document.createElement("span");
                    toggleText.textContent = "Color Overlay";
                    toggleLabel.appendChild(toggleIndicator);
                    toggleLabel.appendChild(toggleText);
                    toggle.appendChild(toggleLabel);
                    const toggleState = document.createElement("span");
                    toggleState.textContent = overlayEnabled ? "On" : "Off";
                    toggle.appendChild(toggleState);
                    const updateToggleUI = () => {
                        toggle.classList.toggle("active", overlayEnabled);
                        toggleState.textContent = overlayEnabled ? "On" : "Off";
                    };
                    toggle.addEventListener("click", () => {
                        overlayEnabled = !overlayEnabled;
                        if (overlayEnabled) {
                            /*
                            * If the previous value was transparent,
                            * start with the primary theme color.
                            *
                            * Otherwise preserve the existing color.
                            */
                            if (!normalizeHex(overlayColor)) {
                                overlayColor = this.getDisplayColor("color-primaryColor");
                            }
                            if (!normalizeHex(overlayColor)) {
                                overlayColor = "#007aff";
                            }
                            if (!Number.isFinite(overlayOpacity)) {
                                overlayOpacity = 100;
                            }
                        }
                        writeOverlayColor();
                        updateToggleUI();
                        this.renderUI();
                    });
                    this.contentArea.appendChild(toggle);
                    /* ---------------------------------------------
                    OVERLAY EDITOR
                    --------------------------------------------- */
                    if (!overlayEnabled) {
                        return;
                    }
                    const overlaySection = document.createElement("div");
                    overlaySection.className = "color-overlay-section";
                    /* ---------------------------------------------
                    COLOR
                    --------------------------------------------- */
                    const colorLabel = document.createElement("div");
                    colorLabel.className = "color-overlay-color-label";
                    colorLabel.textContent = "Overlay Color";
                    overlaySection.appendChild(colorLabel);
                    /*
                    * The existing palette is used here.
                    *
                    * It already supports:
                    *
                    * - theme colors
                    * - custom HEX
                    * - transparent
                    */
                    const palette = this.buildPaletteSelector(overlayColor, newVal => {
                        /*
                        * If the user explicitly chooses
                        * transparent, treat that as turning
                        * the overlay OFF.
                        */
                        if (newVal === "transparent") {
                            overlayEnabled = false;
                            this.dataArray.coloroverlay = "transparent";
                            this.renderUI();
                            return;
                        }
                        /*
                        * Theme variables need to be resolved
                        * into their actual HEX value because
                        * coloroverlay is persisted as HEX.
                        */
                        const resolved = this.getDisplayColor(newVal);
                        const normalized = normalizeHex(resolved);
                        if (!normalized) {
                            return;
                        }
                        overlayColor = normalized.substring(0, 7);
                        writeOverlayColor();
                        this.renderUI();
                    });
                    overlaySection.appendChild(palette);
                    /* ---------------------------------------------
                    OPACITY
                    --------------------------------------------- */
                    const opacityRow = document.createElement("div");
                    opacityRow.className = "color-overlay-opacity-row";
                    const opacityLabel = document.createElement("span");
                    opacityLabel.textContent = "Opacity:";
                    const opacitySlider = document.createElement("input");
                    opacitySlider.type = "range";
                    opacitySlider.min = "0";
                    opacitySlider.max = "100";
                    opacitySlider.step = "1";
                    opacitySlider.className = "color-overlay-opacity-slider";
                    opacitySlider.value = overlayOpacity;
                    const opacityValue = document.createElement("span");
                    opacityValue.className = "color-overlay-opacity-value";
                    const updateOpacityUI = value => {
                        overlayOpacity = Math.max(0, Math.min(100, Number(value)));
                        opacitySlider.value = overlayOpacity;
                        opacityValue.textContent = `${overlayOpacity}%`;
                        /*
                        * Opacity 0 means the resulting overlay
                        * is transparent.
                        *
                        * Keep the color available in memory/UI,
                        * but persist transparent because that is
                        * the original OFF representation.
                        */
                        if (overlayOpacity <= 0) {
                            this.dataArray.coloroverlay = "transparent";
                        } else {
                            writeOverlayColor();
                        }
                    };
                    updateOpacityUI(overlayOpacity);
                    opacitySlider.addEventListener("input", e => {
                        updateOpacityUI(e.target.value);
                    });
                    opacityRow.appendChild(opacityLabel);
                    opacityRow.appendChild(opacitySlider);
                    opacityRow.appendChild(opacityValue);
                    overlaySection.appendChild(opacityRow);
                    this.contentArea.appendChild(overlaySection);
                }
                // Inherit
                buildInheritUI() {
                    const row = document.createElement("div");
                    row.className = "color-row";
                    row.style.color = "#666";
                    row.textContent = "Color will be inherited from the parent.";
                    this.contentArea.appendChild(row);
                }
                // Init
                initResult() {
                    return async () => {
                        try {
                            const themeName = typeof this.thisPageObject !== "undefined" ? this.thisPageObject.theme : "defaultTheme";
                            const themeData = await flexEngineFlieSystem.readTheme(themeName);
                            const parsedTheme = typeof themeData === "string" ? JSON.parse(themeData) : themeData;
                            this.themeColors = parsedTheme.colors || {};
                            this.renderUI();
                        } catch (error) {
                            console.error("Theme variables failed to load:", error);
                        }
                        return {
                            code: 0
                        };
                    };
                }
                onSave() {
                    /*
                    * Return the actual data object.
                    *
                    * No onChange mechanism is used.
                    */
                    return this.dataArray;
                }

                updatePreview(data = this.dataArray) {
                    if (!this.previewElement) {
                        return;
                    }

                    this.previewElement.innerHTML = "";

                    const circle = document.createElement("div");

                    circle.style.width = "100%";
                    circle.style.height = "100%";
                    circle.style.borderRadius = "50%";
                    circle.style.background = this.render(data);

                    this.previewElement.appendChild(circle);
                }


                onDataChange(data) {
                    this.updatePreview(data);
                }
            },
            // Color renderer
            render: function(colorObj) {
                if (!colorObj || !colorObj.mode) {
                    return "transparent";
                }
                const resolveColor = cStr => {
                    if (!cStr || cStr === "transparent") {
                        return "transparent";
                    }
                    return cStr.startsWith("color-") ? `var(--${cStr})` : cStr;
                };
                switch (colorObj.mode) {
                    case "basic":
                        return resolveColor(colorObj.color);
                    case "hex":
                        return colorObj.hex;
                    case "variables":
                        return `var(--${colorObj.variables})`;
                    case "linearGradient": {
                        const gradientStops = (colorObj.stops || []).map(stop => `${resolveColor(stop.color)} ${stop.offset}%`).join(", ");
                        return `linear-gradient(
                                    ${colorObj.angle}deg,
                                    ${gradientStops}
                                )`;
                    }
                    case "backgroundIMG": {
                        const repeat = `
                                    ${colorObj.repeatX ? "repeat-x" : ""}
                                    ${colorObj.repeatY ? "repeat-y" : ""}
                                `.trim() || "no-repeat";
                        const posX = ["left", "center", "right"][colorObj.positionX - 1] || "center";
                        const posY = ["top", "center", "bottom"][colorObj.positionY - 1] || "center";
                        const attachment = colorObj.attachment ? "fixed" : "scroll";
                        if (colorObj.coloroverlay && colorObj.coloroverlay !== "transparent") {
                            const overlayStr = resolveColor(colorObj.coloroverlay);
                            return `
                                        linear-gradient(
                                            ${overlayStr},
                                            ${overlayStr}
                                        ),
                                        url("${colorObj.src}")
                                        ${posX}
                                        ${posY}
                                        / auto
                                        ${repeat}
                                        ${attachment}
                                    `;
                        }
                        return `
                                    url("${colorObj.src}")
                                    ${posX}
                                    ${posY}
                                    / auto
                                    ${repeat}
                                    ${attachment}
                                `;
                    }
                    case "inherit":
                        return "inherit";
                    case "none":
                    default:
                        return "transparent";
                }
            }
        },

        plete: {
            structureSample: {
                mode: "basic",
                color: "color-primaryColor"
            },
            displayType: "large",
            cssStyles: [{
                object: ".color-control-container",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-direction",
                    value: "column"
                }, {
                    key: "gap",
                    value: "10px"
                }, {
                    key: "padding",
                    value: "12px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "background",
                    value: "#ffffff"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "8px"
                }]
            }, {
                object: ".color-header",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "justify-content",
                    value: "space-between"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "gap",
                    value: "4px"
                }, {
                    key: "background",
                    value: "#f2f2f7"
                }, {
                    key: "padding",
                    value: "4px"
                }, {
                    key: "border-radius",
                    value: "8px"
                }, {
                    key: "border",
                    value: "1px solid #e5e5ea"
                }]
            }, {
                object: ".color-switch-btn",
                info: [{
                    key: "flex",
                    value: "1 1 0"
                }, {
                    key: "text-align",
                    value: "center"
                }, {
                    key: "padding",
                    value: "6px 4px"
                }, {
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "font-weight",
                    value: "500"
                }, {
                    key: "color",
                    value: "#3a3a3c"
                }, {
                    key: "border-radius",
                    value: "6px"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "border",
                    value: "none"
                }, {
                    key: "background",
                    value: "transparent"
                }, {
                    key: "transition",
                    value: "all 0.2s ease-in-out"
                }, {
                    key: "user-select",
                    value: "none"
                }, {
                    key: "white-space",
                    value: "nowrap"
                }]
            }, {
                object: ".color-switch-btn.active",
                info: [{
                    key: "background",
                    value: "#ffffff"
                }, {
                    key: "color",
                    value: "#000000"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.12)"
                }, {
                    key: "font-weight",
                    value: "600"
                }]
            }, {
                object: ".color-content-area",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-direction",
                    value: "column"
                }, {
                    key: "gap",
                    value: "10px"
                }]
            }, {
                object: ".color-row",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "gap",
                    value: "8px"
                }, {
                    key: "font-size",
                    value: "13px"
                }, {
                    key: "flex-wrap",
                    value: "wrap"
                }]
            }, {
                object: ".color-input",
                info: [{
                    key: "height",
                    value: "32px"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "6px"
                }, {
                    key: "padding",
                    value: "0 8px"
                }, {
                    key: "flex",
                    value: "1"
                }, {
                    key: "outline",
                    value: "none"
                }]
            }, {
                object: ".btn-action",
                info: [{
                    key: "padding",
                    value: "4px 8px"
                }, {
                    key: "background",
                    value: "#f3f4f6"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "4px"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "font-size",
                    value: "12px"
                }]
            }, {
                object: ".color-angle-slider",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "6px"
                }, {
                    key: "background",
                    value: "#e5e5ea"
                }, {
                    key: "border-radius",
                    value: "3px"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-angle-slider::-webkit-slider-thumb",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "width",
                    value: "16px"
                }, {
                    key: "height",
                    value: "16px"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#007aff"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.3)"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-angle-slider::-moz-range-thumb",
                info: [{
                    key: "width",
                    value: "16px"
                }, {
                    key: "height",
                    value: "16px"
                }, {
                    key: "border",
                    value: "none"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#007aff"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.3)"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-overlay-section",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-direction",
                    value: "column"
                }, {
                    key: "gap",
                    value: "10px"
                }, {
                    key: "padding",
                    value: "10px"
                }, {
                    key: "background",
                    value: "#fdfdfd"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "8px"
                }, {
                    key: "margin-top",
                    value: "2px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".color-overlay-toggle",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "space-between"
                }, {
                    key: "padding",
                    value: "8px 10px"
                }, {
                    key: "background",
                    value: "#f3f4f6"
                }, {
                    key: "border",
                    value: "1px solid #d2d2d7"
                }, {
                    key: "border-radius",
                    value: "6px"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "font-weight",
                    value: "600"
                }, {
                    key: "color",
                    value: "#3a3a3c"
                }, {
                    key: "text-align",
                    value: "left"
                }, {
                    key: "transition",
                    value: "all 0.2s ease-in-out"
                }, {
                    key: "user-select",
                    value: "none"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".color-overlay-toggle.active",
                info: [{
                    key: "background",
                    value: "#eaf3ff"
                }, {
                    key: "border-color",
                    value: "#b8d9ff"
                }, {
                    key: "color",
                    value: "#007aff"
                }]
            }, {
                object: ".color-overlay-toggle-indicator",
                info: [{
                    key: "width",
                    value: "8px"
                }, {
                    key: "height",
                    value: "8px"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#c7c7cc"
                }, {
                    key: "flex",
                    value: "0 0 auto"
                }, {
                    key: "transition",
                    value: "background 0.2s ease-in-out"
                }]
            }, {
                object: ".color-overlay-toggle.active .color-overlay-toggle-indicator",
                info: [{
                    key: "background",
                    value: "#007aff"
                }]
            }, {
                object: ".color-overlay-label",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "gap",
                    value: "8px"
                }]
            }, {
                object: ".color-overlay-color-label",
                info: [{
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "color",
                    value: "#666"
                }, {
                    key: "margin-bottom",
                    value: "2px"
                }]
            }, {
                object: ".color-overlay-opacity-row",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "gap",
                    value: "8px"
                }, {
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "color",
                    value: "#666"
                }]
            }, {
                object: ".color-overlay-opacity-slider",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "flex",
                    value: "1"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "6px"
                }, {
                    key: "background",
                    value: "#e5e5ea"
                }, {
                    key: "border-radius",
                    value: "3px"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-overlay-opacity-slider::-webkit-slider-thumb",
                info: [{
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "appearance",
                    value: "none"
                }, {
                    key: "width",
                    value: "16px"
                }, {
                    key: "height",
                    value: "16px"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#007aff"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.3)"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-overlay-opacity-slider::-moz-range-thumb",
                info: [{
                    key: "width",
                    value: "16px"
                }, {
                    key: "height",
                    value: "16px"
                }, {
                    key: "border",
                    value: "none"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "background",
                    value: "#007aff"
                }, {
                    key: "box-shadow",
                    value: "0 1px 3px rgba(0,0,0,0.3)"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-overlay-opacity-value",
                info: [{
                    key: "width",
                    value: "42px"
                }, {
                    key: "text-align",
                    value: "right"
                }, {
                    key: "font-variant-numeric",
                    value: "tabular-nums"
                }, {
                    key: "color",
                    value: "#666"
                }]
            }, {
                object: ".color-custom-picker",
                info: [{
                    key: "width",
                    value: "32px"
                }, {
                    key: "height",
                    value: "32px"
                }, {
                    key: "border-radius",
                    value: "50%"
                }, {
                    key: "overflow",
                    value: "hidden"
                }, {
                    key: "cursor",
                    value: "pointer"
                }, {
                    key: "position",
                    value: "relative"
                }, {
                    key: "flex",
                    value: "0 0 auto"
                }]
            }, {
                object: ".color-custom-picker input[type=\"color\"]",
                info: [{
                    key: "appearance",
                    value: "none"
                }, {
                    key: "-webkit-appearance",
                    value: "none"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "100%"
                }, {
                    key: "padding",
                    value: "0"
                }, {
                    key: "margin",
                    value: "0"
                }, {
                    key: "border",
                    value: "none"
                }, {
                    key: "outline",
                    value: "none"
                }, {
                    key: "background",
                    value: "transparent"
                }, {
                    key: "display",
                    value: "block"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".color-custom-picker input[type=\"color\"]::-webkit-color-swatch-wrapper",
                info: [{
                    key: "padding",
                    value: "0"
                }, {
                    key: "border",
                    value: "none"
                }]
            }, {
                object: ".color-custom-picker input[type=\"color\"]::-webkit-color-swatch",
                info: [{
                    key: "border",
                    value: "none"
                }, {
                    key: "border-radius",
                    value: "50%"
                }]
            }, {
                object: ".color-custom-picker-brush",
                info: [{
                    key: "position",
                    value: "absolute"
                }, {
                    key: "left",
                    value: "50%"
                }, {
                    key: "top",
                    value: "50%"
                }, {
                    key: "transform",
                    value: "translate(-50%, -50%)"
                }, {
                    key: "font-size",
                    value: "14px"
                }, {
                    key: "line-height",
                    value: "1"
                }, {
                    key: "pointer-events",
                    value: "none"
                }, {
                    key: "user-select",
                    value: "none"
                }, {
                    key: "z-index",
                    value: "2"
                }]
            }],
            component: class {
                constructor(dataArray, entryElement, entryConfig = {}, ctx) {
                    /*
                    * IMPORTANT:
                    *
                    * Keep the exact object supplied by the caller.
                    *
                    * If it is a Proxy, the Proxy stays the Proxy.
                    *
                    * The component does NOT create another Proxy.
                    */
                    this.thisPageObject = ctx;

                    this.dataArray = dataArray && Object.keys(dataArray).length > 0 ? dataArray : {
                        mode: "basic",
                        color: "color-primaryColor"
                    };
                    if (this.dataArray.mode === "none") {
                        this.dataArray.mode = "inherit";
                    }
                    this.entryElement = entryElement;
                    this.allowBackgroundIMG = entryConfig.backgroundIMG !== false;
                    this.themeColors = null;
                    this.container = document.createElement("div");
                    this.container.className = "color-control-container";
                    this.header = document.createElement("div");
                    this.header.className = "color-header";
                    const modes = [{
                        label: "Basic",
                        value: "basic"
                    }, {
                        label: "Gradient",
                        value: "linearGradient"
                    }, {
                        label: "Image",
                        value: "backgroundIMG",
                        hidden: !this.allowBackgroundIMG
                    }, {
                        label: "Inherit",
                        value: "inherit"
                    }];
                    this.modeButtons = {};
                    let activeMode = ["inherit"].includes(this.dataArray.mode) ? "inherit" : (this.dataArray.mode || "basic");
                    modes.forEach(mode => {
                        if (mode.hidden) return;
                        const btn = document.createElement("div");
                        btn.className = `color-switch-btn ${
                                    activeMode === mode.value ? "active" : ""
                                }`;
                        btn.textContent = mode.label;
                        btn.addEventListener("click", () => {
                            if (activeMode === mode.value) return;
                            Object.values(this.modeButtons).forEach(button => {
                                button.classList.remove("active");
                            });
                            btn.classList.add("active");
                            activeMode = mode.value;
                            this.initializeDataForMode(mode.value);
                            this.renderUI();
                        });
                        this.modeButtons[mode.value] = btn;
                        this.header.appendChild(btn);
                    });
                    this.container.appendChild(this.header);
                    this.contentArea = document.createElement("div");
                    this.contentArea.className = "color-content-area";
                    this.container.appendChild(this.contentArea);
                    this.renderUI();
                    this.entryElement.innerHTML = "";
                    this.entryElement.appendChild(this.container);
                }
                // Stop offset calculation
                recalculateStopsOffsets() {
                    if (!this.dataArray.stops || this.dataArray.stops.length === 0) {
                        return;
                    }
                    const count = this.dataArray.stops.length;
                    if (count === 1) {
                        this.dataArray.stops[0].offset = 0;
                        return;
                    }
                    const step = 100 / (count - 1);
                    this.dataArray.stops.forEach((stop, index) => {
                        stop.offset = Math.round(index * step);
                    });
                }
                // Initialize mode
                initializeDataForMode(mode) {
                    let newData = {
                        mode
                    };
                    switch (mode) {
                        case "basic":
                            newData.color = this.dataArray.color || "color-primaryColor";
                            break;
                        case "backgroundIMG":
                            newData.src = this.dataArray.src || "";
                            newData.repeatX = this.dataArray.repeatX ?? true;
                            newData.repeatY = this.dataArray.repeatY ?? false;
                            newData.positionX = this.dataArray.positionX || 2;
                            newData.positionY = this.dataArray.positionY || 2;
                            newData.attachment = this.dataArray.attachment ?? false;
                            newData.coloroverlay = this.dataArray.coloroverlay || "transparent";
                            break;
                        case "linearGradient":
                            newData.angle = this.dataArray.angle || 90;
                            newData.stops = this.dataArray.stops?.length >= 2 ? this.dataArray.stops : [{
                                color: "color-primaryColor",
                                offset: 0
                            }, {
                                color: "color-secondaryColor",
                                offset: 100
                            }];
                            break;
                        case "inherit":
                            break;
                    }
                    /*
                    * These are ordinary mutations.
                    *
                    * If dataArray is a Proxy,
                    * the external Proxy sees them.
                    */
                    Object.keys(this.dataArray).forEach(key => {
                        delete this.dataArray[key];
                    });
                    Object.assign(this.dataArray, newData);
                    if (mode === "linearGradient") {
                        this.recalculateStopsOffsets();
                    }
                }
                // Render UI
                renderUI() {
                    this.contentArea.innerHTML = "";
                    const mode = this.dataArray.mode;
                    if (!this.themeColors) {
                        const loadingMsg = document.createElement("div");
                        loadingMsg.className = "color-row";
                        loadingMsg.style.color = "#888";
                        loadingMsg.textContent = "Loading theme variables...";
                        this.contentArea.appendChild(loadingMsg);
                        return;
                    }
                    if (mode === "basic") {
                        this.buildBasicUI();
                    } else if (mode === "backgroundIMG") {
                        this.buildBackgroundImgUI();
                    } else if (mode === "linearGradient") {
                        this.buildGradientUI();
                    } else if (mode === "inherit") {
                        this.buildInheritUI();
                    }
                }
                // Color resolution
                getDisplayColor(colorVal) {
                    if (!colorVal || colorVal === "transparent") {
                        return "transparent";
                    }
                    if (colorVal.startsWith("color-")) {
                        const key = colorVal.replace("color-", "");
                        const raw = this.themeColors ? this.themeColors[key] : null;
                        return typeof raw === "object" && raw !== null ? (raw.hex || "#e5e5ea") : (raw || "#e5e5ea");
                    }
                    return colorVal;
                }
                // Palette
                buildPaletteSelector(currentValue, onSelectCallback) {
                    const container = document.createElement("div");
                    container.style.display = "grid";
                    container.style.gridTemplateColumns = "repeat(4, 1fr)";
                    container.style.gap = "8px";
                    container.style.padding = "10px";
                    container.style.background = "#f9f9fb";
                    container.style.borderRadius = "8px";
                    container.style.border = "1px solid #eaeaea";
                    container.style.justifyItems = "center";
                    const keys = ["primaryColor", "secondaryColor", "accentColor", "secondaryAccentColor", "costomColor1", "costomColor2", "costomColor3", "costomColor4", "neutralTextColor", "neutralBackgroundColor"];
                    const renderSwatch = (displayBg, isSelected, icon = "", title = "") => {
                        const swatch = document.createElement("div");
                        swatch.style.width = "32px";
                        swatch.style.height = "32px";
                        swatch.style.borderRadius = "50%";
                        swatch.style.background = displayBg;
                        swatch.style.cursor = "pointer";
                        swatch.style.display = "flex";
                        swatch.style.alignItems = "center";
                        swatch.style.justifyContent = "center";
                        swatch.title = title;
                        if (icon) {
                            swatch.innerHTML = icon;
                            swatch.style.fontSize = "14px";
                        }
                        if (isSelected) {
                            swatch.style.border = "2px solid #007aff";
                            swatch.style.boxShadow = "0 0 0 2px rgba(0,122,255,0.2)";
                        } else {
                            swatch.style.border = "1px solid rgba(0,0,0,0.15)";
                        }
                        return swatch;
                    };
                    const isTransparent = currentValue === "transparent";
                    const isThemeColor = currentValue && currentValue.startsWith("color-");
                    const isCustomHex = currentValue && !isThemeColor && !isTransparent;
                    keys.forEach(key => {
                        const expectedVar = `color-${key}`;
                        const rawColor = this.themeColors[key];
                        const displayColor = typeof rawColor === "object" && rawColor !== null ? (rawColor.hex || "#e5e5ea") : (rawColor || "#e5e5ea");
                        const isSelected = currentValue === expectedVar;
                        const swatch = renderSwatch(displayColor, isSelected, "", expectedVar);
                        swatch.addEventListener("click", () => onSelectCallback(expectedVar));
                        container.appendChild(swatch);
                    });
                    const customBg = isCustomHex ? currentValue : "#000000";
                    const customWrap = document.createElement("div");
                    customWrap.className = "color-custom-picker";
                    customWrap.style.border = isCustomHex ? "2px solid #007aff" : "1px solid rgba(0,0,0,0.15)";
                    customWrap.style.boxShadow = isCustomHex ? "0 0 0 2px rgba(0,122,255,0.2)" : "none";
                    const nativePicker = document.createElement("input");
                    nativePicker.type = "color";
                    nativePicker.value = customBg;
                    nativePicker.title = "Custom Color";
                    nativePicker.addEventListener("input", e => {
                        this.dataArray.color = e.target.value;
                    });
                    nativePicker.addEventListener("blur", e => {
                        // Stop this event from reaching the surrounding color-system controls.
                        e.stopPropagation();
                        // Save the selected value BEFORE anything causes the UI to re-render.
                        const selectedColor = e.target.value;
                        // IMPORTANT:
                        // Close the native color picker FIRST.
                        //
                        // onSelectCallback() can cause renderUI(),
                        // which destroys this input element.
                        //
                        // Therefore blur MUST happen before onSelectCallback().
                        nativePicker.blur();
                        // Now allow the color system to process the new value and re-render.
                        onSelectCallback(selectedColor);
                    });
                    customWrap.appendChild(nativePicker);
                    const brushOverlay = document.createElement("span");
                    brushOverlay.className = "color-custom-picker-brush";
                    brushOverlay.textContent = "🖌️";
                    customWrap.appendChild(brushOverlay);
                    container.appendChild(customWrap);
                    const checkerboard = "repeating-linear-gradient(" + "45deg, #e0e0e0 25%, transparent 25%, " + "transparent 75%, #e0e0e0 75%, #e0e0e0), " + "repeating-linear-gradient(" + "45deg, #e0e0e0 25%, #ffffff 25%, " + "#ffffff 75%, #e0e0e0 75%, #e0e0e0)";
                    const transparentSwatch = renderSwatch("transparent", isTransparent, "🚫", "Transparent / None");
                    transparentSwatch.style.backgroundImage = checkerboard;
                    transparentSwatch.style.backgroundPosition = "0 0, 6px 6px";
                    transparentSwatch.style.backgroundSize = "12px 12px";
                    transparentSwatch.addEventListener("click",
                        () => onSelectCallback("transparent"));
                    container.appendChild(transparentSwatch);
                    return container;
                }
                // Basic
                buildBasicUI() {
                    const palette = this.buildPaletteSelector(this.dataArray.color, newVal => {
                        /*
                        * This mutation goes directly
                        * through the external Proxy.
                        */
                        this.dataArray.color = newVal;
                        this.renderUI();
                    });
                    this.contentArea.appendChild(palette);
                }
                // Gradient
                buildGradientUI() {
                    /* =========================================================
                    ENSURE VALID STOPS
                    ========================================================= */

                    if (
                        !Array.isArray(this.dataArray.stops) ||
                        this.dataArray.stops.length < 2
                    ) {
                        this.dataArray.stops = [{
                                color: "color-primaryColor",
                                offset: 0
                            },
                            {
                                color: "color-secondaryColor",
                                offset: 100
                            }
                        ];
                    }

                    /* =========================================================
                    ACTIVE STOP
                    ========================================================= */

                    if (
                        typeof this.openStopIndex !== "number" ||
                        this.openStopIndex < 0 ||
                        this.openStopIndex >= this.dataArray.stops.length
                    ) {
                        this.openStopIndex = 0;
                    }


                    /* =========================================================
                    ANGLE
                    ========================================================= */

                    const angleRow = document.createElement("div");
                    angleRow.className = "color-row";

                    const range = document.createElement("input");
                    range.type = "range";
                    range.className = "color-angle-slider";
                    range.min = "0";
                    range.max = "360";
                    range.value = this.dataArray.angle ?? 90;
                    range.style.flex = "1";

                    const num = document.createElement("input");
                    num.type = "number";
                    num.min = "0";
                    num.max = "360";
                    num.className = "color-input";
                    num.style.width = "60px";
                    num.style.flex = "none";
                    num.value = this.dataArray.angle ?? 90;

                    const syncAngle = value => {
                        let safeValue = Number(value);

                        if (!Number.isFinite(safeValue)) {
                            safeValue = 90;
                        }

                        safeValue = Math.max(
                            0,
                            Math.min(360, safeValue)
                        );

                        this.dataArray.angle = safeValue;

                        range.value = safeValue;
                        num.value = safeValue;
                    };

                    range.addEventListener("input", event => {
                        syncAngle(event.target.value);
                    });

                    num.addEventListener("input", event => {
                        syncAngle(event.target.value);
                    });

                    angleRow.appendChild(
                        document.createTextNode("Angle (°):")
                    );

                    angleRow.appendChild(range);
                    angleRow.appendChild(num);

                    this.contentArea.appendChild(angleRow);


                    /* =========================================================
                    STOP TABS CONTAINER
                    ========================================================= */

                    const stopsTabsContainer =
                        document.createElement("div");

                    stopsTabsContainer.className =
                        "color-header";

                    stopsTabsContainer.style.marginTop = "10px";
                    stopsTabsContainer.style.display = "flex";
                    stopsTabsContainer.style.alignItems = "center";
                    stopsTabsContainer.style.gap = "4px";


                    /* =========================================================
                    SORTABLE STOP GROUP

                    IMPORTANT:
                    Only stopsGroup is sortable.
                    The "+" button is outside it.
                    ========================================================= */

                    const stopsGroup =
                        document.createElement("div");

                    stopsGroup.style.display = "flex";
                    stopsGroup.style.alignItems = "center";
                    stopsGroup.style.gap = "4px";
                    stopsGroup.style.minWidth = "0";
                    stopsGroup.style.flex = "1";
                    stopsGroup.style.overflowX = "auto";


                    /* =========================================================
                    BUILD STOP TABS
                    ========================================================= */

                    this.dataArray.stops.forEach((stop, index) => {

                        const tab =
                            document.createElement("div");

                        tab.className =
                            "color-switch-btn" +
                            (
                                this.openStopIndex === index ?
                                " active" :
                                ""
                            );

                        /*
                        * Allow the stop itself to receive focus.
                        */
                        tab.tabIndex = 0;

                        tab.dataset.stopIndex = index;

                        tab.style.flex = "0 0 auto";
                        tab.style.display = "flex";
                        tab.style.alignItems = "center";
                        tab.style.justifyContent = "center";
                        tab.style.padding = "6px 10px";
                        tab.style.cursor = "grab";
                        tab.style.userSelect = "none";


                        /* =====================================================
                        COLOR SWATCH
                        ===================================================== */

                        const iconSwatch =
                            document.createElement("div");

                        iconSwatch.style.width = "18px";
                        iconSwatch.style.height = "18px";
                        iconSwatch.style.borderRadius = "50%";
                        iconSwatch.style.border =
                            "1px solid rgba(0,0,0,0.2)";
                        iconSwatch.style.flex = "0 0 auto";

                        if (stop.color === "transparent") {

                            iconSwatch.style.backgroundImage =
                                "repeating-linear-gradient(" +
                                "45deg, #e0e0e0 25%, transparent 25%, " +
                                "transparent 75%, #e0e0e0 75%, #e0e0e0), " +
                                "repeating-linear-gradient(" +
                                "45deg, #e0e0e0 25%, #ffffff 25%, " +
                                "#ffffff 75%, #e0e0e0 75%, #e0e0e0)";

                            iconSwatch.style.backgroundSize =
                                "8px 8px";

                        } else {

                            iconSwatch.style.background =
                                this.getDisplayColor(stop.color);
                        }

                        tab.appendChild(iconSwatch);


                        /* =====================================================
                        TOOLTIP
                        ===================================================== */

                        tab.title =
                            `Stop ${index + 1} (${stop.offset}%)`;


                        /* =====================================================
                        CLICK / SELECT
                        ===================================================== */

                        tab.addEventListener("click", event => {

                            /*
                            * If Sortable is currently finishing a drag,
                            * don't treat the generated click as a normal
                            * selection.
                            */
                            if (tab.dataset.dragging === "true") {
                                event.preventDefault();
                                event.stopPropagation();
                                return;
                            }

                            const currentIndex =
                                Array.from(
                                    stopsGroup.children
                                ).indexOf(tab);

                            if (currentIndex < 0) {
                                return;
                            }

                            this.openStopIndex =
                                currentIndex;

                            this.renderUI();
                        });


                        /* =====================================================
                        KEYBOARD SELECTION
                        ===================================================== */

                        tab.addEventListener("keydown", event => {

                            if (
                                event.key === "Enter" ||
                                event.key === " "
                            ) {

                                event.preventDefault();

                                const currentIndex =
                                    Array.from(
                                        stopsGroup.children
                                    ).indexOf(tab);

                                if (currentIndex < 0) {
                                    return;
                                }

                                this.openStopIndex =
                                    currentIndex;

                                this.renderUI();
                            }
                        });


                        stopsGroup.appendChild(tab);
                    });


                    /* =========================================================
                    ADD STOP BUTTON
                    ========================================================= */

                    const addTab =
                        document.createElement("div");

                    addTab.className =
                        "color-switch-btn";

                    addTab.style.flex =
                        "0 0 auto";

                    addTab.style.fontWeight =
                        "bold";

                    addTab.style.padding =
                        "6px 10px";

                    addTab.style.cursor =
                        "pointer";

                    addTab.textContent =
                        "+";

                    addTab.title =
                        "Add Stop";


                    addTab.addEventListener("click", () => {

                        this.dataArray.stops.push({
                            color: "transparent",
                            offset: 100
                        });

                        /*
                        * Redistribute offsets.
                        */
                        this.recalculateStopsOffsets();

                        /*
                        * Select the newly-created stop.
                        */
                        this.openStopIndex =
                            this.dataArray.stops.length - 1;

                        this.renderUI();
                    });


                    /* =========================================================
                    HEADER
                    ========================================================= */

                    stopsTabsContainer.appendChild(
                        stopsGroup
                    );

                    stopsTabsContainer.appendChild(
                        addTab
                    );

                    this.contentArea.appendChild(
                        stopsTabsContainer
                    );


                    /* =========================================================
                    SORTABLE.JS
                    ========================================================= */

                    if (typeof Sortable !== "undefined") {

                        new Sortable(stopsGroup, {

                            animation: 150,

                            direction: "horizontal",

                            ghostClass: "gradient-stop-ghost",

                            chosenClass: "gradient-stop-chosen",

                            dragClass: "gradient-stop-drag",

                            forceFallback: false,

                            draggable: ".color-switch-btn",


                            /* =================================================
                            DRAG START

                            THIS IS THE IMPORTANT PART.

                            As soon as Sortable detects dragging:

                            1. Find dragged stop.
                            2. Make it active.
                            3. Focus it.
                            4. Do NOT renderUI().
                            ================================================= */

                            onStart: event => {

                                const draggedTab =
                                    event.item;


                                /*
                                * Find its current position.
                                */
                                const currentIndex =
                                    Array.from(
                                        stopsGroup.children
                                    ).indexOf(draggedTab);

                                if (currentIndex < 0) {
                                    return;
                                }


                                /*
                                * Make dragged stop the active stop
                                * immediately.
                                */
                                this.openStopIndex =
                                    currentIndex;


                                /*
                                * Remove active state from every
                                * other stop.
                                */
                                Array.from(
                                    stopsGroup.children
                                ).forEach(tab => {

                                    tab.classList.remove(
                                        "active"
                                    );
                                });


                                /*
                                * Make dragged stop active.
                                */
                                draggedTab.classList.add(
                                    "active"
                                );


                                /*
                                * Focus the dragged stop immediately.
                                *
                                * This is effectively the same focus
                                * behavior as clicking the menu.
                                */
                                draggedTab.focus({
                                    preventScroll: true
                                });


                                /*
                                * Mark as dragging so the click event
                                * generated by Sortable doesn't cause
                                * another selection.
                                */
                                draggedTab.dataset.dragging =
                                    "true";


                                /*
                                * Change cursor.
                                */
                                draggedTab.style.cursor =
                                    "grabbing";
                            },


                            /* =================================================
                            DRAG END
                            ================================================= */

                            onEnd: event => {

                                const draggedTab =
                                    event.item;

                                draggedTab.style.cursor =
                                    "grab";


                                /*
                                * The DOM order has already been changed
                                * by Sortable.
                                *
                                * Use newIndex as the final stop index.
                                */
                                this.openStopIndex =
                                    event.newIndex;


                                /* =================================================
                                NOTHING MOVED
                                ================================================= */

                                if (
                                    event.oldIndex ===
                                    event.newIndex
                                ) {

                                    /*
                                    * Clear dragging state after the
                                    * current pointer/click cycle.
                                    */
                                    setTimeout(() => {

                                        draggedTab.dataset.dragging =
                                            "false";

                                    }, 0);


                                    /*
                                    * Keep focus on the same element.
                                    */
                                    requestAnimationFrame(() => {

                                        draggedTab.focus({
                                            preventScroll: true
                                        });

                                    });

                                    return;
                                }


                                /* =================================================
                                MOVE DATA ARRAY
                                ================================================= */

                                const movedStop =
                                    this.dataArray.stops.splice(
                                        event.oldIndex,
                                        1
                                    )[0];


                                this.dataArray.stops.splice(
                                    event.newIndex,
                                    0,
                                    movedStop
                                );


                                /* =================================================
                                RECALCULATE OFFSETS
                                ================================================= */

                                this.recalculateStopsOffsets();


                                /* =================================================
                                REBUILD UI
                                ================================================= */

                                /*
                                * The current DOM belongs to Sortable and is
                                * about to be destroyed by renderUI().
                                */
                                this.renderUI();


                                /*
                                * renderUI() creates a new tab.
                                *
                                * Focus that newly-created tab after the
                                * new DOM is ready.
                                */
                                requestAnimationFrame(() => {

                                    const newTabs =
                                        this.contentArea.querySelectorAll(
                                            ".color-switch-btn[data-stop-index]"
                                        );

                                    const newActiveTab =
                                        newTabs[this.openStopIndex];

                                    if (newActiveTab) {

                                        newActiveTab.focus({
                                            preventScroll: true
                                        });
                                    }
                                });


                                /*
                                * Prevent Sortable's generated click from
                                * being interpreted as a normal click.
                                */
                                setTimeout(() => {

                                    if (newTabsAreStillDragging()) {
                                        return;
                                    }

                                }, 0);
                            }
                        });

                    } else {

                        console.warn(
                            "Sortable.js is not loaded. " +
                            "Gradient stops will not be draggable."
                        );
                    }


                    /* =========================================================
                    ACTIVE STOP EDITOR
                    ========================================================= */

                    const activeStop =
                        this.dataArray.stops[
                            this.openStopIndex
                        ];

                    if (!activeStop) {
                        return;
                    }


                    const editorArea =
                        document.createElement("div");

                    editorArea.style.padding =
                        "10px";

                    editorArea.style.background =
                        "#fdfdfd";

                    editorArea.style.border =
                        "1px solid #d2d2d7";

                    editorArea.style.borderRadius =
                        "8px";

                    editorArea.style.marginTop =
                        "4px";


                    /* =========================================================
                    CONTROLS ROW
                    ========================================================= */

                    const controlsRow =
                        document.createElement("div");

                    controlsRow.className =
                        "color-row";

                    controlsRow.style.marginBottom =
                        "10px";

                    controlsRow.style.justifyContent =
                        "space-between";


                    /* =========================================================
                    OFFSET
                    ========================================================= */

                    const offsetWrap =
                        document.createElement("div");

                    offsetWrap.className =
                        "color-row";

                    offsetWrap.style.fontSize =
                        "12px";

                    offsetWrap.style.color =
                        "#666";

                    offsetWrap.textContent =
                        `Offset: ${activeStop.offset}% (Auto)`;

                    controlsRow.appendChild(
                        offsetWrap
                    );


                    /* =========================================================
                    REMOVE STOP
                    ========================================================= */

                    const delBtn =
                        document.createElement("button");

                    delBtn.className =
                        "btn-action";

                    delBtn.type =
                        "button";

                    delBtn.textContent =
                        "Remove Stop";

                    delBtn.style.color =
                        "#d93025";

                    delBtn.disabled =
                        this.dataArray.stops.length <= 2;

                    if (delBtn.disabled) {

                        delBtn.style.opacity =
                            "0.5";

                        delBtn.style.cursor =
                            "not-allowed";
                    }


                    delBtn.addEventListener("click", () => {

                        if (
                            this.dataArray.stops.length <= 2
                        ) {
                            return;
                        }


                        this.dataArray.stops.splice(
                            this.openStopIndex,
                            1
                        );


                        this.recalculateStopsOffsets();


                        this.openStopIndex =
                            Math.min(
                                this.openStopIndex,
                                this.dataArray.stops.length - 1
                            );


                        this.renderUI();
                    });


                    controlsRow.appendChild(
                        delBtn
                    );

                    editorArea.appendChild(
                        controlsRow
                    );


                    /* =========================================================
                    COLOR PALETTE
                    ========================================================= */

                    const palette =
                        this.buildPaletteSelector(
                            activeStop.color,
                            newVal => {

                                activeStop.color =
                                    newVal;

                                this.renderUI();
                            }
                        );

                    editorArea.appendChild(
                        palette
                    );


                    /* =========================================================
                    APPEND EDITOR
                    ========================================================= */

                    this.contentArea.appendChild(
                        editorArea
                    );
                }
                // Image
                // Image
                buildBackgroundImgUI() {
                    /* ---------------------------------------------
                    HEX COLOR HELPERS
                    --------------------------------------------- */
                    const normalizeHex = value => {
                        if (!value || typeof value !== "string") {
                            return null;
                        }
                        let hex = value.trim();
                        // #RGB -> #RRGGBB
                        if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
                            hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
                        }
                        // #RGBA -> #RRGGBBAA
                        else if (/^#[0-9a-fA-F]{4}$/.test(hex)) {
                            hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] + hex[4] + hex[4];
                        }
                        if (!/^#[0-9a-fA-F]{6}$/.test(hex) && !/^#[0-9a-fA-F]{8}$/.test(hex)) {
                            return null;
                        }
                        return hex.toLowerCase();
                    };
                    const hexToOverlayState = value => {
                        const hex = normalizeHex(value);
                        if (!hex) {
                            return {
                                color: "#000000",
                                opacity: 100,
                                enabled: false
                            };
                        }
                        if (hex.length === 7) {
                            return {
                                color: hex,
                                opacity: 100,
                                enabled: true
                            };
                        }
                        const color = hex.substring(0, 7);
                        const alphaHex = hex.substring(7, 9);
                        const alpha = parseInt(alphaHex, 16);
                        return {
                            color,
                            opacity: Math.round((alpha / 255) * 100),
                            enabled: alpha > 0
                        };
                    };
                    const overlayState = hexToOverlayState(this.dataArray.coloroverlay);
                    /*
                    * IMPORTANT:
                    *
                    * Do not modify dataArray here.
                    *
                    * Existing JSON should be read as-is.
                    */
                    let overlayColor = overlayState.color;
                    let overlayOpacity = overlayState.opacity;
                    let overlayEnabled = this.dataArray.coloroverlay !== "transparent" && overlayState.enabled;
                    const opacityToHex = opacity => {
                        const safeOpacity = Math.max(0, Math.min(100, Number(opacity)));
                        return Math.round(
                            (safeOpacity / 100) * 255).toString(16).padStart(2, "0").toLowerCase();
                    };
                    const writeOverlayColor = () => {
                        if (!overlayEnabled) {
                            this.dataArray.coloroverlay = "transparent";
                            return;
                        }
                        const hex = normalizeHex(overlayColor);
                        if (!hex) {
                            this.dataArray.coloroverlay = "transparent";
                            return;
                        }
                        /*
                        * 100% opacity keeps the original
                        * six-digit HEX representation.
                        *
                        * This is important for backward compatibility.
                        */
                        if (overlayOpacity >= 100) {
                            this.dataArray.coloroverlay = hex.substring(0, 7);
                            return;
                        }
                        /*
                        * Less than 100% becomes HEX8:
                        *
                        * #RRGGBBAA
                        */
                        const alphaHex = opacityToHex(overlayOpacity);
                        this.dataArray.coloroverlay = hex.substring(0, 7) + alphaHex;
                    };
                    /* ---------------------------------------------
                    IMAGE SOURCE
                    --------------------------------------------- */
                    const srcRow = document.createElement("div");
                    srcRow.className = "color-row";
                    const srcInput = document.createElement("input");
                    srcInput.type = "text";
                    srcInput.className = "color-input";
                    srcInput.placeholder = "Image URL (src)";
                    srcInput.value = this.dataArray.src || "";
                    srcInput.addEventListener("input", e => {
                        this.dataArray.src = e.target.value;
                    });
                    srcRow.appendChild(srcInput);
                    this.contentArea.appendChild(srcRow);
                    /* ---------------------------------------------
                    REPEAT / ATTACHMENT
                    --------------------------------------------- */
                    const repeatRow = document.createElement("div");
                    repeatRow.className = "color-row";
                    repeatRow.innerHTML = `
                                
                            <label>
                                <input type="checkbox" id="rx">
                                    Repeat X
                                
                                </label>
                                <label>
                                    <input type="checkbox" id="ry">
                                    Repeat Y
                                
                                    </label>
                                    <label>
                                        <input type="checkbox" id="atch">
                                    Fixed Attach
                                
                                        </label>
                            `;
                    const rx = repeatRow.querySelector("#rx");
                    const ry = repeatRow.querySelector("#ry");
                    const atch = repeatRow.querySelector("#atch");
                    rx.checked = !!this.dataArray.repeatX;
                    ry.checked = !!this.dataArray.repeatY;
                    atch.checked = !!this.dataArray.attachment;
                    rx.addEventListener("change", e => {
                        this.dataArray.repeatX = e.target.checked;
                    });
                    ry.addEventListener("change", e => {
                        this.dataArray.repeatY = e.target.checked;
                    });
                    atch.addEventListener("change", e => {
                        this.dataArray.attachment = e.target.checked;
                    });
                    this.contentArea.appendChild(repeatRow);
                    /* ---------------------------------------------
                    POSITION
                    --------------------------------------------- */
                    const posRow = document.createElement("div");
                    posRow.className = "color-row";
                    const posX = document.createElement("select");
                    posX.className = "color-mode-select";
                    posX.innerHTML = `
                                
                                        <option value="1">Left</option>
                                        <option value="2">Center</option>
                                        <option value="3">Right</option>
                            `;
                    posX.value = this.dataArray.positionX || 2;
                    posX.addEventListener("change", e => {
                        this.dataArray.positionX = Number(e.target.value);
                    });
                    const posY = document.createElement("select");
                    posY.className = "color-mode-select";
                    posY.innerHTML = `
                                
                                        <option value="1">Top</option>
                                        <option value="2">Center</option>
                                        <option value="3">Bottom</option>
                            `;
                    posY.value = this.dataArray.positionY || 2;
                    posY.addEventListener("change", e => {
                        this.dataArray.positionY = Number(e.target.value);
                    });
                    posRow.appendChild(document.createTextNode("PosX:"));
                    posRow.appendChild(posX);
                    posRow.appendChild(document.createTextNode("PosY:"));
                    posRow.appendChild(posY);
                    this.contentArea.appendChild(posRow);
                    /* ---------------------------------------------
                    COLOR OVERLAY TOGGLE
                    --------------------------------------------- */
                    const toggle = document.createElement("button");
                    toggle.type = "button";
                    toggle.className = "color-overlay-toggle" + (overlayEnabled ? " active" : "");
                    const toggleLabel = document.createElement("span");
                    toggleLabel.className = "color-overlay-label";
                    const toggleIndicator = document.createElement("span");
                    toggleIndicator.className = "color-overlay-toggle-indicator";
                    const toggleText = document.createElement("span");
                    toggleText.textContent = "Color Overlay";
                    toggleLabel.appendChild(toggleIndicator);
                    toggleLabel.appendChild(toggleText);
                    toggle.appendChild(toggleLabel);
                    const toggleState = document.createElement("span");
                    toggleState.textContent = overlayEnabled ? "On" : "Off";
                    toggle.appendChild(toggleState);
                    const updateToggleUI = () => {
                        toggle.classList.toggle("active", overlayEnabled);
                        toggleState.textContent = overlayEnabled ? "On" : "Off";
                    };
                    toggle.addEventListener("click", () => {
                        overlayEnabled = !overlayEnabled;
                        if (overlayEnabled) {
                            /*
                            * If the previous value was transparent,
                            * start with the primary theme color.
                            *
                            * Otherwise preserve the existing color.
                            */
                            if (!normalizeHex(overlayColor)) {
                                overlayColor = this.getDisplayColor("color-primaryColor");
                            }
                            if (!normalizeHex(overlayColor)) {
                                overlayColor = "#007aff";
                            }
                            if (!Number.isFinite(overlayOpacity)) {
                                overlayOpacity = 100;
                            }
                        }
                        writeOverlayColor();
                        updateToggleUI();
                        this.renderUI();
                    });
                    this.contentArea.appendChild(toggle);
                    /* ---------------------------------------------
                    OVERLAY EDITOR
                    --------------------------------------------- */
                    if (!overlayEnabled) {
                        return;
                    }
                    const overlaySection = document.createElement("div");
                    overlaySection.className = "color-overlay-section";
                    /* ---------------------------------------------
                    COLOR
                    --------------------------------------------- */
                    const colorLabel = document.createElement("div");
                    colorLabel.className = "color-overlay-color-label";
                    colorLabel.textContent = "Overlay Color";
                    overlaySection.appendChild(colorLabel);
                    /*
                    * The existing palette is used here.
                    *
                    * It already supports:
                    *
                    * - theme colors
                    * - custom HEX
                    * - transparent
                    */
                    const palette = this.buildPaletteSelector(overlayColor, newVal => {
                        /*
                        * If the user explicitly chooses
                        * transparent, treat that as turning
                        * the overlay OFF.
                        */
                        if (newVal === "transparent") {
                            overlayEnabled = false;
                            this.dataArray.coloroverlay = "transparent";
                            this.renderUI();
                            return;
                        }
                        /*
                        * Theme variables need to be resolved
                        * into their actual HEX value because
                        * coloroverlay is persisted as HEX.
                        */
                        const resolved = this.getDisplayColor(newVal);
                        const normalized = normalizeHex(resolved);
                        if (!normalized) {
                            return;
                        }
                        overlayColor = normalized.substring(0, 7);
                        writeOverlayColor();
                        this.renderUI();
                    });
                    overlaySection.appendChild(palette);
                    /* ---------------------------------------------
                    OPACITY
                    --------------------------------------------- */
                    const opacityRow = document.createElement("div");
                    opacityRow.className = "color-overlay-opacity-row";
                    const opacityLabel = document.createElement("span");
                    opacityLabel.textContent = "Opacity:";
                    const opacitySlider = document.createElement("input");
                    opacitySlider.type = "range";
                    opacitySlider.min = "0";
                    opacitySlider.max = "100";
                    opacitySlider.step = "1";
                    opacitySlider.className = "color-overlay-opacity-slider";
                    opacitySlider.value = overlayOpacity;
                    const opacityValue = document.createElement("span");
                    opacityValue.className = "color-overlay-opacity-value";
                    const updateOpacityUI = value => {
                        overlayOpacity = Math.max(0, Math.min(100, Number(value)));
                        opacitySlider.value = overlayOpacity;
                        opacityValue.textContent = `${overlayOpacity}%`;
                        /*
                        * Opacity 0 means the resulting overlay
                        * is transparent.
                        *
                        * Keep the color available in memory/UI,
                        * but persist transparent because that is
                        * the original OFF representation.
                        */
                        if (overlayOpacity <= 0) {
                            this.dataArray.coloroverlay = "transparent";
                        } else {
                            writeOverlayColor();
                        }
                    };
                    updateOpacityUI(overlayOpacity);
                    opacitySlider.addEventListener("input", e => {
                        updateOpacityUI(e.target.value);
                    });
                    opacityRow.appendChild(opacityLabel);
                    opacityRow.appendChild(opacitySlider);
                    opacityRow.appendChild(opacityValue);
                    overlaySection.appendChild(opacityRow);
                    this.contentArea.appendChild(overlaySection);
                }
                // Inherit
                buildInheritUI() {
                    const row = document.createElement("div");
                    row.className = "color-row";
                    row.style.color = "#666";
                    row.textContent = "Color will be inherited from the parent.";
                    this.contentArea.appendChild(row);
                }
                // Init
                initResult() {
                    return async () => {
                        try {
                            const themeName = typeof this.thisPageObject !== "undefined" ? this.thisPageObject.theme : "defaultTheme";
                            const themeData = await flexEngineFlieSystem.readTheme(themeName);
                            const parsedTheme = typeof themeData === "string" ? JSON.parse(themeData) : themeData;
                            this.themeColors = parsedTheme.colors || {};
                            this.renderUI();
                        } catch (error) {
                            console.error("Theme variables failed to load:", error);
                        }
                        return {
                            code: 0
                        };
                    };
                }
                onSave() {
                    /*
                    * Return the actual data object.
                    *
                    * No onChange mechanism is used.
                    */
                    return this.dataArray;
                }
            },
            // Color renderer
            render: function(colorObj) {
                if (!colorObj || !colorObj.mode) {
                    return "transparent";
                }
                const resolveColor = cStr => {
                    if (!cStr || cStr === "transparent") {
                        return "transparent";
                    }
                    return cStr.startsWith("color-") ? `var(--${cStr})` : cStr;
                };
                switch (colorObj.mode) {
                    case "basic":
                        return resolveColor(colorObj.color);
                    case "hex":
                        return colorObj.hex;
                    case "variables":
                        return `var(--${colorObj.variables})`;
                    case "linearGradient": {
                        const gradientStops = (colorObj.stops || []).map(stop => `${resolveColor(stop.color)} ${stop.offset}%`).join(", ");
                        return `linear-gradient(
                                    ${colorObj.angle}deg,
                                    ${gradientStops}
                                )`;
                    }
                    case "backgroundIMG": {
                        const repeat = `
                                    ${colorObj.repeatX ? "repeat-x" : ""}
                                    ${colorObj.repeatY ? "repeat-y" : ""}
                                `.trim() || "no-repeat";
                        const posX = ["left", "center", "right"][colorObj.positionX - 1] || "center";
                        const posY = ["top", "center", "bottom"][colorObj.positionY - 1] || "center";
                        const attachment = colorObj.attachment ? "fixed" : "scroll";
                        if (colorObj.coloroverlay && colorObj.coloroverlay !== "transparent") {
                            const overlayStr = resolveColor(colorObj.coloroverlay);
                            return `
                                        linear-gradient(
                                            ${overlayStr},
                                            ${overlayStr}
                                        ),
                                        url("${colorObj.src}")
                                        ${posX}
                                        ${posY}
                                        / auto
                                        ${repeat}
                                        ${attachment}
                                    `;
                        }
                        return `
                                    url("${colorObj.src}")
                                    ${posX}
                                    ${posY}
                                    / auto
                                    ${repeat}
                                    ${attachment}
                                `;
                    }
                    case "inherit":
                        return "inherit";
                    case "none":
                    default:
                        return "transparent";
                }
            }
        }            
    },

    list: {
        list: {
            strutureSample: [],

            displayType: "popupMedium",

            cssStyles: [{
                // =================================================
                // ROOT
                // =================================================
                object: ".sort-list-root",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "max-width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // ADD AREA
                // =================================================
                object: ".sort-list-add",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-wrap",
                    value: "wrap"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "gap",
                    value: "8px"
                }, {
                    key: "margin-bottom",
                    value: "12px"
                }]
            }, {
                object: ".sort-list-input",
                info: [{
                    key: "flex",
                    value: "1 1 auto"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".sort-list-add-button",
                info: [{
                    key: "flex",
                    value: "0 0 auto"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // HEADER
                // =================================================
                object: ".sort-list-header",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-wrap",
                    value: "wrap"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "align-items",
                    value: "center"
                }]
            }, {
                // =================================================
                // LIST
                // =================================================
                object: ".sort-list-list",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-direction",
                    value: "column"
                }, {
                    key: "flex-wrap",
                    value: "wrap"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "max-width",
                    value: "100%"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // ROW
                // =================================================
                object: ".sort-list-row",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-wrap",
                    value: "wrap"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "max-width",
                    value: "100%"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "align-items",
                    value: "center"
                }]
            }, {
                // =================================================
                // DRAG COLUMN
                // =================================================
                object: ".sort-list-drag",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex",
                    value: "0 0 30px"
                }, {
                    key: "width",
                    value: "30px"
                }, {
                    key: "min-width",
                    value: "30px"
                }, {
                    key: "max-width",
                    value: "30px"
                }, {
                    key: "height",
                    value: "30px"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "center"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".sort-list-handle",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "height",
                    value: "100%"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "center"
                }, {
                    key: "cursor",
                    value: "grab"
                }, {
                    key: "user-select",
                    value: "none"
                }, {
                    key: "touch-action",
                    value: "none"
                }]
            }, {
                // =================================================
                // NAME COLUMN
                // =================================================
                object: ".sort-list-name",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex",
                    value: "1 1 0"
                }, {
                    key: "width",
                    value: "auto"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // NAME INPUT
                // =================================================
                object: ".sort-list-name-input",
                info: [{
                    key: "display",
                    value: "block"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "height",
                    value: "30px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // TEXT FIELD = 200px
                // =================================================
                object: ".sort-list-field-text",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex",
                    value: "0 0 200px"
                }, {
                    key: "width",
                    value: "200px"
                }, {
                    key: "min-width",
                    value: "200px"
                }, {
                    key: "max-width",
                    value: "200px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // INTEGER FIELD = 60px
                // =================================================
                object: ".sort-list-field-integer",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex",
                    value: "0 0 60px"
                }, {
                    key: "width",
                    value: "60px"
                }, {
                    key: "min-width",
                    value: "60px"
                }, {
                    key: "max-width",
                    value: "60px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // CHECKMARK FIELD = 60px
                // =================================================
                object: ".sort-list-field-checkmark",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex",
                    value: "0 0 60px"
                }, {
                    key: "width",
                    value: "60px"
                }, {
                    key: "min-width",
                    value: "60px"
                }, {
                    key: "max-width",
                    value: "60px"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "center"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // FIELD INPUT
                // =================================================
                object: ".sort-list-field-input",
                info: [{
                    key: "display",
                    value: "block"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "height",
                    value: "30px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // CHECKBOX
                // =================================================
                object: ".sort-list-field-checkbox",
                info: [{
                    key: "width",
                    value: "18px"
                }, {
                    key: "height",
                    value: "18px"
                }, {
                    key: "margin",
                    value: "0"
                }]
            }, {
                // =================================================
                // DELETE COLUMN = 40px
                // =================================================
                object: ".sort-list-delete",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex",
                    value: "0 0 40px"
                }, {
                    key: "width",
                    value: "40px"
                }, {
                    key: "min-width",
                    value: "40px"
                }, {
                    key: "max-width",
                    value: "40px"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "center"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                // =================================================
                // DELETE BUTTON
                // =================================================
                object: ".sort-list-remove",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "center"
                }, {
                    key: "width",
                    value: "28px"
                }, {
                    key: "height",
                    value: "28px"
                }, {
                    key: "padding",
                    value: "0"
                }, {
                    key: "border",
                    value: "0"
                }, {
                    key: "background",
                    value: "transparent"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                // =================================================
                // GHOST
                // =================================================
                object: ".sort-list-ghost",
                info: [{
                    key: "opacity",
                    value: "0.35"
                }]
            }],

            component: class {

                constructor(
                    dataArray,
                    entryElement,
                    elementSetting
                ) {

                    // =================================================
                    // BASIC REFERENCES
                    // =================================================

                    this.previewElement = entryElement[0];
                    this.popupElement = entryElement[1];
                    this.elementSetting = elementSetting;


                    // =================================================
                    // ORIGINAL DATA
                    // =================================================

                    /*
                    * This can be your Proxy.
                    *
                    * NEVER edit this directly while the popup
                    * is being edited.
                    */

                    this.originalDataArray = dataArray;


                    // =================================================
                    // EXTRA FIELDS
                    // =================================================

                    this.extraFields =
                        Array.isArray(
                            elementSetting.extraFields
                        )
                            ? elementSetting.extraFields.map(
                                field => ({
                                    label: field.label ?? "",
                                    type: this.normalizeFieldType(
                                        field.type
                                    ),
                                    default: field.default,
                                    optional:
                                        field.optional === true
                                })
                            )
                            : [];


                    // =================================================
                    // WORKING ARRAY
                    // =================================================

                    const sourceArray =
                        Array.isArray(dataArray)
                            ? dataArray
                            : (
                                Array.isArray(
                                    elementSetting.default
                                )
                                    ? elementSetting.default
                                    : []
                            );


                    /*
                    * Create separate objects.
                    *
                    * The popup works ONLY with this array.
                    */

                    this.workingArray =
                        sourceArray.map(
                            item => this.cloneItem(item)
                        );


                    // =================================================
                    // SORTABLE
                    // =================================================

                    this.sortable = null;


                    // =================================================
                    // PREVIEW
                    // =================================================

                    this.previewElement.innerHTML = "";

                    this.previewText =
                        document.createElement("p");

                    this.previewElement.appendChild(
                        this.previewText
                    );


                    // =================================================
                    // POPUP ROOT
                    // =================================================

                    this.popupElement.innerHTML = "";

                    this.rootElement =
                        document.createElement("div");

                    this.rootElement.className =
                        "sort-list-root";

                    this.popupElement.appendChild(
                        this.rootElement
                    );


                    // =================================================
                    // ADD AREA
                    // =================================================

                    const addArea =
                        document.createElement("div");

                    addArea.className =
                        "sort-list-add";


                    this.addInput =
                        document.createElement("input");

                    this.addInput.type =
                        "text";

                    this.addInput.className =
                        "sort-list-input";

                    this.addInput.placeholder =
                        "Add list element...";


                    const addButton =
                        document.createElement("button");

                    addButton.type =
                        "button";

                    addButton.className =
                        "sort-list-add-button";

                    addButton.textContent =
                        "Add";


                    addArea.appendChild(
                        this.addInput
                    );

                    addArea.appendChild(
                        addButton
                    );

                    this.rootElement.appendChild(
                        addArea
                    );


                    // =================================================
                    // HEADER
                    // =================================================

                    this.headerElement =
                        document.createElement("div");

                    this.headerElement.className =
                        "sort-list-header";


                    // Drag header

                    this.headerElement.appendChild(
                        this.createHeaderCell(
                            "",
                            "sort-list-drag"
                        )
                    );


                    // Name header

                    this.headerElement.appendChild(
                        this.createHeaderCell(
                            "Name",
                            "sort-list-name"
                        )
                    );


                    // Extra headers

                    this.extraFields.forEach(
                        field => {

                            let label =
                                field.label;

                            if (field.optional) {
                                label += " (optional)";
                            }

                            this.headerElement.appendChild(
                                this.createHeaderCell(
                                    label,
                                    this.getFieldClass(
                                        field
                                    )
                                )
                            );
                        }
                    );


                    // Delete header

                    this.headerElement.appendChild(
                        this.createHeaderCell(
                            "Delete",
                            "sort-list-delete"
                        )
                    );


                    this.rootElement.appendChild(
                        this.headerElement
                    );


                    // =================================================
                    // LIST
                    // =================================================

                    this.listElement =
                        document.createElement("div");

                    this.listElement.className =
                        "sort-list-list";

                    this.rootElement.appendChild(
                        this.listElement
                    );


                    // =================================================
                    // ADD HANDLERS
                    // =================================================

                    const addItem = () => {

                        const value =
                            this.addInput.value.trim();

                        if (!value) {
                            return;
                        }


                        const item =
                            this.createDefaultItem(
                                value
                            );


                        /*
                        * Add to working data.
                        */

                        this.workingArray.push(
                            item
                        );


                        /*
                        * IMPORTANT:
                        *
                        * Do NOT render the whole list.
                        *
                        * Just create one new row.
                        */

                        const row =
                            this.createRow(
                                item
                            );

                        this.listElement.appendChild(
                            row
                        );


                        this.addInput.value = "";

                        this.addInput.focus();


                        this.updatePreview();
                    };


                    addButton.addEventListener(
                        "click",
                        addItem
                    );


                    this.addInput.addEventListener(
                        "keydown",
                        event => {

                            if (
                                event.key ===
                                "Enter"
                            ) {

                                event.preventDefault();

                                addItem();
                            }
                        }
                    );


                    // =================================================
                    // INITIAL BUILD
                    // =================================================

                    /*
                    * This is the ONLY full construction.
                    */

                    this.renderListOnce();


                    // =================================================
                    // PREVIEW
                    // =================================================

                    this.updatePreview();
                }


                // =================================================
                // FIELD TYPE
                // =================================================

                normalizeFieldType(type) {

                    const value =
                        String(
                            type ?? "text"
                        ).toLowerCase();


                    if (
                        value === "integer"
                    ) {
                        return "integer";
                    }


                    if (
                        value === "checkmark" ||
                        value === "checkbox" ||
                        value === "check"
                    ) {
                        return "checkmark";
                    }


                    return "text";
                }


                // =================================================
                // DEFAULT FIELD VALUE
                // =================================================

                getDefaultFieldValue(field) {

                    if (
                        field.default !==
                        undefined
                    ) {

                        return this.normalizeFieldValue(
                            field,
                            field.default
                        );
                    }


                    switch (field.type) {

                        case "integer":
                            return 0;

                        case "checkmark":
                            return false;

                        case "text":
                        default:
                            return "";
                    }
                }


                // =================================================
                // NORMALIZE FIELD VALUE
                // =================================================

                normalizeFieldValue(
                    field,
                    value
                ) {

                    switch (field.type) {

                        case "integer": {

                            if (
                                value === "" ||
                                value === null ||
                                value === undefined
                            ) {

                                return 0;
                            }


                            const number =
                                Number(value);


                            return Number.isFinite(
                                number
                            )
                                ? Math.trunc(number)
                                : 0;
                        }


                        case "checkmark":

                            return Boolean(
                                value
                            );


                        case "text":
                        default:

                            return (
                                value === null ||
                                value === undefined
                            )
                                ? ""
                                : String(value);
                    }
                }


                // =================================================
                // CLONE ITEM
                // =================================================

                cloneItem(item) {

                    /*
                    * Existing object
                    */

                    if (
                        item &&
                        typeof item === "object" &&
                        !Array.isArray(item)
                    ) {

                        const result = {
                            ...item
                        };


                        result.name =
                            result.name ??
                            "";


                        this.extraFields.forEach(
                            field => {

                                if (
                                    result[field.label] ===
                                    undefined
                                ) {

                                    result[field.label] =
                                        this.getDefaultFieldValue(
                                            field
                                        );

                                } else {

                                    result[field.label] =
                                        this.normalizeFieldValue(
                                            field,
                                            result[field.label]
                                        );
                                }
                            }
                        );


                        return result;
                    }


                    /*
                    * Primitive item
                    */

                    const result = {
                        name:
                            item === null ||
                            item === undefined
                                ? ""
                                : String(item)
                    };


                    this.extraFields.forEach(
                        field => {

                            result[field.label] =
                                this.getDefaultFieldValue(
                                    field
                                );
                        }
                    );


                    return result;
                }


                // =================================================
                // CREATE DEFAULT ITEM
                // =================================================

                createDefaultItem(
                    name
                ) {

                    const item = {
                        name: String(name)
                    };


                    this.extraFields.forEach(
                        field => {

                            item[field.label] =
                                this.getDefaultFieldValue(
                                    field
                                );
                        }
                    );


                    return item;
                }


                // =================================================
                // FIELD CLASS
                // =================================================

                getFieldClass(field) {

                    switch (field.type) {

                        case "text":
                            return "sort-list-field-text";

                        case "integer":
                            return "sort-list-field-integer";

                        case "checkmark":
                            return "sort-list-field-checkmark";

                        default:
                            return "sort-list-field-text";
                    }
                }


                // =================================================
                // HEADER CELL
                // =================================================

                createHeaderCell(
                    text,
                    className
                ) {

                    const element =
                        document.createElement("div");

                    element.className =
                        className;

                    element.textContent =
                        text;

                    return element;
                }


                // =================================================
                // CREATE FIELD INPUT
                // =================================================

                createFieldInput(
                    field,
                    item
                ) {

                    let input;


                    switch (field.type) {

                        // -----------------------------------------
                        // INTEGER
                        // -----------------------------------------

                        case "integer": {

                            input =
                                document.createElement(
                                    "input"
                                );

                            input.type =
                                "number";

                            input.step =
                                "1";

                            input.className =
                                "sort-list-field-input";


                            input.value =
                                item[field.label] ?? "";


                            /*
                            * IMPORTANT:
                            *
                            * Only modify the item.
                            *
                            * Do NOT rebuild anything.
                            */

                            input.addEventListener(
                                "input",
                                () => {

                                    if (
                                        input.value ===
                                        ""
                                    ) {

                                        if (
                                            field.optional
                                        ) {

                                            item[field.label] =
                                                "";

                                        } else {

                                            item[field.label] =
                                                this.getDefaultFieldValue(
                                                    field
                                                );
                                        }

                                        return;
                                    }


                                    item[field.label] =
                                        this.normalizeFieldValue(
                                            field,
                                            input.value
                                        );
                                }
                            );


                            break;
                        }


                        // -----------------------------------------
                        // CHECKMARK
                        // -----------------------------------------

                        case "checkmark": {

                            input =
                                document.createElement(
                                    "input"
                                );

                            input.type =
                                "checkbox";

                            input.className =
                                "sort-list-field-checkbox";

                            input.checked =
                                Boolean(
                                    item[field.label]
                                );


                            input.addEventListener(
                                "change",
                                () => {

                                    item[field.label] =
                                        input.checked;
                                }
                            );


                            return input;
                        }


                        // -----------------------------------------
                        // TEXT
                        // -----------------------------------------

                        case "text":

                        default: {

                            input =
                                document.createElement(
                                    "input"
                                );

                            input.type =
                                "text";

                            input.className =
                                "sort-list-field-input";


                            input.value =
                                item[field.label] ?? "";


                            input.addEventListener(
                                "input",
                                () => {

                                    item[field.label] =
                                        input.value;
                                }
                            );


                            break;
                        }
                    }


                    if (
                        field.optional ===
                        false
                    ) {

                        input.dataset.required =
                            "true";
                    }


                    return input;
                }


                // =================================================
                // CREATE ONE ROW
                // =================================================

                createRow(item) {

                    const row =
                        document.createElement("div");

                    row.className =
                        "sort-list-row";


                    /*
                    * Keep direct reference to the
                    * corresponding working item.
                    */

                    row._sortListItem =
                        item;


                    // =================================================
                    // DRAG COLUMN
                    // =================================================

                    const dragCell =
                        document.createElement("div");

                    dragCell.className =
                        "sort-list-drag";


                    const handle =
                        document.createElement("span");

                    handle.className =
                        "sort-list-handle";

                    handle.textContent =
                        "☷";


                    dragCell.appendChild(
                        handle
                    );

                    row.appendChild(
                        dragCell
                    );


                    // =================================================
                    // NAME COLUMN
                    // =================================================

                    const nameCell =
                        document.createElement("div");

                    nameCell.className =
                        "sort-list-name";


                    const nameInput =
                        document.createElement("input");

                    nameInput.type =
                        "text";

                    nameInput.className =
                        "sort-list-name-input";

                    nameInput.value =
                        item.name ?? "";


                    /*
                    * EXACTLY like your successful sample:
                    *
                    * change the object,
                    * do not rebuild the row.
                    */

                    nameInput.addEventListener(
                        "input",
                        () => {

                            item.name =
                                nameInput.value;

                            this.updatePreview();
                        }
                    );


                    nameCell.appendChild(
                        nameInput
                    );

                    row.appendChild(
                        nameCell
                    );


                    // =================================================
                    // EXTRA FIELDS
                    // =================================================

                    this.extraFields.forEach(
                        field => {

                            const cell =
                                document.createElement(
                                    "div"
                                );

                            /*
                            * Same width class as the
                            * header column.
                            */

                            cell.className =
                                this.getFieldClass(
                                    field
                                );


                            const input =
                                this.createFieldInput(
                                    field,
                                    item
                                );


                            cell.appendChild(
                                input
                            );

                            row.appendChild(
                                cell
                            );
                        }
                    );


                    // =================================================
                    // DELETE COLUMN
                    // =================================================

                    const deleteCell =
                        document.createElement("div");

                    deleteCell.className =
                        "sort-list-delete";


                    const deleteButton =
                        document.createElement("button");

                    deleteButton.type =
                        "button";

                    deleteButton.className =
                        "sort-list-remove";

                    deleteButton.textContent =
                        "×";


                    deleteButton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            /*
                            * Find item by reference.
                            *
                            * This remains correct even
                            * after the list has been sorted.
                            */

                            const index =
                                this.workingArray.indexOf(
                                    item
                                );


                            if (
                                index === -1
                            ) {
                                return;
                            }


                            /*
                            * Remove ONE object
                            * from the working data.
                            */

                            this.workingArray.splice(
                                index,
                                1
                            );


                            /*
                            * Remove ONE DOM row.
                            *
                            * No re-render.
                            */

                            row.remove();


                            this.updatePreview();
                        }
                    );


                    deleteCell.appendChild(
                        deleteButton
                    );

                    row.appendChild(
                        deleteCell
                    );


                    return row;
                }


                // =================================================
                // INITIAL LIST BUILD
                // =================================================

                renderListOnce() {

                    /*
                    * Full DOM construction occurs
                    * only here.
                    */

                    this.listElement.innerHTML = "";


                    this.workingArray.forEach(
                        item => {

                            this.listElement.appendChild(
                                this.createRow(item)
                            );
                        }
                    );


                    this.createSortable();
                }


                // =================================================
                // CREATE SORTABLE
                // =================================================

                createSortable() {

                    if (
                        typeof Sortable ===
                        "undefined"
                    ) {

                        return;
                    }


                    /*
                    * IMPORTANT:
                    *
                    * There is NO filter here.
                    *
                    * Sorting is activated ONLY from
                    * .sort-list-handle.
                    *
                    * Therefore the input remains a
                    * completely normal editable input.
                    */

                    this.sortable =
                        new Sortable(
                            this.listElement,
                            {

                                animation:
                                    150,

                                direction:
                                    "vertical",

                                draggable:
                                    ".sort-list-row",

                                handle:
                                    ".sort-list-handle",

                                ghostClass:
                                    "sort-list-ghost",

                                /*
                                * Do not use filter:
                                * "input, button"
                                */

                                onEnd:
                                    event => {

                                        const oldIndex =
                                            event.oldIndex;

                                        const newIndex =
                                            event.newIndex;


                                        if (
                                            oldIndex ===
                                            undefined ||
                                            newIndex ===
                                            undefined ||
                                            oldIndex ===
                                            newIndex
                                        ) {

                                            return;
                                        }


                                        /*
                                        * Sortable has already
                                        * moved the DOM node.
                                        *
                                        * We only move the
                                        * working data.
                                        */

                                        const movedItem =
                                            this.workingArray.splice(
                                                oldIndex,
                                                1
                                            )[0];


                                        this.workingArray.splice(
                                            newIndex,
                                            0,
                                            movedItem
                                        );


                                        /*
                                        * Absolutely NO
                                        * renderListOnce().
                                        */

                                        this.updatePreview();
                                    }
                            }
                        );
                }


                // =================================================
                // PREVIEW
                // =================================================

                updatePreview() {

                    /*
                    * Only update the preview element.
                    *
                    * Nothing in the popup is recreated.
                    */

                    this.previewText.textContent =
                        this.workingArray
                            .map(
                                item =>
                                    item.name
                            )
                            .join(", ");
                }


                // =================================================
                // POPUP CLOSE
                // =================================================

                onPopupClose() {

                    /*
                    * Do not commit.
                    *
                    * Do not rebuild.
                    *
                    * Do not destroy the inputs.
                    */

                    this.updatePreview();
                }


                // =================================================
                // SAVE
                // =================================================

                onSave() {

                    // ---------------------------------------------
                    // Destroy Sortable.
                    // ---------------------------------------------

                    if (
                        this.sortable
                    ) {

                        this.sortable.destroy();

                        this.sortable = null;
                    }


                    // ---------------------------------------------
                    // Commit only now.
                    // ---------------------------------------------

                    if (
                        Array.isArray(
                            this.originalDataArray
                        )
                    ) {

                        this.originalDataArray.splice(
                            0,
                            this.originalDataArray.length,
                            ...this.workingArray
                        );


                        return this.originalDataArray;
                    }


                    return this.workingArray;
                }


                // =================================================
                // RESULT
                // =================================================

                initResult() {

                    return {
                        code: 0
                    };
                }
            },


            // =================================================
            // CANVAS PREVIEW
            // =================================================

            render: function(dataArray) {
                return dataArray;
            }
        },

		category: {
			strutureSample: [],
			displayType: "popupMedium",
			cssStyles: [
				// ============================================================
				// ROOT
				// ============================================================
				{
					object: ".sort-list-root",
					info: [{
						key: "width",
						value: "100%"
					}, {
						key: "max-width",
						value: "100%"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// ADD
				// ============================================================
				{
					object: ".sort-list-add",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex-wrap",
						value: "wrap"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "gap",
						value: "8px"
					}, {
						key: "margin-bottom",
						value: "15px"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				}, {
					object: ".sort-list-input",
					info: [{
						key: "flex",
						value: "1 1 0"
					}, {
						key: "min-width",
						value: "0"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				}, {
					object: ".sort-list-add-category",
					info: [{
						key: "flex",
						value: "0 0 140px"
					}, {
						key: "width",
						value: "140px"
					}, {
						key: "min-width",
						value: "140px"
					}, {
						key: "max-width",
						value: "140px"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				}, {
					object: ".sort-list-add-button",
					info: [{
						key: "flex",
						value: "0 0 auto"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// SINGLE HEADER
				// ============================================================
				{
					object: ".sort-list-header",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex-wrap",
						value: "wrap"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "align-items",
						value: "center"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// LIST
				// ============================================================
				{
					object: ".sort-list-list",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex-direction",
						value: "column"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "max-width",
						value: "100%"
					}, {
						key: "min-width",
						value: "0"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// CATEGORY
				//
				// THE ENTIRE TITLE IS THE HANDLE.
				// ============================================================
				{
					object: ".sort-list-category-title",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "min-height",
						value: "36px"
					}, {
						key: "align-items",
						value: "center"
					}, {
						key: "box-sizing",
						value: "border-box"
					}, {
						key: "margin",
						value: "18px 0 8px 0"
					}, {
						key: "padding",
						value: "6px 10px"
					}, {
						key: "font-size",
						value: "18px"
					}, {
						key: "font-weight",
						value: "bold"
					}, {
						key: "cursor",
						value: "grab"
					}, {
						key: "user-select",
						value: "none"
					}, {
						key: "touch-action",
						value: "none"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// CATEGORY GHOST
				// ============================================================
				{
					object: ".sort-list-category-ghost",
					info: [{
						key: "opacity",
						value: "0.35"
					}]
				},
				// ============================================================
				// ROW
				// ============================================================
				{
					object: ".sort-list-row",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex-wrap",
						value: "wrap"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "max-width",
						value: "100%"
					}, {
						key: "min-width",
						value: "0"
					}, {
						key: "align-items",
						value: "center"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// ROW DRAG
				// ============================================================
				{
					object: ".sort-list-drag",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex",
						value: "0 0 30px"
					}, {
						key: "width",
						value: "30px"
					}, {
						key: "min-width",
						value: "30px"
					}, {
						key: "max-width",
						value: "30px"
					}, {
						key: "height",
						value: "30px"
					}, {
						key: "align-items",
						value: "center"
					}, {
						key: "justify-content",
						value: "center"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				}, {
					object: ".sort-list-handle",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "height",
						value: "100%"
					}, {
						key: "align-items",
						value: "center"
					}, {
						key: "justify-content",
						value: "center"
					}, {
						key: "cursor",
						value: "grab"
					}, {
						key: "user-select",
						value: "none"
					}, {
						key: "touch-action",
						value: "none"
					}]
				},
				// ============================================================
				// NAME
				// ============================================================
				{
					object: ".sort-list-name",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex",
						value: "1 1 0"
					}, {
						key: "min-width",
						value: "0"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				}, {
					object: ".sort-list-name-input",
					info: [{
						key: "display",
						value: "block"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "min-width",
						value: "0"
					}, {
						key: "height",
						value: "30px"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// TEXT
				// ============================================================
				{
					object: ".sort-list-field-text",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex",
						value: "0 0 200px"
					}, {
						key: "width",
						value: "200px"
					}, {
						key: "min-width",
						value: "200px"
					}, {
						key: "max-width",
						value: "200px"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// INTEGER
				// ============================================================
				{
					object: ".sort-list-field-integer",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex",
						value: "0 0 60px"
					}, {
						key: "width",
						value: "60px"
					}, {
						key: "min-width",
						value: "60px"
					}, {
						key: "max-width",
						value: "60px"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// CHECKMARK
				// ============================================================
				{
					object: ".sort-list-field-checkmark",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex",
						value: "0 0 60px"
					}, {
						key: "width",
						value: "60px"
					}, {
						key: "min-width",
						value: "60px"
					}, {
						key: "max-width",
						value: "60px"
					}, {
						key: "align-items",
						value: "center"
					}, {
						key: "justify-content",
						value: "center"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// INPUT
				// ============================================================
				{
					object: ".sort-list-field-input",
					info: [{
						key: "display",
						value: "block"
					}, {
						key: "width",
						value: "100%"
					}, {
						key: "min-width",
						value: "0"
					}, {
						key: "height",
						value: "30px"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				},
				// ============================================================
				// CHECKBOX
				// ============================================================
				{
					object: ".sort-list-field-checkbox",
					info: [{
						key: "width",
						value: "18px"
					}, {
						key: "height",
						value: "18px"
					}, {
						key: "margin",
						value: "0"
					}]
				},
				// ============================================================
				// DELETE
				// ============================================================
				{
					object: ".sort-list-delete",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "flex",
						value: "0 0 40px"
					}, {
						key: "width",
						value: "40px"
					}, {
						key: "min-width",
						value: "40px"
					}, {
						key: "max-width",
						value: "40px"
					}, {
						key: "align-items",
						value: "center"
					}, {
						key: "justify-content",
						value: "center"
					}, {
						key: "box-sizing",
						value: "border-box"
					}]
				}, {
					object: ".sort-list-remove",
					info: [{
						key: "display",
						value: "flex"
					}, {
						key: "align-items",
						value: "center"
					}, {
						key: "justify-content",
						value: "center"
					}, {
						key: "width",
						value: "28px"
					}, {
						key: "height",
						value: "28px"
					}, {
						key: "padding",
						value: "0"
					}, {
						key: "border",
						value: "0"
					}, {
						key: "background",
						value: "transparent"
					}, {
						key: "cursor",
						value: "pointer"
					}]
				},
				// ============================================================
				// GHOST
				// ============================================================
				{
					object: ".sort-list-ghost",
					info: [{
						key: "opacity",
						value: "0.35"
					}]
				}
			],
			component: class {
				constructor(dataArray, entryElement, elementSetting) {
					this.previewElement = entryElement[0];
					this.popupElement = entryElement[1];
					this.elementSetting = elementSetting;
					// ========================================================
					// ORIGINAL DATA
					// ========================================================
					this.originalDataArray = dataArray;
					// ========================================================
					// OPTIONS
					// ========================================================
					this.allowNewItem = elementSetting.allowNewItem !== false;
					// ========================================================
					// CATEGORIES
					// ========================================================
					this.categories = Array.isArray(elementSetting.category) ? elementSetting.category.map(category => ({
						label: String(category.label ?? "")
					})).filter(category => category.label) : [];
					// ========================================================
					// EXTRA FIELDS
					// ========================================================
					this.extraFields = Array.isArray(elementSetting.extraFields) ? elementSetting.extraFields.map(field => ({
						label: String(field.label ?? ""),
						type: this.normalizeFieldType(field.type),
						default: field.default,
						optional: field.optional === true
					})) : [];
					// ========================================================
					// WORKING COPY
					// ========================================================
					this.workingArray = (Array.isArray(dataArray) ? dataArray : []).map(item => this.cloneItem(item));
					// ========================================================
					// SORTABLE
					// ========================================================
					this.sortable = null;
					// ========================================================
					// PREVIEW
					// ========================================================
					this.previewElement.innerHTML = "";
					this.previewText = document.createElement("p");
					this.previewElement.appendChild(this.previewText);
					// ========================================================
					// POPUP
					// ========================================================
					this.popupElement.innerHTML = "";
					this.rootElement = document.createElement("div");
					this.rootElement.className = "sort-list-root";
					this.popupElement.appendChild(this.rootElement);
					// ========================================================
					// ADD
					// ========================================================
					if (this.allowNewItem) {
						this.createAddArea();
					}
					// ========================================================
					// SINGLE HEADER
					// ========================================================
					this.rootElement.appendChild(this.createHeader());
					// ========================================================
					// SINGLE FLAT LIST
					// ========================================================
					this.listElement = document.createElement("div");
					this.listElement.className = "sort-list-list";
					this.rootElement.appendChild(this.listElement);
					// ========================================================
					// INITIAL BUILD
					// ========================================================
					this.renderList();
					this.updatePreview();
				}
				// ============================================================
				// FIELD TYPE
				// ============================================================
				normalizeFieldType(type) {
					const value = String(type ?? "text").toLowerCase();
					if (value === "integer") {
						return "integer";
					}
					if (value === "checkmark" || value === "checkbox" || value === "check") {
						return "checkmark";
					}
					return "text";
				}
				// ============================================================
				// CATEGORY HELPERS
				// ============================================================
				getCategoryNames() {
					return this.categories.map(category => category.label);
				}
				getFirstCategory() {
					return (this.categories[0]?.label ?? "");
				}
				getValidCategory(category) {
					const names = this.getCategoryNames();
					if (names.includes(category)) {
						return category;
					}
					return this.getFirstCategory();
				}
				// ============================================================
				// FIELD DEFAULT
				// ============================================================
				getDefaultFieldValue(field) {
					if (field.default !== undefined) {
						return this.normalizeFieldValue(field, field.default);
					}
					switch (field.type) {
						case "integer":
							return 0;
						case "checkmark":
							return false;
						default:
							return "";
					}
				}
				// ============================================================
				// FIELD NORMALIZE
				// ============================================================
				normalizeFieldValue(field, value) {
					switch (field.type) {
						case "integer": {
							const number = Number(value);
							if (!Number.isFinite(number)) {
								return 0;
							}
							return Math.trunc(number);
						}
						case "checkmark":
							return Boolean(value);
						default:
							return (value === null || value === undefined) ? "" : String(value);
					}
				}
				// ============================================================
				// CLONE ITEM
				// ============================================================
				cloneItem(item) {
					const result = {};
					if (item && typeof item === "object" && !Array.isArray(item)) {
						Object.assign(result, item);
					}
					result.name = result.name ?? "";
					result.category = this.getValidCategory(result.category);
					this.extraFields.forEach(field => {
						if (result[field.label] === undefined) {
							result[field.label] = this.getDefaultFieldValue(field);
						} else {
							result[field.label] = this.normalizeFieldValue(field, result[field.label]);
						}
					});
					return result;
				}
				// ============================================================
				// CREATE ITEM
				// ============================================================
				createDefaultItem(name, category) {
					const item = {
						name: String(name),
						category: this.getValidCategory(category)
					};
					this.extraFields.forEach(field => {
						item[field.label] = this.getDefaultFieldValue(field);
					});
					return item;
				}
				// ============================================================
				// ADD AREA
				// ============================================================
				createAddArea() {
					const addArea = document.createElement("div");
					addArea.className = "sort-list-add";
					this.addInput = document.createElement("input");
					this.addInput.type = "text";
					this.addInput.className = "sort-list-input";
					this.addInput.placeholder = "Add list element...";
					this.addCategory = document.createElement("select");
					this.addCategory.className = "sort-list-add-category";
					this.categories.forEach(category => {
						const option = document.createElement("option");
						option.value = category.label;
						option.textContent = category.label;
						this.addCategory.appendChild(option);
					});
					const addButton = document.createElement("button");
					addButton.type = "button";
					addButton.className = "sort-list-add-button";
					addButton.textContent = "Add";
					addArea.appendChild(this.addInput);
					addArea.appendChild(this.addCategory);
					addArea.appendChild(addButton);
					this.rootElement.appendChild(addArea);
					const addItem = () => {
						const name = this.addInput.value.trim();
						if (!name) {
							return;
						}
						this.workingArray.push(this.createDefaultItem(name, this.addCategory.value));
						this.renderList();
						this.updatePreview();
						this.addInput.value = "";
						this.addInput.focus();
					};
					addButton.addEventListener("click", addItem);
					this.addInput.addEventListener("keydown", event => {
						if (event.key === "Enter") {
							event.preventDefault();
							addItem();
						}
					});
				}
				// ============================================================
				// FIELD CLASS
				// ============================================================
				getFieldClass(field) {
					switch (field.type) {
						case "integer":
							return "sort-list-field-integer";
						case "checkmark":
							return "sort-list-field-checkmark";
						default:
							return "sort-list-field-text";
					}
				}
				// ============================================================
				// HEADER
				// ============================================================
				createHeader() {
					const header = document.createElement("div");
					header.className = "sort-list-header";
					header.appendChild(this.createHeaderCell("", "sort-list-drag"));
					header.appendChild(this.createHeaderCell("Name", "sort-list-name"));
					this.extraFields.forEach(field => {
						let label = field.label;
						if (field.optional) {
							label += " (optional)";
						}
						header.appendChild(this.createHeaderCell(label, this.getFieldClass(field)));
					});
					header.appendChild(this.createHeaderCell("Delete", "sort-list-delete"));
					return header;
				}
				// ============================================================
				// HEADER CELL
				// ============================================================
				createHeaderCell(text, className) {
					const element = document.createElement("div");
					element.className = className;
					element.textContent = text;
					return element;
				}
				// ============================================================
				// FIELD INPUT
				// ============================================================
				createFieldInput(field, item) {
					let input;
					switch (field.type) {
						case "integer": {
							input = document.createElement("input");
							input.type = "number";
							input.step = "1";
							input.className = "sort-list-field-input";
							input.value = item[field.label] ?? "";
							input.addEventListener("input",
								() => {
									item[field.label] = input.value === "" ? "" : this.normalizeFieldValue(field, input.value);
								});
							break;
						}
						case "checkmark": {
							input = document.createElement("input");
							input.type = "checkbox";
							input.className = "sort-list-field-checkbox";
							input.checked = Boolean(item[field.label]);
							input.addEventListener("change",
								() => {
									item[field.label] = input.checked;
								});
							return input;
						}
						default: {
							input = document.createElement("input");
							input.type = "text";
							input.className = "sort-list-field-input";
							input.value = item[field.label] ?? "";
							input.addEventListener("input",
								() => {
									item[field.label] = input.value;
								});
							break;
						}
					}
					return input;
				}
				// ============================================================
				// CATEGORY TITLE
				// ============================================================
				createCategoryTitle(category) {
					const title = document.createElement("div");
					/*
					 * IMPORTANT:
					 *
					 * Category title is itself
					 * the Sortable handle.
					 */
					title.className = "sort-list-category-title";
					title.dataset.type = "category";
					title.dataset.category = category.label;
					title.textContent = category.label;
					title._sortListCategory = category.label;
					return title;
				}
				// ============================================================
				// ROW
				// ============================================================
				createRow(item) {
					const row = document.createElement("div");
					row.className = "sort-list-row";
					row.dataset.type = "item";
					row._sortListItem = item;
					// --------------------------------------------------------
					// DRAG HANDLE
					// --------------------------------------------------------
					const dragCell = document.createElement("div");
					dragCell.className = "sort-list-drag";
					const handle = document.createElement("span");
					handle.className = "sort-list-handle";
					handle.textContent = "☷";
					dragCell.appendChild(handle);
					row.appendChild(dragCell);
					// --------------------------------------------------------
					// NAME
					// --------------------------------------------------------
					const nameCell = document.createElement("div");
					nameCell.className = "sort-list-name";
					const nameInput = document.createElement("input");
					nameInput.type = "text";
					nameInput.className = "sort-list-name-input";
					nameInput.value = item.name ?? "";
					nameInput.addEventListener("input",
						() => {
							item.name = nameInput.value;
							this.updatePreview();
						});
					nameCell.appendChild(nameInput);
					row.appendChild(nameCell);
					// --------------------------------------------------------
					// EXTRA FIELDS
					// --------------------------------------------------------
					this.extraFields.forEach(field => {
						const cell = document.createElement("div");
						cell.className = this.getFieldClass(field);
						cell.appendChild(this.createFieldInput(field, item));
						row.appendChild(cell);
					});
					// --------------------------------------------------------
					// DELETE
					// --------------------------------------------------------
					const deleteCell = document.createElement("div");
					deleteCell.className = "sort-list-delete";
					const deleteButton = document.createElement("button");
					deleteButton.type = "button";
					deleteButton.className = "sort-list-remove";
					deleteButton.textContent = "×";
					deleteButton.addEventListener("click", event => {
						event.preventDefault();
						event.stopPropagation();
						const index = this.workingArray.indexOf(item);
						if (index === -1) {
							return;
						}
						this.workingArray.splice(index, 1);
						this.renderList();
						this.updatePreview();
					});
					deleteCell.appendChild(deleteButton);
					row.appendChild(deleteCell);
					return row;
				}
				// ============================================================
				// RENDER LIST
				// ============================================================
				renderList() {
					this.destroySortable();
					this.listElement.innerHTML = "";
					/*
					 * IMPORTANT:
					 *
					 * The DOM has TWO kinds of sortable things:
					 *
					 * 1. category titles
					 * 2. normal rows
					 *
					 * Everything is inside ONE flat list.
					 */
					this.categories.forEach(category => {
						this.listElement.appendChild(this.createCategoryTitle(category));
						this.workingArray.filter(item => item.category === category.label).forEach(item => {
							this.listElement.appendChild(this.createRow(item));
						});
					});
					this.createSortable();
				}
				// ============================================================
				// READ FLAT DOM
				// ============================================================
				syncFromDOM() {
					const result = [];
					let currentCategory = null;
					/*
					 * The DOM is the source of truth.
					 *
					 * Category title:
					 *     changes currentCategory
					 *
					 * Item row:
					 *     receives currentCategory
					 */
					Array.from(this.listElement.children).forEach(element => {
						// ------------------------------------------------
						// CATEGORY
						// ------------------------------------------------
						if (element.dataset.type === "category") {
							currentCategory = this.getValidCategory(element.dataset.category);
							return;
						}
						// ------------------------------------------------
						// ITEM
						// ------------------------------------------------
						if (element.dataset.type === "item") {
							const item = element._sortListItem;
							if (!item) {
								return;
							}
							/*
							 * The item now belongs to
							 * the most recent category title.
							 */
							item.category = currentCategory;
							result.push(item);
						}
					});
					this.workingArray = result;
					/*
					 * Also calculate category order from
					 * the DOM.
					 */
					const newCategoryOrder = [];
					Array.from(this.listElement.children).forEach(element => {
						if (element.dataset.type !== "category") {
							return;
						}
						const category = element.dataset.category;
						if (!newCategoryOrder.includes(category)) {
							newCategoryOrder.push(category);
						}
					});
					/*
					 * Keep elementSetting.category as
					 * configuration, but use the DOM order
					 * for display/order.
					 */
					this.currentCategoryOrder = newCategoryOrder;
				}
				// ============================================================
				// SORTABLE
				// ============================================================
				createSortable() {
					if (typeof Sortable === "undefined") {
						return;
					}
					this.sortable = new Sortable(this.listElement, {
						animation: 150,
						direction: "vertical",
						draggable: ".sort-list-category-title, .sort-list-row",
						/*
						 * Only the FIRST category title is locked.
						 *
						 * The other category titles are still
						 * completely draggable.
						 */
						filter: ".sort-list-category-title:first-child",
						ghostClass: "sort-list-ghost",
						onStart: event => {
							const firstCategory = this.listElement.querySelector(".sort-list-category-title:first-child");
							/*
							 * Extra safety:
							 *
							 * The first category can never
							 * become the dragged element.
							 */
							if (event.item === firstCategory) {
								event.preventDefault();
								return;
							}
							if (event.item.dataset.type === "category") {
								this.draggingType = "category";
							} else {
								this.draggingType = "item";
							}
						},
						onMove: event => {
							const firstCategory = this.listElement.querySelector(".sort-list-category-title:first-child");
							const dragged = event.dragged;
							const related = event.related;
							// ============================================================
							// FIRST CATEGORY IS ALWAYS LOCKED
							// ============================================================
							if (dragged === firstCategory) {
								return false;
							}
							// ============================================================
							// NEVER INSERT ANYTHING BEFORE FIRST CATEGORY
							// ============================================================
							if (related === firstCategory && event.willInsertAfter === false) {
								return false;
							}
							// ============================================================
							// CATEGORY HEADER RESTRICTION
							// A CATEGORY CANNOT MOVE OVER ANOTHER CATEGORY
							// ============================================================
							const draggedIsCategory = dragged && dragged.dataset.type === "category";
							const relatedIsCategory = related && related.dataset.type === "category";
							if (draggedIsCategory && relatedIsCategory) {
								return false;
							}
							// ============================================================
							// ALREADY-SAFE DROP
							// ============================================================
							return true;
						},
						onEnd: () => {
							this.syncFromDOM();
							this.rebuildFromDOM();
							this.updatePreview();
							this.draggingType = null;
						}
					});
				}
				// ============================================================
				// REBUILD FROM DOM
				// ============================================================
				rebuildFromDOM() {
					/*
					 * For now the DOM itself is already the
					 * ordering source.
					 *
					 * We only recreate the row/category DOM
					 * when something else needs a rebuild.
					 */
					const elements = Array.from(this.listElement.children);
					const state = [];
					elements.forEach(element => {
						if (element.dataset.type === "category") {
							state.push({
								type: "category",
								category: element.dataset.category
							});
							return;
						}
						if (element.dataset.type === "item") {
							state.push({
								type: "item",
								item: element._sortListItem
							});
						}
					});
					/*
					 * We intentionally DON'T rebuild the
					 * DOM here.
					 *
					 * The DOM is already what Sortable made.
					 */
				}
				// ============================================================
				// DESTROY
				// ============================================================
				destroySortable() {
					if (this.sortable) {
						this.sortable.destroy();
						this.sortable = null;
					}
				}
				// ============================================================
				// PREVIEW
				// ============================================================
				updatePreview() {
					const parts = [];
					let currentCategory = null;
					/*
					 * Use workingArray for the actual
					 * preview grouping.
					 */
					this.getCategoryNamesInWorkingOrder().forEach(category => {
						const names = this.workingArray.filter(item => item.category === category).map(item => item.name);
						parts.push(`${category}: ${names.join(", ")}`);
					});
					this.previewText.textContent = parts.join(" | ");
				}
				// ============================================================
				// CATEGORY ORDER
				// ============================================================
				getCategoryNamesInWorkingOrder() {
					const result = [];
					/*
					 * First use the current DOM category order.
					 */
					Array.from(this.listElement.children).forEach(element => {
						if (element.dataset.type !== "category") {
							return;
						}
						const category = element.dataset.category;
						if (!result.includes(category)) {
							result.push(category);
						}
					});
					/*
					 * Make sure no category disappears
					 * from the preview.
					 */
					this.getCategoryNames().forEach(category => {
						if (!result.includes(category)) {
							result.push(category);
						}
					});
					return result;
				}
				// ============================================================
				// POPUP CLOSE
				// ============================================================
				onPopupClose() {
					/*
					 * Commit working data here.
					 */
					this.syncFromDOM();
					if (Array.isArray(this.originalDataArray)) {
						this.originalDataArray.splice(0, this.originalDataArray.length, ...this.workingArray);
					}
					this.updatePreview();
					return this.originalDataArray;
				}
				// ============================================================
				// DESTROY
				// ============================================================
				onSave() {
					/*
					 * onSave ONLY destroys Sortable.
					 */
					this.destroySortable();
					return this.originalDataArray;
				}
				// ============================================================
				// RESULT
				// ============================================================
				initResult() {
					return {
						code: 0
					};
				}
			},
			// ================================================================
			// CANVAS RENDER
			// ================================================================
			render: function(dataArray) {
				if (!Array.isArray(dataArray)) {
					return "";
				}
				return dataArray.map(item => {
					if (item && typeof item === "object" && !Array.isArray(item)) {
						return (item.name ?? "");
					}
					return String(item);
				}).join(", ");
			}
		},

        nested: {
            strutureSample: [],
            
            displayType: "popupMedium",
            
            cssStyles: [{
                object: ".advance-root",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "max-width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-add",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "gap",
                    value: "8px"
                }, {
                    key: "margin-bottom",
                    value: "12px"
                }]
            }, {
                object: ".advance-add-input",
                info: [{
                    key: "flex",
                    value: "1 1 auto"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-add-button",
                info: [{
                    key: "flex",
                    value: "0 0 auto"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-table",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "max-width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-header",
                info: [{
                    key: "display",
                    value: "grid"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "align-items",
                    value: "center"
                }]
            }, {
                object: ".advance-header-cell",
                info: [{
                    key: "min-width",
                    value: "0"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "padding",
                    value: "6px 8px"
                }, {
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "font-weight",
                    value: "600"
                }, {
                    key: "overflow",
                    value: "hidden"
                }, {
                    key: "text-overflow",
                    value: "ellipsis"
                }, {
                    key: "white-space",
                    value: "nowrap"
                }]
            }, {
                object: ".advance-list",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex-direction",
                    value: "column"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "max-width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "gap",
                    value: "5px"
                }, {
                    key: "min-height",
                    value: "10px"
                }]
            }, {
                object: ".advance-item",
                info: [{
                    key: "display",
                    value: "block"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "max-width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-item-row",
                info: [{
                    key: "display",
                    value: "grid"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "max-width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "min-height",
                    value: "38px"
                }]
            }, {
                object: ".advance-cell",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "padding",
                    value: "4px 8px"
                }]
            }, {
                object: ".advance-name-cell",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "gap",
                    value: "6px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "padding",
                    value: "4px 8px"
                }]
            }, {
                object: ".advance-handle",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "flex",
                    value: "0 0 24px"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "center"
                }, {
                    key: "width",
                    value: "24px"
                }, {
                    key: "height",
                    value: "28px"
                }, {
                    key: "cursor",
                    value: "grab"
                }, {
                    key: "user-select",
                    value: "none"
                }, {
                    key: "touch-action",
                    value: "none"
                }]
            }, {
                object: ".advance-handle:active",
                info: [{
                    key: "cursor",
                    value: "grabbing"
                }]
            }, {
                object: ".advance-item-input",
                info: [{
                    key: "display",
                    value: "block"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "height",
                    value: "30px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "padding",
                    value: "3px 6px"
                }, {
                    key: "border",
                    value: "1px solid transparent"
                }, {
                    key: "outline",
                    value: "none"
                }]
            }, {
                object: ".advance-field-input",
                info: [{
                    key: "display",
                    value: "block"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "min-width",
                    value: "0"
                }, {
                    key: "height",
                    value: "30px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "padding",
                    value: "3px 6px"
                }, {
                    key: "border",
                    value: "1px solid transparent"
                }, {
                    key: "outline",
                    value: "none"
                }]
            }, {
                object: ".advance-field-checkbox",
                info: [{
                    key: "display",
                    value: "block"
                }, {
                    key: "width",
                    value: "18px"
                }, {
                    key: "height",
                    value: "18px"
                }, {
                    key: "margin",
                    value: "0"
                }]
            }, {
                object: ".advance-remove",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "center"
                }, {
                    key: "width",
                    value: "28px"
                }, {
                    key: "height",
                    value: "28px"
                }, {
                    key: "padding",
                    value: "0"
                }, {
                    key: "border",
                    value: "0"
                }, {
                    key: "background",
                    value: "transparent"
                }, {
                    key: "cursor",
                    value: "pointer"
                }]
            }, {
                object: ".advance-children",
                info: [{
                    key: "display",
                    value: "block"
                }, {
                    key: "width",
                    value: "calc(100% - 28px)"
                }, {
                    key: "max-width",
                    value: "calc(100% - 28px)"
                }, {
                    key: "margin-left",
                    value: "28px"
                }, {
                    key: "padding-left",
                    value: "10px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-nest-space",
                info: [{
                    key: "display",
                    value: "flex"
                }, {
                    key: "width",
                    value: "100%"
                }, {
                    key: "min-height",
                    value: "34px"
                }, {
                    key: "margin-top",
                    value: "3px"
                }, {
                    key: "margin-bottom",
                    value: "3px"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "align-items",
                    value: "center"
                }, {
                    key: "justify-content",
                    value: "center"
                }, {
                    key: "padding",
                    value: "6px"
                }, {
                    key: "border",
                    value: "1px dashed currentColor"
                }, {
                    key: "font-size",
                    value: "12px"
                }, {
                    key: "user-select",
                    value: "none"
                }]
            }, {
                object: ".advance-nest-space-text",
                info: [{
                    key: "display",
                    value: "block"
                }, {
                    key: "pointer-events",
                    value: "none"
                }, {
                    key: "text-align",
                    value: "center"
                }]
            }, {
                object: ".advance-ghost",
                info: [{
                    key: "opacity",
                    value: "0.35"
                }]
            }, {
                object: ".advance-chosen",
                info: [{
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-drag",
                info: [{
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-drop-invalid",
                info: [{
                    key: "opacity",
                    value: "0.4"
                }]
            }, {
                object: ".advance-preview-tree",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }]
            }, {
                object: ".advance-preview-item",
                info: [{
                    key: "width",
                    value: "100%"
                }, {
                    key: "box-sizing",
                    value: "border-box"
                }, {
                    key: "padding-top",
                    value: "2px"
                }, {
                    key: "padding-bottom",
                    value: "2px"
                }]
            }],
            
            
            component: class {
                constructor(
                    dataArray,
                    entryElement,
                    elementSetting
                ) {
                    // =================================================
                    // ELEMENTS
                    // =================================================
                    
                    this.previewElement =
                        entryElement[0];
                    
                    this.popupElement =
                        entryElement[1];
                    
                    this.elementSetting =
                        elementSetting;
                    
                    // =================================================
                    // ORIGINAL PROXY
                    // =================================================
                    
                    this.originalDataArray =
                        dataArray;
                    
                    // =================================================
                    // NEST LIMIT
                    // =================================================
                    
                    this.nestLimit = Math.max(
                        1,
                        Number(
                            elementSetting.nestLimit
                        ) || 1
                    );
                    
                    // =================================================
                    // EXTRA FIELD SCHEMA
                    // =================================================
                    
                    this.extraFields =
                        Array.isArray(
                            elementSetting.extraFields
                        ) ?
                        elementSetting.extraFields :
                        [];
                    
                    // =================================================
                    // NORMALIZE FIELD SCHEMA
                    // =================================================
                    
                    this.extraFields =
                        this.extraFields.map(
                            field => ({
                                label: field.label ??
                                    "",
                                
                                type: this.normalizeFieldType(
                                    field.type
                                ),
                                
                                default: field.default,
                                
                                optional: field.optional === true
                            })
                        );
                    
                    // =================================================
                    // WORKING TREE
                    // =================================================
                    
                    this.workingArray =
                        this.cloneTree(
                            Array.isArray(dataArray) ?
                            dataArray :
                            (
                                Array.isArray(
                                    elementSetting.default
                                ) ?
                                elementSetting.default :
                                []
                            )
                        );
                    
                    this.ensureIds(
                        this.workingArray
                    );
                    
                    // =================================================
                    // SORTABLE INSTANCES
                    // =================================================
                    
                    this.sortables = [];
                    
                    this.draggedElement =
                        null;
                    
                    // =================================================
                    // PREVIEW
                    // =================================================
                    
                    this.previewElement.innerHTML =
                        "";
                    
                    this.previewTreeElement =
                        document.createElement(
                            "div"
                        );
                    
                    this.previewTreeElement.className =
                        "advance-preview-tree";
                    
                    this.previewElement.appendChild(
                        this.previewTreeElement
                    );
                    
                    this.updatePreview();
                    
                    // =================================================
                    // POPUP
                    // =================================================
                    
                    this.popupElement.innerHTML =
                        "";
                    
                    this.rootElement =
                        document.createElement(
                            "div"
                        );
                    
                    this.rootElement.className =
                        "advance-root";
                    
                    this.popupElement.appendChild(
                        this.rootElement
                    );
                    
                    // =================================================
                    // ADD AREA
                    // =================================================
                    
                    const addArea =
                        document.createElement(
                            "div"
                        );
                    
                    addArea.className =
                        "advance-add";
                    
                    this.addInput =
                        document.createElement(
                            "input"
                        );
                    
                    this.addInput.type =
                        "text";
                    
                    this.addInput.className =
                        "advance-add-input";
                    
                    this.addInput.placeholder =
                        "Add list element...";
                    
                    const addButton =
                        document.createElement(
                            "button"
                        );
                    
                    addButton.type =
                        "button";
                    
                    addButton.className =
                        "advance-add-button";
                    
                    addButton.textContent =
                        "Add";
                    
                    addArea.appendChild(
                        this.addInput
                    );
                    
                    addArea.appendChild(
                        addButton
                    );
                    
                    this.rootElement.appendChild(
                        addArea
                    );
                    
                    // =================================================
                    // TABLE CONTAINER
                    // =================================================
                    
                    this.tableElement =
                        document.createElement(
                            "div"
                        );
                    
                    this.tableElement.className =
                        "advance-table";
                    
                    this.rootElement.appendChild(
                        this.tableElement
                    );
                    
                    // =================================================
                    // HEADER
                    // =================================================
                    
                    this.createHeader();
                    
                    // =================================================
                    // ROOT LIST
                    // =================================================
                    
                    this.rootList =
                        document.createElement(
                            "div"
                        );
                    
                    this.rootList.className =
                        "advance-list";
                    
                    this.rootList.dataset.depth =
                        "1";
                    
                    this.tableElement.appendChild(
                        this.rootList
                    );
                    
                    // =================================================
                    // ADD ROOT ITEM
                    // =================================================
                    
                    const addRootItem =
                        () => {
                            const value =
                                this.addInput.value.trim();
                            
                            if (!value) {
                                return;
                            }
                            
                            const newItem =
                                this.createDefaultItem(
                                    value
                                );
                            
                            this.workingArray.push(
                                newItem
                            );
                            
                            this.addInput.value =
                                "";
                            
                            this.renderTree();
                            
                            this.addInput.focus();
                            
                            this.updatePreview();
                        };
                    
                    addButton.addEventListener(
                        "click",
                        addRootItem
                    );
                    
                    this.addInput.addEventListener(
                        "keydown",
                        event => {
                            if (
                                event.key ===
                                "Enter"
                            ) {
                                event.preventDefault();
                                
                                addRootItem();
                            }
                        }
                    );
                    
                    // =================================================
                    // INITIAL RENDER
                    // =================================================
                    
                    this.renderTree();
                }
                
                // =====================================================
                // RESULT
                // =====================================================
                
                initResult() {
                    return {
                        code: 0
                    };
                }
                
                // =====================================================
                // FIELD TYPE
                // =====================================================
                
                normalizeFieldType(type) {
                    const value =
                        String(
                            type ?? "text"
                        ).toLowerCase();
                    
                    if (
                        value === "integer"
                    ) {
                        return "integer";
                    }
                    
                    if (
                        value === "checkmark" ||
                        value === "checkbox" ||
                        value === "check"
                    ) {
                        return "checkmark";
                    }
                    
                    return "text";
                }
                
                // =====================================================
                // DEFAULT VALUE
                // =====================================================
                
                getDefaultFieldValue(
                    field
                ) {
                    if (
                        field.default !==
                        undefined
                    ) {
                        return this.normalizeFieldValue(
                            field,
                            field.default
                        );
                    }
                    
                    switch (
                        field.type
                    ) {
                        case "integer":
                            return 0;
                            
                        case "checkmark":
                            return false;
                            
                        default:
                            return "";
                    }
                }
                
                // =====================================================
                // NORMALIZE FIELD VALUE
                // =====================================================
                
                normalizeFieldValue(
                    field,
                    value
                ) {
                    switch (
                        field.type
                    ) {
                        case "integer": {
                            if (
                                value === "" ||
                                value === null ||
                                value === undefined
                            ) {
                                return 0;
                            }
                            
                            const number =
                                Number(value);
                            
                            return Number.isFinite(
                                    number
                                ) ?
                                Math.trunc(
                                    number
                                ) :
                                0;
                        }
                        
                        case "checkmark":
                            return Boolean(
                                value
                            );
                            
                        case "text":
                        default:
                            return (
                                value === null ||
                                value === undefined ?
                                "" :
                                String(
                                    value
                                )
                            );
                    }
                }
                
                // =====================================================
                // CREATE DEFAULT ITEM
                // =====================================================
                
                createDefaultItem(
                    name
                ) {
                    const item = {
                        name: String(name),
                        children: []
                    };
                    
                    this.extraFields.forEach(
                        field => {
                            item[field.label] =
                                this.getDefaultFieldValue(
                                    field
                                );
                        }
                    );
                    
                    item.__advanceId =
                        this.createId();
                    
                    return item;
                }
                
                // =====================================================
                // CLONE TREE
                // =====================================================
                
                cloneTree(array) {
                    if (!Array.isArray(array)) {
                        return [];
                    }
                    
                    return array.map(
                        item => {
                            if (
                                item &&
                                typeof item ===
                                "object"
                            ) {
                                const result = {
                                    ...item,
                                    
                                    name: item.name ??
                                        item.label ??
                                        "",
                                    
                                    children: this.cloneTree(
                                        Array.isArray(
                                            item.children
                                        ) ?
                                        item.children :
                                        []
                                    )
                                };
                                
                                // ---------------------------------
                                // Ensure extra fields exist.
                                // ---------------------------------
                                
                                this.extraFields
                                    .forEach(
                                        field => {
                                            if (
                                                result[
                                                    field.label
                                                ] ===
                                                undefined
                                            ) {
                                                result[
                                                        field.label
                                                    ] =
                                                    this.getDefaultFieldValue(
                                                        field
                                                    );
                                            } else {
                                                result[
                                                        field.label
                                                    ] =
                                                    this.normalizeFieldValue(
                                                        field,
                                                        result[
                                                            field.label
                                                        ]
                                                    );
                                            }
                                        }
                                    );
                                
                                return result;
                            }
                            
                            return this.createDefaultItem(
                                String(item)
                            );
                        }
                    );
                }
                
                // =====================================================
                // IDS
                // =====================================================
                
                ensureIds(array) {
                    if (!Array.isArray(array)) {
                        return;
                    }
                    
                    array.forEach(
                        item => {
                            if (
                                !item.__advanceId
                            ) {
                                item.__advanceId =
                                    this.createId();
                            }
                            
                            if (
                                Array.isArray(
                                    item.children
                                )
                            ) {
                                this.ensureIds(
                                    item.children
                                );
                            }
                        }
                    );
                }
                
                createId() {
                    return (
                        "advance_" +
                        Date.now().toString(36) +
                        "_" +
                        Math.random()
                        .toString(36)
                        .slice(2, 10)
                    );
                }
                
                // =====================================================
                // HEADER
                // =====================================================
                
                createHeader() {
                    const message = document.createElement("div");
                    message.classList.add("advance-nest-space-text");
                    message.style.fontSize = "14px"
                    message.textContent = "(Hint: you can drag the element to the bottom of the other element for nesting)"
                    this.tableElement.appendChild(message)
                    
                    const header =
                        document.createElement(
                            "div"
                        );
                    
                    header.className =
                        "advance-header";
                    
                    const columns = [
                        "Name",
                        ...this.extraFields.map(
                            field =>
                            field.label
                        ),
                        ""
                    ];
                    
                    header.style.gridTemplateColumns =
                        this.getGridColumns();
                    
                    columns.forEach(
                        label => {
                            const cell =
                                document.createElement(
                                    "div"
                                );
                            
                            cell.className =
                                "advance-header-cell";
                            
                            cell.textContent =
                                label;
                            
                            header.appendChild(
                                cell
                            );
                        }
                    );
                    
                    this.tableElement.appendChild(
                        header
                    );
                }
                
                // =====================================================
                // GRID
                // =====================================================
                
                getGridColumns() {
                    /*
                    * Name gets the remaining
                    * space.
                    *
                    * Extra fields use a reasonable
                    * fixed minimum.
                    *
                    * Last column is remove button.
                    */
                    
                    const fields =
                        this.extraFields.length;
                    
                    if (fields === 0) {
                        return "minmax(0, 1fr) 36px";
                    }
                    
                    return (
                        "minmax(180px, 1fr) " +
                        Array(
                            fields
                        )
                        .fill(
                            "minmax(90px, 0.35fr)"
                        )
                        .join(" ") +
                        " 36px"
                    );
                }
                
                // =====================================================
                // PREVIEW
                // =====================================================
                
                updatePreview() {
                    this.previewTreeElement.innerHTML =
                        "";
                    
                    this.renderPreviewLevel(
                        this.workingArray,
                        this.previewTreeElement,
                        1
                    );
                }
                
                renderPreviewLevel(
                    array,
                    container,
                    depth
                ) {
                    if (!Array.isArray(array)) {
                        return;
                    }
                    
                    array.forEach(
                        item => {
                            const row =
                                document.createElement(
                                    "div"
                                );
                            
                            row.className =
                                "advance-preview-item";
                            
                            row.style.paddingLeft =
                                (
                                    (depth - 1) *
                                    20
                                ) + "px";
                            
                            row.textContent =
                                String(
                                    item.name ?? ""
                                );
                            
                            container.appendChild(
                                row
                            );
                            
                            if (
                                Array.isArray(
                                    item.children
                                ) &&
                                item.children.length
                            ) {
                                this.renderPreviewLevel(
                                    item.children,
                                    container,
                                    depth + 1
                                );
                            }
                        }
                    );
                }
                
                // =====================================================
                // RENDER TREE
                // =====================================================
                
                renderTree() {
                    this.destroySortables();
                    
                    this.rootList.innerHTML =
                        "";
                    
                    this.ensureIds(
                        this.workingArray
                    );
                    
                    this.renderLevel(
                        this.workingArray,
                        this.rootList,
                        1
                    );
                    
                    this.updatePreview();
                }
                
                // =====================================================
                // RENDER LEVEL
                // =====================================================
                
                renderLevel(
                    array,
                    listElement,
                    depth
                ) {
                    listElement.dataset.depth =
                        String(depth);
                    
                    array.forEach(
                        item => {
                            const element =
                                this.createItem(
                                    item,
                                    array,
                                    depth
                                );
                            
                            listElement.appendChild(
                                element
                            );
                        }
                    );
                    
                    this.createSortable(
                        listElement
                    );
                }
                
                // =====================================================
                // CREATE ITEM
                // =====================================================
                
                createItem(
                    item,
                    parentArray,
                    depth
                ) {
                    const wrapper =
                        document.createElement(
                            "div"
                        );
                    
                    wrapper.className =
                        "advance-item";
                    
                    wrapper.dataset.advanceId =
                        item.__advanceId;
                    
                    wrapper.dataset.depth =
                        String(depth);
                    
                    // =================================================
                    // ROW
                    // =================================================
                    
                    const row =
                        document.createElement(
                            "div"
                        );
                    
                    row.className =
                        "advance-item-row";
                    
                    row.style.gridTemplateColumns =
                        this.getGridColumns();
                    
                    // =================================================
                    // NAME
                    // =================================================
                    
                    const nameCell =
                        document.createElement(
                            "div"
                        );
                    
                    nameCell.className =
                        "advance-name-cell";
                    
                    const handle =
                        document.createElement(
                            "span"
                        );
                    
                    handle.className =
                        "advance-handle";
                    
                    handle.textContent =
                        "☷";
                    
                    const nameInput =
                        document.createElement(
                            "input"
                        );
                    
                    nameInput.type =
                        "text";
                    
                    nameInput.className =
                        "advance-item-input";
                    
                    nameInput.value =
                        item.name ?? "";
                    
                    nameInput.addEventListener(
                        "input",
                        () => {
                            item.name =
                                nameInput.value;
                            
                            this.updatePreview();
                        }
                    );
                    
                    nameCell.appendChild(
                        handle
                    );
                    
                    nameCell.appendChild(
                        nameInput
                    );
                    
                    row.appendChild(
                        nameCell
                    );
                    
                    // =================================================
                    // EXTRA FIELDS
                    // =================================================
                    
                    this.extraFields.forEach(
                        field => {
                            const cell =
                                document.createElement(
                                    "div"
                                );
                            
                            cell.className =
                                "advance-cell";
                            
                            const input =
                                this.createFieldInput(
                                    field,
                                    item
                                );
                            
                            cell.appendChild(
                                input
                            );
                            
                            row.appendChild(
                                cell
                            );
                        }
                    );
                    
                    // =================================================
                    // REMOVE
                    // =================================================
                    
                    const removeCell =
                        document.createElement(
                            "div"
                        );
                    
                    removeCell.className =
                        "advance-cell";
                    
                    const remove =
                        document.createElement(
                            "button"
                        );
                    
                    remove.type =
                        "button";
                    
                    remove.className =
                        "advance-remove";
                    
                    remove.textContent =
                        "×";
                    
                    remove.addEventListener(
                        "click",
                        event => {
                            event.preventDefault();
                            event.stopPropagation();
                            
                            const index =
                                parentArray.indexOf(
                                    item
                                );
                            
                            if (
                                index !== -1
                            ) {
                                parentArray.splice(
                                    index,
                                    1
                                );
                            }
                            
                            this.renderTree();
                        }
                    );
                    
                    removeCell.appendChild(
                        remove
                    );
                    
                    row.appendChild(
                        removeCell
                    );
                    
                    wrapper.appendChild(
                        row
                    );
                    
                    // =================================================
                    // CHILDREN
                    // =================================================
                    
                    if (
                        depth <
                        this.nestLimit
                    ) {
                        if (
                            !Array.isArray(
                                item.children
                            )
                        ) {
                            item.children = [];
                        }
                        
                        const childrenArea =
                            document.createElement(
                                "div"
                            );
                        
                        childrenArea.className =
                            "advance-children";
                        
                        // ---------------------------------------------
                        // CHILD LIST
                        // ---------------------------------------------
                        
                        const childList =
                            document.createElement(
                                "div"
                            );
                        
                        childList.className =
                            "advance-list";
                        
                        childList.dataset.depth =
                            String(
                                depth + 1
                            );
                        
                        this.renderLevel(
                            item.children,
                            childList,
                            depth + 1
                        );
                        
                        childrenArea.appendChild(
                            childList
                        );
                        
                        // ---------------------------------------------
                        // NEST SPACE
                        // ---------------------------------------------
                        /*
                        const nestSpace =
                            document.createElement(
                                "div"
                            );

                        nestSpace.className =
                            "advance-nest-space";

                        nestSpace.dataset.ownerId =
                            item.__advanceId;


                    
                        const nestText =
                            document.createElement(
                                "span"
                            );

                        nestText.className =
                            "advance-nest-space-text";

                        nestText.textContent =
                            "drag element here for nesting";

                        nestSpace.appendChild(
                            nestText
                        );

                        childrenArea.appendChild(
                            nestSpace
                        );
                        */
                        
                        wrapper.appendChild(
                            childrenArea
                        );
                    }
                    
                    return wrapper;
                }
                
                // =====================================================
                // FIELD INPUT
                // =====================================================
                
                createFieldInput(
                    field,
                    item
                ) {
                    let input;
                    
                    switch (
                        field.type
                    ) {
                        case "integer":
                            input =
                                document.createElement(
                                    "input"
                                );
                            
                            input.type =
                                "number";
                            
                            input.step =
                                "1";
                            
                            input.className =
                                "advance-field-input";
                            
                            input.value =
                                item[
                                    field.label
                                ] ?? 0;
                            
                            input.addEventListener(
                                "input",
                                () => {
                                    item[
                                            field.label
                                        ] =
                                        this.normalizeFieldValue(
                                            field,
                                            input.value
                                        );
                                }
                            );
                            
                            break;
                            
                        case "checkmark":
                            input =
                                document.createElement(
                                    "input"
                                );
                            
                            input.type =
                                "checkbox";
                            
                            input.className =
                                "advance-field-checkbox";
                            
                            input.checked =
                                Boolean(
                                    item[
                                        field.label
                                    ]
                                );
                            
                            input.addEventListener(
                                "change",
                                () => {
                                    item[
                                            field.label
                                        ] =
                                        input.checked;
                                }
                            );
                            
                            break;
                            
                        case "text":
                        default:
                            input =
                                document.createElement(
                                    "input"
                                );
                            
                            input.type =
                                "text";
                            
                            input.className =
                                "advance-field-input";
                            
                            input.value =
                                item[
                                    field.label
                                ] ?? "";
                            
                            input.addEventListener(
                                "input",
                                () => {
                                    item[
                                            field.label
                                        ] =
                                        input.value;
                                }
                            );
                            
                            break;
                    }
                    
                    // -------------------------------------------------
                    // OPTIONAL
                    // -------------------------------------------------
                    //
                    // For optional fields we allow an empty value.
                    // For required fields we don't remove the field
                    // from the object.
                    //
                    // The schema itself controls whether the field
                    // must exist.
                    // -------------------------------------------------
                    
                    if (
                        field.optional === false
                    ) {
                        input.dataset.required =
                            "true";
                    }
                    
                    return input;
                }
                
                // =====================================================
                // SORTABLE
                // =====================================================
                
                createSortable(
                    listElement
                ) {
                    if (
                        typeof Sortable ===
                        "undefined"
                    ) {
                        return;
                    }
                    
                    const sortable =
                        new Sortable(
                            listElement, {
                                animation: 180,
                                
                                direction: "vertical",
                                
                                draggable: ".advance-item",
                                
                                handle: ".advance-handle",
                                
                                ghostClass: "advance-ghost",
                                
                                chosenClass: "advance-chosen",
                                
                                dragClass: "advance-drag",
                                
                                fallbackOnBody: true,
                                
                                swapThreshold: 0.65,
                                
                                emptyInsertThreshold: 20,
                                
                                group: {
                                    name: "advance-tree",
                                    
                                    pull: true,
                                    
                                    put: true
                                },
                                
                                // =====================================
                                // START
                                // =====================================
                                
                                onStart: event => {
                                    this.draggedElement =
                                        event.item;
                                    
                                    this.showValidNestSpaces(
                                        event.item
                                    );
                                },
                                
                                // =====================================
                                // MOVE
                                // =====================================
                                
                                onMove: event => {
                                    return this.handleMove(
                                        event
                                    );
                                },
                                
                                // =====================================
                                // END
                                // =====================================
                                
                                onEnd: event => {
                                    this.hideNestSpaces();
                                    
                                    this.draggedElement =
                                        null;
                                    
                                    this.rebuildTreeFromDOM();
                                    
                                    this.updatePreview();
                                }
                            }
                        );
                    
                    this.sortables.push(
                        sortable
                    );
                }
                
                // =====================================================
                // ON MOVE
                // =====================================================
                
                handleMove(
                    event
                ) {
                    const dragged =
                        event.dragged;
                    
                    const destination =
                        event.to;
                    
                    if (
                        !dragged ||
                        !destination
                    ) {
                        return false;
                    }
                    
                    // -------------------------------------------------
                    // Can't move into itself.
                    // -------------------------------------------------
                    
                    if (
                        dragged ===
                        destination
                    ) {
                        return false;
                    }
                    
                    // -------------------------------------------------
                    // Can't move into own descendants.
                    // -------------------------------------------------
                    
                    if (
                        dragged.contains(
                            destination
                        )
                    ) {
                        return false;
                    }
                    
                    // -------------------------------------------------
                    // Destination depth.
                    // -------------------------------------------------
                    
                    const destinationDepth =
                        this.getListDepth(
                            destination
                        );
                    
                    // -------------------------------------------------
                    // Height of entire dragged subtree.
                    // -------------------------------------------------
                    
                    const subtreeDepth =
                        this.getDOMSubtreeDepth(
                            dragged
                        );
                    
                    // -------------------------------------------------
                    // Resulting deepest level.
                    // -------------------------------------------------
                    
                    const deepestLevel =
                        destinationDepth +
                        subtreeDepth -
                        1;
                    
                    // -------------------------------------------------
                    // NEST LIMIT.
                    // -------------------------------------------------
                    
                    if (
                        deepestLevel >
                        this.nestLimit
                    ) {
                        return false;
                    }
                    
                    // -------------------------------------------------
                    // Make sure destination isn't
                    // actually inside dragged subtree.
                    // -------------------------------------------------
                    
                    const owner =
                        destination.closest(
                            ".advance-item"
                        );
                    
                    if (
                        owner &&
                        owner ===
                        dragged
                    ) {
                        return false;
                    }
                    
                    return true;
                }
                
                // =====================================================
                // LIST DEPTH
                // =====================================================
                
                getListDepth(
                    list
                ) {
                    const depth =
                        Number(
                            list.dataset.depth
                        );
                    
                    return Number.isFinite(
                            depth
                        ) ?
                        depth :
                        1;
                }
                
                // =====================================================
                // DOM SUBTREE DEPTH
                // =====================================================
                
                getDOMSubtreeDepth(
                    element
                ) {
                    const rootDepth =
                        Number(
                            element.dataset.depth
                        ) || 1;
                    
                    let maximum =
                        rootDepth;
                    
                    const descendants =
                        element.querySelectorAll(
                            ".advance-item"
                        );
                    
                    descendants.forEach(
                        child => {
                            const depth =
                                Number(
                                    child.dataset.depth
                                );
                            
                            if (
                                Number.isFinite(
                                    depth
                                )
                            ) {
                                maximum =
                                    Math.max(
                                        maximum,
                                        depth
                                    );
                            }
                        }
                    );
                    
                    return (
                        maximum -
                        rootDepth +
                        1
                    );
                }
                
                // =====================================================
                // NEST SPACE VISIBILITY
                // =====================================================
                
                showValidNestSpaces(
                    dragged
                ) {
                    const spaces =
                        this.popupElement.querySelectorAll(
                            ".advance-nest-space"
                        );
                    
                    const subtreeDepth =
                        this.getDOMSubtreeDepth(
                            dragged
                        );
                    
                    spaces.forEach(
                        space => {
                            const ownerId =
                                space.dataset
                                .ownerId;
                            
                            // Never allow nesting into
                            // the dragged item itself.
                            
                            if (
                                ownerId ===
                                dragged.dataset
                                .advanceId
                            ) {
                                space.style.display =
                                    "none";
                                
                                return;
                            }
                            
                            const childList =
                                space.previousElementSibling;
                            
                            if (
                                !childList
                            ) {
                                return;
                            }
                            
                            const destinationDepth =
                                this.getListDepth(
                                    childList
                                );
                            
                            const resultingDepth =
                                destinationDepth +
                                subtreeDepth -
                                1;
                            
                            if (
                                resultingDepth <=
                                this.nestLimit
                            ) {
                                space.style.display =
                                    "flex";
                            } else {
                                space.style.display =
                                    "none";
                            }
                        }
                    );
                }
                
                hideNestSpaces() {
                    const spaces =
                        this.popupElement.querySelectorAll(
                            ".advance-nest-space"
                        );
                    
                    spaces.forEach(
                        space => {
                            space.style.display =
                                "flex";
                        }
                    );
                }
                
                // =====================================================
                // REBUILD TREE
                // =====================================================
                
                rebuildTreeFromDOM() {
                    const oldTree =
                        this.workingArray;
                    
                    const readList =
                        listElement => {
                            const result = [];
                            
                            Array.from(
                                listElement.children
                            ).forEach(
                                element => {
                                    if (
                                        !element.classList.contains(
                                            "advance-item"
                                        )
                                    ) {
                                        return;
                                    }
                                    
                                    const id =
                                        element.dataset
                                        .advanceId;
                                    
                                    const oldItem =
                                        this.findById(
                                            oldTree,
                                            id
                                        );
                                    
                                    const item =
                                        oldItem ?
                                        {
                                            ...oldItem
                                        } :
                                        this.createDefaultItem(
                                            ""
                                        );
                                    
                                    item.__advanceId =
                                        id;
                                    
                                    // ---------------------------------
                                    // NAME
                                    // ---------------------------------
                                    
                                    const nameInput =
                                        element.querySelector(
                                            ":scope > .advance-item-row > .advance-name-cell > .advance-item-input"
                                        );
                                    
                                    item.name =
                                        nameInput ?
                                        nameInput.value :
                                        "";
                                    
                                    // ---------------------------------
                                    // EXTRA FIELDS
                                    // ---------------------------------
                                    
                                    const row =
                                        element.querySelector(
                                            ":scope > .advance-item-row"
                                        );
                                    
                                    if (row) {
                                        const cells =
                                            Array.from(
                                                row.children
                                            );
                                        
                                        // Cell 0 = name.
                                        // Last cell = remove.
                                        //
                                        // Extra fields are
                                        // between them.
                                        
                                        this.extraFields.forEach(
                                            (
                                                field,
                                                fieldIndex
                                            ) => {
                                                const cell =
                                                    cells[
                                                        fieldIndex +
                                                        1
                                                    ];
                                                
                                                if (
                                                    !cell
                                                ) {
                                                    return;
                                                }
                                                
                                                const input =
                                                    cell.querySelector(
                                                        "input"
                                                    );
                                                
                                                if (
                                                    !input
                                                ) {
                                                    return;
                                                }
                                                
                                                if (
                                                    field.type ===
                                                    "checkmark"
                                                ) {
                                                    item[
                                                            field.label
                                                        ] =
                                                        input.checked;
                                                } else {
                                                    item[
                                                            field.label
                                                        ] =
                                                        this.normalizeFieldValue(
                                                            field,
                                                            input.value
                                                        );
                                                }
                                            }
                                        );
                                    }
                                    
                                    // ---------------------------------
                                    // CHILDREN
                                    // ---------------------------------
                                    
                                    const childList =
                                        element.querySelector(
                                            ":scope > .advance-children > .advance-list"
                                        );
                                    
                                    if (
                                        childList
                                    ) {
                                        item.children =
                                            readList(
                                                childList
                                            );
                                    } else {
                                        item.children = [];
                                    }
                                    
                                    result.push(
                                        item
                                    );
                                }
                            );
                            
                            return result;
                        };
                    
                    this.workingArray =
                        readList(
                            this.rootList
                        );
                }
                
                // =====================================================
                // FIND BY ID
                // =====================================================
                
                findById(
                    array,
                    id
                ) {
                    if (
                        !Array.isArray(
                            array
                        )
                    ) {
                        return null;
                    }
                    
                    for (
                        const item of array
                    ) {
                        if (
                            item &&
                            item.__advanceId ===
                            id
                        ) {
                            return item;
                        }
                        
                        if (
                            item &&
                            Array.isArray(
                                item.children
                            )
                        ) {
                            const found =
                                this.findById(
                                    item.children,
                                    id
                                );
                            
                            if (found) {
                                return found;
                            }
                        }
                    }
                    
                    return null;
                }
                
                // =====================================================
                // DESTROY SORTABLE
                // =====================================================
                
                destroySortables() {
                    if (
                        !Array.isArray(
                            this.sortables
                        )
                    ) {
                        this.sortables = [];
                        
                        return;
                    }
                    
                    this.sortables.forEach(
                        sortable => {
                            if (
                                sortable &&
                                typeof sortable.destroy ===
                                "function"
                            ) {
                                sortable.destroy();
                            }
                        }
                    );
                    
                    this.sortables = [];
                }
                
                // =====================================================
                // CLEAN DATA
                // =====================================================
                
                cleanTree(
                    array
                ) {
                    if (
                        !Array.isArray(
                            array
                        )
                    ) {
                        return [];
                    }
                    
                    return array.map(
                        item => {
                            const result = {};
                            
                            Object.keys(
                                item
                            ).forEach(
                                key => {
                                    if (
                                        key !==
                                        "__advanceId"
                                    ) {
                                        result[key] =
                                            item[key];
                                    }
                                }
                            );
                            
                            result.children =
                                this.cleanTree(
                                    Array.isArray(
                                        item.children
                                    ) ?
                                    item.children :
                                    []
                                );
                            
                            return result;
                        }
                    );
                }
                
                // =====================================================
                // POPUP CLOSE
                // =====================================================
                
                onPopupClose() {
                    this.hideNestSpaces();
                    
                    this.updatePreview();
                }
                
                // =====================================================
                // SAVE
                // =====================================================
                
                onSave() {
                    // -----------------------------------------------
                    // Destroy ALL Sortable instances.
                    // -----------------------------------------------
                    
                    this.destroySortables();
                    
                    this.draggedElement =
                        null;
                    
                    // -----------------------------------------------
                    // Clean internal IDs.
                    // -----------------------------------------------
                    
                    const cleanData =
                        this.cleanTree(
                            this.workingArray
                        );
                    
                    // -----------------------------------------------
                    // Commit to existing Proxy.
                    // -----------------------------------------------
                    
                    if (
                        Array.isArray(
                            this.originalDataArray
                        )
                    ) {
                        this.originalDataArray.splice(
                            0,
                            this.originalDataArray.length,
                            ...cleanData
                        );
                        
                        return this.originalDataArray;
                    }
                    
                    return cleanData;
                }
            },
            
            // =========================================================
            // CANVAS RENDER
            // =========================================================
            
            render: function(
                dataArray
            ) {
                return dataArray;
            }
        }
    }
};


/**
 * ------------------------------------------------------------------------------
 * Property Manager
 * 
 * Those were for Property like Animation, Style, and More.
 * Last Update: 1.0.0
 * ------------------------------------------------------------------------------
 * 
 * All query need include:
 * selfQuery, allQuery, render: [0, 1, 2, 3] and internal stuff.
 * ------------------------------------------------------------------------------
 */



// Animation Registery
export const flexEngineDefaultAnimation = {
	0: {
		name: "showup",
		query: [],
		variables: function(anim) {
			return "";
		},
		cssRawCode: `
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}`,
		setting: {
			timeOverride: true,
			timeOverrideSeconds: 0
		}
	},

	1: {
		name: "fade",
		query: [],
		variables: function(anim) {
			return "";
		},
		cssRawCode: `
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}`,
		setting: {}
	},

	2: {
		name: "flyIn",
		query: [
			{
				name: "direction",
				label: "Direction",
				type: "integer/slide",
				min: 0,
				max: 359,
				step: 1,
				default: 0
			},
			{
				name: "intensity",
				label: "Distance",
				type: "integer/noNeg",
				default: 60
			}
		],
		variables: function(anim) {
			const direction = (num(anim.direction) % 360 + 360) % 360;
			const intensity = Math.max(0, num(anim.intensity));
			const rad = direction * Math.PI / 180;
			const x = Math.cos(rad) * intensity;
			const y = Math.sin(rad) * intensity;

			return (
				`--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-x:${x}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-y:${y}px;`
			);
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform: translate(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-x, 0px),
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-flyIn-y, 60px)
				);
			}
			to {
				opacity: 1;
				transform: translate(0, 0);
			}`,
		setting: {}
	},

	3: {
		name: "growTurn",
		query: [
			{
				name: "rotate",
				label: "Rotate Deg",
				type: "integer",
				default: -25
			}
		],
		variables: function(anim) {
			const rotate = num(anim.rotate);

			return `--${BUILDER_CONFIG.classPrefix}animation-variables-growTurn-rotate:${rotate}deg;`;
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform: scale(0.3) rotate(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-growTurn-rotate, -25deg)
				);
			}
			to {
				opacity: 1;
				transform: scale(1) rotate(0deg);
			}`,
		setting: {}
	},

	4: {
		name: "zoom",
		query: [],
		variables: function(anim) {
			return "";
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform: scale(0.4);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}`,
		setting: {}
	},

	5: {
		name: "basicZoom",
		query: [
			{
				name: "scaleStart",
				label: "Starting Scale %",
				type: "integer/slide",
				min: 0,
				max: 100,
				step: 1,
				default: 85
			}
		],
		variables: function(anim) {
			const scaleStart = num(anim.scaleStart) || 100;

			return `--${BUILDER_CONFIG.classPrefix}animation-variables-basicZoom-scaleStart:${scaleStart / 100};`;
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform: scale(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-basicZoom-scaleStart, 0.85)
				);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}`,
		setting: {}
	},

	6: {
		name: "rise",
		query: [
			{
				name: "direction",
				label: "Direction",
				type: "selection",
				choice: [
					{ label: "Top", value: 1 },
					{ label: "Top Right", value: 2 },
					{ label: "Right", value: 3 },
					{ label: "Bottom Right", value: 4 },
					{ label: "Bottom", value: 5 },
					{ label: "Bottom Left", value: 6 },
					{ label: "Left", value: 7 },
					{ label: "Top Left", value: 8 }
				]
			},
			{
				name: "intensity",
				label: "Distance",
				type: "integer/noNeg",
				default: 25
			}
		],
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 8);
			const intensity = Math.max(0, num(anim.intensity));
			const angle = (direction - 1) * 45;
			const rad = angle * Math.PI / 180;

			return (
				`--${BUILDER_CONFIG.classPrefix}animation-variables-rise-x:${Math.cos(rad) * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-rise-y:${Math.sin(rad) * intensity}px;`
			);
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform: translate(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-rise-x, 0px),
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-rise-y, 25px)
				);
			}
			to {
				opacity: 1;
				transform: translate(0, 0);
			}`,
		setting: {}
	},

	7: {
		name: "stretch",
		query: [
			{
				name: "direction",
				label: "Direction",
				type: "selection",
				choice: [
					{ label: "Top", value: 1 },
					{ label: "Right", value: 2 },
					{ label: "Bottom", value: 3 },
					{ label: "Left", value: 4 }
				]
			}
		],
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const map = ["top", "right", "bottom", "left"];

			return `--${BUILDER_CONFIG.classPrefix}animation-variables-stretch-origin:${map[direction - 1]};`;
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform-origin: var(
					--${BUILDER_CONFIG.classPrefix}animation-variables-stretch-origin,
					left
				);
				transform: scaleX(0.1);
			}
			to {
				opacity: 1;
				transform: scaleX(1);
			}`,
		setting: {}
	},

	8: {
		name: "wipe",
		query: [
			{
				name: "direction",
				label: "Direction",
				type: "selection",
				choice: [
					{ label: "Top", value: 1 },
					{ label: "Right", value: 2 },
					{ label: "Bottom", value: 3 },
					{ label: "Left", value: 4 }
				]
			}
		],
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);

			const clip = [
				"inset(100% 0 0 0)",
				"inset(0 0 0 100%)",
				"inset(0 0 100% 0)",
				"inset(0 100% 0 0)"
			];

			return `--${BUILDER_CONFIG.classPrefix}animation-variables-wipe-from:${clip[direction - 1]};`;
		},
		cssRawCode: `
			from {
				opacity: 0;
				clip-path: var(
					--${BUILDER_CONFIG.classPrefix}animation-variables-wipe-from,
					inset(0 100% 0 0)
				);
			}
			to {
				opacity: 1;
				clip-path: inset(0 0 0 0);
			}`,
		setting: {}
	},

	9: {
		name: "peekIn",
		query: [
			{
				name: "direction",
				label: "Direction",
				type: "selection",
				choice: [
					{ label: "Top", value: 1 },
					{ label: "Right", value: 2 },
					{ label: "Bottom", value: 3 },
					{ label: "Left", value: 4 }
				]
			},
			{
				name: "intensity",
				label: "Distance",
				type: "integer/noNeg",
				default: 40
			}
		],
		variables: function(anim) {
			const direction = clamp(num(anim.direction) || 1, 1, 4);
			const intensity = Math.max(0, num(anim.intensity));

			const dirs = [
				[0, -1],
				[1, 0],
				[0, 1],
				[-1, 0]
			];

			const d = dirs[direction - 1];

			const clip = [
				"inset(100% 0 0 0)",
				"inset(0 0 0 100%)",
				"inset(0 0 100% 0)",
				"inset(0 100% 0 0)"
			];

			return (
				`--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-x:${d[0] * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-y:${d[1] * intensity}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-from:${clip[direction - 1]};`
			);
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform: translate(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-x, -40px),
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-y, 0px)
				);
				clip-path: var(
					--${BUILDER_CONFIG.classPrefix}animation-variables-peekIn-from,
					inset(0 100% 0 0)
				);
			}
			to {
				opacity: 1;
				transform: translate(0, 0);
				clip-path: inset(0 0 0 0);
			}`,
		setting: {}
	},

	10: {
		name: "box",
		query: [
			{
				name: "x",
				label: "Horizontal Origin",
				type: "selection",
				choice: [
					{ label: "Right", value: 1 },
					{ label: "Center", value: 2 },
					{ label: "Left", value: 3 }
				]
			},
			{
				name: "y",
				label: "Vertical Origin",
				type: "selection",
				choice: [
					{ label: "Bottom", value: 1 },
					{ label: "Center", value: 2 },
					{ label: "Top", value: 3 }
				]
			}
		],
		variables: function(anim) {
			const xIndex = clamp(num(anim.x) || 1, 1, 3);
			const yIndex = clamp(num(anim.y) || 1, 1, 3);

			const map = {
				1: "100%",
				2: "50%",
				3: "0%"
			};

			return (
				`--${BUILDER_CONFIG.classPrefix}animation-variables-box-x:${map[xIndex]};` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-box-y:${map[yIndex]};`
			);
		},
		cssRawCode: `
			from {
				opacity: 0;
				clip-path: inset(
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-box-y, 50%)
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-box-x, 50%)
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-box-y, 50%)
					var(--${BUILDER_CONFIG.classPrefix}animation-variables-box-x, 50%)
				);
			}
			to {
				opacity: 1;
				clip-path: inset(0 0 0 0);
			}`,
		setting: {}
	},

	11: {
		name: "expand",
		query: [],
		variables: function(anim) {
			return "";
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform: scale(0);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}`,
		setting: {}
	},

	12: {
		name: "tumble",
		query: [
			{
				name: "directionRight",
				label: "Direction Right?",
				type: "selection",
				choice: [
					{ label: "Left", value: 0 },
					{ label: "Right", value: 1 }
				]
			},
			{
				name: "fromUp",
				label: "From Up?",
				type: "selection",
				choice: [
					{ label: "No", value: 0 },
					{ label: "Yes", value: 1 }
				]
			},
			{
				name: "rotateIntensity",
				label: "Rotate Deg",
				type: "integer",
				default: -120
			}
		],
		variables: function(anim) {
			const directionRight = anim.directionRight ? 1 : 0;
			const fromUp = anim.fromUp ? 1 : 0;
			const intensity = num(anim.rotateIntensity);

			return (
				`--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-x:${directionRight ? 40 : -40}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-y:${fromUp ? -40 : 40}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-intensity:${intensity}deg;` +
				`transform-origin:top left;`
			);
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform-origin: top left;
				transform:
					translate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-x, -40px),
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-y, -40px)
					)
					rotate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-tumble-intensity, -120deg)
					);
			}
			to {
				opacity: 1;
				transform: translate(0, 0) rotate(0deg);
			}`,
		setting: {}
	},

	13: {
		name: "rotate",
		query: [
			{
				name: "directionRight",
				label: "Direction Right?",
				type: "selection",
				choice: [
					{ label: "Left", value: 0 },
					{ label: "Right", value: 1 }
				]
			},
			{
				name: "rotateIntensity",
				label: "Rotate Deg",
				type: "integer",
				default: 180
			}
		],
		variables: function(anim) {
			const directionRight = anim.directionRight ? 1 : 0;
			const intensity = num(anim.rotateIntensity);

			return (
				`--${BUILDER_CONFIG.classPrefix}animation-variables-rotate-intensity:${directionRight ? intensity : -intensity}deg;` +
				`transform-origin:center center;`
			);
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform:
					translateY(50%)
					rotate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-rotate-intensity, 180deg)
					);
			}
			to {
				opacity: 1;
				transform: translateY(0) rotate(0deg);
			}`,
		setting: {}
	},

	14: {
		name: "slideRotate",
		query: [
			{
				name: "rotateIntensity",
				label: "Rotate Deg",
				type: "integer",
				default: 180
			},
			{
				name: "slideAmountX",
				label: "Slide X",
				type: "integer",
				default: 0
			},
			{
				name: "slideAmountY",
				label: "Slide Y",
				type: "integer",
				default: 100
			}
		],
		variables: function(anim) {
			const intensity = num(anim.rotateIntensity);
			const slideX = num(anim.slideAmountX);
			const slideY = num(anim.slideAmountY);

			return (
				`--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-intensity:${intensity}deg;` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideX:${slideX}px;` +
				`--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideY:${slideY}px;` +
				`transform-origin:center center;`
			);
		},
		cssRawCode: `
			from {
				opacity: 0;
				transform:
					translate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideX, 0px),
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-slideY, 100px)
					)
					rotate(
						var(--${BUILDER_CONFIG.classPrefix}animation-variables-slideRotate-intensity, 180deg)
					);
			}
			to {
				opacity: 1;
				transform: translate(0, 0) rotate(0deg);
			}`,
		setting: {}
	}
};


// Animation
export const flexEngineAnimation = {
	name: "animation",

	// selfQuery and allQuery, 
	// however those were demytric, we use get name().
	get selfQuery() {
		let query = [
			{
				name: "animationType",
				label: "Animation",
				type: "selection",
				choice: [
					{
						name: "Inherit",
						value: -1
					},
					...Object.keys(flexEngineDefaultAnimation).map(key => ({
						name: flexEngineDefaultAnimation[key].name,
						value: Number(key)
					}))
				],
				default: 1
			},

			{
				name: "animationCurve",
				label: "Curve",
				type: "curve",
				visibleIf: {
					name: "animationType",
					value: [
						0, 1, 2, 3, 4, 5, 6, 7,
						8, 9, 10, 11, 12, 13, 14
					]
				}
			},

			{
				name: "duration",
				label: "Duration",
				type: "number",
				default: 0.6,
				visibleIf: {
					name: "animationType",
					value: [
						0, 1, 2, 3, 4, 5, 6, 7,
						8, 9, 10, 11, 12, 13, 14
					]
				}
			},

			{
				name: "delayTime",
				label: "Delay",
				type: "number",
				default: 0,
				visibleIf: {
					name: "animationType",
					value: [
						0, 1, 2, 3, 4, 5, 6, 7,
						8, 9, 10, 11, 12, 13, 14
					]
				}
			},

			{
				name: "trigger",
				label: "Trigger",
				type: "integer",
				default: 1,
				visibleIf: {
					name: "animationType",
					value: [
						0, 1, 2, 3, 4, 5, 6, 7,
						8, 9, 10, 11, 12, 13, 14
					]
				}
			}
		];

		const optionalQueryMap = {};
		const optionalQueryOrder = [];

		Object.keys(flexEngineDefaultAnimation).forEach(function(key) {

			const animationType = Number(key);
			const animation = flexEngineDefaultAnimation[animationType];

			if (!animation || !Array.isArray(animation.query)) {
				return;
			}

			animation.query.forEach(function(animationQuery) {

				if (!animationQuery || !animationQuery.name) {
					return;
				}

				const name = animationQuery.name;

				if (!optionalQueryMap[name]) {

					optionalQueryMap[name] = {
						...animationQuery,
						visibleIf: {
							name: "animationType",
							value: [animationType]
						}
					};

					optionalQueryOrder.push(name);

				} else {

					optionalQueryMap[name].visibleIf.value.push(animationType);

				}

			});

		});

		optionalQueryOrder.forEach(function(name) {
			query.push(optionalQueryMap[name]);
		});

		return query;
	},
	
	get allQuery() {
		const query = [
			{
				name: "animationType",
				label: "Animation",
				type: "selection",
				choice: Object.keys(flexEngineDefaultAnimation).map(key => ({
					name: flexEngineDefaultAnimation[key].name,
					value: Number(key)
				}))
			},

			{
				name: "animationCurve",
				label: "Curve",
				type: "curve"
			},

			{
				name: "duration",
				label: "Duration",
				type: "number",
				default: 0.6
			},

			{
				name: "delayTime",
				label: "First Delay",
				type: "number",
				default: 0
			},

			{
				name: "executionInterval",
				label: "Execution Interval",
				type: "number",
				default: 0
			},

			{
				name: "trigger",
				label: "Trigger",
				type: "integer",
				default: 1
			}
		];


		/*
			Keep track of which animation IDs
			contain each optional query.

			Example:

			{
				direction: {
					query: {...},
					animationTypes: [2, 6, 7, 8, 9]
				}
			}
		*/
		const optionalQueries = new Map();


		/*
			Check every animation.
		*/
		Object.keys(flexEngineDefaultAnimation).forEach(key => {

			const animationNumber = Number(key);
			const animation =
				flexEngineDefaultAnimation[animationNumber];

			/*
				Check every optional query belonging
				to this animation.
			*/
			(animation.query || []).forEach(animationQuery => {

				const name = animationQuery.name;

				/*
					First definition wins.

					If another animation later uses the
					same name, we DO NOT replace the query.
				*/
				if (!optionalQueries.has(name)) {

					optionalQueries.set(name, {
						query: {
							...animationQuery
						},
						animationTypes: [
							animationNumber
						]
					});

					return;
				}


				/*
					Same variable already exists.

					Only add this animation number.
				*/
				const existing =
					optionalQueries.get(name);

				if (
					!existing.animationTypes.includes(
						animationNumber
					)
				) {
					existing.animationTypes.push(
						animationNumber
					);
				}

			});

		});


		/*
			Convert the collected optional queries
			into actual query definitions.
		*/
		optionalQueries.forEach(function(data) {

			const optionalQuery = {
				...data.query,

				visibleIf: {
					name: "animationType",
					value: data.animationTypes
				}
			};

			query.push(optionalQuery);

		});


		return query;
	},

	// render part.
	render: {
		// Animation completely disabled.
		0: function(dataArray, node) {
			const prefix = BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}animation-config-self`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-self-trigger`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-trigger`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-firstdelay`,
				""
			);

			node.setAttribute(
				`${prefix}animation-config-all-timeRange`,
				""
			);

			return;			
		},

		// Animation enabled for this node itself
		1: function(dataArray, node) {
			const prefix = BUILDER_CONFIG.classPrefix;

			const attrName = `${prefix}animation-config-self`;
			const triggerAttr = `${prefix}animation-config-self-trigger`;

			const anim = dataArray.animation;

			/*
				Inherit animation from another animation context.

				This must happen before resolving animationType,
				variables, curve, duration, etc.
			*/
			if (Number(anim.animationType) === -1) {
				node.setAttribute(attrName, "inherit");
				node.setAttribute(triggerAttr, "");
				return;
			}


			/*
				Resolve animation type.

				Animation IDs:
				0  showup
				1  fade
				2  flyIn
				3  growTurn
				4  zoom
				5  basicZoom
				6  rise
				7  stretch
				8  wipe
				9  peekIn
				10 box
				11 expand
				12 tumble
				13 rotate
				14 slideRotate
			*/
			let animationNumber = Number(anim.animationType);

			if (!Number.isInteger(animationNumber) || !flexEngineDefaultAnimation[animationNumber]) {
				animationNumber = 1;
			}

			const entry = flexEngineDefaultAnimation[animationNumber];


			/*
				Build animation-specific CSS variables.
			*/
			let cssVars = "";

			if (typeof entry.variables === "function") {
				try {
					cssVars = entry.variables(anim) || "";
				}
				catch (e) {
					cssVars = "";
				}
			}


			/*
				Animation duration.

				If the animation's setting explicitly overrides
				the time, use that value instead of anim.duration.

				Example:
				showup -> timeOverride = true
				showup -> timeOverrideSeconds = 0

				So showup always uses 0s regardless of anim.duration.
			*/
			let duration;

			if (
				entry.setting &&
				entry.setting.timeOverride === true
			) {
				duration = `${entry.setting.timeOverrideSeconds}s`;
			}
			else {
				duration = `${num(anim.duration) || 0.6}s`;
			}


			/*
				Animation curve.

				anim.animationCurve is the raw curve data/array.

				Do NOT treat it as the final CSS string.

				The curve renderer converts the stored data
				into the actual CSS timing-function value.
			*/
			let curve = "";

			try {
				curve = flexEngineDefaultVariables.curve.curve.render(
					anim.animationCurve
				) || "";
			}
			catch (e) {
				curve = "";
			}


			/*
				Animation delay.
			*/
			const delay = `${anim.delayTime || 0}s`;


			/*
				Build final animation shorthand.
			*/
			const animationName = entry.name;

			const cssAnim =
				`animation:${prefix}animation-${animationName} ` +
				`${duration} ${curve} ${delay} 1 normal both;`;


			/*
				Write final attributes.
			*/
			node.setAttribute(
				attrName,
				cssVars + cssAnim
			);

			node.setAttribute(
				triggerAttr,
				anim.trigger || 1
			);
		},

		// Animation enabled as a SECTION.
		2: function(dataArray, node, expend = true) {
			const prefix = BUILDER_CONFIG.classPrefix;

			const attrSelf = `${prefix}animation-config-self`;
			const attrSelfTrigger = `${prefix}animation-config-self-trigger`;

			const attrAll = `${prefix}animation-config-all`;
			const attrAllTrigger = `${prefix}animation-config-all-trigger`;

			const attrFirstDelay = `${prefix}animation-config-all-firstdelay`;
			const attrTimeRange = `${prefix}animation-config-all-timeRange`;

			const attrInherit = `${prefix}animation-self-inherit`;

			if (!node || !dataArray) {
				return;
			}

			const animationData = dataArray.animation || {};


			const selfData = structuredClone(dataArray);

			selfData.animation = animationData.self || {};

			flexEngineAnimation.render[1](selfData, node);

			const allAnimation = animationData.all;

			if (!allAnimation) {
				node.setAttribute(attrAll, "");
				node.setAttribute(attrAllTrigger, "");
				node.setAttribute(attrFirstDelay, "");
				node.setAttribute(attrTimeRange, "");

				if (expend === true) {
					flexEngineAnimation.applySectionAnimation(node);
				}

				return;
			}


			if (Number(allAnimation.animationType) === -1) {
				node.setAttribute(attrAll, "inherit");
				node.setAttribute(attrAllTrigger, "");

				node.setAttribute(attrFirstDelay, "");
				node.setAttribute(attrTimeRange, "");

				return;
			}


			let animationNumber = Number(allAnimation.animationType);

			if (
				!Number.isInteger(animationNumber) ||
				!flexEngineDefaultAnimation[animationNumber]
			) {
				animationNumber = 1;
			}

			const entry = flexEngineDefaultAnimation[animationNumber];


			let cssVars = "";

			if (typeof entry.variables === "function") {
				try {
					cssVars = entry.variables(allAnimation) || "";
				} catch (e) {
					cssVars = "";
				}
			}


			let duration;

			if (
				entry.setting &&
				entry.setting.timeOverride === true
			) {
				duration =
					`${num(entry.setting.timeOverrideSeconds) || 0}s`;
			} else {
				duration =
					`${num(allAnimation.duration) || 0.6}s`;
			}


			let curve = "";

			try {
				curve =
					flexEngineDefaultVariables.curve.curve.render(
						allAnimation.animationCurve
					) || "";
			} catch (e) {
				curve = "";
			}


			const animationName = entry.name;

			const cssAnim =
				`animation:${prefix}animation-${animationName} ` +
				`${duration} ${curve} <delay>s 1 normal both;`;


			node.setAttribute(
				attrAll,
				cssVars + cssAnim
			);

			node.setAttribute(
				attrAllTrigger,
				allAnimation.trigger || 1
			);


			node.setAttribute(
				attrFirstDelay,
				num(allAnimation.delayTime) || 0
			);

			node.setAttribute(
				attrTimeRange,
				num(allAnimation.executionInterval) || 0
			);


			if (expend === true) {
				flexEngineAnimation.applySectionAnimation(node);
			};
		},
		
		// Animation bepass, as inherit only.
		3: function(dataArray, node) {
			const prefix = BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}animation-config-self`,
				"inherit"
			);

			node.setAttribute(
				`${prefix}animation-config-self-trigger`,
				""
			);

			return;
		},

		// for unKnown node, if we cannot find one, atuo fallback.
		"other": function(dataArray, node) {
			return;
		}
	},

	//this schema allow custom helper functions.
	applySectionAnimation: function(node) {
		const prefix = BUILDER_CONFIG.classPrefix;

		const attrAll = `${prefix}animation-config-all`;
		const attrAllTrigger = `${prefix}animation-config-all-trigger`;

		const attrSelf = `${prefix}animation-config-self`;
		const attrSelfTrigger = `${prefix}animation-config-self-trigger`;

		const attrFirstDelay = `${prefix}animation-config-all-firstdelay`;
		const attrTimeRange = `${prefix}animation-config-all-timeRange`;

		const attrInherit = `${prefix}animation-self-inherit`;

		const DELAY_PLACEHOLDER = "<delay>";


		const allConfig = node.getAttribute(attrAll) || "";
		const allTrigger = node.getAttribute(attrAllTrigger) || "";


		if (
			!allConfig ||
			allConfig === "inherit"
		) {
			return;
		}


		const parseNumber = function(value) {
			if (value === null || value === undefined) {
				return 0;
			}

			const parsed = parseFloat(
				String(value).trim()
			);

			return Number.isFinite(parsed)
				? parsed
				: 0;
		};

		const firstDelay = parseNumber(
			node.getAttribute(attrFirstDelay)
		);

		const timeRange = parseNumber(
			node.getAttribute(attrTimeRange)
		);


		let count = 0;


		const walk = function(currentNode, depth) {

			const currentInherit =
				currentNode.getAttribute(attrInherit);

			const enabled =
				currentInherit !== null &&
				currentInherit !== "" &&
				currentInherit !== "0";

			if (enabled) {

				currentNode.setAttribute(
					attrInherit,
					String(depth)
				);


				const delayValue =
					firstDelay + count * timeRange;


				const selfConfig =
					allConfig.replace(
						new RegExp(DELAY_PLACEHOLDER, "g"),
						String(delayValue)
					);

				currentNode.setAttribute(
					attrSelf,
					selfConfig
				);

				currentNode.setAttribute(
					attrSelfTrigger,
					allTrigger
				);


				count++;
			}


			[...currentNode.children].forEach(child => {
				walk(child, depth + 1);
			});
		};


		[...node.children].forEach(child => {
			walk(child, 1);
		});
	}
};


// Trans. System
export const flexEngineTransition = {
	name: "transition",

    // query
	selfQuery: [

		{
			name: "inherit",
			label: "Inherit",
			type: "boolean/checkmark"
		},

		{
			name: "property",
			label: "Property",
			type: "selection/popup",

			catergory: [
				{
					label: "Basic",
					choice: [
						{ name: "all", label: "All" },
						{ name: "opacity", label: "Opacity" },
						{ name: "visibility", label: "Visibility" }
					]
				},

				{
					label: "Transform",
					choice: [
						{ name: "transform", label: "Transform" }
					]
				},

				{
					label: "Size",
					choice: [
						{ name: "width", label: "Width" },
						{ name: "height", label: "Height" },
						{ name: "min-width", label: "Minimum Width" },
						{ name: "max-width", label: "Maximum Width" },
						{ name: "min-height", label: "Minimum Height" },
						{ name: "max-height", label: "Maximum Height" }
					]
				},

				{
					label: "Spacing",
					choice: [
						{ name: "padding", label: "Padding" },
						{ name: "padding-top", label: "Padding Top" },
						{ name: "padding-right", label: "Padding Right" },
						{ name: "padding-bottom", label: "Padding Bottom" },
						{ name: "padding-left", label: "Padding Left" }
					]
				},

				{
					label: "Background & Color",
					choice: [
						{ name: "background", label: "Background" },
						{ name: "background-color", label: "Background Color" },
						{ name: "color", label: "Text Color" },
						{ name: "border-color", label: "Border Color" }
					]
				},

				{
					label: "Border",
					choice: [
						{ name: "border", label: "Border" },
						{ name: "border-width", label: "Border Width" },
						{ name: "border-top-width", label: "Top Border Width" },
						{ name: "border-right-width", label: "Right Border Width" },
						{ name: "border-bottom-width", label: "Bottom Border Width" },
						{ name: "border-left-width", label: "Left Border Width" },
						{ name: "border-radius", label: "Border Radius" }
					]
				},

				{
					label: "Shadow & Filter",
					choice: [
						{ name: "box-shadow", label: "Box Shadow" },
						{ name: "filter", label: "Filter" },
						{ name: "backdrop-filter", label: "Backdrop Filter" }
					]
				},

				{
					label: "Other",
					choice: [
						{ name: "font-size", label: "Font Size" },
						{ name: "line-height", label: "Line Height" },
						{ name: "letter-spacing", label: "Letter Spacing" },
						{ name: "flex", label: "Flex" },
						{ name: "flex-grow", label: "Flex Grow" },
						{ name: "flex-shrink", label: "Flex Shrink" },
						{ name: "gap", label: "Gap" }
					]
				}
			],

			default: [],

			visibleIf: {
				name: "inherit",
				value: false
			}
		},

		{
			name: "duration",
			label: "Duration",
			type: "integer/noNeg",
			default: 300,

			visibleIf: {
				name: "inherit",
				value: false
			}
		},

		{
			name: "delay",
			label: "Delay",
			type: "integer/noNeg",
			default: 0,

			visibleIf: {
				name: "inherit",
				value: false
			}
		},

		{
			name: "curve",
			label: "Timing Curve",
			type: "curve/curve",

			visibleIf: {
				name: "inherit",
				value: false
			}
		}
	],

	allQuery: [

		{
			name: "property",
			label: "Property",
			type: "selection/popup",

			catergory: [
				{
					label: "Basic",
					choice: [
						{ name: "all", label: "All" },
						{ name: "opacity", label: "Opacity" },
						{ name: "visibility", label: "Visibility" }
					]
				},

				{
					label: "Transform",
					choice: [
						{ name: "transform", label: "Transform" }
					]
				},

				{
					label: "Size",
					choice: [
						{ name: "width", label: "Width" },
						{ name: "height", label: "Height" },
						{ name: "min-width", label: "Minimum Width" },
						{ name: "max-width", label: "Maximum Width" },
						{ name: "min-height", label: "Minimum Height" },
						{ name: "max-height", label: "Maximum Height" }
					]
				},

				{
					label: "Spacing",
					choice: [
						{ name: "margin", label: "Margin" },
						{ name: "margin-top", label: "Margin Top" },
						{ name: "margin-right", label: "Margin Right" },
						{ name: "margin-bottom", label: "Margin Bottom" },
						{ name: "margin-left", label: "Margin Left" },

						{ name: "padding", label: "Padding" },
						{ name: "padding-top", label: "Padding Top" },
						{ name: "padding-right", label: "Padding Right" },
						{ name: "padding-bottom", label: "Padding Bottom" },
						{ name: "padding-left", label: "Padding Left" }
					]
				},

				{
					label: "Background & Color",
					choice: [
						{ name: "background", label: "Background" },
						{ name: "background-color", label: "Background Color" },
						{ name: "color", label: "Text Color" },
						{ name: "border-color", label: "Border Color" }
					]
				},

				{
					label: "Border",
					choice: [
						{ name: "border", label: "Border" },
						{ name: "border-width", label: "Border Width" },
						{ name: "border-top-width", label: "Top Border Width" },
						{ name: "border-right-width", label: "Right Border Width" },
						{ name: "border-bottom-width", label: "Bottom Border Width" },
						{ name: "border-left-width", label: "Left Border Width" },
						{ name: "border-radius", label: "Border Radius" }
					]
				},

				{
					label: "Shadow & Filter",
					choice: [
						{ name: "box-shadow", label: "Box Shadow" },
						{ name: "filter", label: "Filter" },
						{ name: "backdrop-filter", label: "Backdrop Filter" }
					]
				},

				{
					label: "Other",
					choice: [
						{ name: "font-size", label: "Font Size" },
						{ name: "line-height", label: "Line Height" },
						{ name: "letter-spacing", label: "Letter Spacing" },
						{ name: "flex", label: "Flex" },
						{ name: "flex-grow", label: "Flex Grow" },
						{ name: "flex-shrink", label: "Flex Shrink" },
						{ name: "gap", label: "Gap" }
					]
				}
			],

			default: []
		},

		{
			name: "duration",
			label: "Duration",
			type: "integer/noNeg",
			default: 300
		},

		{
			name: "delay",
			label: "Delay",
			type: "integer/noNeg",
			default: 0
		},

		{
			name: "curve",
			label: "Timing Curve",
			type: "curve/curve"
		}
	],


	// render
	render: {

		0: function(dataArray, node) {

			if (!node) {
				return;
			}

			const prefix =
				BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}transition-config-self`,
				""
			);

			node.setAttribute(
				`${prefix}transition-config-all`,
				""
			);

			node.setAttribute(
				`${prefix}transition-self-inherit`,
				""
			);

			return;
		},

		1: function(dataArray, node) {

			if (!node) {
				return;
			}

			const prefix =
				BUILDER_CONFIG.classPrefix;

			const attrSelf =
				`${prefix}transition-config-self`;

			const attrInherit =
				`${prefix}transition-self-inherit`;

			const transition =
				dataArray &&
				dataArray.transition &&
				dataArray.transition.self;


			/*
			 * Inherit from parent SECTION.
			 */
			if (
				transition &&
				transition.inherit === true
			) {

				node.setAttribute(
					attrInherit,
					"1"
				);

				node.setAttribute(
					attrSelf,
					"inherit"
				);

				return;
			}


			/*
			 * Normal SELF transition.
			 */
			node.setAttribute(
				attrInherit,
				""
			);


			const selfCSS =
				flexEngineTransition.renderSingle(
					transition
				);


			node.setAttribute(
				attrSelf,
				selfCSS
					? `transition:${selfCSS};`
					: ""
			);

			return;
		},

		2: function(dataArray, node) {

			if (!node || !dataArray) {
				return;
			}

			const prefix =
				BUILDER_CONFIG.classPrefix;

			const attrSelf =
				`${prefix}transition-config-self`;

			const attrAll =
				`${prefix}transition-config-all`;

			const transitionData =
				dataArray.transition || {};


			/*
			 * Render SELF.
			 */
			const selfData =
				structuredClone(dataArray);

			selfData.transition =
				transitionData.self || {};

			flexEngineTransition.render[1](
				selfData,
				node
			);


			/*
			 * Render ALL.
			 */
			const allTransition =
				transitionData.all;


			if (!allTransition) {

				node.setAttribute(
					attrAll,
					""
				);

				return;
			}


			const allCSS =
				flexEngineTransition.renderSingle(
					allTransition
				);


			node.setAttribute(
				attrAll,
				allCSS
					? `transition:${allCSS};`
					: ""
			);

			return;
		},

		3: function(dataArray, node) {

			if (!node) {
				return;
			}

			const prefix =
				BUILDER_CONFIG.classPrefix;

			node.setAttribute(
				`${prefix}transition-config-self`,
				"inherit"
			);

			node.setAttribute(
				`${prefix}transition-self-inherit`,
				"1"
			);

			return;
		},

		"other": function(dataArray, node) {

			return;
		}
	},


	// helper functions
	applySectionTransition: function(node) {

		if (!node) {
			return;
		}

		const prefix =
			BUILDER_CONFIG.classPrefix;

		const attrAll =
			`${prefix}transition-config-all`;

		const attrSelf =
			`${prefix}transition-config-self`;

		const attrSelfInherit =
			`${prefix}transition-self-inherit`;

		const allConfig =
			node.getAttribute(attrAll) || "";


		if (
			!allConfig ||
			allConfig === "inherit"
		) {
			return;
		}


		const walk =
			function(currentNode, currentDepth) {

				const currentInherit =
					currentNode.getAttribute(
						attrSelfInherit
					);

				const enabled =
					currentInherit !== null &&
					currentInherit !== "" &&
					currentInherit !== "0";


				if (enabled) {

					currentNode.setAttribute(
						attrSelfInherit,
						String(currentDepth)
					);

					currentNode.setAttribute(
						attrSelf,
						allConfig
					);
				}


				[...currentNode.children].forEach(
					function(child) {
						walk(
							child,
							currentDepth + 1
						);
					}
				);
			};


		[...node.children].forEach(
			function(child) {
				walk(child, 1);
			}
		);
	},

	renderSingle: function(transition) {

		if (!transition) {
			return "";
		}

		if (!Array.isArray(transition.property)) {
			return "";
		}

		if (transition.property.length === 0) {
			return "";
		}


		const duration =
			Math.max(
				0,
				Number(transition.duration) || 0
			);

		const delay =
			Math.max(
				0,
				Number(transition.delay) || 0
			);


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


		const durationSeconds =
			duration / 1000;

		const delaySeconds =
			delay / 1000;


		const parts = [];


		for (
			const property of transition.property
		) {

			if (
				typeof property !== "string" ||
				property.trim() === ""
			) {
				continue;
			}

			parts.push(
				`${property} ${durationSeconds}s ${curve} ${delaySeconds}s`
			);
		}


		return parts.join(",");
	}
};


// Action System, that's too Strange so we cannot count.
export const flexEngineActionQuery = [
	{
		name: "enable",
		label: "Clickable",
		type: "boolean/checkmark"
	},
	{
		name: "action.mode",
		label: "Action",
		type: "selection",
		choice: [{
			name: "Link",
			value: "a"
		}, {
			name: "Download",
			value: "download"
		}, {
			name: "Open Popup",
			value: "openPopup"
		}, {
			name: "Close This Popup",
			value: "closeThisPopup"
		}, {
			name: "Run JavaScript",
			value: "runJS"
		}],
		visibleIf: {
			name: "enable",
			value: true
		}
	},
	{
		name: "action.url",
		label: "URL",
		type: "string/text",
		visibleIf: {
			name: "action.mode",
			value: ["a", "download"]
		}
	},
	{
		name: "action.newPage",
		label: "Open in New Page",
		type: "boolean/checkmark",
		visibleIf: {
			name: "action.mode",
			value: "a"
		}
	},
	{
		name: "action.forceDownload",
		label: "Force Download",
		type: "boolean/checkmark",
		visibleIf: {
			name: "action.mode",
			value: "download"
		}
	},
	{
		name: "action.popupID",
		label: "Popup ID",
		type: "string/text",
		visibleIf: {
			name: "action.mode",
			value: "openPopup"
		}
	},
	{
		name: "action.JS",
		label: "JavaScript",
		type: "string/text",
		visibleIf: {
			name: "action.mode",
			value: "runJS"
		}
	}
];

export const flexEngineCreateAction = function(documentHTML, clickable, nodeStyleDefault) {
	let node = documentHTML.createElement(nodeStyleDefault);
	if (!clickable || clickable.enable !== true || !clickable.action) {
		return node;
	}
	const action = clickable.action;
	if (action.mode === "a") {
		node = documentHTML.createElement("a");
		node.href = action.url || "";
		if (action.newPage === true) {
			node.target = "_blank";
		}
	}
	if (action.mode === "download") {
		node = documentHTML.createElement("a");
		node.href = action.url || "";
		node.target = "_blank";
		node.download = "";
		if (action.forceDownload === true) {
			node.setAttribute("download", action.forceDownload);
		}
	}
	if (action.mode === "openPopup") {
		node = documentHTML.createElement("button");
		node.setAttribute(`data-${BUILDER_CONFIG.classPrefix}popup-id`, action.popupID || "");
	}
	if (action.mode === "closeThisPopup") {
		node = documentHTML.createElement("button");
		node.setAttribute(`data-${BUILDER_CONFIG.classPrefix}popup-id`, "0");
	}
	if (action.mode === "runJS") {
		node = documentHTML.createElement("button");
		node.setAttribute("onclick", action.JS || "");
	}
	return node;
};


/**
 * ------------------------------------------------------------------------------
 * Styler Manager
 * 
 * Those were for Property like Style
 * Last Update: 1.0.0
 * ------------------------------------------------------------------------------
 *
 * Expected structure:
 *
 *
 * DATA TREE
 *
 * data
 * └─ appearance
 *    └─ [appearance]
 *       └─ [target]
 *          └─ [state]
 *             ├─ style
 *             └─ size
 *
 * EXTRA / QUERY TREE
 *
 * settings
 * └─ [element]
 *    ├─ styleDefault
 *    ├─ styleMobile
 *    ├─ sizeDefault
 *    ├─ sizeMobile
 *    └─ extras
 *       └─ [position]
 *          ├─ styleDefault
 *          ├─ styleMobile
 *          ├─ sizeDefault
 *          └─ sizeMobile
 */

const flexEngineDefaultAppearance = {
	styleQuery: [{
		name: "paddingTop",
		label: "Padding Top",
		type: "space"
	}, {
		name: "paddingBottom",
		label: "Padding Bottom",
		type: "space"
	}, {
		name: "paddingLeft",
		label: "Padding Left",
		type: "space"
	}, {
		name: "paddingRight",
		label: "Padding Right",
		type: "space"
	}, {
		name: "borderMode",
		label: "Border Style",
		type: "selection",
		choice: [{
			label: "Solid",
			value: "solid"
		}, {
			label: "None",
			value: "none"
		}, {
			label: "Dashed",
			value: "dashed"
		}, {
			label: "Dotted",
			value: "dotted"
		}, {
			label: "Double",
			value: "double"
		}]
	}, {
		name: "borderTop",
		label: "Top Border",
		type: "space"
	}, {
		name: "borderBottom",
		label: "Bottom Border",
		type: "space"
	}, {
		name: "borderLeft",
		label: "Left Border",
		type: "space"
	}, {
		name: "borderRight",
		label: "Right Border",
		type: "space"
	}, {
		name: "borderRadius",
		label: "Border Radius",
		type: "integer/noNeg"
	}, {
		name: "shadow",
		label: "Shadow",
		type: "boolean/checkmark"
	}, {
		name: "shadowInset",
		label: "Shadow Inset",
		type: "boolean/checkmark"
	}, {
		name: "shadowOffsetX",
		label: "Shadow Offset X",
		type: "integer"
	}, {
		name: "shadowOffsetY",
		label: "Shadow Offset Y",
		type: "integer"
	}, {
		name: "shadowBlur",
		label: "Shadow Blur",
		type: "integer/noNeg"
	}, {
		name: "shadowExpand",
		label: "Shadow Expand",
		type: "integer"
	}, {
		name: "shadowColor",
		label: "Shadow Color",
		type: "color/picker"
	}, {
		name: "textColor",
		label: "Text Color",
		type: "color/picker"
	}, {
		name: "background",
		label: "Background",
		type: "color/picker"
	}, {
		name: "blur",
		label: "Blur",
		type: "integer/noNeg"
	}, {
		name: "font",
		label: "Font",
		type: "string/text"
	}, {
		name: "markColor",
		label: "Caret Color",
		type: "color/picker"
	}, {
		name: "mobilePaddingTop",
		label: "Mobile Padding Top",
		type: "space"
	}, {
		name: "mobilePaddingBottom",
		label: "Mobile Padding Bottom",
		type: "space"
	}, {
		name: "mobilePaddingLeft",
		label: "Mobile Padding Left",
		type: "space"
	}, {
		name: "mobilePaddingRight",
		label: "Mobile Padding Right",
		type: "space"
	}],
	styleDefault: (s) => {
		return {
			"padding-top": flexEngineStyleVarible.space(s.paddingTop),
			"padding-bottom": flexEngineStyleVarible.space(s.paddingBottom),
			"padding-left": flexEngineStyleVarible.space(s.paddingLeft),
			"padding-right": flexEngineStyleVarible.space(s.paddingRight),
			"border-style": s.borderMode || "solid",
			"border-top": flexEngineStyleVarible.space(s.borderTop) || "0px",
			"border-bottom": flexEngineStyleVarible.space(s.borderBottom) || "0px",
			"border-left": flexEngineStyleVarible.space(s.borderLeft) || "0px",
			"border-right": flexEngineStyleVarible.space(s.borderRight) || "0px",
			"border-radius": `${s.borderRadius || 0}px`,
			"box-shadow": s.shadow ? `${s.shadowInset ? 'inset ' : ''}${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 0}px ${s.shadowBlur || 0}px ${s.shadowExpand || 0}px ${flexEngineStyleVarible.color(s.shadowColor)}` : "none",
			"color": flexEngineStyleVarible.color(s.textColor),
			"background": flexEngineStyleVarible.color(s.background),
			"filter": s.blur ? `blur(${s.blur}px)` : "none",
			"font-family": s.font || "inherit",
			"caret-color": flexEngineStyleVarible.color(s.markColor),
		};
	},
	styleMobile: (s) => {
		return {
			"padding-top": flexEngineStyleVarible.space(s.mobilePaddingTop),
			"padding-bottom": flexEngineStyleVarible.space(s.mobilePaddingBottom),
			"padding-left": flexEngineStyleVarible.space(s.mobilePaddingLeft),
			"padding-right": flexEngineStyleVarible.space(s.mobilePaddingRight)
		};
	},


	sizeQuery: [],
	sizeDefault: (sz, isVertical) => {
		return {};
	},

	sizeMobile: (sz, isVertical) => {
		return {};
	}
};

const flexEngineStylesToCss = (cssObject) => {
	if (!cssObject || typeof cssObject !== "object") {
		return "";
	}

	return Object.entries(cssObject)
		.filter(([_, value]) => value !== undefined && value !== null && value !== "")
		.map(([key, value]) => `${key}: ${value};`)
		.join("");
};

const flexEngineStylesResolveRegistry = (elementMode) => {
	const rawMode = String(elementMode || "");
	const separatorIndex = rawMode.indexOf("/");
	const category = separatorIndex === -1 ? rawMode : rawMode.substring(0, separatorIndex);
	const element = separatorIndex === -1 ? "" : rawMode.substring(separatorIndex + 1);
	const isRoot = category === "@root";

	const categoryRegistry = isRoot
		? (flexEngineRootElement || {})
		: (flexEngineDefaultElements?.[category] || {});

	const elementRegistry =
		categoryRegistry?.[element] && typeof categoryRegistry[element] === "object"
			? categoryRegistry[element]
			: {};

	return {
		categoryRegistry,
		elementRegistry
	};
};

const flexEngineStylesCreateBaseRegistry = (elementRegistry, categoryRegistry) => {
	const getProcessor = (name) =>
		typeof elementRegistry?.[name] === "function"
			? elementRegistry[name]
			: typeof categoryRegistry?.[name] === "function"
				? categoryRegistry[name]
				: typeof flexEngineDefaultAppearance?.[name] === "function"
					? flexEngineDefaultAppearance[name]
					: () => ({});

	return {
		styleDefault: getProcessor("styleDefault"),
		styleMobile: getProcessor("styleMobile"),
		sizeDefault: getProcessor("sizeDefault"),
		sizeMobile: getProcessor("sizeMobile"),
		extras: elementRegistry?.extras ?? categoryRegistry?.extras ?? null
	};
};

const flexEngineStylesNormalizeExtras = (extras) => {
	const normalized = {};

	if (!extras) {
		return normalized;
	}

	if (typeof extras === "string") {
		normalized[extras] = {};
		return normalized;
	}

	if (Array.isArray(extras)) {
		extras.forEach((item) => {
			if (typeof item === "string") {
				normalized[item] = {};
				return;
			}

			if (!item || typeof item !== "object") {
				return;
			}

			const position = item.position ?? item.target ?? item.name ?? item.key;

			if (position) {
				normalized[String(position)] = item;
			}
		});

		return normalized;
	}

	if (
		typeof extras === "object" &&
		(extras.position ||
			extras.target ||
			extras.styleDefault ||
			extras.styleMobile ||
			extras.sizeDefault ||
			extras.sizeMobile)
	) {
		const position = extras.position ?? extras.target;

		if (position) {
			normalized[String(position)] = extras;
		}

		return normalized;
	}

	Object.entries(extras).forEach(([position, config]) => {
		normalized[position] =
			config && typeof config === "object"
				? config
				: {};
	});

	return normalized;
};

const flexEngineStylesProcessState = (tateData, stateName, processorRegistry, isVertical) => {
	if (!stateData || typeof stateData !== "object") {
		return null;
	}

	const styleData =
		stateData.style && typeof stateData.style === "object"
			? stateData.style
			: {};

	const sizeData =
		stateData.size && typeof stateData.size === "object"
			? stateData.size
			: {};

	const isMobile = stateName === "onMobile" || stateName === "onMobileHover";

	const styleProcessor = isMobile
		? processorRegistry.styleMobile
		: processorRegistry.styleDefault;

	const sizeProcessor = isMobile
		? processorRegistry.sizeMobile
		: processorRegistry.sizeDefault;

	return {
		...(typeof styleProcessor === "function"
			? styleProcessor(styleData) || {}
			: {}),
		...(typeof sizeProcessor === "function"
			? sizeProcessor(sizeData, isVertical) || {}
			: {})
	};
};

const flexEngineStylesBuildClassName = (prefix, appearanceName, position, stateName) => {
	const cleanAppearance = String(appearanceName || "").replace(/^\./, "");

	const stateSuffix = {
		default: "",
		onMobile: "-onMobile",
		hover: "-onHover",
		onMobileHover: "-onMobileHover"
	}[stateName] || "";

	const targetSuffix =
		position === undefined ||
		position === null ||
		position === "" ||
		position === "base"
			? ""
			: `-at${position}`;

	return `${prefix}-styles-${cleanAppearance}${stateSuffix}${targetSuffix}`;
};

const flexEngineStylingSystem = function (dataArray, node, isVertical, elementMode) {
	if (!node || !dataArray || typeof dataArray !== "object") {
		return;
	}

	const {
		categoryRegistry,
		elementRegistry
	} = flexEngineStylesResolveRegistry(elementMode);

	const baseRegistry = flexEngineStylesCreateBaseRegistry(
		elementRegistry,
		categoryRegistry
	);

	const extraRegistry = flexEngineStylesNormalizeExtras(
		baseRegistry.extras
	);

	const appearance =
		dataArray.appearance &&
		typeof dataArray.appearance === "object"
			? dataArray.appearance
			: {};

	const prefix = BUILDER_CONFIG?.classPrefix || "";

	const states = [
		"default",
		"onMobile",
		"hover",
		"onMobileHover"
	];

	Object.entries(appearance).forEach(
		([appearanceName, appearanceData]) => {
			if (
				!appearanceData ||
				typeof appearanceData !== "object"
			) {
				return;
			}

			const positions = new Set(["base"]);

			Object.keys(appearanceData).forEach((key) => {
				positions.add(String(key));
			});

			Object.keys(extraRegistry || {}).forEach((key) => {
				positions.add(String(key));
			});

			positions.forEach((position) => {
				const targetData = appearanceData?.[position];

				const extraConfig =
					position === "base"
						? null
						: extraRegistry?.[position] || null;

				const processorRegistry = extraConfig
					? {
							styleDefault:
								typeof extraConfig.styleDefault ===
								"function"
									? extraConfig.styleDefault
									: baseRegistry.styleDefault,

							styleMobile:
								typeof extraConfig.styleMobile ===
								"function"
									? extraConfig.styleMobile
									: baseRegistry.styleMobile,

							sizeDefault:
								typeof extraConfig.sizeDefault ===
								"function"
									? extraConfig.sizeDefault
									: baseRegistry.sizeDefault,

							sizeMobile:
								typeof extraConfig.sizeMobile ===
								"function"
									? extraConfig.sizeMobile
									: baseRegistry.sizeMobile
						}
					: baseRegistry;

				states.forEach((stateName) => {
					const stateData = targetData?.[stateName];

					if (
						!stateData ||
						typeof stateData !== "object"
					) {
						return;
					}

					const cssObject = flexEngineStylesProcessState(
						stateData,
						stateName,
						processorRegistry,
						isVertical
					);

					if (!cssObject) {
						return;
					}

					const attributeName =
						flexEngineStylesBuildClassName(
							prefix,
							appearanceName,
							position,
							stateName
						);

					node.setAttribute(
						attributeName,
						flexEngineStylesToCss(cssObject)
					);
				});
			});
		}
	);
};


/**
 * ------------------------------------------------------------------------------
 * Element Registery
 * 
 * Main Registery that control all of the elements. @root being treat differently.
 * Later we will use a function to start registery extension process.
 * ------------------------------------------------------------------------------
 * Share some infomation:
 * every catergory is included with a sizeQuery, sizeDefault, sizeMobile, elements and setting.
 * Setting will include systemClass, allowedSortIn, dependencyAnimation, allowedSortTo those 4 types.
 * 
 * Now for each element, they need include a className, alts, icon, contentQuery, layoutQuery, initQuery(optional), 
 * initFunction(optional), contentFunction, cssStyles, jsRuntime and setting.
 * a setting may have some questions, check in to see what there have.
 * contentFunction need include function(dataArray, documentHTML, node, createAnotherNode)
 * 
 * You can override the class by simply using the same name field in element.
 * ------------------------------------------------------------------------------
 */


debugger; // FLAG for future change - flexEngineDefaultElements need to shift to new StyleVarible, 
// for safety, keep the original ones, but we will delete soon after.
// defaults elements
export const flexEngineDefaultElements = {
    basic: {
        sizeQuery: [
            {
                name: "along",
                label: "{Width/Height}",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "overflowAlong",
                label: "{Width/Height} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "alongGrow",
                label: "{Width/Height} Growth Amount",
                type: "number"
            },
            {
                name: "alongShrink",
                label: "Shrink?",
                type: "selection",
                choice: [
                    { label: "No shrink", value: 0 },
                    { label: "Shrink", value: 1 }
                ]
            },

            {
                name: "across",
                label: "{Height/Width}",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "overflowAcross",
                label: "{Height/Width} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "acrossAlign",
                label: "{Height/Width} Alignment",
                type: "selection",
                choice: [
                    { label: "Default", value: 0 },
                    { label: "Start", value: 1 },
                    { label: "Center", value: 2 },
                    { label: "End", value: 3 },
                    { label: "Stretch", value: 4 },
                    { label: "Baseline", value: 5 }
                ]
            },

            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space",
                defaultAsFull: true
            }
        ],

		sizeDefault: (sz, isVertical) => {
			return {
				"width": isVertical ? flexEngineStyleVarible.space(sz.across) : flexEngineStyleVarible.space(sz.along),
				"height": isVertical ? flexEngineStyleVarible.space(sz.along) : flexEngineStyleVarible.space(sz.across),
				"flex-grow": sz.alongGrow || 0,
				"flex-shrink": sz.alongShrink === true ? 1 : 0,
				"overflow-x": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible'),
				"overflow-y": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible'),
				"align-self": (sz.acrossAlign > 0) ? ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'][sz.acrossAlign - 1] : 'auto'
			}
		},
		sizeMobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
			}
		},

        elements: {
            text: {
                className: "text",
                alts: ["p"],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">
                        <path d="M288-192v-480H96v-96h480v96H384v480h-96Zm360 0v-288H528v-96h336v96H744v288h-96Z" />
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "textbox", 
                        type: "interactiveTextBox",
                    }
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const deltaOps = dataArray.content;
                    const converter = new QuillDeltaToHtmlConverter(deltaOps, {
                        classPrefix: `${BUILDER_CONFIG.classPrefix}content-text`
                    });
                    const html = converter.convert();
                    node.innerHTML = html;
                },  
                cssStyles: [],
                jsRuntime: {},

                settings: {}
            },

            heading: {
                className: "heading",
                alts: ["h1", "h2", "h3", "h4", "h5", "h6"],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">
                        <path d="M432-192v-480H240v-96h480v96H528v480h-96Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "textbox", 
                        type: "interactiveTextBox",
                    }
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const deltaOps = dataArray.content;
                    const converter = new QuillDeltaToHtmlConverter(deltaOps, {
                        classPrefix: `${BUILDER_CONFIG.classPrefix}content-text`
                    });
                    const html = converter.convert();
                    node.innerHTML = html;
                },  
                cssStyles: [],
                jsRuntime: {},


                settings: {}
            },
            
            image: {
                className: "image",
                alts: ["img"],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">

                        <path d="M216-144q-29.7 0-50.85-21.5Q144-187 
                        144-216v-528q0-29 21.15-50.5T216-816h528q29.7 0 50.85 21.5Q816-773 
                        816-744v528q0 29-21.15 50.5T744-144H216Zm0-72h528v-528H216v528Zm48-72h432L552-480 444-336l-72-96-108 
                        144Zm-48 72v-528 528Z"/>

                    </svg>
                `,

                contentQuery: [
                    {
                        name: "source", 
                        type: "media/img",
                    },
                    {
                        name: "alt", 
                        label: "alt text",
                        type: "string/textbox",
                    }, 
                    {
                        name: "displayX", 
                        label: "X Alignment",
                        type: "selection",
                        choice: [
                            {label: "left", value: 1},
                            {label: "center", value: 2},
                            {label: "right", value: 3}
                        ],
                        default: 2,
                    },  
                    {
                        name: "displayY", 
                        label: "Y Alignment",
                        type: "selection",
                        choice: [
                            {label: "top", value: 1},
                            {label: "center", value: 2},
                            {label: "bottom", value: 3}
                        ],
                        default: 2,
                    },                                                         
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const content = dataArray.content;
                    // Resolve media URL
                    const src = flexEngineStyleVarible.media(content.source);
                    // Create <img> element
                    const img = documentHTML.createElement("img");
                    img.src = src;
                    img.alt = content.alt || "";
                    img.className = `${BUILDER_CONFIG.classPrefix}context-image`;
                    // Positioning logic
                    const posX = content.displayX; // 1 = left, 2 = center, 3 = right
                    const posY = content.displayY; // 1 = top, 2 = center, 3 = bottom
                    // Convert numeric alignment to CSS keywords
                    const map = {
                        1: "start",
                        2: "center",
                        3: "end"
                    };
                    img.style.objectPosition = `${map[posX]} ${map[posY]}`;
                    // Insert into node
                    node.innerHTML = ""; // clear previous content if needed
                    node.appendChild(img); // DOM insertion
                },  
                cssStyles: [
                    {
                        object: "@context",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "100%" },
                            { key: "object-fit", value: "cover" },
                            { key: "object-position", value: "center" },
                            { key: "display", value: "block" },
                            { key: "user-select", value: "none" }
                        ]
                    }
                ],
                jsRuntime: {},

                initQuery: [
                    {
                        name: "src",
                        lebel: "select image",
                        type: "media/img"
                    }
                ],
                
                initFunction: function(dataArray, element) {
                    const sourceData = dataArray.src;

                    // Ensure the element and its content object exist safely
                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    // Step 2: Insert it directly into element.content.source
                    element.content.source = sourceData;           
                },

                settings: {}
            },

            button: {
                className: "button",
                alts: ["btn"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">

                        <path d="M168-240q-29.7 0-50.85-21.15Q96-282.3 96-312v-336q0-29.7 21.15-50.85Q138.3-720 168-720h624q29.7 0 50.85 21.15Q864-677.7 864-648v336q0 29.7-21.15 50.85Q821.7-240 792-240H168Zm0-72h624v-336H168v336Zm132-48h72v-84h84v-72h-84v-84h-72v84h-84v72h84v84Zm-132 48v-336 336Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "label",
                        type: "string/text",
                    }
                ],

                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const content = dataArray.content;
                    const label = content.label || "";

                    // SAFE: prevents XSS because it does not parse HTML
                    node.textContent = label;
                },

                cssStyles: [],

                jsRuntime: {},

                settings: {}
            },

            line: {
                className: "hr",
                alts: ["line"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">

                        <path d="m271-209-62-62q-11-11-11-25.5t11-25.5l429-429q11-11 25.5-11t25.5 11l62 62q11 11 11 25.5T751-638L322-209q-11 11-25.5 11T271-209Z"/>
                    </svg>
                `,

                contentQuery: [],

                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const hr = documentHTML.createElement("hr");
                    hr.className = `${BUILDER_CONFIG.classPrefix}context-hr`;

                    node.innerHTML = "";
                    node.appendChild(hr);
                },

                cssStyles: [
                    {
                        object: "hr",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "margin", value: "0" },
                            { key: "border", value: "none" },
                            { key: "border-top", value: "1px solid currentColor" },
                            { key: "box-sizing", value: "border-box" }
                        ]
                    }
                ],

                jsRuntime: {},

                settings: {}
            },

            spacer: {
                className: "br",
                alts: ["br"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">

                        <path d="M349.5-610.29q10.5-10.29 10.5-25.5t-10.29-25.71q-10.29-10.5-25.5-10.5t-25.71 10.29q-10.5 10.29-10.5 25.5t10.29 25.71q10.29 10.5 25.5 10.5t25.71-10.29Zm156 0q10.5-10.29 10.5-25.5t-10.29-25.71q-10.29-10.5-25.5-10.5t-25.71 10.29q-10.5 10.29-10.5 25.5t10.29 25.71q10.29 10.5 25.5 10.5t25.71-10.29Zm156 0q10.5-10.29 10.5-25.5t-10.29-25.71q-10.29-10.5-25.5-10.5t-25.71 10.29q-10.5 10.29-10.5 25.5t10.29 25.71q10.29 10.5 25.5 10.5t25.71-10.29ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z"/>
                    </svg>
                `,

                contentQuery: [],

                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    // Spacer is layout-only — no DOM insertion
                    return;
                },

                cssStyles: [],

                jsRuntime: {},

                settings: {}
            }
        },

        setting: {
            systemClass: true,
            allowedSortIn: false, // Work at End node
            animation: 1,
            allowedSortTo: ["container", "section/section", "@root/popup", "@root/CTA", "@root/Footer"]
        }
    },
    
    media: {
        sizeQuery: [
            {
                name: "along",
                label: "{Width/Height}",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "overflowAlong",
                label: "{Width/Height} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "alongGrow",
                label: "{Width/Height} Growth Amount",
                type: "number"
            },
            {
                name: "alongShrink",
                label: "Shrink?",
                type: "selection",
                choice: [
                    { label: "No shrink", value: 0 },
                    { label: "Shrink", value: 1 }
                ]
            },

            {
                name: "across",
                label: "{Height/Width}",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "overflowAcross",
                label: "{Height/Width} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "acrossAlign",
                label: "{Height/Width} Alignment",
                type: "selection",
                choice: [
                    { label: "Default", value: 0 },
                    { label: "Start", value: 1 },
                    { label: "Center", value: 2 },
                    { label: "End", value: 3 },
                    { label: "Stretch", value: 4 },
                    { label: "Baseline", value: 5 }
                ]
            },

            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space",
                defaultAsFull: true
            }
        ],

		sizeDefault: (sz, isVertical) => {
			return {
				"width": isVertical ? flexEngineStyleVarible.space(sz.across) : flexEngineStyleVarible.space(sz.along),
				"height": isVertical ? flexEngineStyleVarible.space(sz.along) : flexEngineStyleVarible.space(sz.across),
				"flex-grow": sz.alongGrow || 0,
				"flex-shrink": sz.alongShrink === true ? 1 : 0,
				"overflow-x": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible'),
				"overflow-y": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible'),
				"align-self": (sz.acrossAlign > 0) ? ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'][sz.acrossAlign - 1] : 'auto'
			}
		},
        
		sizeMobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
			}
		},

        elements: {
            audio: {
                className: "audio",
                alts: [],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">
                        <path d="M432-192q40 0 68-28t28-68v-144h120v-96H480v157q-11-6-22.5-9.5T432-384q-40 0-68 28t-28 68q0 40 28 68t68 28ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "source", 
                        label: "Source",
                        type: "media/audio",
                    },
                    {
                        name: "hideControls", 
                        label: "Hide Controls",
                        type: "boolean/checkmark",
                    }, 
                    {
                        name: "loop", 
                        label: "Loop Audio",
                        type: "boolean/checkmark",
                    }                                          
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const content = dataArray.content;
                    const src = flexEngineStyleVarible.media(content.source);
                    const audio = documentHTML.createElement("audio");
                    
                    audio.className = `${BUILDER_CONFIG.classPrefix}context-audio`;
                    audio.src = src;
                    
                    // Handle native audio player properties
                    if (!content.hideControls) {
                        audio.controls = true;
                    }
                    if (content.loop) {
                        audio.loop = true;
                    }
                    
                    node.innerHTML = ""; 
                    node.appendChild(audio); 
                },  
                cssStyles: [
                    {
                        object: "@context",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "display", value: "block" }
                        ]
                    }
                ],
                jsRuntime: {},

                settings: {}
            },

            video: {
                className: "video",
                alts: ["video"],
                
                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="currentColor" 
                        class="RaySiteUI-c-svg">
                        <path d="m456-384 264-168-264-168v336ZM312-240q-29.7 0-50.85-21.15Q240-282.3 240-312v-480q0-29.7 21.15-50.85Q282.3-864 312-864h480q29.7 0 50.85 21.15Q864-821.7 864-792v480q0 29.7-21.15 50.85Q821.7-240 792-240H312Zm0-72h480v-480H312v480ZM168-96q-29.7 0-50.85-21.15Q96-138.3 96-168v-552h72v552h552v72H168Zm144-696v480-480Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "source",
                        label: "Source",
                        type: "media/video"
                    },
                    {
                        name: "hideControls",
                        label: "Hide Controls",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "autoplay",
                        label: "Autoplay",
                        type: "boolean/checkmark",
                    },
                    {
                        name: "muted",
                        label: "Mute by default",
                        type: "boolean/checkmark",
                        visibleIf: {
                            name: "autoplay",
                            value: false,
                            otherwise: false
                        }                        
                    },
                    {
                        name: "loop",
                        label: "Loop the video",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "thumbnail",
                        label: "thumbnail",
                        type: "media/image"
                    },
                    {
                        name: "disablepictureinpicture",
                        label: "Disable Picture to Picture",
                        type: "boolean/checkmark"
                    }
                ],
                layoutQuery: [],

                contentFunction: function(dataArray, documentHTML, node) {
                    const content = dataArray.content;
                    const src = flexEngineStyleVarible.media(content.source);
                    const poster = content.thumbnail ? flexEngineStyleVarible.media(content.thumbnail) : null;
                    const video = documentHTML.createElement("video");
                    
                    video.className = `${BUILDER_CONFIG.classPrefix}context-video`;
                    video.src = src;
                    
                    if (poster) {
                        video.poster = poster;
                    }
                    if (!content.hideControls) {
                        video.controls = true;
                    }
                    if (content.autoplay) {
                        video.autoplay = true;
                    }
                    if (content.muted) {
                        video.muted = true;
                    }
                    if (content.loop) {
                        video.loop = true;
                    }
                    if (content.disablepictureinpicture) {
                        video.disablePictureInPicture = true;
                        video.setAttribute("disablepictureinpicture", "");
                    }
                    
                    const fallback = documentHTML.createElement("p");
                    fallback.textContent = "Oh no! your Browser does not support Embed Video! but that's OK, download the video at ";
                    
                    const link = documentHTML.createElement("a");
                    link.href = src;
                    link.textContent = "here!";
                    link.download = "";
                    
                    fallback.appendChild(link);
                    video.appendChild(fallback);
                    
                    node.innerHTML = "";
                    node.appendChild(video);
                },
                cssStyles: [
                    {
                        object: "@context",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "auto" },
                            { key: "display", value: "block" },
                            { key: "background", value: "#000" }
                        ]
                    }
                ],
                jsRuntime: {},

                settings: {
                    hide: true,
                }
            },

            vimeoVideo: {
                name: "Vimeo Video",
                className: "vimeoVideo",

                alts: ["vimeo", "vimeo video"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M2498.5,499c-11.2,242.7-181.1,575.1-509.7,997.1c-339.8,440.6-627.4,661-862.6,661 
                        c-145.6,0-268.9-134.4-369.7-403.3l-201.6-739.4C480.1,745.4,399.8,611,314,611c-18.7,0-84,39.2-196.1,117.6L0.3,577.4 
                        C122.5,470,243.8,361.7,364.4,252.5C528.7,110.6,651.9,35.9,734.1,28.5c194.2-18.7,313.7,113.9,358.5,397.7 
                        c48.5,306.2,82.2,496.7,100.8,571.3c56,253.9,117.6,380.9,184.8,380.9c52.3,0,130.7-82.2,235.3-246.5 
                        c104.6-164.3,160.6-289.4,168-375.3c14.9-141.9-41.1-212.9-168-212.9c-59.7,0-121.4,13.1-184.8,39.2 
                        c123.2-399.6,358.5-593.7,705.8-582.5C2392.1,7.9,2513.4,174.1,2498.5,499L2498.5,499z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "sourceID",
                        label: "Video ID",
                        type: "string/text"
                    },
                    {
                        name: "hash",
                        label: "Password hash",
                        type: "string/text"
                    },
                    {
                        name: "hideControls",
                        label: "Hide controls",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "autoplay",
                        label: "Autoplay",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "muted",
                        label: "Mute",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "loop",
                        label: "Loop Video",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "disablepictureinpicture",
                        label: "Disable Picture in Picture",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "startTime",
                        label: "Start time (seconds)",
                        type: "integer/NoNeg"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "url",
                        label: "Vimeo shared link",
                        type: "string/url"
                    }
                ],

                initFunction: function(dataArray, element) {
                    const rawURL = dataArray.url || "";

                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    // Extract Vimeo ID + hash from shared link
                    try {
                        const u = new URL(rawURL);
                        const parts = u.pathname.split("/").filter(Boolean);

                        // Vimeo shared links look like:
                        // https://vimeo.com/123456789
                        // https://vimeo.com/123456789/h:abcdefg
                        // https://player.vimeo.com/video/123456789?h=abcdefg

                        let id = "";
                        let hash = "";

                        // Find numeric ID
                        for (const p of parts) {
                            if (/^\d+$/.test(p)) {
                                id = p;
                            }
                            if (p.startsWith("h:")) {
                                hash = p.replace("h:", "");
                            }
                        }

                        // Also check query params
                        if (u.searchParams.has("h")) {
                            hash = u.searchParams.get("h");
                        }

                        element.content.sourceID = id;
                        element.content.hash = hash;

                    } catch (e) {
                        // If URL parsing fails, leave fields empty
                        element.content.sourceID = "";
                        element.content.hash = "";
                    }
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    const c = dataArray.content;

                    let url = `https://player.vimeo.com/video/${encodeURIComponent(c.sourceID)}`;

                    const params = new URLSearchParams();

                    if (c.hash && c.hash !== "") {
                        params.set("h", c.hash);
                    }

                    params.set("controls", c.hideControls ? "0" : "1");

                    if (c.autoplay) {
                        params.set("autoplay", "1");
                        params.set("muted", "1");
                    }

                    if (c.muted) {
                        params.set("muted", "1");
                    }

                    if (c.loop) {
                        params.set("loop", "1");
                    }

                    if (c.startTime) {
                        params.set("#t", `${c.startTime}s`);
                    }

                    url += "?" + params.toString();

                    const iframe = documentHTML.createElement("iframe");
                    iframe.className = `${BUILDER_CONFIG.classPrefix}context-vimeoVideo`;
                    iframe.src = url;
                    iframe.allow = "autoplay; fullscreen; picture-in-picture";

                    if (c.disablepictureinpicture) {
                        iframe.setAttribute("disablepictureinpicture", "");
                        iframe.allow = "autoplay; fullscreen";
                    }

                    iframe.frameBorder = "0";
                    iframe.allowFullscreen = true;

                    node.innerHTML = "";
                    node.appendChild(iframe);
                },

                cssStyles: [
                    {
                        object: "@context",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "aspect-ratio", value: "16 / 9" },
                            { key: "display", value: "block" },
                            { key: "border", value: "none" }
                        ]
                    }
                ],

                jsRuntime: {},

                settings: {}
            },
     
            ytVideo: {
                name: "YouTube Video",
                className: "ytVideo",

                alts: ["youtube", "yt", "youtube video"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "videoID",
                        label: "Video ID",
                        type: "string/text"
                    },
                    {
                        name: "hideControls",
                        label: "Hide controls",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "autoplay",
                        label: "Autoplay",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "muted",
                        label: "Mute",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "loop",
                        label: "Loop Video",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "disablepictureinpicture",
                        label: "Disable Picture in Picture",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "startTime",
                        label: "Start time (seconds)",
                        type: "integer/noNeg"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "url",
                        label: "YouTube Video shared Link",
                        type: "string/url"
                    }
                ],

                initFunction: function(dataArray, element) {
                    const rawURL = dataArray.url || "";

                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    try {
                        const u = new URL(rawURL);

                        let id = "";

                        // Handle:
                        // https://www.youtube.com/watch?v=XXXXXXXX
                        // https://youtu.be/XXXXXXXX
                        // https://www.youtube.com/embed/XXXXXXXX
                        // https://youtube.com/shorts/XXXXXXXX
                        // https://youtube.com/live/XXXXXXXX

                        // 1. Check query param
                        if (u.searchParams.has("v")) {
                            id = u.searchParams.get("v");
                        }

                        // 2. Check pathname segments
                        if (!id) {
                            const parts = u.pathname.split("/").filter(Boolean);

                            // youtu.be/XXXXXXXX
                            if (u.hostname.includes("youtu.be")) {
                                id = parts[0];
                            }

                            // youtube.com/embed/XXXXXXXX
                            if (parts[0] === "embed") {
                                id = parts[1];
                            }

                            // youtube.com/shorts/XXXXXXXX
                            if (parts[0] === "shorts") {
                                id = parts[1];
                            }

                            // youtube.com/live/XXXXXXXX
                            if (parts[0] === "live") {
                                id = parts[1];
                            }
                        }

                        element.content.videoID = id;

                    } catch (e) {
                        element.content.videoID = "";
                    }
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    const c = dataArray.content;

                    let url = `https://www.youtube.com/embed/${encodeURIComponent(c.videoID)}`;

                    const params = new URLSearchParams();

                    params.set("controls", c.hideControls ? "0" : "1");

                    if (c.autoplay) {
                        params.set("autoplay", "1");
                        params.set("mute", "1");
                    }

                    if (c.muted) {
                        params.set("mute", "1");
                    }

                    if (c.loop) {
                        params.set("loop", "1");
                        params.set("playlist", c.videoID);
                    }

                    if (c.startTime) {
                        params.set("start", c.startTime);
                    }

                    url += "?" + params.toString();

                    const iframe = documentHTML.createElement("iframe");
                    iframe.className = `${BUILDER_CONFIG.classPrefix}context-ytvideo`;
                    iframe.src = url;
                    iframe.title = "YouTube video player";
                    iframe.frameBorder = "0";

                    iframe.allow =
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

                    if (c.disablepictureinpicture) {
                        iframe.setAttribute("disablepictureinpicture", "");
                        iframe.allow =
                            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share";
                    }

                    iframe.referrerPolicy = "strict-origin-when-cross-origin";
                    iframe.allowFullscreen = true;

                    node.innerHTML = "";
                    node.appendChild(iframe);
                },

                cssStyles: [
                    {
                        object: "@context",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "aspect-ratio", value: "16 / 9" },
                            { key: "display", value: "block" },
                            { key: "border", value: "none" }
                        ]
                    }
                ],

                jsRuntime: {},

                settings: {}
            },
            
            iframe: {
                name: "Embeds",
                className: "iframe",

                alts: ["embed", "iframe", "html embed", "external embed"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M480-432h192v-72H480v72Zm-48 48v-168h288v168H432ZM168-192q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Zm0-72h624v-360H168v360Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "source",
                        label: "source",
                        type: "string/textbox"
                    },
                    {
                        name: "embedAsHTML",
                        label: "this is HTML document",
                        type: "boolean/checkmark",
                        default: false
                    },
                    {
                        name: "sandboxChoice",
                        label: "sandbox policy",
                        type: "selection",
                        choice: [
                            { label: "No sandbox", value: 0 },
                            { label: "Sandbox (allow scripts + same-origin)", value: 1 },
                            { label: "Strict sandbox", value: 2 }
                        ],
                        default: 0
                    },
                    {
                        name: "allowFullScreen",
                        label: "Allow Full Screen",
                        type: "boolean/checkmark"
                    },
                    {
                        name: "permission",
                        label: "Permission Setting......",
                        type: "selection/popup",
                        catergory: [
                            {
                                label: "Media & Playback",
                                choice: [
                                    { name: "autoplay", label: "Autoplay" },
                                    { name: "encrypted-media", label: "Encrypted Media" },
                                    { name: "picture-in-picture", label: "Picture in Picture" },
                                    { name: "fullscreen", label: "Fullscreen" },
                                    { name: "camera", label: "Camera" },
                                    { name: "microphone", label: "Microphone" },
                                    { name: "speaker-selection", label: "Speaker Selection" }
                                ]
                            },
                            {
                                label: "Input & Interaction",
                                choice: [
                                    { name: "clipboard-read", label: "Clipboard Read" },
                                    { name: "clipboard-write", label: "Clipboard Write" },
                                    { name: "display-capture", label: "Display Capture" },
                                    { name: "gamepad", label: "Gamepad" },
                                    { name: "geolocation", label: "Geolocation" },
                                    { name: "hid", label: "HID" },
                                    { name: "idle-detection", label: "Idle Detection" },
                                    { name: "keyboard-map", label: "Keyboard Map" },
                                    { name: "magnetometer", label: "Magnetometer" },
                                    { name: "midi", label: "MIDI" },
                                    { name: "payment", label: "Payment" },
                                    { name: "screen-wake-lock", label: "Screen Wake Lock" },
                                    { name: "serial", label: "Serial" },
                                    { name: "usb", label: "USB" },
                                    { name: "xr-spatial-tracking", label: "XR Spatial Tracking" }
                                ]
                            },
                            {
                                label: "Storage & System",
                                choice: [
                                    { name: "storage-access", label: "Storage Access" },
                                    { name: "web-share", label: "Web Share" },
                                    { name: "sync-xhr", label: "Sync XHR (deprecated)" }
                                ]
                            },
                            {
                                label: "Experimental / Less common",
                                choice: [
                                    { name: "accelerometer", label: "Accelerometer" },
                                    { name: "gyroscope", label: "Gyroscope" },
                                    { name: "ambient-light-sensor", label: "Ambient Light Sensor" },
                                    { name: "vr", label: "VR (deprecated)" }
                                ]
                            }
                        ],
                        default: []
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "text",
                        label: "iframe code",
                        type: "string/textbox"
                    }
                ],

                initFunction: function(dataArray, element) {
                    const raw = dataArray.text || "";

                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    // ---------------------------------------------------------
                    // 1. Extract ONLY the first <iframe> from the pasted HTML
                    // ---------------------------------------------------------
                    let iframeHTML = "";
                    const iframeMatch = raw.match(/<iframe[\s\S]*?<\/iframe>/i);

                    if (iframeMatch) {
                        iframeHTML = iframeMatch[0];
                    } else {
                        // If no iframe found, treat entire text as source
                        element.content.source = raw.trim();
                        element.content.embedAsHTML = false;
                        element.content.sandboxChoice = 0;
                        element.content.allowFullScreen = false;
                        element.content.permission = [];
                        return;
                    }

                    // ---------------------------------------------------------
                    // 2. Extract attributes from the iframe
                    // ---------------------------------------------------------
                    const getAttr = (attr) => {
                        const m = iframeHTML.match(new RegExp(attr + '\\s*=\\s*["\']([^"\']+)["\']', 'i'));
                        return m ? m[1] : "";
                    };

                    const src = getAttr("src");
                    const sandbox = getAttr("sandbox");
                    const allow = getAttr("allow");
                    const allowfullscreen = /allowfullscreen/i.test(iframeHTML);

                    // ---------------------------------------------------------
                    // 3. Apply extracted values to content
                    // ---------------------------------------------------------
                    element.content.source = src || "";

                    // sandboxChoice mapping:
                    // 0 = no sandbox
                    // 1 = allow scripts + same-origin
                    // 2 = strict sandbox
                    if (!sandbox) {
                        element.content.sandboxChoice = 0;
                    } else if (sandbox.includes("allow-scripts")) {
                        element.content.sandboxChoice = 1;
                    } else {
                        element.content.sandboxChoice = 2;
                    }

                    element.content.allowFullScreen = allowfullscreen ? true : false;

                    // Permissions list → split into array
                    if (allow) {
                        element.content.permission = allow
                            .split(";")
                            .map(p => p.trim())
                            .filter(p => p.length > 0);
                    } else {
                        element.content.permission = [];
                    }

                    // embedAsHTML always false on init
                    element.content.embedAsHTML = false;
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    const iframe = documentHTML.createElement("iframe");
                    iframe.className = `${BUILDER_CONFIG.classPrefix}context-iframe`;

                    const c = dataArray.content;

                    const safeURL = encodeURI(c.source);

                    // Sandbox handling
                    if (c.sandboxChoice === 1) {
                        iframe.sandbox = "allow-scripts";
                    } else if (c.sandboxChoice === 2) {
                        iframe.sandbox = "";
                    }

                    // Allow fullscreen
                    if (c.allowFullScreen) {
                        iframe.allowFullscreen = true;
                    }

                    // Permissions
                    if (Array.isArray(c.permission) && c.permission.length > 0) {
                        iframe.allow = c.permission.join("; ");
                    }

                    // HTML embed mode
                    if (c.embedAsHTML === true) {
                        const src = c.source;

                        if (typeof src !== "string") return;
                        if (/^https?:\/\//i.test(src.trim())) return;
                        if (/^javascript:/i.test(src.trim())) return;
                        if (!/<[^>]+>/.test(src)) return;

                        iframe.srcdoc = "";
                        iframe.addEventListener("load", () => {
                            const doc = iframe.contentDocument;
                            if (doc) {
                                doc.open();
                                doc.write(src);
                                doc.close();
                            }
                        });
                    } else {
                        // Normal iframe mode
                        iframe.src = safeURL;
                    }

                    node.innerHTML = "";
                    node.appendChild(iframe);
                },

                cssStyles: [
                    {
                        object: "@context",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "100%" },
                            { key: "padding", value: "0" },
                            { key: "display", value: "block" },
                            { key: "border", value: "none" }
                        ]
                    }
                ],  

                jsRuntime: {},

                settings: {}
            },

            gDocs: {
                name: "Google Docs Native Embeds",
                className: "gDocs",

                alts: ["google docs", "gdocs", "docs embed", "google document"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 47 65"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <!-- Generator: Sketch 54.1 (76490) - https://sketchapp.com -->
                        <title>Docs-icon</title>
                        <desc>Created with Sketch.</desc>
                        <defs>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-1"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-3"></path>
                            <linearGradient x1="50.0053945%" y1="8.58610612%" x2="50.0053945%" y2="100.013939%" id="linearGradient-5">
                                <stop stop-color="#1A237E" stop-opacity="0.2" offset="0%"></stop>
                                <stop stop-color="#1A237E" stop-opacity="0.02" offset="100%"></stop>
                            </linearGradient>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-6"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-8"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-10"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-12"></path>
                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="path-14"></path>
                            <radialGradient cx="3.16804688%" cy="2.71744318%" fx="3.16804688%" fy="2.71744318%" r="161.248516%" gradientTransform="translate(0.031680,0.027174),scale(1.000000,0.723077),translate(-0.031680,-0.027174)" id="radialGradient-16">
                                <stop stop-color="#FFFFFF" stop-opacity="0.1" offset="0%"></stop>
                                <stop stop-color="#FFFFFF" stop-opacity="0" offset="100%"></stop>
                            </radialGradient>
                        </defs>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Consumer-Apps-Docs-Large-VD-R8" transform="translate(-451.000000, -463.000000)">
                                <g id="Hero" transform="translate(0.000000, 63.000000)">
                                    <g id="Personal" transform="translate(277.000000, 309.000000)">
                                        <g id="Docs-icon" transform="translate(174.000000, 91.000000)">
                                            <g id="Group">
                                                <g id="Clipped">
                                                    <mask id="mask-2" fill="white">
                                                        <use xlink:href="#path-1"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L36.71875,10.3409091 L29.375,0 Z" id="Path" fill="#4285F4" fill-rule="nonzero" mask="url(#mask-2)"></path>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-4" fill="white">
                                                        <use xlink:href="#path-3"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <polygon id="Path" fill="url(#linearGradient-5)" fill-rule="nonzero" mask="url(#mask-4)" points="30.6638281 16.4309659 47 32.8582386 47 17.7272727"></polygon>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-7" fill="white">
                                                        <use xlink:href="#path-6"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M11.75,47.2727273 L35.25,47.2727273 L35.25,44.3181818 L11.75,44.3181818 L11.75,47.2727273 Z M11.75,53.1818182 L29.375,53.1818182 L29.375,50.2272727 L11.75,50.2272727 L11.75,53.1818182 Z M11.75,32.5 L11.75,35.4545455 L35.25,35.4545455 L35.25,32.5 L11.75,32.5 Z M11.75,41.3636364 L35.25,41.3636364 L35.25,38.4090909 L11.75,38.4090909 L11.75,41.3636364 Z" id="Shape" fill="#F1F1F1" fill-rule="nonzero" mask="url(#mask-7)"></path>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-9" fill="white">
                                                        <use xlink:href="#path-8"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <g id="Group" mask="url(#mask-9)">
                                                        <g transform="translate(26.437500, -2.954545)">
                                                            <path d="M2.9375,2.95454545 L2.9375,16.25 C2.9375,18.6985795 4.90929688,20.6818182 7.34375,20.6818182 L20.5625,20.6818182 L2.9375,2.95454545 Z" id="Path" fill="#A1C2FA" fill-rule="nonzero"></path>
                                                        </g>
                                                    </g>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-11" fill="white">
                                                        <use xlink:href="#path-10"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,4.80113636 C0,2.36363636 1.9828125,0.369318182 4.40625,0.369318182 L29.375,0.369318182 L29.375,0 L4.40625,0 Z" id="Path" fill-opacity="0.2" fill="#FFFFFF" fill-rule="nonzero" mask="url(#mask-11)"></path>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-13" fill="white">
                                                        <use xlink:href="#path-12"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M42.59375,64.6306818 L4.40625,64.6306818 C1.9828125,64.6306818 0,62.6363636 0,60.1988636 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,60.1988636 C47,62.6363636 45.0171875,64.6306818 42.59375,64.6306818 Z" id="Path" fill-opacity="0.2" fill="#1A237E" fill-rule="nonzero" mask="url(#mask-13)"></path>
                                                </g>
                                                <g id="Clipped">
                                                    <mask id="mask-15" fill="white">
                                                        <use xlink:href="#path-14"></use>
                                                    </mask>
                                                    <g id="SVGID_1_"></g>
                                                    <path d="M33.78125,17.7272727 C31.3467969,17.7272727 29.375,15.7440341 29.375,13.2954545 L29.375,13.6647727 C29.375,16.1133523 31.3467969,18.0965909 33.78125,18.0965909 L47,18.0965909 L47,17.7272727 L33.78125,17.7272727 Z" id="Path" fill-opacity="0.1" fill="#1A237E" fill-rule="nonzero" mask="url(#mask-15)"></path>
                                                </g>
                                            </g>
                                            <path d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z" id="Path" fill="url(#radialGradient-16)" fill-rule="nonzero"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "gDocsID",
                        label: "Google docs URL",
                        type: "string/text"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "text",
                        label: "Google Docs Public URL",
                        type: "string/text"
                    }
                ],

                initFunction: function(dataArray, element) {
                    const raw = dataArray.text || "";

                    if (!element) element = {};
                    if (!element.content) element.content = {};

                    let docId = "";

                    // ---------------------------------------------------------
                    // 1. If user pasted an <iframe>, extract src="..."
                    // ---------------------------------------------------------
                    const iframeMatch = raw.match(/<iframe[\s\S]*?src=["']([^"']+)["'][\s\S]*?>/i);
                    let url = "";

                    if (iframeMatch) {
                        url = iframeMatch[1];
                    } else {
                        url = raw.trim();
                    }

                    // ---------------------------------------------------------
                    // 2. Extract Google Docs ID from URL
                    // ---------------------------------------------------------
                    try {
                        const u = new URL(url);

                        // Expected formats:
                        // https://docs.google.com/document/d/e/<ID>/pub
                        // https://docs.google.com/document/d/e/<ID>/pub?embedded=true
                        const parts = u.pathname.split("/").filter(Boolean);

                        // Find the "d/e/<ID>" pattern
                        const idx = parts.indexOf("e");
                        if (idx !== -1 && parts[idx + 1]) {
                            docId = parts[idx + 1];
                        }
                    } catch (e) {
                        docId = "";
                    }

                    element.content.gDocsID = docId;
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    const el = documentHTML.createElement("div");
                    el.className = `${BUILDER_CONFIG.classPrefix}context-gdocs`;

                    el.setAttribute(`data-${BUILDER_CONFIG.classPrefix}gdocid`, dataArray.content.gDocsID);

                    const docId = dataArray.content.gDocsID;

                    const loadingText = documentHTML.createElement("p");
                    loadingText.textContent = "Loading Contents.......";
                    el.appendChild(loadingText);

                    const fallback = documentHTML.createElement("p");
                    fallback.append(documentHTML.createTextNode("Cannot see the Context? go "));

                    const link = documentHTML.createElement("a");
                    link.href = `https://docs.google.com/document/d/e/${docId}/pub`;
                    link.target = "_blank";
                    link.textContent = "this link";
                    fallback.appendChild(link);

                    fallback.append(documentHTML.createTextNode(" to view the message. If you disabled JS, your document will be displayed here. For better experience we recommend to "));

                    const jsLink = documentHTML.createElement("a");
                    jsLink.href = "https://turnonjs.com";
                    jsLink.target = "_blank";
                    jsLink.textContent = "turn on JS";
                    fallback.appendChild(jsLink);

                    el.appendChild(fallback);

                    const noscript = documentHTML.createElement("noscript");
                    noscript.className = `${BUILDER_CONFIG.classPrefix}context-gdocs-noscript`;

                    const iframe = documentHTML.createElement("iframe");
                    iframe.className = `${BUILDER_CONFIG.classPrefix}context-gdocs-iframe`;
                    iframe.src = `https://docs.google.com/document/d/e/${docId}/pub?embedded=true`;

                    noscript.appendChild(iframe);
                    el.appendChild(noscript);

                    node.innerHTML = "";
                    node.appendChild(el);
                },

                jsRuntime: {
                    forEach: function(BUILDER_CONFIG) {
                        return `
                            const docId = element.getAttribute(\`data-${BUILDER_CONFIG.classPrefix}gdocid\`);
                            const url = \`https://docs.google.com/document/d/e/\${docId}/pub?embedded=true\`;

                            const raw = await fetch(url).then(r => r.text());
                            const parsed = new DOMParser().parseFromString(raw, "text/html");

                            parsed.querySelectorAll("style, link[rel='stylesheet']").forEach(el => el.remove());
                            const container = parsed.querySelector(".doc-content") || parsed.body;

                            element.innerHTML = container.innerHTML;
                        `;
                    }
                },

                cssStyles: [
                    {
                        object: "@context",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "display", value: "block" },
                            { key: "font-family", value: "inherit" },
                            { key: "color", value: "inherit" }
                        ]
                    },
                    {
                        object: "@context-noscript",
                        info: [
                            { key: "display", value: "block" }
                        ]
                    },
                    {
                        object: "@context-iframe",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "border", value: "none" },
                            { key: "display", value: "block" }
                        ]
                    }
                ],

                settings: {}
            },

            ytLive: {
                name: "YouTube Live Connector",
                className: "ytLive",

                alts: ["youtube live", "yt live", "live connector", "youtube stream"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <circle cx="480" cy="-480" r="120" fill="#f44336"></circle>
                        <path fill="#f44336" d="M350 -580 L300 -630 C240 -570 200 -480 200 -380 s40 190 100 250 l50 -50 c-40 -40 -60 -100 -60 -160 s20 -120 60 -160z"></path>
                        <path fill="#f44336" d="M610 -580 l50 -50 c60 60 100 150 100 250 s-40 190 -100 250 l-50 -50 c40 -40 60 -100 60 -160 s-20 -120 -60 -160z"></path>
                        <path fill="#f44336" d="M280 -700 l-60 -60 C120 -640 60 -520 60 -380 s60 260 160 340 l60 -60 c-80 -80 -120 -180 -120 -280 s40 -200 120 -280z"></path>
                        <path fill="#f44336" d="M680 -700 l60 -60 c100 80 160 200 160 340 s-60 260 -160 340 l-60 -60 c80 -80 120 -180 120 -280 s-40 -200 -120 -280z"></path>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "channelID",
                        label: "YouTube channel ID",
                        type: "string/text"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "channelID",
                        label: "Please paste your YouTube channel ID (you can find yours on https://www.youtube.com/account_advanced)",
                        type: "string/text"
                    }
                ],

                initFunction: function(dataArray, element) {
                    element.content.channelID = dataArray.channelID || "";
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    // Add data attribute
                    node.setAttribute(`data-${BUILDER_CONFIG.classPrefix}ytchannelid`, dataArray.content.channelID);

                    // Clear existing content
                    node.innerHTML = "";

                    // <noscript> block
                    const noscript = documentHTML.createElement("noscript");

                    // "We find your JavaScript is disabled, please "
                    noscript.appendChild(documentHTML.createTextNode("We find your JavaScript is disabled, please "));

                    // <a> Turn on JS
                    const turnOn = documentHTML.createElement("a");
                    turnOn.href = "https://turnonjs.com";
                    turnOn.target = "_blank";
                    turnOn.textContent = "Turn on JS";
                    noscript.appendChild(turnOn);

                    // " or visit the channel: "
                    noscript.appendChild(documentHTML.createTextNode(" or visit the channel: "));

                    // <a> YouTube channel link
                    const ytLink = documentHTML.createElement("a");
                    ytLink.href = `https://youtube.com/channel/${dataArray.content.channelID}`;
                    ytLink.target = "_blank";
                    ytLink.textContent = "YouTube";
                    noscript.appendChild(ytLink);

                    // Append <noscript> directly to node
                    node.appendChild(noscript);

                },

                jsRuntime: {
                    sourceRequirement: [
                        {
                            source: 1,
                            script: "https://www.youtube.com/iframe_api",
                            defer: false,
                            integrity: "none",
                            ESM: false
                        }
                    ],

                    forEach: function(BUILDER_CONFIG) {
                        return `
                            const channelId = el.getAttribute(\`data-\${BUILDER_CONFIG.classPrefix}ytchannelid\`);

                            el.innerHTML = "";
                            const overlay = document.createElement("div");
                            overlay.className = \`\${BUILDER_CONFIG.classPrefix}context-ytLive-preparing\`;
                            overlay.textContent = "Preparing, Please Wait.....";
                            el.appendChild(overlay);

                            const iframe = document.createElement("iframe");
                            iframe.src = \`https://www.youtube.com/embed/live_stream?channel=\${channelId}&autoplay=1&mute=1&enablejsapi=1\`;
                            iframe.allow = "autoplay; encrypted-media";
                            iframe.allowFullscreen = true;
                            el.appendChild(iframe);

                            const poll = setInterval(() => {
                            if (window.YT && window.YT.Player) {
                                clearInterval(poll);

                                const thisPlayer = new YT.Player(iframe, {
                                events: {
                                    onReady: () => {
                                    if (overlay) overlay.remove();
                                    },

                                    onError: function(event) {
                                    if (event.data === 100 || event.data === 150) {
                                        const playlistId = "UU" + channelId.substring(2);

                                        const playlistIframe = document.createElement("iframe");
                                        playlistIframe.src = \`https://www.youtube.com/embed/videoseries?list=\${playlistId}&autoplay=0\`;
                                        playlistIframe.allow = "autoplay; encrypted-media";
                                        playlistIframe.allowFullscreen = true;
                                        playlistIframe.className = \`\${BUILDER_CONFIG.classPrefix}offline\`;

                                        thisPlayer.destroy();
                                        el.innerHTML = "";
                                        el.appendChild(playlistIframe);
                                    }
                                    }
                                }
                                });
                            }
                            }, 120);
                        `;
                    }
                },

                cssStyles: [
                    {
                        object: "@context-preparing",
                        info: [
                            { key: "position", value: "absolute" },
                            { key: "inset", value: "0" },
                            { key: "display", value: "flex" },
                            { key: "align-items", value: "center" },
                            { key: "justify-content", value: "center" },
                            { key: "background", value: "#222" },
                            { key: "color", value: "#EEE" },
                            { key: "font-size", value: "1.2rem" },
                            { key: "z-index", value: "10" },
                            { key: "pointer-events", value: "none" }
                        ]
                    },
                    {
                        object: "iframe",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "aspect-ratio", value: "16 / 9" },
                            { key: "border", value: "0" }
                        ]
                    }
                ],

                settings: {}
            },

            html: {
                name: "HTML",
                className: "html",

                alts: ["html", "raw html", "custom html", "embed html"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M228-300 48-480l180-180 51 51-129 129 129 129-51 51Zm196 119-69-22 180-576 69 22-180 576Zm308-119-51-51 129-129-129-129 51-51 180 180-180 180Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "html",
                        label: "HTML Code Snap",
                        type: "string/textbox"
                    }
                ],

                layoutQuery: [],

                initQuery: [
                    {
                        name: "html",
                        label: "HTML Code Snap Here",
                        type: "string/textbox"
                    }
                ],

                initFunction: function(dataArray, element) {
                    element.content.html = dataArray.html || "";
                },

                contextFunction: function(dataArray, documentHTML, node) {
                    node.innerHTML = dataArray.content.html;
                },

                jsRuntime: "",

                cssStyles: [],

                settings: {}
            }
        },

        setting: {
            systemClass: true,
            allowedSortIn: false,
            animation: 1,
            allowedSortTo: ["container", "section/section", "@root/popup", "@root/CTA", "@root/Footer"]
        }
    },

    container: {
        sizeQuery: [
            {
                name: "along",
                label: "{Width/Height}",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "overflowAlong",
                label: "{Width/Height} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "alongGrow",
                label: "{Width/Height} Growth Amount",
                type: "number"
            },
            {
                name: "alongShrink",
                label: "Shrink?",
                type: "selection",
                choice: [
                    { label: "No shrink", value: 0 },
                    { label: "Shrink", value: 1 }
                ]
            },

            {
                name: "across",
                label: "{Height/Width}",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "overflowAcross",
                label: "{Height/Width} Overflow Behavior",
                type: "selection",
                choice: [
                    { label: "Grow to fit", value: 1 },
                    { label: "Cut part", value: 2 },
                    { label: "Scroll bar", value: 3 }
                ]
            },
            {
                name: "acrossAlign",
                label: "{Height/Width} Alignment",
                type: "selection",
                choice: [
                    { label: "Default", value: 0 },
                    { label: "Start", value: 1 },
                    { label: "Center", value: 2 },
                    { label: "End", value: 3 },
                    { label: "Stretch", value: 4 },
                    { label: "Baseline", value: 5 }
                ]
            },

            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space",
                defaultAsFull: true
            }
        ],

		sizeDefault: (sz, isVertical) => {
			return {
				"width": isVertical ? flexEngineStyleVarible.space(sz.across) : flexEngineStyleVarible.space(sz.along),
				"height": isVertical ? flexEngineStyleVarible.space(sz.along) : flexEngineStyleVarible.space(sz.across),
				"flex-grow": sz.alongGrow || 0,
				"flex-shrink": sz.alongShrink === true ? 1 : 0,
				"overflow-x": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible'),
				"overflow-y": isVertical ? (['visible', 'hidden', 'auto'][sz.overflowAlong - 1] || 'visible') : (['visible', 'hidden', 'auto'][sz.overflowAcross - 1] || 'visible'),
				"align-self": (sz.acrossAlign > 0) ? ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'][sz.acrossAlign - 1] : 'auto'
			}
		},
        
		sizeMobile: (sz, isVertical) => {
			return {
				"min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
			}
		},

        elements: {
            div: {
                name: "Standard Container",
                className: "div",

                alts: ["div", "container", "wrapper", "layout container"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M96-191v-240h336v240H96Zm0-337v-240h336v240H96Zm72-72h192v-96H168v96Zm505 411L481-381l51-51 105 105v-441h72v441l106-105 50 51-192 192Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "@global",
                        label: "Elements",
                        type: "interactiveElements"
                    }
                ],

                layoutQuery: [
                    {
                        name: "direction",
                        label: "Direction",
                        type: "selection",
                        choice: [
                            { label: "Left → Right", value: 1 },
                            { label: "Top → Bottom", value: 2 },
                            { label: "Right → Left", value: 3 },
                            { label: "Bottom → Top", value: 4 }
                        ],
                        default: 1
                    },
                    {
                        name: "wrap",
                        label: "Wrap Permission",
                        type: "selection",
                        choice: [
                            { label: "No wrap", value: 1 },
                            { label: "Wrap", value: 2 },
                            { label: "Wrap reverse", value: 3 }
                        ],
                        default: 1
                    },
                    {
                        name: "spaceAlong",
                        label: "{Width/Height} Space Distribuation",
                        type: "selection",
                        choice: [
                            { label: "Start", value: 1 },
                            { label: "Center", value: 2 },
                            { label: "End", value: 3 },
                            { label: "Space Around", value: 4 },
                            { label: "Space Between", value: 5 },
                            { label: "Space Evenly", value: 6 }
                        ],
                        default: 1
                    },
                    {
                        name: "spaceAcross",
                        label: "{Height/Width} Space Distribuation",
                        type: "selection",
                        choice: [
                            { label: "Start", value: 1 },
                            { label: "Center", value: 2 },
                            { label: "End", value: 3 },
                            { label: "Stretch", value: 4 },
                            { label: "Baseline", value: 5 }
                        ],
                        default: 1
                    },
                    {
                        name: "spaceAcrossMutiple",
                        label: "When Wrap Happend, Align {Height/Width} with",
                        type: "selection",
                        choice: [
                            { label: "Start", value: 1 },
                            { label: "Center", value: 2 },
                            { label: "End", value: 3 },
                            { label: "Stretch", value: 4 },
                            { label: "Baseline", value: 5 },
                            { label: "Evenly", value: 6 }
                        ],
                        default: 1
                    },
                    {
                        name: "gapX",
                        label: "Gap on Horizontal",
                        type: "space"
                    },
                    {
                        name: "gapY",
                        label: "Gap on Vertical",
                        type: "space"
                    },
                    {
                        name: "stackAtMobile",
                        label: "Stack when at Mobile?",
                        type: "boolean/checkmark",
                        default: false
                    },
                    {
                        name: "mobileReverseDirection",
                        label: "Reverse Direction on Mobile?",
                        type: "boolean/checkmark",
                        default: false
                    },
                    {
                        name: "mobileGap",
                        label: "Gap on Mobile",
                        type: "space"
                    }
                ],

                initQuery: [],

                initFunction: null,

                contextFunction: function(dataArray, documentHTML, node, createAnotherNode) {
                    const layout = dataArray.layout || {};
                    const content = dataArray.content;

                    const directions = ['row', 'column', 'row-reverse', 'column-reverse'];
                    const wraps = ['nowrap', 'wrap', 'wrap-reverse'];
                    const justifyMap = ['flex-start', 'center', 'flex-end', 'space-around', 'space-between', 'space-evenly'];
                    const alignMap = ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'];

                    const dirIndex = (layout.direction || 1) - 1;
                    const desktopDirection = directions[dirIndex] || 'row';
                    const isVertical = desktopDirection.includes('column');

                    const desktopCss = `
                        display: flex;
                        flex-direction: ${desktopDirection};
                        flex-wrap: ${wraps[(layout.wrap || 1) - 1] || 'nowrap'};
                        justify-content: ${justifyMap[(layout.spaceAlong || 1) - 1] || 'flex-start'};
                        align-items: ${alignMap[(layout.spaceAcross || 1) - 1] || 'flex-start'};
                        ${layout.gapX ? `column-gap: ${flexEngineStyleVarible.space(layout.gapX)};` : ''}
                        ${layout.gapY ? `row-gap: ${flexEngineStyleVarible.space(layout.gapY)};` : ''}
                    `.trim();

                    let mobileCSS = "";
                    if (layout.stackAtMobile || layout.mobileReverseDirection || layout.mobileGap) {
                        let mobileDir = desktopDirection;

                        if (layout.stackAtMobile) {
                            mobileDir = layout.mobileReverseDirection ? 'column-reverse' : 'column';
                        } else if (layout.mobileReverseDirection) {
                            mobileDir = desktopDirection.includes('-reverse')
                                ? desktopDirection.replace('-reverse', '')
                                : desktopDirection + '-reverse';
                        }

                        const mGap = flexEngineStyleVarible.space(layout.mobileGap);

                        mobileCSS = `
                            flex-direction: ${mobileDir} !important;
                            gap: ${mGap} !important;
                        `.trim();

                        if (layout.stackAtMobile) {
                            mobileCSS += `
                                justify-content: center;
                                align-items: center;
                            `;
                        }
                    }

                    const prefix = BUILDER_CONFIG.classPrefix + "styles-node";
                    node.setAttribute(prefix, desktopCss.trim());
                    node.setAttribute(prefix + "-onMobile", mobileCSS.trim());

                    if (Array.isArray(content)) {
                        content.forEach(childData => {
                            if (childData) {
                                const childNode = createAnotherNode(childData, documentHTML, isVertical);
                                if (childNode) node.appendChild(childNode);
                            }
                        });
                    }
                },

                jsRuntime: {},

                cssStyles: [],

                settings: {
                    sortablePart: function(elemnent){
                        return element;
                    }
                }
            }     
        },

        setting: {
            systemClass: true,
            allowedSortIn: true,
            animation: 1,
            allowedSortTo: ["container", "section/section", "@root/popup", "@root/CTA", "@root/Footer"],
        }
    },

    section: {
        sizeQuery: [
            {
                name: "height",
                label: "Height",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "alongGrow",
                label: "Allow section grow?",
                type: "boolean/checkmark"
            },
            {
                name: "alongShrink",
                label: "Allow section shrink?",
                type: "boolean/checkmark"
            },
            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space",
                defaultAsFull: true
            }
        ],

        sizeDefault: (sz, isVertical) => {
            return {
                "width": "100%",
                "height": flexEngineStyleVarible.space(sz.height),
                "flex-grow": sz.alongGrow === true ? 1 : 0,
                "flex-shrink": sz.alongShrink === true ? 1 : 0,
                "overflow-x": "visible",
                "overflow-y": "visible",
                "align-self": "center"
            };
        },

        sizeMobile: (sz, isVertical) => {
            return {
                "min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
            };
        },

        elements: {
            section: {
                name: "Section",
                className: "section",

                alts: ["section", "Section"],

                icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M216-216v-144 16-4 132Zm-.3 72q-32.7 0-52.2-19.5T144-216v-144q0-33 19.5-52.5T216-432h528q33 0 52.5 19.5T816-360H216v144h396v72H215.7Zm.3-384q-33 0-52.5-19.5T144-600v-144q0-33 19.5-52.5T216-816h528q33 0 52.5 19.5T816-744v144q0 33-19.5 52.5T744-528H216Zm0-72h528v-144H216v144Zm0 0v-144 144ZM744-84v-60h-60v-72h60v-60h72v60h60v72h-60v60h-72Z"/>
                    </svg>
                `,

                contentQuery: [
                    {
                        name: "@global",
                        label: "Elements",
                        type: "interactiveElements"
                    }
                ],
                
                layoutQuery: [
                    {
                        name: "spaceAcross",
                        label: "Align it to...",
                        type: "selection",
                        choice: [
                            { label: "Left", value: 1 },
                            { label: "Center", value: 2 },
                            { label: "Right", value: 3 },
                            { label: "Stretch it", value: 4 }
                        ],
                        default: 1
                    },
                    {
                        name: "spaceAlong",
                        label: "in Height, perfer...",
                        type: "selection",
                        choice: [
                            { label: "Top", value: 1 },
                            { label: "Center", value: 2 },
                            { label: "Buttom", value: 3 }
                        ],
                        default: 1
                    },
                    {
                        name: "overflow",
                        label: "Height Overflow Behavior",
                        type: "selection",
                        choice: [
                            { label: "Scroll", value: 1 },
                            { label: "Hidden", value: 2 },
                            { label: "No Action", value: 3 }
                        ],
                        default: 3
                    },
                    {
                        name: "gap",
                        label: "Gaps Length",
                        type: "space"
                    },
                    {
                        name: "mobileGap",
                        label: "Gap on Mobile",
                        type: "space"
                    },
                    {
                        name: "mobileReverseDirection",
                        label: "Reverse Direction on Mobile?",
                        type: "boolean/checkmark",
                        default: false
                    },
                    {
                        name: "displayType",
                        label: "Maximum Width",
                        type: "selection",
                        choice: [
                            { label: "Standard", value: 0 },
                            { label: "Wide", value: 1 },
                            { label: "Full", value: 2 }
                        ],
                        default: 0
                    }
                ],

                initQuery: [],

                initFunction: function(dataArray, element) {
                    debugger; // in future we will add some default views
                },


                contentFunction: function(dataArray, documentHTML, node, createAnotherNode) {
                    const layout = dataArray.layout;
                    let cssOutput = "";
                    let cssMobileOutput = "";

                    // spaceAcross
                    if (layout.spaceAcross) {
                        const map = {
                            1: "flex-start",
                            2: "center",
                            3: "flex-end",
                            4: "stretch"
                        };
                        cssOutput += `justify-content:${map[layout.spaceAcross]};`;
                    }

                    // spaceAlong
                    if (layout.spaceAlong) {
                        const map = {
                            1: "flex-start",
                            2: "center",
                            3: "flex-end"
                        };
                        cssOutput += `align-items:${map[layout.spaceAlong]};`;
                    }

                    // overflow
                    if (layout.overflow) {
                        const map = {
                            1: "scroll",
                            2: "hidden",
                            3: null
                        };
                        if (map[layout.overflow]) {
                            cssOutput += `overflow:${map[layout.overflow]};`;
                        }
                    }

                    // gap
                    if (layout.gap !== undefined) {
                        const gapValue = flexEngineStyleVariable.space[layout.gap];
                        cssOutput += `gap:${gapValue};`;
                    }

                    // mobile reverse direction
                    if (layout.mobileReverseDirection) {
                        cssMobileOutput += `flex-direction:column-reverse;`;
                    }

                    // mobile gap
                    if (layout.mobileGap !== undefined) {
                        const gapValue = flexEngineStyleVariable.space[layout.mobileGap];
                        cssMobileOutput += `gap:${gapValue};`;
                    }

                    // apply attributes
                    const prefix = BUILDER_CONFIG.classPrefix + "styles-node-at1";
                    const prefixMobile = BUILDER_CONFIG.classPrefix + "styles-node-onMobile-at1";

                    node.setAttribute(prefix, cssOutput);
                    node.setAttribute(prefixMobile, cssMobileOutput);

                    let innerNode = documentHTML.createElement("div");

                    if (layout.displayType === 0) {
                        innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-standard`);
                    } else if(layout.displayType === 1) {
                        innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-wide`);
                    } else {
                        innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-full`);
                    }

                    // children
                    if (Array.isArray(dataArray.context)) {
                        dataArray.context.forEach(ctx => {
                            const childNode = createAnotherNode(ctx, documentHTML, true);
                            if (childNode) {
                                innerNode.appendChild(childNode);
                            }
                        });
                    }

                    node.appendChild(innerNode);
                },

                jsRuntime: {},

                cssStyles: [
                    {
                        object: "@context-full",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "100%" }
                        ]
                    },
                    {
                        object: "@context-wide",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "100%" },
                            { key: "max-width", value: "1600px" }
                        ]
                    },
                    {
                        object: "@context-standard",
                        info: [
                            { key: "width", value: "100%" },
                            { key: "height", value: "100%" },
                            { key: "max-width", value: "1200px" }
                        ]
                    }
                ],

                settings: {
                    sortablePart: function(element) {
                        return element.firstElementChild;
                    },
                    elementType: "section"
                }
            }
        },

        setting: {
            systemClass: true,
            allowedSortIn: true,
            animation: 2,
            allowedSortTo: ["@root/main"]
        }
    },

    header: {

    }
};


// @root Elements 
export const flexEngineRootElement = {
	popup: {
		name: "Popup",
		className: "popup",
        alts: [],
		icon: `
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                class="RaySiteUI-c-svg">
                <path d="M533-408h187v-216H533v216ZM168-192q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Zm0-72h624v-432H168v432Zm0 0v-432 432Z"/>
            </svg>
        `,
		contentQuery: [{
			name: "@global",
			label: "Elements",
			type: "interactiveElements"
		}],

		layoutQuery: [{
			name: "spaceAcross",
			label: "Align it to...",
			type: "selection",
			choice: [{
				label: "Left",
				value: 1
			}, {
				label: "Center",
				value: 2
			}, {
				label: "Right",
				value: 3
			}, {
				label: "Stretch it",
				value: 4
			}],
			default: 1
		}, {
			name: "spaceAlong",
			label: "in Height, perfer...",
			type: "selection",
			choice: [{
				label: "Top",
				value: 1
			}, {
				label: "Center",
				value: 2
			}, {
				label: "Buttom",
				value: 3
			}],
			default: 1
		}, {
			name: "overflow",
			label: "Height Overflow Behavior",
			type: "selection",
			choice: [{
				label: "Scroll",
				value: 1
			}, {
				label: "Hidden",
				value: 2
			}, {
				label: "No Action",
				value: 3
			}],
			default: 3
		}, {
			name: "gap",
			label: "Gaps Length",
			type: "space"
		}, {
			name: "mobileGap",
			label: "Gap on Mobile",
			type: "space"
		}, {
			name: "mobileReverseDirection",
			label: "Reverse Direction on Mobile?",
			type: "boolean/checkmark",
			default: false
		}],

		initQuery: [],
		initFunction: function(dataArray, element) {
			debugger; // in future we will add some default views
		},

		contentFunction: function(dataArray, documentHTML, node, createAnotherNode) {
			const layout = dataArray.layout;
			let cssOutput = "";
			let cssMobileOutput = "";
			// spaceAcross
			if (layout.spaceAcross) {
				const map = {
					1: "flex-start",
					2: "center",
					3: "flex-end",
					4: "stretch"
				};
				cssOutput += `justify-content:${map[layout.spaceAcross]};`;
			}
			// spaceAlong
			if (layout.spaceAlong) {
				const map = {
					1: "flex-start",
					2: "center",
					3: "flex-end"
				};
				cssOutput += `align-items:${map[layout.spaceAlong]};`;
			}
			// overflow
			if (layout.overflow) {
				const map = {
					1: "scroll",
					2: "hidden",
					3: null
				};
				if (map[layout.overflow]) {
					cssOutput += `overflow:${map[layout.overflow]};`;
				}
			}
			// gap
			if (layout.gap !== undefined) {
				const gapValue = flexEngineStyleVariable.space[layout.gap];
				cssOutput += `gap:${gapValue};`;
			}
			// mobile reverse direction
			if (layout.mobileReverseDirection) {
				cssMobileOutput += `flex-direction:column-reverse;`;
			}
			// mobile gap
			if (layout.mobileGap !== undefined) {
				const gapValue = flexEngineStyleVariable.space[layout.mobileGap];
				cssMobileOutput += `gap:${gapValue};`;
			}
			// apply attributes
			const prefix = BUILDER_CONFIG.classPrefix + "styles-node-at1";
			const prefixMobile = BUILDER_CONFIG.classPrefix + "styles-node-onMobile-at1";
			node.setAttribute(prefix, cssOutput);
			node.setAttribute(prefixMobile, cssMobileOutput);
			let innerNode = documentHTML.createElement("div");
            innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-popup`);
			// children
			if (Array.isArray(dataArray.context)) {
				dataArray.context.forEach(ctx => {
					const childNode = createAnotherNode(ctx, documentHTML, true);
					if (childNode) {
						innerNode.appendChild(childNode);
					}
				});
			}
			node.appendChild(innerNode);
		},

		jsRuntime: {},
        cssStyles: [{
            object: "@context",
            info: [{
                key: "position",
                value: "absolute"
            }, {
                key: "inset",
                value: "0"
            }]
        }],

        // systems
        sizeQuery: [
            {
                name: "height",
                label: "Height",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "alongGrow",
                label: "Allow section grow?",
                type: "boolean/checkmark"
            },
            {
                name: "alongShrink",
                label: "Allow section shrink?",
                type: "boolean/checkmark"
            },
            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "marginTop",
                label: "Margin Top",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "marginBottom",
                label: "Margin Bottom",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "marginLeft",
                label: "Margin Left",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "marginRight",
                label: "Margin Right",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "mobileMarginTop",
                label: "Mobile Margin Top",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "mobileMarginBottom",
                label: "Mobile Margin Bottom",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "mobileMarginLeft",
                label: "Mobile Margin Left",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "mobileMarginRight",
                label: "Mobile Margin Right",
                type: "space",
                defaultAsFull: true
            }
        ],

        sizeDefault: (sz, isVertical) => {
            return {
                "width": "100%",
                "height": flexEngineStyleVarible.space(sz.height),
                "flex-grow": sz.alongGrow === true ? 1 : 0,
                "flex-shrink": sz.alongShrink === true ? 1 : 0,

                "margin-top": flexEngineStyleVarible.space(sz.marginTop),
                "margin-bottom": flexEngineStyleVarible.space(sz.marginBottom),
                "margin-left": flexEngineStyleVarible.space(sz.marginLeft),
                "margin-right": flexEngineStyleVarible.space(sz.marginRight),

                "overflow-x": "visible",
                "overflow-y": "visible",
                "align-self": "center"
            };
        },

        sizeMobile: (sz, isVertical) => {
            return {
                "min-height": flexEngineStyleVarible.space(sz.mobileMinHeight),

                "margin-top": flexEngineStyleVarible.space(sz.mobileMarginTop),
                "margin-bottom": flexEngineStyleVarible.space(sz.mobileMarginBottom),
                "margin-left": flexEngineStyleVarible.space(sz.mobileMarginLeft),
                "margin-right": flexEngineStyleVarible.space(sz.mobileMarginRight)
            };
        },      

		settings: {
			sortablePart: function(element) {
				return element;
			},
            systemClass: true,
            allowedSortIn: true,
            hide: true,
            animation: 2
		}
	},

	float: {
		name: "Float Button",
		className: "float",
		alts: [],
		icon: `
					<svg xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -960 960 960"
						fill="currentColor"
						class="RaySiteUI-c-svg">
						<path d="M533-408h187v-216H533v216ZM168-192q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Zm0-72h624v-432H168v432Zm0 0v-432 432Z"/>
					</svg>
				`,
        contentQuery: [
            {
                name: "label",
                type: "string/text",
            }
        ],
		layoutQuery: [],


		contentFunction: function(dataArray, documentHTML, node) {
            const content = dataArray.content;
            const label = content.label || "";

            // SAFE: prevents XSS because it does not parse HTML
            node.textContent = label;
        },

		jsRuntime: {},

		// debugger
		cssStyles: [{
			object: "@main",
			info: [{
				key: "width",
				value: "100%"
			}, {
				key: "height",
				value: "100%"
			}]
		}],

		sizeQuery: [
			{
				name: "minHeight",
				label: "Minimum Height",
				type: "space",
				defaultAsFull: false
			},

			{
				name: "minWidth",
				label: "Minimum Width",
				type: "space",
				defaultAsFull: false
			},

			{
				name: "floatOn",
				label: "Float Button On",
				type: "selection",
				choice: [
					{ label: "Top", value: 1 },
					{ label: "Bottom", value: 2 },
					{ label: "Left", value: 3 },
					{ label: "Right", value: 4 },
					{ label: "Top Left", value: 5 },
					{ label: "Top Right", value: 6 },
					{ label: "Bottom Left", value: 7 },
					{ label: "Bottom Right", value: 8 }
				],
				default: 8
			},

			{
				name: "widthPadding",
				label: "Width Padding",
				type: "space",
				defaultAsFull: false,
				visibleIf: {
					name: "floatOn",
					value: [3, 4, 5, 6, 7, 8],
				}
			},

			{
				name: "heightPadding",
				label: "Height Padding",
				type: "space",
				defaultAsFull: false,
				visibleIf: {
					name: "floatOn",
					value: [1, 2, 5, 6, 7, 8],
				}
			}
		],

		sizeDefault: (sz, isVertical) => {
			const floatOn = sz.floatOn || 8

			const isTop = [1, 5, 6].includes(floatOn)
			const isBottom = [2, 7, 8].includes(floatOn)
			const isLeft = [3, 5, 7].includes(floatOn)
			const isRight = [4, 6, 8].includes(floatOn)

			const widthPadding = flexEngineStyleVarible.space(sz.widthPadding)
			const heightPadding = flexEngineStyleVarible.space(sz.heightPadding)

			return {
				"min-width": flexEngineStyleVarible.space(sz.minWidth),
				"min-height": flexEngineStyleVarible.space(sz.minHeight),

				"position": "fixed",

				"top": isTop ? heightPadding : "auto",
				"bottom": isBottom ? heightPadding : "auto",
				"left": isLeft ? widthPadding : "auto",
				"right": isRight ? widthPadding : "auto"
			}
		},

		sizeMobile: (sz, isVertical) => {
			return {}
		},
		
		settings: {
			systemClass: true,
			allowedSortIn: false,
			animation: 1,
			hide: true
		}
	},

    CTA: {
    	name: "Call to Action Section",
    	className: "cta",
    	alts: ["Call to Action", "CTA"],
    	icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M216-216v-144 16-4 132Zm-.3 72q-32.7 0-52.2-19.5T144-216v-144q0-33 19.5-52.5T216-432h528q33 0 52.5 19.5T816-360H216v144h396v72H215.7Zm.3-384q-33 0-52.5-19.5T144-600v-144q0-33 19.5-52.5T216-816h528q33 0 52.5 19.5T816-744v144q0 33-19.5 52.5T744-528H216Zm0-72h528v-144H216v144Zm0 0v-144 144ZM744-84v-60h-60v-72h60v-60h72v60h60v72h-60v60h-72Z"/>
                    </svg>
                `,
    	contentQuery: [{
    		name: "@global",
    		label: "Elements",
    		type: "interactiveElements"
    	}],
    	layoutQuery: [{
    		name: "spaceAcross",
    		label: "Align it to...",
    		type: "selection",
    		choice: [{
    			label: "Left",
    			value: 1
    		}, {
    			label: "Center",
    			value: 2
    		}, {
    			label: "Right",
    			value: 3
    		}, {
    			label: "Stretch it",
    			value: 4
    		}],
    		default: 1
    	}, {
    		name: "spaceAlong",
    		label: "in Height, perfer...",
    		type: "selection",
    		choice: [{
    			label: "Top",
    			value: 1
    		}, {
    			label: "Center",
    			value: 2
    		}, {
    			label: "Buttom",
    			value: 3
    		}],
    		default: 1
    	}, {
    		name: "overflow",
    		label: "Height Overflow Behavior",
    		type: "selection",
    		choice: [{
    			label: "Scroll",
    			value: 1
    		}, {
    			label: "Hidden",
    			value: 2
    		}, {
    			label: "No Action",
    			value: 3
    		}],
    		default: 3
    	}, {
    		name: "gap",
    		label: "Gaps Length",
    		type: "space"
    	}, {
    		name: "mobileGap",
    		label: "Gap on Mobile",
    		type: "space"
    	}, {
    		name: "mobileReverseDirection",
    		label: "Reverse Direction on Mobile?",
    		type: "boolean/checkmark",
    		default: false
    	}, {
    		name: "displayType",
    		label: "Maximum Width",
    		type: "selection",
    		choice: [{
    			label: "Standard",
    			value: 0
    		}, {
    			label: "Wide",
    			value: 1
    		}, {
    			label: "Full",
    			value: 2
    		}],
    		default: 0
    	}],
    	initQuery: [],
    	initFunction: function(dataArray, element) {
    		debugger; // in future we will add some default views
    	},
    	contentFunction: function(dataArray, documentHTML, node, createAnotherNode) {
    		const layout = dataArray.layout;
    		let cssOutput = "";
    		let cssMobileOutput = "";
    		// spaceAcross
    		if (layout.spaceAcross) {
    			const map = {
    				1: "flex-start",
    				2: "center",
    				3: "flex-end",
    				4: "stretch"
    			};
    			cssOutput += `justify-content:${map[layout.spaceAcross]};`;
    		}
    		// spaceAlong
    		if (layout.spaceAlong) {
    			const map = {
    				1: "flex-start",
    				2: "center",
    				3: "flex-end"
    			};
    			cssOutput += `align-items:${map[layout.spaceAlong]};`;
    		}
    		// overflow
    		if (layout.overflow) {
    			const map = {
    				1: "scroll",
    				2: "hidden",
    				3: null
    			};
    			if (map[layout.overflow]) {
    				cssOutput += `overflow:${map[layout.overflow]};`;
    			}
    		}
    		// gap
    		if (layout.gap !== undefined) {
    			const gapValue = flexEngineStyleVariable.space[layout.gap];
    			cssOutput += `gap:${gapValue};`;
    		}
    		// mobile reverse direction
    		if (layout.mobileReverseDirection) {
    			cssMobileOutput += `flex-direction:column-reverse;`;
    		}
    		// mobile gap
    		if (layout.mobileGap !== undefined) {
    			const gapValue = flexEngineStyleVariable.space[layout.mobileGap];
    			cssMobileOutput += `gap:${gapValue};`;
    		}
    		// apply attributes
    		const prefix = BUILDER_CONFIG.classPrefix + "styles-node-at1";
    		const prefixMobile = BUILDER_CONFIG.classPrefix + "styles-node-onMobile-at1";
    		node.setAttribute(prefix, cssOutput);
    		node.setAttribute(prefixMobile, cssMobileOutput);
    		let innerNode = documentHTML.createElement("div");
    		if (layout.displayType === 0) {
    			innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-standard`);
    		} else if (layout.displayType === 1) {
    			innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-wide`);
    		} else {
    			innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-full`);
    		}
    		// children
    		if (Array.isArray(dataArray.context)) {
    			dataArray.context.forEach(ctx => {
    				const childNode = createAnotherNode(ctx, documentHTML, true);
    				if (childNode) {
    					innerNode.appendChild(childNode);
    				}
    			});
    		}
    		node.appendChild(innerNode);
    	},
    	jsRuntime: {},

    	cssStyles: [{
    		object: "@context-full",
    		info: [{
    			key: "width",
    			value: "100%"
    		}, {
    			key: "height",
    			value: "100%"
    		}]
    	}, {
    		object: "@context-wide",
    		info: [{
    			key: "width",
    			value: "100%"
    		}, {
    			key: "height",
    			value: "100%"
    		}, {
    			key: "max-width",
    			value: "1600px"
    		}]
    	}, {
    		object: "@context-standard",
    		info: [{
    			key: "width",
    			value: "100%"
    		}, {
    			key: "height",
    			value: "100%"
    		}, {
    			key: "max-width",
    			value: "1200px"
    		}]
    	}],

        sizeQuery: [
            {
                name: "height",
                label: "Height",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "alongGrow",
                label: "Allow section grow?",
                type: "boolean/checkmark"
            },
            {
                name: "alongShrink",
                label: "Allow section shrink?",
                type: "boolean/checkmark"
            },
            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space",
                defaultAsFull: true
            }
        ],

        sizeDefault: (sz, isVertical) => {
            return {
                "width": "100%",
                "height": flexEngineStyleVarible.space(sz.height),
                "flex-grow": sz.alongGrow === true ? 1 : 0,
                "flex-shrink": sz.alongShrink === true ? 1 : 0,
                "overflow-x": "visible",
                "overflow-y": "visible",
                "align-self": "center"
            };
        },

        sizeMobile: (sz, isVertical) => {
            return {
                "min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
            };
        },
        
    	settings: {
    		sortablePart: function(element) {
    			return element.firstElementChild;
    		},
            systemClass: true,
            allowedSortIn: true,
            animation: 2,
            hide: true,
            noDelete: true,
            globalElement: true
    	}
    },

    Footer: {
    	name: "Footer",
    	className: "footer",
    	alts: [],
    	icon: `
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                        class="RaySiteUI-c-svg">
                        <path d="M144-144v-72h672v72H144Zm72-144q-33 0-52.5-19.5T144-360v-384q0-33 19.5-52.5T216-816h528q33 0 52.5 19.5T816-744v384q0 33-19.5 52.5T744-288H216Zm0-72h528v-384H216v384Zm0 0v-384 384Z"/>
                    </svg>
                `,
    	contentQuery: [{
    		name: "@global",
    		label: "Elements",
    		type: "interactiveElements"
    	}],
    	layoutQuery: [{
    		name: "spaceAcross",
    		label: "Align it to...",
    		type: "selection",
    		choice: [{
    			label: "Left",
    			value: 1
    		}, {
    			label: "Center",
    			value: 2
    		}, {
    			label: "Right",
    			value: 3
    		}, {
    			label: "Stretch it",
    			value: 4
    		}],
    		default: 1
    	}, {
    		name: "spaceAlong",
    		label: "in Height, perfer...",
    		type: "selection",
    		choice: [{
    			label: "Top",
    			value: 1
    		}, {
    			label: "Center",
    			value: 2
    		}, {
    			label: "Buttom",
    			value: 3
    		}],
    		default: 1
    	}, {
    		name: "overflow",
    		label: "Height Overflow Behavior",
    		type: "selection",
    		choice: [{
    			label: "Scroll",
    			value: 1
    		}, {
    			label: "Hidden",
    			value: 2
    		}, {
    			label: "No Action",
    			value: 3
    		}],
    		default: 3
    	}, {
    		name: "gap",
    		label: "Gaps Length",
    		type: "space"
    	}, {
    		name: "mobileGap",
    		label: "Gap on Mobile",
    		type: "space"
    	}, {
    		name: "mobileReverseDirection",
    		label: "Reverse Direction on Mobile?",
    		type: "boolean/checkmark",
    		default: false
    	}, {
    		name: "displayType",
    		label: "Maximum Width",
    		type: "selection",
    		choice: [{
    			label: "Standard",
    			value: 0
    		}, {
    			label: "Wide",
    			value: 1
    		}, {
    			label: "Full",
    			value: 2
    		}],
    		default: 0
    	}],
    	initQuery: [],
    	initFunction: function(dataArray, element) {
    		debugger; // in future we will add some default views
    	},
    	contentFunction: function(dataArray, documentHTML, node, createAnotherNode) {
    		const layout = dataArray.layout;
    		let cssOutput = "";
    		let cssMobileOutput = "";
    		// spaceAcross
    		if (layout.spaceAcross) {
    			const map = {
    				1: "flex-start",
    				2: "center",
    				3: "flex-end",
    				4: "stretch"
    			};
    			cssOutput += `justify-content:${map[layout.spaceAcross]};`;
    		}
    		// spaceAlong
    		if (layout.spaceAlong) {
    			const map = {
    				1: "flex-start",
    				2: "center",
    				3: "flex-end"
    			};
    			cssOutput += `align-items:${map[layout.spaceAlong]};`;
    		}
    		// overflow
    		if (layout.overflow) {
    			const map = {
    				1: "scroll",
    				2: "hidden",
    				3: null
    			};
    			if (map[layout.overflow]) {
    				cssOutput += `overflow:${map[layout.overflow]};`;
    			}
    		}
    		// gap
    		if (layout.gap !== undefined) {
    			const gapValue = flexEngineStyleVariable.space[layout.gap];
    			cssOutput += `gap:${gapValue};`;
    		}
    		// mobile reverse direction
    		if (layout.mobileReverseDirection) {
    			cssMobileOutput += `flex-direction:column-reverse;`;
    		}
    		// mobile gap
    		if (layout.mobileGap !== undefined) {
    			const gapValue = flexEngineStyleVariable.space[layout.mobileGap];
    			cssMobileOutput += `gap:${gapValue};`;
    		}
    		// apply attributes
    		const prefix = BUILDER_CONFIG.classPrefix + "styles-node-at1";
    		const prefixMobile = BUILDER_CONFIG.classPrefix + "styles-node-onMobile-at1";
    		node.setAttribute(prefix, cssOutput);
    		node.setAttribute(prefixMobile, cssMobileOutput);
    		let innerNode = documentHTML.createElement("div");
    		if (layout.displayType === 0) {
    			innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-standard`);
    		} else if (layout.displayType === 1) {
    			innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-wide`);
    		} else {
    			innerNode.classList.add(`${BUILDER_CONFIG.classPrefix}-context-section-full`);
    		}
    		// children
    		if (Array.isArray(dataArray.context)) {
    			dataArray.context.forEach(ctx => {
    				const childNode = createAnotherNode(ctx, documentHTML, true);
    				if (childNode) {
    					innerNode.appendChild(childNode);
    				}
    			});
    		}
    		node.appendChild(innerNode);
    	},
    	jsRuntime: {},

    	cssStyles: [{
    		object: "@context-full",
    		info: [{
    			key: "width",
    			value: "100%"
    		}, {
    			key: "height",
    			value: "100%"
    		}]
    	}, {
    		object: "@context-wide",
    		info: [{
    			key: "width",
    			value: "100%"
    		}, {
    			key: "height",
    			value: "100%"
    		}, {
    			key: "max-width",
    			value: "1600px"
    		}]
    	}, {
    		object: "@context-standard",
    		info: [{
    			key: "width",
    			value: "100%"
    		}, {
    			key: "height",
    			value: "100%"
    		}, {
    			key: "max-width",
    			value: "1200px"
    		}]
    	}],

        sizeQuery: [
            {
                name: "height",
                label: "Height",
                type: "space",
                defaultAsFull: true
            },
            {
                name: "alongGrow",
                label: "Allow section grow?",
                type: "boolean/checkmark"
            },
            {
                name: "alongShrink",
                label: "Allow section shrink?",
                type: "boolean/checkmark"
            },
            {
                name: "mobileMinHeight",
                label: "Mobile Minimum Height",
                type: "space",
                defaultAsFull: true
            }
        ],

        sizeDefault: (sz, isVertical) => {
            return {
                "width": "100%",
                "height": flexEngineStyleVarible.space(sz.height),
                "flex-grow": sz.alongGrow === true ? 1 : 0,
                "flex-shrink": sz.alongShrink === true ? 1 : 0,
                "overflow-x": "visible",
                "overflow-y": "visible",
                "align-self": "center"
            };
        },

        sizeMobile: (sz, isVertical) => {
            return {
                "min-height": flexEngineStyleVarible.space(sz.mobileMinHeight)
            };
        },
        
    	settings: {
    		sortablePart: function(element) {
    			return element.firstElementChild;
    		},
            systemClass: true,
            allowedSortIn: true,
            hide: true,
            noDelete: true,
            animation: 2,
            elementType: "footer",
            globalElement: true
    	}
    },

    Header: {

    },

    main: {
        name: "Main",
        className: "main",
        alts: ["Content"],
        icon: `
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                class="RaySiteUI-c-svg">
                <path d="M144-144v-72h672v72H144Zm72-144q-33 0-52.5-19.5T144-360v-384q0-33 19.5-52.5T216-816h528q33 0 52.5 19.5T816-744v384q0 33-19.5 52.5T744-288H216Zm0-72h528v-384H216v384Zm0 0v-384 384Z"/>
            </svg>
        `,

        contentQuery: [{
            name: "@global",
            label: "Elements",
            type: "interactiveElements"
        }],

        layoutQuery: [],

        initQuery: [],

        initFunction: function(dataArray, element) {
            debugger; // in future we will add some default views
        },

        contentFunction: function(
            dataArray,
            documentHTML,
            node,
            createAnotherNode
        ) {
            // children
            if (Array.isArray(dataArray.context)) {
                dataArray.context.forEach(ctx => {
                    const childNode = createAnotherNode(
                        ctx,
                        documentHTML,
                        true
                    );

                    if (childNode) {
                        node.appendChild(childNode);
                    }
                });
            }
        },

        jsRuntime: {},

        cssStyles: [{
            object: "@main",
            info: [{
                key: "width",
                value: "100%"
            }, {
                key: "height",
                value: "auto"
            }],
            sizeQuery: []
        }],

        sizeDefault: (sz, isVertical) => {
            return {};
        },

        sizeMobile: (sz, isVertical) => {
            return {};
        },

        settings: {
            sortablePart: function(element) {
                return element.firstElementChild;
            },

            systemClass: true,
            allowedSortIn: true,
            hide: true,
            noDelete: true,
            animation: 2,
            noStyles: true,
            elementType: "main",
        }
    }
};

/**
 * ------------------------------------------------------------------------------
 * Registery Summit!
 * 
 * we will start to put the engine together!
 * ------------------------------------------------------------------------------
 * Share some infomation:
 * 
 * If needed, we will make it an export default!
 * ------------------------------------------------------------------------------
 */
debugger;


/**
 * Main Function (RUN THIS!)
 */
export const main = function(){
    const flexEngineFileSystem = new FlexEngineFileSystem();
};

// Go RaySite!
main();