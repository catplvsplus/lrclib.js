import lrclib, { type APIOptions } from 'lrclib.js';

export async function load({ url, fetch }) {
    const q = url.searchParams.get('q') ?? undefined;
    const track_name = url.searchParams.get('track_name') ?? undefined;
    const artist_name = url.searchParams.get('artist_name') ?? undefined;
    const album_name = url.searchParams.get('album_name') ?? undefined;

    let query: APIOptions.Get.Search|null = null;

    if (track_name) {
        query = { track_name, artist_name, album_name };
    } else if (q) {
        query = { q };
    }

    lrclib.rest.fetch = fetch;

    return (async () => ({
        query,
        tracks: query ? await lrclib.search(query) : null
    }))();
}