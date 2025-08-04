import { Collection } from '@discordjs/collection';
import { Track } from './Track.js';
import { REST, type RESTOptions } from './REST.js';
import type { APIOptions, APIPublishTokenData, APIResponse } from '../types/API.js';
import { Routes } from './Routes.js';
import { Utils } from './Utils.js';

export interface ClientOptions {
    rest?: RESTOptions|REST;
    cache?: Collection<number, Track>;
    cacheMaxAge?: number;
}

export class Client implements ClientOptions {
    public rest: REST = new REST();
    public cache: Collection<number, Track> = new Collection();
    public cacheMaxAge: number = 86400000;

    private cacheSweeper?: NodeJS.Timeout;

    public constructor(options?: ClientOptions) {
        if (options?.rest) this.rest = options.rest instanceof REST ? options.rest : new REST(options.rest);
        if (options?.cache) this.cache = options.cache;

        this.createCacheSweeper(options?.cacheMaxAge);
    }

    /**
     * Publish a track to the API
     * @param track The track to publish
     * @param token The API publish token
     */
    public async publishTrack(track: APIOptions.Post.Publish|Utils.JSONEncodable<APIOptions.Post.Publish>, token: string|APIPublishTokenData): Promise<void> {
        await this.rest.post(Routes['/api/publish'](), {
            json: Utils.isJSONEncodable(track) ? track.toJSON() : track,
            headers: {
                'X-Publish-Token': typeof token === 'string' ? token : `${token.prefix}:${token.nonce}`
            }
        });
    }

    /**
     * Request a challenge from the API for publishing
     */
    public async requestChallenge(): Promise<APIResponse.Post.RequestChallenge> {
        return this.rest.post(Routes['/api/request-challenge']());
    }

    /**
     * Search for tracks
     * @param search Search query or options
     * @param cache Whether to cache the results
     * @returns The search results
     */
    public async search(search: string|APIOptions.Get.Search|Utils.JSONEncodable<APIOptions.Get.Search>, cache: boolean = true): Promise<Track[]> {
        const query = Utils.isJSONEncodable(search) ? search.toJSON() : search;
        const tracks = await this.rest.get(Routes['/api/search'](
            typeof query === 'string' ? { q: query } : query
        )).then(t => cache ? this._patchCache(t) : t.map(t => new Track(t)));

        return tracks;
    }

    /**
     * Get a track by its ID
     * @param id The track ID
     * @param cache Whether to cache the track
     * @returns The track
     * @throws Errors if the track is not found
     */
    public async fetchTrackById(id: number|APIOptions.Get.TrackById, cache: boolean = true): Promise<Track> {
        id = typeof id === 'number' ? id : id.id;

        if (cache) {
            const track = this.cache.get(id);
            if (track) return track;
        }

        return this.rest.get(Routes['/api/get/{id}']({ id })).then(t => cache ? this._patchCache([t])[0] : new Track(t, this));
    }

    /**
     * Get a track by its signature data
     * @param data The track signature data
     * @param cache Whether to cache the track
     * @returns The track
     * @throws Errors if the track is not found
     */
    public async fetchTrack(data: APIOptions.Get.TrackSignatureOptions|Utils.JSONEncodable<APIOptions.Get.TrackSignatureOptions>, cache: boolean = true): Promise<Track> {
        data = Utils.isJSONEncodable(data) ? data.toJSON() : data;

        if (cache) {
            const track = this.cache.find(t => data.track_name === t.trackName && data.artist_name === t.artistName && data.album_name === t.albumName && (!data.duration || data.duration === t.duration));
            if (track) return track;
        }

        return this.rest.get(Routes['/api/get'](data)).then(t => cache ? this._patchCache([t])[0] : new Track(t, this));
    }

    /**
     * Create a cache sweeper
     * @param maxAge The maximum age of the cache
     */
    public createCacheSweeper(maxAge?: number): void {
        if (maxAge) this.cacheMaxAge = maxAge;

        if (this.cacheSweeper) clearInterval(this.cacheSweeper);
        if (this.cacheMaxAge === Infinity || this.cacheMaxAge <= 0) return;

        this.cacheSweeper = setInterval(() => this.cache.sweep(t => Date.now() - Track.getCreatedAt(t).getTime() > this.cacheMaxAge), 60000);
    }

    private _patchCache(data: (Track|APIResponse.Get.TrackSignature)[]): Track[] {
        return data.map(t => {
            let track = this.cache.get(t.id);

            if (!track) {
                this.cache.set(t.id, track = t instanceof Track ? t : new Track(t));
            } else {
                Track._patch(track, t);
            }

            return track;
        });
    }
}