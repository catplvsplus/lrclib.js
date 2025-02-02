import { type ClassValue, clsx } from "clsx";
import type { APIOptions } from 'lrclib';
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getSearchName(options: APIOptions.Get.Search): string {
    return ('q' in options ? options.q : `${options.track_name} ${options.artist_name ? ('by ' + options.artist_name) : ''}`).trim();
}

export function isAdvancedSearchOptions(options: APIOptions.Get.Search): options is APIOptions.Get.SearchTrackSignature {
    return 'track_name' in options;
}