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
    return 'q' in query ? query.q : `${query.track_name} by ${query.artist_name}`;
}