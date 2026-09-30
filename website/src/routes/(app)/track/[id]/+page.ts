import lrclib from 'lrclib.js';
import storage from '$lib/helpers/storage';

export async function load({ params }) {
    const id = Number(params.id);
    const track = await storage.getTrack(id) || await lrclib.fetchTrackById(id);

    return { track };
}