import type { APIResponse } from 'lrclib.js';
import { LRC } from 'lrclib.js';
import { LyricsContentType, parseBlob, type IAudioMetadata } from 'music-metadata';

export async function parseAudioMetadata(file: File): Promise<Partial<Omit<APIResponse.Get.TrackSignature, 'id'|'instrumental'>>> {
    const data = await parseBlob(file);

    const { plainLyrics, syncedLyrics } = parseMetadataLyrics(data);

    return {
        trackName: data.common.title,
        artistName: data.common.artist,
        albumName: data.common.album,
        duration: data.format.duration && Math.floor(data.format.duration),
        syncedLyrics,
        plainLyrics
    };
}

export async function parseLRCMetadata(file: File): Promise<Partial<Omit<APIResponse.Get.TrackSignature, 'id'|'instrumental'>>> {
    const syncedLyrics = await file.text();
    const data = LRC.parse(syncedLyrics);

    const metadata = data.filter(l => l.type === LRC.LineType.METADATA);
    const lyrics = data.filter(l => 'startMillisecond' in l);

    return {
        trackName: metadata.find(l => l.key === 'ti')?.value,
        artistName: metadata.filter(l => l.key === 'ar').map(l => l.value).join(', '),
        albumName: metadata.find(l => l.key === 'al')?.value,
        duration: lyrics.at(-1)?.startMillisecond,
        syncedLyrics,
        plainLyrics: LRC.toPlain(data).trim(),
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
        syncedLyrics: synced || null,
        plainLyrics: (plain?.text ?? (synced ? LRC.toPlain(LRC.parse(synced)).trim() : undefined)) || null
    }
}