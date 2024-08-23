import type { TrackSyncedLyrics } from './Track.js';

export class Utils {
    private constructor() {}

    public static recordToSearchQuery(record: Record<string, any>): string {
        const entries = Object.entries(record);
        if (!entries.length) return '';

        return '?' + entries
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    }

    public static parseTrackSyncedLyricsJSON(raw: string): TrackSyncedLyrics {
        const lines: string[] = raw.split('\n').filter(Boolean);
        const lyrics: TrackSyncedLyrics = [];

        for (const line of lines) {
            const match = /^((?:\[.+?:.*?\])+)(.*)$/g.exec(line);
            const rawTime = match?.[1].trim();
            const text = match?.[2].trim();

            if (!rawTime || !text) continue;

            const [rawMin, rawSecWithDecimal] = rawTime.replace('[', '').replace(']', '').split(':');
            const [sec, ms] = rawSecWithDecimal.split('.').map(Number);
            const min = Number(rawMin);

            let timeMs: number = 0;

            if (min) timeMs += min * 60 * 1000;
            if (sec) timeMs += sec * 1000;
            if (ms) timeMs += ms;

            lyrics.push({ timeMs, rawTime, raw: line, text });
        }

        return lyrics;
    }
}