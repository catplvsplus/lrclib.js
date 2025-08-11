import lrclib from 'lrclib.js';
import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte.js';
import { error } from '@sveltejs/kit';

export const ssr = false;

export async function load({ params, fetch }) {
    const id = params.id;

    lrclib.rest.fetch = fetch;

    const track = await savedLyrics.fetch(Number(id))
        .catch(() => null);

    if (!track) throw error(404, 'Track not found');

    return { track };
}