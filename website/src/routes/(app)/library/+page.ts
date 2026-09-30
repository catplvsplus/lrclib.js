import { definePageMetaTags } from 'svelte-meta-tags';

export async function load() {
    return {
        ...definePageMetaTags({
            title: 'Lrclib.js Library',
            description: 'Browse your saved tracks and albums from lrclib.net'
        })
    }
}