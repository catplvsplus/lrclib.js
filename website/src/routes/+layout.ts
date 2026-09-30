import { defineBaseMetaTags } from 'svelte-meta-tags';

export async function load({ url }) {
    return {
        ...defineBaseMetaTags({
            title: 'Lrclib.js',
            description: 'A JavaScript library for interacting with lrclib.net API',
            keywords: ['lrclib', 'JavaScript', 'API', 'library'],
            canonical: new URL(url.pathname, url.origin).href,
        })
    }
}