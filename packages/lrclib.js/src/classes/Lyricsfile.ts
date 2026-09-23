import { parse } from 'yaml';

export class Lyricsfile implements Lyricsfile.Data {
    public version: string;
    public metadata: Lyricsfile.Metadata;
    public lines?: Lyricsfile.SyncedLine[];
    public plain?: string;

    public constructor(data: Lyricsfile.Data|string) {
        data = typeof data === 'string' ? Lyricsfile.parse(data) : data;

        this.version = data.version;
        this.metadata = data.metadata;
        this.lines = data.lines;
        this.plain = data.plain;
    }

    /**
     * Get the lyric lines that are currently active based on the provided timestamp.
     * @param currentTime The current time in milliseconds.
     * @returns The timestamp data, including history, current, and future lines.
     */
    public getTimestampLyrics(currentTime: number): Lyricsfile.TimestampLines {
        const data: Lyricsfile.TimestampLines = {
            history: [],
            current: [],
            future: []
        };

        if (!this.lines) return data;

        for (let i = 0; i < this.lines.length; i++) {
            const line: Lyricsfile.SyncedLine = this.lines[i];
            const next: Lyricsfile.SyncedLine|undefined = this.lines[i + 1];

            const lineStart = line.start_ms;
            const lineEnd = line.end_ms ?? (next?.start_ms ?? this.metadata.duration_ms ?? Number.MAX_SAFE_INTEGER);

            if (currentTime > lineEnd) {
                data.history.push(line);
                continue;
            } else if (currentTime < lineStart) {
                data.future.push(line);
                continue;
            } else if (!line.words?.length) {
                data.current.push(line);
                continue;
            }

            const words: Lyricsfile.SyncedWord[] = [];

            for (let j = 0; j < line.words.length; j++) {
                const word = line.words[j];

                const wordStart = word.start_ms;

                if (currentTime >= wordStart) {
                    words.push(word);
                }
            }

            data.current.push({
                ...line,
                words
            });
        }

        return data;
    }

    public toJSON(): Lyricsfile.Data {
        return {
            version: this.version,
            metadata: this.metadata,
            lines: this.lines,
            plain: this.plain
        };
    }

    public static parse(raw: string): Lyricsfile.Data {
        const data = parse(raw);

        if (typeof data !== 'object' || data === null) {
            throw new TypeError('Invalid lyricsfile data: not an object');
        }

        if (!('version' in data) || typeof data.version !== 'string') {
            throw new TypeError('Invalid lyricsfile data: missing or invalid version');
        }

        if (!('metadata' in data) || typeof data.metadata !== 'object' || data.metadata === null) {
            throw new TypeError('Invalid lyricsfile data: missing or invalid metadata');
        }

        if (!('title' in data.metadata) || typeof data.metadata.title !== 'string') {
            throw new TypeError('Invalid lyricsfile data: missing or invalid metadata.title');
        }

        if (!('artist' in data.metadata) || typeof data.metadata.artist !== 'string') {
            throw new TypeError('Invalid lyricsfile data: missing or invalid metadata.artist');
        }

        if ((!('lines' in data) || !Array.isArray(data.lines)) && (!('plain' in data) || typeof data.plain !== 'string')) {
            throw new TypeError('Invalid lyricsfile data: missing or invalid lines or plain');
        }

        return data;
    }
}

export namespace Lyricsfile {
    export interface Data {
        /**
         * Lyricsfile format version.
         */
        version: string;
        /**
         * Information about the track and lyrics.
         */
        metadata: Metadata;
        /**
         * Synchronized lyric lines.
         */
        lines?: SyncedLine[];
        /**
         * Unsynchronized lyrics with preserved line breaks.
         */
        plain?: string;
    }

    export interface Metadata {
        /**
         * Track title.
         */
        title: string;
        /**
         * Primary artist name.
         */
        artist: string;
        /**
         * Album name.
         */
        album?: string;
        /**
         * Track duration in milliseconds.
         */
        duration_ms?: number;
        /**
         * Global timing offset; exact application is unresolved.
         */
        offset_ms?: number;
        /**
         * Primary lyrics language as an ISO 639-1 code.
         */
        language?: string;
        /**
         * Whether the track has no vocal lyrics.
         * @default false
         */
        instrumental?: boolean;
    }

    export interface SyncedLine {
        /**
         * Complete text of the line.
         */
        text: string;
        /**
         * Start time in milliseconds.
         */
        start_ms: number;
        /**
         * End time in milliseconds.
         */
        end_ms?: number;
        /**
         * Word- or segment-level synchronization.
         */
        words?: SyncedWord[];
    }

    export interface SyncedWord {
        /**
         * Text of the word or segment, including relevant whitespace.
         */
        text: string;
        /**
         * Start time in milliseconds.
         */
        start_ms: number;
        /**
         * End time in milliseconds.
         */
        end_ms?: number;
    }

    export interface TimestampLines {
        history: SyncedLine[];
        current: SyncedLine[];
        future: SyncedLine[];
    }
}