import { clsx, type ClassValue } from "clsx";
import humanizeDuration from 'humanize-duration';
import type { APIOptions } from 'lrclib.js';
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function formatNumberString(number: number): string {
    if (number < 1000) {
        return number.toLocaleString();
    } else if (number < 1000000) {
        return `${(number / 1000).toFixed(1)}K`;
    } else if (number < 1000000000) {
        return `${(number / 1000000).toFixed(1)}M`;
    } else {
        return `${(number / 1000000000).toFixed(1)}B`;
    }
}

export function formatBytesString(bytes: number): string {
    if (bytes < 1000) {
        return `${bytes} B`;
    } else if (bytes < 1000000) {
        return `${(bytes / 1000).toFixed(1)} KB`;
    } else if (bytes < 1000000000) {
        return `${(bytes / 1000000).toFixed(1)} MB`;
    } else {
        return `${(bytes / 1000000000).toFixed(1)} GB`;
    }
}

export const formatDurationString = humanizeDuration.humanizer({
    largest: 1,
    language: "shortEn",
    maxDecimalPoints: 1,
    spacer: "",
    languages: {
        shortEn: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms",
        },
    },
});

export function stringifyQuery(query: APIOptions.Get.Search): string {
    return ((q: APIOptions.Get.Search): q is APIOptions.Get.SearchTrackSignature => !!isTrackSignatureSearch(q))(query)
        ? `${query.track_name}${query.artist_name ? ` ${query.artist_name}` : ''}`
        : query.q ?? '';
}

export function isQueryEmpty(query: Partial<APIOptions.Get.SearchQuery & APIOptions.Get.SearchTrackSignature>): boolean {
    if (isTrackSignatureSearch(query)) {
        return !query.track_name?.trim() && !query.artist_name?.trim() && !query.album_name?.trim();
    }

    if ('q' in query) return !query.q?.trim();

    return true;
}

export function isTrackSignatureSearch(query: Partial<APIOptions.Get.SearchQuery & APIOptions.Get.SearchTrackSignature>): boolean|null {
    if ('track_name' in query || 'artist_name' in query || 'album_name' in query) return true;
    if ('q' in query) return false;
    return null;
}

export type PartialNull<T> = {
    [P in keyof T]?: T[P] | null;
};