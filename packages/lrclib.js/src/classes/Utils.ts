import type { TrackDurationLyrics, TrackSyncedLyrics } from './Track.js';

export class Utils {
    private constructor() {}

    /**
     * The version of the library
     */
    public static version: string = '[VI]{{inject}}[/VI]';

    /**
     * Convert a record to a query string
     * @param record The record to convert to queries
     * @returns The query string
     */
    public static recordToQueries(record: Record<string, any>): string {
        const entries = Object.entries(record);
        if (!entries.length) return '';

        return '?' + entries
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    }

    /**
     * Parse a track synced lyrics JSON
     * @param raw The raw synced lyrics
     * @returns The parsed synced lyrics
     */
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

    /**
     * Get the active lines based on the duration
     * @param lyrics The synced lyrics
     * @param duration The duration in ms
     * @returns The active lines
     */
    public static getActiveLines(lyrics: TrackSyncedLyrics, duration: number): TrackDurationLyrics {
        const lines = lyrics.filter(lyrics => lyrics.timeMs <= duration);
        const indexes = lines.map(lrc => lyrics.indexOf(lrc));

        return {
            lines,
            indexes,
            duration,
            lastLine: lines[lines.length - 1],
            lastLineIndex: indexes[indexes.length - 1]
        };
    }

    public static isJSONEncodable<T extends any = any>(value: any): value is Utils.JSONEncodable<any> {
        return typeof value.toJSON === 'function';
    }
}

export namespace Utils {
    export interface JSONEncodable<T> {
        toJSON(): T;
    }
}