/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const cacheName = `cache-${version}`;
const assets = [...files, ...build];

self.addEventListener('install', (event) => {
    event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clearOldCache());
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(serveFromCache(event));
});

self.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') await self.skipWaiting();
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

async function serveFromCache(event: FetchEvent) {
    const { request } = event;
    const url = new URL(request.url);

    try {
        const response = await fetch(request);
        const clone = response.clone();

        if (response.ok && url.protocol.startsWith('http')) {
            console.log('Serving from network', url);

            event.waitUntil((async () => {
                const cache = await caches.open(cacheName);
                await cache.put(request, clone);
            })());
        }

        return response;
    } catch (error) {
        console.log('Falling back to cache', url);
        const cached = await caches.match(request);

        if (cached) {
            console.log('Serving from cache', url);
            return cached;
        } else {
            console.error('Cache miss', url);
        }
    }

    return new Response(null, { status: 404 });
}