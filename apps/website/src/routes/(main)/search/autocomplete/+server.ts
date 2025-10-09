import { json } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import path from 'node:path';
import lrclib from 'lrclib.js';

export async function GET({ url}) {
    const query = url.searchParams.get('q')?.toLowerCase() || '';
    const results = await lrclib.search(query).catch(() => null);

    const suggestion = [
        query,
        results?.map(r => r.trackName) || [],
        results?.map(r => `By ${r.artistName}`) || [],
        results?.map(r => `${url.origin}${path.join('/', resolve('/(main)/track/[id]', { id: String(r.id) }))}`) || []
    ];

    return json(suggestion);
}