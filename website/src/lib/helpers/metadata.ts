import { LRCParser } from '@braccato/parsers';
import type { APIResponse } from 'lrclib.js';
import { LyricsContentType, parseBlob, type IAudioMetadata } from 'music-metadata';
import { stringifyLyrics } from './utils';

export async function parseAudioMetadata(file: File): Promise<Partial<Omit<APIResponse.Get.TrackSignature, 'id'|'instrumental'>>> {
    const data = await parseBlob(file);

    const { plainLyrics, syncedLyrics } = parseMetadataLyrics(data);

    return {
        name: data.common.title,
        trackName: data.common.title,
        artistName: data.common.artist,
        albumName: data.common.album,
        duration: data.format.duration && Math.floor(data.format.duration),
        syncedLyrics,
        plainLyrics
    };
}

export function formatLRCDuration(duration: number): string {
    const [milliseconds, seconds, minutes] = [
        Math.floor(duration % 1000),
        Math.floor(duration / 1000) % 60,
        Math.floor(duration / 60000)
    ].map(n => String(n).padStart(2, '0'));

    return `${minutes}:${seconds}.${milliseconds}`;
}

export function parseMetadataLyrics(metadata: IAudioMetadata): Record<'plainLyrics'|'syncedLyrics', string|null> {
    const plain = metadata.common.lyrics?.find(l => l.contentType === LyricsContentType.lyrics && l.text);
    const firstSynced = metadata.common.lyrics?.find(l => l.contentType === LyricsContentType.lyrics && l.syncText);

    const synced = firstSynced?.syncText.map(l => `[${formatLRCDuration(l.timestamp ?? 0)}] ${l.text}`).join('\n');

    return {
        syncedLyrics: synced && LRCParser.detect(synced) ? synced : null,
        plainLyrics: (plain?.text ?? (synced && LRCParser.detect(synced) ? stringifyLyrics(LRCParser.parse(synced)) : undefined)) || null
    }
}