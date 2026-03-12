import { definePageMetaTags } from 'svelte-meta-tags';

export async function load() {
    const metatags = {
        title: 'Lrclib.js Player',
        description: 'Play your audio files with lyrics from Lrclib.js',
    };

    return {
        ...definePageMetaTags({
            ...metatags,
            openGraph: metatags
        })
    };
}