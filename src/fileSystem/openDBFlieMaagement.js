'use strict';
import { openDB } from 'idb';
import JSZip from 'jszip';

/**
 * A Simliated Web Object Store System. store that .zip.
 */
export class openDBFlieMaagement {
    /**
     * A Simliated Web Object Store System. store that .zip.
    */
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
            console.log("[ZipContainer] Opening database:", this.dbName);

            const db = await openDB(this.dbName, 1, {
                upgrade: (db) => {
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                        console.log(
                            "[ZipContainer] Created object store:",
                            this.storeName
                        );
                    }
                },
            });

            if (!db) {
                throw new Error("openDB() returned no database instance.");
            }

            if (!db.objectStoreNames.contains(this.storeName)) {
                throw new Error(
                    `Object store "${this.storeName}" does not exist.`
                );
            }

            this.db = db;

            console.log("[ZipContainer] Database ready:", {
                name: this.db.name,
                storeName: this.storeName,
                stores: Array.from(this.db.objectStoreNames),
            });

            return {
                message: "Database registered and connected successfully."
            };
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
}
