import { QueueItem } from '@groovytune/player';
import lrclib, { type Track } from 'lrclib.js';
import { parseBlob, type IAudioMetadata } from 'music-metadata';

export class PlayerTrack extends QueueItem {
    public lyrics: Track|null = $state(null);
    public source: Blob|File|null = $state(null);
    public metadata: IAudioMetadata|null = $state(null);

    private _sourceURL: string|null = null;

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
}

export namespace PlayerTrack {
    export interface Options {
        lyrics?: Track;
        source?: Blob;
        metadata?: IAudioMetadata;
    }
}