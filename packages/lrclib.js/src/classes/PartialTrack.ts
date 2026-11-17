import type { APIOptions, APIResponse } from "@lrclib.js/api-types";
import type { Client } from './Client';
import type { Track } from './Track';

export class PartialTrack implements APIResponse.Get.PartialSearch {
    public id: number;
    public name: string;
    public trackName: string;
    public artistName: string;
    public albumName: string;
    public instrumental: boolean;
    public hasWordSync: boolean;
    public hasPlainLyrics: boolean;
    public hasSyncedLyrics: boolean;
    public hasLyricsfile: boolean;
    public duration: number;

    private _createdAt: Date = new Date();

    public constructor(options: APIResponse.Get.PartialSearch, public client?: Client) {
        this.id = options.id;
        this.name = options.name;
        this.trackName = options.trackName;
        this.artistName = options.artistName;
        this.albumName = options.albumName;
        this.instrumental = options.instrumental;
        this.hasWordSync = options.hasWordSync;
        this.hasPlainLyrics = options.hasPlainLyrics;
        this.hasSyncedLyrics = options.hasSyncedLyrics;
        this.hasLyricsfile = options.hasLyricsfile;
        this.duration = options.duration;
    }

    public async fetch(): Promise<Track> {
        if (!this.client) throw new Error('Client instance is not available.');

        return this.client.fetchTrackById(this);
    }

    public isPlain(): boolean {
        return this.hasPlainLyrics;
    }

    public isSynced(): boolean  {
        return this.hasSyncedLyrics;
    }

    public isInstrumental(): boolean {
        return this.instrumental;
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

    public toJSON(): APIResponse.Get.PartialSearch {
        return {
            id: this.id,
            name: this.name,
            trackName: this.trackName,
            artistName: this.artistName,
            albumName: this.albumName,
            instrumental: this.instrumental,
            hasWordSync: this.hasWordSync,
            hasPlainLyrics: this.hasPlainLyrics,
            hasSyncedLyrics: this.hasSyncedLyrics,
            hasLyricsfile: this.hasLyricsfile,
            duration: this.duration
        }
    }

    public static getCreatedAt(partialTrack: PartialTrack): Date {
        return partialTrack._createdAt;
    }
}