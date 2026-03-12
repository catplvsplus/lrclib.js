import { defineBaseMetaTags } from 'svelte-meta-tags';

export async function load({ url }) {
    const canonical = new URL(url.pathname, url.origin).toString();

    return {
        ...defineBaseMetaTags({
            title: 'Lrclib.js',
            description: 'A JavaScript library for interacting with lrclib.net API',
            keywords: ['lrclib.js', 'lrclib', 'lrclib.net', 'api', 'lyrics'],
            canonical,
            openGraph: {
                type: 'website',
                title: 'Lrclib.js',
                description: 'A JavaScript library for interacting with lrclib.net API',
                url: canonical,
                siteName: 'Lrclib.js',
                locale: 'en_US',
            }
        })
    };
}