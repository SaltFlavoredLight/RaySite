"use strict";

const DEBUG = true;
const PROXY_TIMEOUT_MS = 30000;

let engineClientId = null;

function log(...args) {
    if (DEBUG) console.log("[RaySite SW]", ...args);
}

function warn(...args) {
    console.warn("[RaySite SW]", ...args);
}

function error(...args) {
    console.error("[RaySite SW]", ...args);
}

function errorResponse(status, code, message) {
    return new Response(message, {
        status,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "X-RaySite-SW-Error": code
        }
    });
}

function isBuilderRequest(pathname) {
    const exactPaths = new Set([
        "/sw.js",
        "/ui.css",
        "/favicon.ico",
        "/rs-preview/index.html",
        "/__vite_ping",
        "/@react-refresh"
    ]);

    const prefixes = [
        "/tests/",
        "/modules/",
        "/src/",
        "/assets/",
        "/@vite/",
        "/@id/",
        "/@fs/",
        "/node_modules/"
    ];

    return (
        exactPaths.has(pathname) ||
        prefixes.some(prefix =>
            pathname.startsWith(prefix)
        )
    );
}

async function isBuilderDocumentRequest(event, pathname) {
    if (pathname !== "/" && pathname !== "/index.html") {
        return false;
    }

    if (!event.clientId) {
        return true;
    }

    if (event.clientId === engineClientId) {
        return true;
    }

    const client = await self.clients.get(event.clientId);
    return client?.frameType === "top-level";
}

async function isRenderRequest(event, pathname) {
    if (pathname === "/rs-build/index.html" || pathname.startsWith("/rs-build/")) {
        return true;
    }

    if (!event.clientId || !pathname.startsWith("/rs-assets/")) {
        return false;
    }

    const client = await self.clients.get(event.clientId);
    if (!client) return false;

    const clientURL = new URL(client.url);
    return clientURL.origin === self.location.origin &&
        clientURL.pathname.startsWith("/rs-build/");
}

self.addEventListener("install", event => {
    log("Installing");
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        await self.clients.claim();
        log("Activated");
    })());
});

self.addEventListener("message", event => {
    const data = event.data;
    const port = event.ports?.[0];

    if (data?.type === "REGISTER_ENGINE") {
        const clientId = event.source?.id;

        if (!clientId) {
            port?.postMessage({
                type: "ENGINE_REGISTRATION_ERROR",
                error: "Client ID is unavailable"
            });

            return;
        }

        engineClientId = clientId;
        log("Engine registered", { clientId });

        port?.postMessage({
            type: "ENGINE_REGISTERED",
            clientId
        });

        return;
    }

    if (data?.type === "UNREGISTER_ENGINE") {
        if (event.source?.id === engineClientId) {
            engineClientId = null;
        }

        port?.postMessage({
            type: "ENGINE_UNREGISTERED"
        });

        return;
    }

    if (data?.type === "WS_DEBUG_STATUS") {
        event.waitUntil((async () => {
            const engine = engineClientId
                ? await self.clients.get(engineClientId)
                : null;

            port?.postMessage({
                type: "WS_DEBUG_STATUS",
                engineClientId,
                engineAvailable: Boolean(engine),
                engineURL: engine?.url ?? null
            });
        })());
    }
});

async function resolveEngineClient() {
    if (engineClientId) {
        const client = await self.clients.get(engineClientId);

        if (client) return client;

        engineClientId = null;
    }

    const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
    });

    const builders = clients.filter(client => {
        const url = new URL(client.url);

        return (
            url.origin === self.location.origin &&
            client.frameType === "top-level" &&
            (
                url.pathname === "/" ||
                url.pathname === "/index.html"
            )
        );
    });

    if (builders.length === 0) {
        return null;
    }

    const builder =
        builders.find(client => client.focused) ||
        builders.find(client => client.visibilityState === "visible") ||
        builders[0];
    engineClientId = builder.id;

    log("Engine client recovered", {
        clientId: engineClientId,
        builderCount: builders.length
    });

    return builder;
}

self.addEventListener("fetch", event => {
    event.respondWith(handleFetch(event));
});

async function handleFetch(event) {
    const request = event.request;
    const url = new URL(request.url);

    log("Request intercepted", {
        url: request.url,
        method: request.method,
        destination: request.destination,
        clientId: event.clientId
    });

    try {
        if (url.origin !== self.location.origin) {
            return await fetch(request);
        }

        if (
            isBuilderRequest(url.pathname) ||
            await isBuilderDocumentRequest(event, url.pathname)
        ) {
            return await fetch(request);
        }

        const server = await isRenderRequest(event, url.pathname)
            ? "render"
            : "editor";
        return await proxyToEngine(request, server);
    } catch (err) {
        error("Request dispatch failed", err);

        return errorResponse(
            502,
            "DISPATCH_ERROR",
            String(err)
        );
    }
}

async function proxyToEngine(request, server = "editor") {
    const engineClient = await resolveEngineClient();

    if (!engineClient) {
        return errorResponse(
            503,
            "ENGINE_UNAVAILABLE",
            "No available RaySite engine client"
        );
    }

    const body = (
        request.method === "GET" ||
        request.method === "HEAD"
    )
        ? null
        : await request.arrayBuffer();

    const channel = new MessageChannel();

    log("Proxying request", {
        url: request.url,
        method: request.method,
        engineClientId: engineClient.id,
        server
    });

    return new Promise(resolve => {
        let settled = false;

        const timeout = setTimeout(() => {
            finish(errorResponse(
                504,
                "ENGINE_TIMEOUT",
                "RaySite engine request timed out"
            ));
        }, PROXY_TIMEOUT_MS);

        function finish(response) {
            if (settled) return;

            settled = true;
            clearTimeout(timeout);
            channel.port1.close();
            resolve(response);
        }

        channel.port1.onmessage = ({ data }) => {
            if (data?.type === "ENGINE_ERROR") {
                error("Engine error", data.error);

                finish(errorResponse(
                    502,
                    "ENGINE_ERROR",
                    data.error || "Unknown engine error"
                ));

                return;
            }

            const status = data?.status;

            if (
                !Number.isInteger(status) ||
                status < 200 ||
                status > 599
            ) {
                finish(errorResponse(
                    502,
                    "INVALID_RESPONSE",
                    "Invalid engine HTTP response"
                ));

                return;
            }

            try {
                const noBody =
                    request.method === "HEAD" ||
                    [204, 205, 304].includes(status);

                const response = new Response(
                    noBody ? null : (data.body ?? null),
                    {
                        status,
                        statusText: data.statusText || "",
                        headers: data.headers || []
                    }
                );

                log("Engine response received", {
                    url: request.url,
                    status: response.status,
                    contentType: response.headers.get("content-type"),
                    response
                });

                finish(response);
            } catch (err) {
                error("Response construction failed", err);

                finish(errorResponse(
                    502,
                    "RESPONSE_CONSTRUCTION",
                    String(err)
                ));
            }
        };

        channel.port1.onmessageerror = () => {
            finish(errorResponse(
                502,
                "MESSAGE_ERROR",
                "Engine response could not be decoded"
            ));
        };

        try {
            engineClient.postMessage(
                {
                    type: "SERVER_FETCH",
                    server,
                    url: request.url,
                    method: request.method,
                    headers: [...request.headers],
                    body
                },
                [channel.port2]
            );
        } catch (err) {
            error("Failed to contact engine", err);

            finish(errorResponse(
                502,
                "POST_MESSAGE_FAILED",
                String(err)
            ));
        }
    });
}

self.addEventListener("messageerror", event => {
    error("Unreadable message", event);
});

self.addEventListener("error", event => {
    error("Service Worker error", event.message);
});

self.addEventListener("unhandledrejection", event => {
    error("Unhandled rejection", event.reason);
});
