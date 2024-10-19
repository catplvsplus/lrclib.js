import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import type { APITrackSignatureResponse, TrackSyncedLyrics } from 'lrclib';
import { ID3Writer } from 'browser-id3-writer';

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
	const line = syncedLyrics.filter(lyrics => (lyrics.timeMs / 1000) <= currentTime);
    const index = syncedLyrics.findIndex(lyrics => line[line.length - 1] === lyrics);
    return index >= 0 ? index : undefined;
}

export function isID3WriteSupported(blob: Blob): boolean {
    return blob.type === 'audio/mpeg';
}

export function getAdlibs(raw: string): { adlibs: string[]; startAdlibs: string[]; endAdlibs: string[]; line: string; } {
    const adlibs: string[] = [];
    const startAdlibs: string[] = [];
    const endAdlibs: string[] = [];

    const lines = raw.split('\n');

    let i = 0;
    let newLine: string = '';

    for (const line of lines) {
        if (line.startsWith('(') && line.endsWith(')')) {
            adlibs.push(line);
            i++;

            if (newLine) {
                endAdlibs.push(line);
            } else {
                startAdlibs.push(line);
            }

            continue;
        }

        const tokens = line.split(/\s+/g);

        let adlibType: 'start'|'end' = 'start';
        let adlib: string[] = [];
        let lineTokens: string[] = [];

        for (const token of tokens) {
            if (token.startsWith('(')) {
                if (lineTokens.length) adlibType = 'end';
                adlib = [token];
                continue;
            }

            if (token.endsWith(')') && adlib) {
                adlib.push(token);
                if (adlibType === 'start') {
                    startAdlibs.push(adlib.join(' '));
                } else {
                    endAdlibs.push(adlib.join(' '));
                }
                continue;
            }

            lineTokens.push(token);
        }

        newLine = lineTokens.join(' ');
    }

    endAdlibs.reverse();

    return {
        line: newLine,
        adlibs,
        startAdlibs,
        endAdlibs
    };
}

export interface WriteID3TagsOptions {
    blob: Blob;
    track: Pick<APITrackSignatureResponse, 'artistName'|'trackName'>;
    lyrics: TrackSyncedLyrics|string;
    cover?: Uint8Array;
}

export async function writeID3Tags(options: WriteID3TagsOptions): Promise<ArrayBuffer> {
    const id3 = new ID3Writer(await options.blob.arrayBuffer());

    if (typeof options.lyrics !== 'string') {
        id3.setFrame('SYLT', {
            type: 1,
            timestampFormat: 2,
            text: options.lyrics.map(l => [l.text, l.timeMs]),
            language: 'eng',
            description: options.track.trackName
        });

        id3.setFrame('USLT', {
            lyrics: options.lyrics.map(l => l.raw).join('\n'),
            description: options.track.trackName,
            language: 'eng',
        });
    } else {
        id3.setFrame('USLT', {
            lyrics: options.lyrics,
            description: options.track.trackName,
            language: 'eng',
        });
    }

    if (options.cover) {
        id3.setFrame('APIC', {
            type: 3,
            data: options.cover,
            description: options.track.trackName,
        });
    }

    return id3.addTag();
}

export function getBlurAmount(currentIndex: number, activeIndex: number): string {
    const indexDistance = activeIndex - currentIndex;

    let amount: number = 0;

    switch (indexDistance) {
        case 0:
            amount = 0;
            break;
        case 1:
        case -1:
            amount = 1;
            break;
        case 2:
        case -2:
            amount = 2;
            break;
        default:
            amount = 3;
            break;
    }

    return `filter: blur(${amount}px);`;
}