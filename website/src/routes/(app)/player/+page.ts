import { definePageMetaTags } from 'svelte-meta-tags';

export async function load() {
    return {
        ...definePageMetaTags({
            title: 'Lrclib.js Player',
            description: 'Listen to your saved tracks and albums from lrclib.net'
        })
    }
}