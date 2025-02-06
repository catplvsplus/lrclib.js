import { type ClassValue, clsx } from "clsx";
import type { APIOptions, Track } from 'lrclib';
import { parseBlob, selectCover, type IPicture } from 'music-metadata';
import { toast } from 'svelte-sonner';
import { twMerge } from "tailwind-merge";
import { spotifyAPI } from './constants';
import { base } from '$app/paths';
import type { IAudioMetadata } from './types';

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

export function copyText(options: { text?: string; container?: HTMLElement; selectRequired?: boolean; }) {
    const text = options.text ?? options.container?.textContent ?? '';
    const selected = options.container ? selectText(options.container) : false;
    if (options.selectRequired && !selected) return false;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        document.execCommand('copy');
    }

    return true;
}

export function getMetadataCoverURL(covers: IPicture[]): string|null {
    const cover = selectCover(covers);
    if (!cover) return null;

    const data = new Blob([cover.data], { type: cover.format });
    return URL.createObjectURL(data);
}

export async function getAudioMetadata(blob: Blob|File, track: Track, fetchSpotify: boolean = true): Promise<IAudioMetadata> {
    const fileData = await parseBlob(blob);

    let cover = fileData.common.picture?.length ? getMetadataCoverURL(fileData.common.picture) : null;
    let title = fileData.common.title ?? null;
    let artist = fileData.common.artist ?? null;
    let album = fileData.common.album ?? null;

    console.log({ cover, title, artist, album });

    if (fetchSpotify && (!cover || !title || !artist || !album)) {
        const data = await spotifyAPI.searchTracks(`${title ?? track.trackName} ${artist ?? track.artistName}`, {
            limit: 1
        })
        .then(res => res.tracks.items[0])
        .catch(() => null);

        if (data) {
            cover ??= data.album.images.length ? data.album.images[0].url : null;
            title ??= data.name;
            artist ??= data.artists.join(', ');
            album ??= data.album.name;
        }
    }

    cover ??= `${base}/audio.png`;
    title ??= track.trackName;
    artist ??= track.artistName;
    album ??= track.albumName;

    return { cover, title, artist, album };
}

export function getTrackDefaultMetadata(track: Track): IAudioMetadata {
    return {
        cover: `${base}/audio.png`,
        title: track.trackName,
        artist: track.artistName,
        album: track.albumName
    }
}