import type { APIPublishTokenData } from '../types/API.js';
import type { TrackSyncedLyrics } from './Track.js';

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
     * Parse an API publish token
     * @param data The data to parse
     * @returns The parsed token
     */
    public static parseAPIPublishToken(data: APIPublishTokenData): string {
        return `${data.prefix}:${data.nonce}`;
    }

    /**
     * Compute the SHA-256 hash of a string
     * @param message The message to hash
     * @returns The hash
     */
    public static async sha256(message: string): Promise<Uint8Array> {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        return new Uint8Array(hashBuffer);
    }

    /**
     * Verify a nonce for API publish token
     * @param result The nonce to verify
     * @param target The target nonce
     * @returns Whether the nonce is valid
     */
    public static verifyNonce(result: Uint8Array, target: Uint8Array): boolean {
        if (result.length !== target.length) return false;

        for (let i = 0; i < result.length - 1; i++) {
            if (result[i] > target[i]) {
                return false;
            } else if (result[i] < target[i]) {
                break;
            }
        }

        return true;
    }

    /**
     * Solve an API publish token challenge
     * @param prefix The prefix of the challenge
     * @param targetHex The target hex of the challenge
     * @returns The nonce
     */
    public static async solveChallenge(prefix: string, targetHex: string): Promise<APIPublishTokenData> {
        let nonce = 0;
        let hashed: Uint8Array;
        const target = Uint8Array.from(Buffer.from(targetHex, 'hex'));

        while (true) {
            const input = `${prefix}${nonce}`;
            hashed = await this.sha256(input);

            if (this.verifyNonce(hashed, target)) {
                break;
            } else {
                nonce += 1;
            }
        }

        return { prefix, nonce: nonce.toString()};
    }
}