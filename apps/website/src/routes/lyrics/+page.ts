import { error } from '@sveltejs/kit';
import lrclib, { type APIOptions } from 'lrclib.js';

export async function load({ url, fetch }) {
    const q = url.searchParams.get('q') ?? undefined;
    const track_name = url.searchParams.get('track_name') ?? undefined;
    const artist_name = url.searchParams.get('artist_name') ?? undefined;
    const album_name = url.searchParams.get('album_name') ?? undefined;

    let options: APIOptions.Get.Search|null = null;

    if (track_name) {
        options = { track_name, artist_name, album_name };
    } else if (q) {
        options = { q };
    } else {
        return error(400, { message: 'Missing search parameters' });
    }

    lrclib.rest.fetch = fetch;

    return (async () => ({
        options,
        data: await lrclib.search(options)
    }))();
}