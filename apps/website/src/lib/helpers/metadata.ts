import type { APIResponse } from 'lrclib.js';
import { LyricsContentType, parseBlob } from 'music-metadata';

export async function parseAudioMetadata(file: File): Promise<Partial<APIResponse.Get.TrackSignature>> {
    const data = await parseBlob(file);

    const firstPlain = data.common.lyrics?.find(l => l.contentType === LyricsContentType.lyrics && l.text);
    const firstSynced = data.common.lyrics?.find(l => l.contentType === LyricsContentType.lyrics && l.syncText);

    return {
        trackName: data.common.title,
        artistName: data.common.artist,
        albumName: data.common.album,
        duration: data.format.duration,
        plainLyrics: firstPlain?.text,
        syncedLyrics: firstSynced?.syncText.map(l => `${l.timestamp}${l.text}`).join('\n')
    };
}

export function formatLRC(lyrics: { text: string; timestamp: number; }[]): string {
    return lyrics.map(l => `[${l.timestamp}]${l.text}`).join('\n');
}