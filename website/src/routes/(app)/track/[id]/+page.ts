import lrclib from 'lrclib.js';

export async function load({ params }) {
    const id = Number(params.id);

    const track = await lrclib.fetchTrackById(id);

    return {
        track
    };
}