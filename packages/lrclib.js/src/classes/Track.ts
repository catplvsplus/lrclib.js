import type { APIOptions, APIResponse } from '@lrclib.js/api-types';
import type { Client } from './Client.js';
import { Lyricsfile } from './Lyricsfile.js';

export class Track implements APIResponse.Get.TrackSignature {
    public id!: number;
    public name!: string;
    public trackName!: string;
    public artistName!: string;
    public albumName!: string;
    public instrumental!: boolean;
    public plainLyrics!: string;
    public syncedLyrics!: string;
    public duration!: number;
    public lyricsfile!: string;

    private _createdAt: Date = new Date();
    private _lyricsfile: Lyricsfile|null = null;

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

    public getLyricsfile(): Lyricsfile {
        return this._lyricsfile ??= new Lyricsfile(this.lyricsfile);
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
            name: this.name,
            trackName: this.trackName,
            artistName: this.artistName,
            albumName: this.albumName,
            duration: this.duration,
            instrumental: this.instrumental,
            plainLyrics: this.plainLyrics,
            syncedLyrics: this.syncedLyrics,
            lyricsfile: this.lyricsfile
        };
    }

    public static _patch(track: Track, options: APIResponse.Get.TrackSignature): Track {
        track.id = options.id;
        track.name = options.name;
        track.trackName = options.trackName;
        track.artistName = options.artistName;
        track.albumName = options.albumName;
        track.instrumental = options.instrumental ?? !(options.plainLyrics?.trim() || options.syncedLyrics?.trim());
        track.duration = options.duration ?? 0;
        track.plainLyrics = options.plainLyrics ?? '';
        track.syncedLyrics = options.syncedLyrics ?? '';
        track.lyricsfile = options.lyricsfile ?? '';
        return track;
    }

    public static getCreatedAt(track: Track): Date {
        return track._createdAt;
    }
}