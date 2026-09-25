import type { Lyric } from '@braccato/parsers';
import type { APIOptions } from 'lrclib.js';

export { cn } from "cn";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function encodeURISearchQuery(query: APIOptions.Get.Search | null): string {
    if (isSearchEmpty(query)) return '?';

    const params = new URLSearchParams();

    if ('q' in query && query.q) {
        params.set('q', query.q);
    } else if ('track_name' in query) {
        if (query.track_name) params.set('track_name', query.track_name);
        if (query.artist_name) params.set('artist_name', query.artist_name);
        if (query.album_name) params.set('album_name', query.album_name);
    }

    return `?${params.toString()}`;
}

export function isSearchEmpty(query: APIOptions.Get.Search | null): query is null {
    if (!query) {
        return true;
    }

    if ('q' in query && !query.q.trim()) {
        return true;
    }

    if ('track_name' in query && !query.track_name.trim() && !query.artist_name?.trim() && !query.album_name?.trim()) {
        return true;
    }

    return false;
}

export function stringifyLyrics(lyrics: Lyric[]): string {
    return lyrics.map(l => l.words).join('\n');
}