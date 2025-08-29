import type { APIOptions, APIResponse } from '@lrclib.js/api-types';
import type { Client } from './Client.js';
import { LRC } from './LRC.js';

export class Track implements APIResponse.Get.TrackSignature {
    public id!: number;
    public trackName!: string;
    public artistName!: string;
    public albumName!: string;
    public instrumental!: boolean;
    public plainLyrics!: string;
    public syncedLyrics!: string;
    public duration!: number;

    private createdAt: Date = new Date();

    public constructor(options: APIResponse.Get.TrackSignature, public client?: Client) {
        Track._patch(this, options);
    }

    public isPlain(): this is Track & { instrumental: false; } {
        return this.instrumental === false;
    }

    public isSynced(): this is Track & { instrumental: false; } {
        return !!this.syncedLyrics;
    }

    public isInstrumental(): this is Track & { instrumental: true; } {
        return this.instrumental === true;
    }

    public parseSyncedLyrics(): LRC.ParsedLine[] {
        return LRC.parse(this.syncedLyrics);
    }

    public parseA2SyncedLyrics(): LRC.ParsedEnhancedLine[] {
        return LRC.parseEnhanced(this.syncedLyrics);
    }

    public getActiveLyrics(duration: number): (LRC.ParsedLine|LRC.ParsedEnhancedLine)[] {
        return [];
    }

    public toAPIJSON(): APIOptions.Get.TrackSignatureOptions & APIOptions.Get.TrackById {
        return {
            id: this.id,
            track_name: this.trackName,
            artist_name: this.artistName,
            album_name: this.albumName,
            duration: this.duration
        }
    }

    public toJSON(): APIResponse.Get.TrackSignature {
        return {
            id: this.id,
            trackName: this.trackName,
            artistName: this.artistName,
            albumName: this.albumName,
            duration: this.duration,
            instrumental: this.instrumental,
            plainLyrics: this.plainLyrics,
            syncedLyrics: this.syncedLyrics
        };
    }

    public static _patch(track: Track, options: APIResponse.Get.TrackSignature): Track {
        track.id = options.id;
        track.trackName = options.trackName;
        track.artistName = options.artistName;
        track.albumName = options.albumName;
        track.instrumental = options.instrumental;
        track.plainLyrics = options.plainLyrics || '';
        track.syncedLyrics = options.syncedLyrics || '';
        track.duration = options.duration;
        return track;
    }

    public static getCreatedAt(track: Track): Date {
        return track.createdAt;
    }
}