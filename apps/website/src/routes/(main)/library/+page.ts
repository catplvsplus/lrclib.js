import { type APIOptions } from 'lrclib.js';
import { definePageMetaTags } from 'svelte-meta-tags';

export async function load({ url }) {
    const q = url.searchParams.get('q') ?? undefined;
    const track_name = url.searchParams.get('track_name') ?? undefined;
    const artist_name = url.searchParams.get('artist_name') ?? undefined;
    const album_name = url.searchParams.get('album_name') ?? undefined;

    let query: APIOptions.Get.Search|null = null;

    if (track_name || artist_name || album_name) {
        query = { track_name: track_name ?? '', artist_name, album_name };
    } else if (q) {
        query = { q };
    }

    const metatags = {
        title: 'Lrclib.js Library',
        description: 'Manage your library of song lyrics with Lrclib.js',
    };

    return {
        query,
        ...definePageMetaTags({
            ...metatags,
            openGraph: metatags
        })
    };
}