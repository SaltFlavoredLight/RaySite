
/* public/ws.js */

// ============================================================
// Configuration
// ============================================================

const DEBUG = true;
const PROXY_TIMEOUT_MS = 15000;

const engineClients = new Set();
let engineClientId = null;

// Requests that should remain under Vite/browser control.
const BYPASS_PATHS = new Set([
    "/ws.js",
    "/src/main.js"
]);

const BYPASS_PREFIXES = [
    "/@vite/",
    "/@id/",
    "/@fs/"
];

// ============================================================
// Debugging helpers
// ============================================================

function log(...args) {
    if (DEBUG) console.log("[WS]", ...args);
}

function warn(...args) {
    console.warn("[WS]", ...args);
}

function error(...args) {
    console.error("[WS]", ...args);
}

function describeRequest(request, clientId) {
    return {
        url: request.url,
        method: request.method,
        mode: request.mode,
        destination: request.destination,
        clientId: clientId || "(none)",
        engineClientId: engineClientId || "(none)",
        isEngine: Boolean(clientId && engineClients.has(clientId))
    };
}

async function getClientInfo(clientId) {
    if (!clientId) return null;

    try {
        const client = await self.clients.get(clientId);

        if (!client) return {
            id: clientId,
            exists: false
        };

        return {
            id: client.id,
            type: client.type,
            url: client.url,
            frameType: client.frameType
        };
    } catch (err) {
        return {
            id: clientId,
            error: String(err)
        };
    }
}

// ============================================================
// Install / activate
// ============================================================

self.addEventListener("install", event => {
    log("Installing Service Worker");

    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    log("Activating Service Worker");

    event.waitUntil((async () => {
        await self.clients.claim();
        log("Activated; clients claimed");
    })());
});

// ============================================================
// Engine registration
// ============================================================

self.addEventListener("message", event => {
    const data = event.data;

    if (data?.type === "REGISTER_ENGINE") {
        if (!event.source?.id) {
            warn("REGISTER_ENGINE rejected: source has no client ID");
            return;
        }

        const clientId = event.source.id;

        engineClients.add(clientId);
        engineClientId = clientId;

        log("Engine registered", {
            clientId,
            totalRegisteredEngines: engineClients.size
        });

        const port = event.ports?.[0];

        port?.postMessage({
            type: "ENGINE_REGISTERED",
            clientId
        });

        return;
    }

    if (data?.type === "WS_DEBUG_STATUS") {
        const port = event.ports?.[0];

        event.waitUntil((async () => {
            const clients = await Promise.all(
                [...engineClients].map(getClientInfo)
            );

            port?.postMessage({
                type: "WS_DEBUG_STATUS",
                engineClientId,
                engineClients: clients
            });
        })());

        return;
    }

    if (data?.type === "WS_DEBUG_UNREGISTER_ENGINE") {
        const clientId = data.clientId;

        if (clientId) {
            engineClients.delete(clientId);

            if (engineClientId === clientId) {
                engineClientId = engineClients.values().next().value ?? null;
            }

            log("Engine unregistered", {
                clientId,
                currentEngineClientId: engineClientId
            });
        }
    }
});

// ============================================================
// Fetch interception
// ============================================================

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);
    const clientId = event.clientId;

    log("Fetch observed", describeRequest(request, clientId));

    // Leave cross-origin requests to the browser.
    if (url.origin !== self.location.origin) {
        log("Bypass: cross-origin", url.href);
        return;
    }

    // Leave Vite and application bootstrap requests alone.
    if (
        BYPASS_PATHS.has(url.pathname) ||
        BYPASS_PREFIXES.some(prefix =>
            url.pathname.startsWith(prefix)
        )
    ) {
        log("Bypass: development/bootstrap path", url.pathname);
        return;
    }

    // Only proxy requests when a parent engine is registered.
    if (!engineClientId || !engineClients.has(engineClientId)) {
        log("Bypass: no registered engine", {
            clientId,
            engineClientId
        });
        return;
    }

    // A client ID identifies the requesting page/frame, not the engine.
    // The proxy target is the separately registered parent engine.
    event.respondWith(
        proxyToEngine(request, engineClientId, clientId)
    );
});

// ============================================================
// Proxy request to parent engine
// ============================================================

async function proxyToEngine(request, targetEngineId, requesterId) {
    const engineClient = await self.clients.get(targetEngineId);

    if (!engineClient) {
        engineClients.delete(targetEngineId);

        if (engineClientId === targetEngineId) {
            engineClientId = null;
        }

        error("Registered engine client no longer exists", {
            targetEngineId,
            requesterId,
            url: request.url
        });

        // Do not silently retry through native fetch: that could
        // hide routing bugs or cause unexpected network requests.
        return new Response("Registered FlexEngine client is unavailable", {
            status: 502,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-RaySite-WS-Error": "ENGINE_UNAVAILABLE"
            }
        });
    }

    const body = ["GET", "HEAD"].includes(request.method)
        ? null
        : await request.arrayBuffer();

    const channel = new MessageChannel();

    log("Proxying request", {
        url: request.url,
        method: request.method,
        requesterId: requesterId || "(none)",
        targetEngineId
    });

    return new Promise(resolve => {
        let settled = false;

        function finish(response) {
            if (settled) return;
            settled = true;

            clearTimeout(timeout);
            channel.port1.close();
            resolve(response);
        }

        const timeout = setTimeout(() => {
            error("Engine request timed out", {
                url: request.url,
                targetEngineId,
                timeoutMs: PROXY_TIMEOUT_MS
            });

            finish(new Response("FlexEngine request timed out", {
                status: 504,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "X-RaySite-WS-Error": "ENGINE_TIMEOUT"
                }
            }));
        }, PROXY_TIMEOUT_MS);

        channel.port1.onmessage = ({ data }) => {
            log("Engine response received", {
                url: request.url,
                status: data?.status,
                type: data?.type
            });

            if (data?.type === "ENGINE_ERROR") {
                error("Engine returned an error", {
                    url: request.url,
                    error: data.error
                });

                finish(new Response(
                    data.error || "FlexEngine request failed",
                    {
                        status: 502,
                        headers: {
                            "Content-Type": "text/plain; charset=utf-8",
                            "X-RaySite-WS-Error": "ENGINE_ERROR"
                        }
                    }
                ));

                return;
            }

            if (
                !Number.isInteger(data?.status) ||
                data.status < 200 ||
                data.status > 599
            ) {
                error("Invalid engine response", data);

                finish(new Response("Invalid FlexEngine response", {
                    status: 502,
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8",
                        "X-RaySite-WS-Error": "INVALID_ENGINE_RESPONSE"
                    }
                }));

                return;
            }

            try {
                const noBody =
                    request.method === "HEAD" ||
                    [204, 205, 304].includes(data.status);

                finish(new Response(noBody ? null : data.body ?? null, {
                    status: data.status,
                    statusText: data.statusText || "",
                    headers: data.headers || []
                }));
            } catch (err) {
                error("Failed to construct response", err);

                finish(new Response(String(err), {
                    status: 502,
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8",
                        "X-RaySite-WS-Error": "RESPONSE_CONSTRUCTION"
                    }
                }));
            }
        };

        channel.port1.onmessageerror = () => {
            error("MessageChannel response could not be decoded", {
                url: request.url,
                targetEngineId
            });

            finish(new Response("Invalid message from FlexEngine", {
                status: 502,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "X-RaySite-WS-Error": "MESSAGE_ERROR"
                }
            }));
        };

        try {
            engineClient.postMessage({
                type: "SERVER_FETCH",
                url: request.url,
                method: request.method,
                headers: [...request.headers],
                body
            }, [channel.port2]);
        } catch (err) {
            error("Failed to send request to engine", err);

            channel.port2.close();

            finish(new Response(String(err), {
                status: 502,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "X-RaySite-WS-Error": "POST_MESSAGE_FAILED"
                }
            }));
        }
    });
}

// ============================================================
// Cleanup stale engine registrations
// ============================================================

self.addEventListener("messageerror", event => {
    error("Service Worker received an unreadable message", event);
});

self.addEventListener("periodicsync", () => {
    // Intentionally unused. Engine cleanup is performed lazily
    // when a request finds that the registered client is missing.
});



self.addEventListener("message", event => {
    const data = event.data;

    if (data?.type === "REGISTER_ENGINE") {
        log("REGISTER_ENGINE received from client:", event.source?.id); // Add this log

        if (!event.source?.id) {
            warn("REGISTER_ENGINE rejected: source has no client ID");
            return;
        }

        const clientId = event.source.id;
        engineClients.add(clientId);
        engineClientId = clientId;

        const port = event.ports?.[0];
        port?.postMessage({
            type: "ENGINE_REGISTERED",
            clientId
        });
        return;
    }
});