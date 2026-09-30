import lrclib from 'lrclib.js';
import storage from '$lib/helpers/storage';
import { definePageMetaTags } from 'svelte-meta-tags';

export async function load({ params }) {
    const id = Number(params.id);
    const track = await storage.getTrack(id) || await lrclib.fetchTrackById(id);

    return {
        track,
        ...definePageMetaTags({
            title: `Lrclib.js | ${track.name} by ${track.artistName}`,
            description: `Lyrics for ${track.name} by ${track.artistName} from the album ${track.albumName}`
        })
    };
}