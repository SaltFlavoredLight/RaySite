/*
objectListener.js
Listen the object is changes or not.

*/
'use strict';

class ObjectListener {
    constructor(obj) {
        this._listeners = new Map();
        this._nextId = 1;
        this._closed = false;

        this.target = obj;

        this.proxy = new Proxy(obj, {
            set: (target, prop, value) => {
                if (this._closed) return true;

                const oldValue = target[prop];
                target[prop] = value;

                const event = {
                    prop,
                    oldValue,
                    newValue: value,
                    target
                };

                for (const fn of this._listeners.values()) {
                    try {
                        fn(event);
                    } catch (err) {
                        console.error("Listener error:", err);
                    }
                }

                return true;
            }
        });

        return this.proxy;
    }

    addEventListener(fn) {
        const id = this._nextId++;
        this._listeners.set(id, fn);
        return id;
    }

    cancelEventListener(id) {
        this._listeners.delete(id);
    }

    close() {
        this._listeners.clear();
        this._closed = true;
    }
};

export default ObjectListener;

/*
Code used for test out! ~~~
*/
if (false){
    // 1. Your JSON-like tree
    const filedata = {
        user: {
            profile: {
            name: "Ray",
            age: 16
            }
        }
    };

    // 2. Take a branch
    const piece = filedata.user.profile;

    // 3. Wrap it
    const listener = new ObjectListener(piece);

    // 4. Add listeners
    const id1 = listener.addEventListener(event => {
        console.log("Listener 1:", event);
    });

    const id2 = listener.addEventListener(async event => {
        console.log("Async listener:", event);
        await new Promise(r => setTimeout(r, 300));
        console.log("Async done for:", event.prop);
    });

    // 5. Modify the object
    listener.name = "Raymond";
    listener.age = 17;

    // 6. Remove one listener
    listener.cancelEventListener(id1);

    // 7. Modify again (only async listener fires)
    listener.age = 18;

    // 8. Close watcher
    listener.close();

    // 9. No more events
    listener.age = 19; // ignored
}