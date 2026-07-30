/*
flexEngineFileSystem.js 

A engine tools that help you acsess website infomation about files
*/
"use strict";


import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';
import JSZip from 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm';

/*
Zip Container - Use IndexDB do folder like Folder, so I can open flie directly in web.
(code with Gemini)
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

const zipFileManagement = openDBFlieMaagement;

class flexEngineFileSystem {
    constructor(dbName = 'ZipContainerDB', storeName = 'files') {
        this.zipManager = new zipFileManagement(dbName, storeName);
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

export default flexEngineFileSystem;