import { definePageMetaTags } from 'svelte-meta-tags';

export async function load() {
    return {
        ...definePageMetaTags({
            title: 'Lrclib.js Documentation',
            description: 'Documentation for the Lrclib.js library'
        })
    }
}