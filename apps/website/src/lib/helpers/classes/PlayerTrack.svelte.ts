import { LRC, type APIOptions, type APIResponse } from 'lrclib.js';
import { LyricsContentType, parseBlob, selectCover, type IAudioMetadata } from 'music-metadata';
import { formatLRCDuration } from '../metadata';
import { savedLyrics } from './SavedLyrics.svelte';

export class PlayerTrack {
    private _audioURL?: string;
    private _coverImageURL?: string;

    public id: string = Math.random().toString(36).substring(2, 15);

    public lyrics?: APIResponse.Get.TrackSignature = $state(undefined);
    public metadata?: IAudioMetadata = $state(undefined);
    public audio: File;
    public status: 'fetching'|null = $state(null);

    constructor(options: PlayerTrack.Options) {
        this.lyrics = options.lyrics;
        this.audio = options.audio;
        this.metadata = options.metadata;
    }

    public destroy() {
        console.log(`Destroying ${this.title} - ${this.artist}`);
        if (this._audioURL) {
            URL.revokeObjectURL(this._audioURL);
            this._audioURL = undefined;
        }

        if (this._coverImageURL) {
            URL.revokeObjectURL(this._coverImageURL);
            this._coverImageURL = undefined;
        }
    }

    public audioURL = $derived.by(() => this._audioURL ??= URL.createObjectURL(this.audio));

    public coverImage = $derived.by(() => (this.metadata?.common.picture && selectCover(this.metadata.common.picture)?.data) ?? null);
    public coverImageURL = $derived.by(() => this.coverImage
        ? (this._coverImageURL ??= URL.createObjectURL(new Blob([
            this.coverImage instanceof Uint8Array
                ? this.coverImage.buffer instanceof ArrayBuffer
                    ? this.coverImage.buffer
                    : new Uint8Array(this.coverImage).buffer
                : this.coverImage
        ]))) ?? null
        : null
    );

    public plainLyrics = $derived.by(() => {
        return this.lyrics?.plainLyrics
            ?? this.metadata?.common.lyrics?.find(l => l.contentType === LyricsContentType.lyrics && l.text)?.text
            ?? ((this.lyrics?.syncedLyrics ? LRC.toPlain(LRC.parse(this.lyrics.syncedLyrics)).trim() : null) || null);
    });

    public syncedLyrics = $derived.by(() => {
        return this.lyrics?.syncedLyrics
            ?? this.metadata?.common.lyrics
                ?.find(l => l.contentType === LyricsContentType.lyrics && l.syncText)?.syncText
                .map(l => `[${formatLRCDuration(l.timestamp ?? 0)}] ${l.text}`)
                .join('\n')
            ?? null;
    });

    public duration = $derived.by(() => {
        return this.lyrics?.duration || this.metadata?.format.duration;
    });

    public title = $derived.by(() => {
        return this.lyrics?.trackName || this.metadata?.common.title || this.audio.name.replace(/\.[^/.]+$/, '');
    });

    public artist = $derived.by(() => {
        return this.lyrics?.artistName || this.metadata?.common.artist;
    });

    public album = $derived.by(() => {
        return this.lyrics?.albumName || this.metadata?.common.album;
    });

    public async fetch(): Promise<this> {
        this.status = 'fetching';
        await this.fetchMetadata();
        await this.fetchLyrics();
        this.status = null;
        return this;
    }

    public async fetchMetadata(): Promise<this> {
        this.metadata ??= await parseBlob(this.audio);
        return this;
    }

    public async fetchLyrics(): Promise<this> {
        const search: APIOptions.Get.Search|null = this.metadata?.common.title
            ? {
                track_name: this.metadata.common.title,
                artist_name: this.metadata.common.artist,
                album_name: this.metadata.common.album
            }
            : null;

        if (search) {
            this.lyrics ??= await savedLyrics
                .search(search)
                .then(tracks => tracks.at(0))
                .catch(() => undefined);
        }

        return this;
    }

    public static async fromFile(options: PlayerTrack.FromFileOptions): Promise<PlayerTrack> {
        const track = new PlayerTrack({
            audio: options.file,
            metadata: options.metadata,
            lyrics: options.lyrics
        });

        if (options.fetch === true) track.fetch();

        return track;
    }
}

export namespace PlayerTrack {
    export interface Options {
        lyrics?: APIResponse.Get.TrackSignature;
        metadata?: IAudioMetadata;
        audio: File;
    }

    export interface FromFileOptions {
        file: File;
        metadata?: IAudioMetadata;
        lyrics?: APIResponse.Get.TrackSignature;
        fetch?: boolean;
    }
}