import { type ClassValue, clsx } from "clsx";
import type { APIOptions } from 'lrclib';
import { toast } from 'svelte-sonner';
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

export function selectText(node: HTMLElement): boolean {
    if ('createTextRange' in document.body) {
        // @ts-expect-error
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
        return true;
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection?.removeAllRanges();
        selection?.addRange(range);
        return true;
    } else {
        toast.error(`Your browser doesn't support select text.`);
        return false;
    }
}