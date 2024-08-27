import type { APITrackSignatureResponse } from '../types/API.js';
import type { Client } from './Client.js';
import { Utils } from './Utils.js';

export interface TrackSyncedLyric {
    timeMs: number;
    rawTime: string;
    raw: string;
    text: string;
}

export type TrackSyncedLyrics = TrackSyncedLyric[];

export class Track implements APITrackSignatureResponse {
    public id: number;
    public trackName: string;
    public artistName: string;
    public albumName: string;
    public duration: number;
    public instrumental: boolean;
    public plainLyrics: string;
    public syncedLyrics: string;

    get isSynced(): boolean {
        return !!this.syncedLyrics;
    }

    get isPlain(): boolean {
        return !!this.plainLyrics;
    }

    get syncedLyricsJSON(): TrackSyncedLyrics {
        return this.isSynced ? Utils.parseTrackSyncedLyricsJSON(this.syncedLyrics) : [];
    }

    constructor(track: APITrackSignatureResponse, public readonly client: Client) {
        this.id = track.id;
        this.trackName = track.trackName;
        this.artistName = track.artistName;
        this.albumName = track.albumName;
        this.duration = track.duration;
        this.instrumental = track.instrumental;
        this.plainLyrics = track.plainLyrics;
        this.syncedLyrics = track.syncedLyrics;
    }

    public toJSON(): APITrackSignatureResponse {
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

    public static _patch(track: Track, data: Track|APITrackSignatureResponse): Track {
        track.id = data.id;
        track.trackName = data.trackName;
        track.artistName = data.artistName;
        track.albumName = data.albumName;
        track.duration = data.duration;
        track.instrumental = data.instrumental;
        track.plainLyrics = data.plainLyrics;
        track.syncedLyrics = data.syncedLyrics;
        return track;
    }
}