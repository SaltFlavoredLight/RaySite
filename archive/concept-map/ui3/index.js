/* Strorage System 1.0 Web version
   Credit to openDB and FFlate MIT
*/


import {
	openDB
} from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';
import {
	zip,
	unzip
} from "https://cdn.jsdelivr.net/npm/fflate@0.8.2/esm/browser.js";


class DBStorage {
	constructor(dbName = 'ProjectFilesDB', storeName = 'files') {
		this.dbName = dbName;
		this.storeName = storeName;
		this.db = null;
	}

	async init() {
		if (this.db) return {
			success: true,
			code: 0
		};

		try {
			let persistCode = 2;

			if (navigator.storage && navigator.storage.persist) {
				const granted = await navigator.storage.persist();
				if (granted) {
					persistCode = 0;
					console.log("💾 Storage status: Persisted");
				} else {
					console.warn("⚠️ Storage status: Best Effort (Not Persisted)");
				}
			}

			this.db = await openDB(this.dbName, 1, {
				upgrade(db) {
					if (!db.objectStoreNames.contains('files')) {
						db.createObjectStore('files');
					}
				},
			});

			return {
				success: true,
				code: persistCode
			};
		} catch (e) {
			return {
				success: false,
				msg: e.message,
				code: 1
			};
		}
	}

	async getEstimate() {
		if (navigator.storage && navigator.storage.estimate) {
			const {
				usage,
				quota
			} = await navigator.storage.estimate();
			return {
				usageMB: (usage / (1024 * 1024)).toFixed(2),
				quotaMB: (quota / (1024 * 1024)).toFixed(2),
				percent: ((usage / quota) * 100).toFixed(2)
			};
		}
		return null;
	}

	async batchSave(fileMap) {
		try {
			const tx = this.db.transaction(this.storeName, 'readwrite');
			for (const [path, content] of Object.entries(fileMap)) {
				tx.store.put(content, path);
			}
			await tx.done;
			const stats = await this.getEstimate();
			return {
				success: true,
				code: 0,
				stats
			};
		} catch (e) {
			return {
				success: false,
				msg: e.message,
				code: 1
			};
		}
	}

	async getFile(path) {
		try {
			const data = await this.db.get(this.storeName, path);
			return {
				success: true,
				data,
				code: 0
			};
		} catch (e) {
			return {
				success: false,
				msg: "Read error",
				code: 1
			};
		}
	}

	async getAllPaths(prefix = "") {
		try {
			const range = prefix ? IDBKeyRange.bound(prefix, prefix + '\uffff') : null;
			const keys = await this.db.getAllKeys(this.storeName, range);
			return {
				success: true,
				data: keys,
				code: 0
			};
		} catch (e) {
			return {
				success: false,
				data: [],
				code: 1
			};
		}
	}

	async deleteFiles(paths) {
		try {
			const pathList = Array.isArray(paths) ? paths : [paths];
			const tx = this.db.transaction(this.storeName, 'readwrite');
			for (const path of pathList) {
				tx.store.delete(path);
			}
			await tx.done;
			return {
				success: true,
				code: 0
			};
		} catch (e) {
			return {
				success: false,
				msg: e.message,
				code: 1
			};
		}
	}

	async clearAll() {
		try {
			const tx = this.db.transaction(this.storeName, 'readwrite');
			await tx.store.clear();
			await tx.done;
			return {
				success: true,
				code: 0
			};
		} catch (e) {
			return {
				success: false,
				msg: e.message,
				code: 1
			};
		}
	}
}

// ecport this class
class FileStorage {
	constructor(dbName = 'ProjectFilesDB', storeName = 'files') {
		this.db = new DBStorage(dbName, storeName);
	}

	async init() {
		return this.db.init();
	}

	// Read a file by path
	async read(path = "") {
		if (!path) return {
			success: false,
			msg: "Path required",
			code: 1
		};
		return this.db.getFile(path);
	}

	// Write a single file
	async write(path = "", content = "") {
		if (!path) return {
			success: false,
			msg: "Path required",
			code: 1
		};
		return this.db.batchSave({
			[path]: content
		});
	}

	// List all paths, optionally filtered by prefix
	async list(prefix = "") {
		return this.db.getAllPaths(prefix);
	}

	// Delete a single file
	async delete(path = "") {
		if (!path) return {
			success: false,
			msg: "Path required",
			code: 1
		};
		return this.db.deleteFiles(path);
	}

	// Import a ZIP project file
	async importProject(projectFile) {
		try {
			await this.db.clearAll();

			const buffer = new Uint8Array(await projectFile.arrayBuffer());

			const files = await new Promise((resolve, reject) => {
				unzip(buffer, (err, data) => {
					if (err) reject(err);
					else resolve(data);
				});
			});

			const fileMap = {};

			for (const [path, data] of Object.entries(files)) {
				const text = new TextDecoder().decode(data);
				fileMap[path] = text;
			}

			return await this.db.batchSave(fileMap);

		} catch (e) {
			return {
				success: false,
				msg: e.message,
				code: 1
			};
		}
	}



	// Export all files into a ZIP
	async exportProject() {
		console.log(">>> exportProject() CALLED");

		try {
			const {
				data: paths
			} = await this.db.getAllPaths();
			const files = {};

			for (const path of paths) {
				const {
					data: content
				} = await this.db.getFile(path);
				files[path] = new TextEncoder().encode(content);
			}

			// Wrap fflate.zip in a Promise
			const zipped = await new Promise((resolve, reject) => {
				zip(files, (err, data) => {
					if (err) reject(err);
					else resolve(data);
				});
			});

			const blob = new Blob([zipped], {
				type: "application/zip"
			});
			console.log("Blob created:", blob);

			return {
				success: true,
				blob,
				code: 0
			};

		} catch (e) {
			console.error("EXPORT ERROR:", e);
			return {
				success: false,
				msg: e.message,
				code: 1
			};
		}
	}


}


/*

*/

/* Index.js, all part together 
const storage = new FileStorage();
*/
export class CubicWorldSites {

}