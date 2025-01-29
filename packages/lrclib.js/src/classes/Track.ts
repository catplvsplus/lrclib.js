import type { APIOptions, APIResponse } from '../types/API.js';
import type { Client } from './Client.js';
import { Utils } from './Utils.js';

export interface TrackSyncedLyric {
    timeMs: number;
    rawTime: string;
    raw: string;
    text: string;
}

export type TrackSyncedLyrics = TrackSyncedLyric[];

export interface TrackDurationLyrics {
    lines: TrackSyncedLyric[];
    indexes: number[];
    duration: number;
}

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

    public get syncedLyricsJSON(): TrackSyncedLyrics|null {
        return this.isSynced() ? Utils.parseTrackSyncedLyricsJSON(this.syncedLyrics) : null;
    }

    public constructor(options: APIResponse.Get.TrackSignature, public client?: Client) {
        Track._patch(this, options);
    }

    public isSynced(): this is Track & { instrumental: false; syncedLyricsJSON: TrackSyncedLyrics; } {
        return !!this.syncedLyrics;
    }

    public isInstrumental(): this is Track & { instrumental: true; syncedLyricsJSON: null; } {
        return this.instrumental === true;
    }

    public isPlain(): this is Track & { instrumental: false; syncedLyricsJSON: null; } {
        return this.instrumental === false;
    }

    public getDurationLyrics(duration: number): TrackDurationLyrics{
        if (!this.isSynced()) return { lines: [], indexes: [], duration };

        const lines = this.syncedLyricsJSON.filter(lyrics => (lyrics.timeMs / 1000) <= duration);
        const indexes = lines.map(lyrics => this.syncedLyricsJSON.indexOf(lyrics));

        return { lines, indexes, duration };
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
        track.plainLyrics = options.plainLyrics;
        track.syncedLyrics = options.syncedLyrics;
        track.duration = options.duration;
        return track;
    }

    public static getCreatedAt(track: Track): Date {
        return track.createdAt;
    }
}