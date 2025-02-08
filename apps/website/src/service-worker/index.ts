/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const cacheName = `cache-v${version}`;
const assets = [...files, ...build];

self.addEventListener('install', (event) => {
    event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clearOldCache());
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(serveFromCache(event.request));
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function addFilesToCache(files?: RequestInfo[]) {
    const cache = await caches.open(cacheName);
    await cache.addAll([...assets, ...files || []]);
}

async function clearOldCache() {
    const keys = await caches.keys();

    for (const key of keys) {
        if (key !== cacheName) await caches.delete(key);
    }
}

async function serveFromCache(request: Request) {
    const url = new URL(request.url);
    const cache = await caches.open(cacheName);

    // if (assets.includes(url.pathname)) {
    //     const cached = await cache.match(request);
    //     if (cached) return cached;
    // }

    try {
        const response = await fetch(request);

        if (response.ok && url.protocol.startsWith('http')) {
            console.log(response);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) return cached;
    }

    return new Response(null, { status: 404 });
}