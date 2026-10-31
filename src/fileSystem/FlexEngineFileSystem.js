'use strict';
import { openDBFlieMaagement } from './fileSystem/openDBFlieMaagement';

/**
 * File System
 * init() first, then you can read many things together.
 * ALL WERE ASYNC!
 */

export class FlexEngineFileSystem {
    /**
     * Setup
     * @param {string} dbName DataBase Name
     * @param {string} storeName Store Name
     */
    constructor(dbName = 'ZipContainerDB', storeName = 'files') {
        this.zipManager = new openDBFlieMaagement(dbName, storeName);
    }

    async init() {
        return await this.zipManager.register();
    }

    async readFile(path) {
        return await this.zipManager.read(path);
    }

    async updateFile(path, fileData) {
        return await this.zipManager.add(path, fileData);
    }

    async deleteFile(path) {
        return await this.zipManager.delete(path);
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
}
