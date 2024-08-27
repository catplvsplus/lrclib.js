import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import type { TrackSyncedLyrics } from 'lrclib';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export function flyAndScale(node: Element, params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }): TransitionConfig {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function parseSearchParams(search: string): Record<string, string> {
    const params = search.substring(1).split('&');
    const record: Record<string, string> = {};

    for (const param of params) {
        const [key, rawValue] = param.split('=');
        record[key] = decodeURIComponent(rawValue);
    }

    return record;
}

export function selectText(node: HTMLElement) {
    if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection?.removeAllRanges();
        selection?.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

export function getCurrentTimeLineIndex(currentTime: number, syncedLyrics: TrackSyncedLyrics): number|undefined {
	const index = syncedLyrics.findIndex(lyrics => (lyrics.timeMs / 1000) >= currentTime);
	return index > 0 ? index - 1 : index;
}