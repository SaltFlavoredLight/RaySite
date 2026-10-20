
let engineClientId = null;

self.addEventListener("install", event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("message", event => {
    if (event.data?.type === "REGISTER_ENGINE" && event.source) {
        engineClientId = event.source.id;
    }
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith((async () => {
        if (!engineClientId) {
            return fetch(request);
        }

        const client = await self.clients.get(engineClientId);

        if (!client) {
            return fetch(request);
        }

        const body = ["GET", "HEAD"].includes(request.method)
            ? null
            : await request.arrayBuffer();

        return new Promise(async (resolve, reject) => {
            const channel = new MessageChannel();

            channel.port1.onmessage = ({ data }) => {
                channel.port1.close();

                resolve(new Response(data.body, {
                    status: data.status,
                    statusText: data.statusText,
                    headers: data.headers
                }));
            };

            channel.port1.onmessageerror = () => {
                channel.port1.close();
                reject(new Error("Invalid response from FlexEngine"));
            };

            client.postMessage({
                type: "SERVER_FETCH",
                url: request.url,
                method: request.method,
                headers: [...request.headers],
                body
            }, [channel.port2]);
        });
    })());
});
