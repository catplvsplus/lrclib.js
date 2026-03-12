import lrclib from 'lrclib.js';
import { savedLyrics } from '$lib/helpers/classes/SavedLyrics.svelte.js';
import { error } from '@sveltejs/kit';
import { definePageMetaTags } from 'svelte-meta-tags';

export async function load({ params, fetch }) {
    const id = params.id;

    lrclib.rest.fetch = fetch;

    const track = await savedLyrics.fetch(Number(id))
        .catch(() => null);

    if (!track) throw error(404, 'Track not found');

    const metatags = {
        title: track.trackName + ' by ' + track.artistName + ' on Lrclib.js',
        description: track.plainLyrics || track.syncedLyrics || track.albumName,
    };

    return {
        track,
        ...definePageMetaTags({
            ...metatags,
            keywords: [track.trackName, track.artistName, track.albumName],
            openGraph: metatags
        })
    };
}