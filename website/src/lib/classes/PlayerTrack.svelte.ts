import { QueueItem } from '@groovytune/player';
import lrclib, { type Track } from 'lrclib.js';
import { parseBlob, selectCover, type IAudioMetadata } from 'music-metadata';

export class PlayerTrack extends QueueItem {
    public lyrics: Track|null = null;
    public source: Blob|File|null = null;
    public metadata: IAudioMetadata|null = null;

    public coverLoadError = false;

    private _sourceURL: string|null = null;
    private _imageURL: string|null = null;

    public get title(): string {
        return this.metadata?.common.title ?? this.lyrics?.trackName ?? (this.source && 'name' in this.source ? this.source.name : 'Untitled');
    }

    public get artist(): string {
        return this.metadata?.common.artist ?? this.lyrics?.artistName ?? 'Unknown Artist';
    }

    public constructor(options?: PlayerTrack.Options) {
        super();

        this.lyrics = options?.lyrics ?? null;
        this.source = options?.source ?? null;
    }

    public async getMetadata(): Promise<IAudioMetadata> {
        if (!this.source) {
            throw new Error('No source available');
        }

        return this.metadata ??= await parseBlob(this.source);
    }

    public async getImageURL(): Promise<string|null> {
        if (!this.source) {
            throw new Error('No source available');
        }

        if (this._imageURL) {
            return this._imageURL;
        }

        const metadata = await this.getMetadata();
        const picture = selectCover(metadata.common.picture);

        if (!picture) {
            return null;
        }

        const data = picture.data.buffer;
        const blob = new Blob([data as BlobPart], { type: picture.format });
        return this._imageURL = URL.createObjectURL(blob);
    }

    public async getLyrics(): Promise<Track|null> {
        if (!this.source) {
            throw new Error('No source available');
        }

        const metadata = await this.getMetadata();

        return this.lyrics ??= (await lrclib.search({
            track_name: metadata.common.title ?? ('name' in this.source ? this.source.name : ''),
            artist_name: metadata.common.artist,
            album_name: metadata.common.album
        })).at(0) ?? null;
    }

    public async getSourceURL(): Promise<string> {
        if (!this.source) {
            throw new Error('No source available');
        }

        return this._sourceURL ??= URL.createObjectURL(this.source);
    }

    public dispose(): void {
        if (this._sourceURL) {
            URL.revokeObjectURL(this._sourceURL);
            this._sourceURL = null;
        }

        if (this._imageURL) {
            URL.revokeObjectURL(this._imageURL);
            this._imageURL = null;
        }
    }

    [Symbol.dispose](): void {
        this.dispose();
    }
}

export namespace PlayerTrack {
    export interface Options {
        lyrics?: Track;
        source?: Blob;
        metadata?: IAudioMetadata;
    }
}