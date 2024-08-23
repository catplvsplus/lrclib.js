import type { APITrackSignatureResponse, RoutesGetIDLyricsOptions, RoutesGetSearchQueryOptions, RoutesGetTrackLyricsOptions } from '../types/API.js';
import { REST, type RESTOptions } from './REST.js';
import { Routes } from './Routes.js';
import { Track } from './Track.js';
import { Collection } from '@discordjs/collection';

export interface ClientOptions extends RESTOptions {}

export class Client {
    public rest: REST;

    public cache: Collection<string, Track> = new Collection();

    constructor(options?: ClientOptions) {
        this.rest = new REST(options);
    }

    public async search(data: RoutesGetSearchQueryOptions|RoutesGetSearchQueryOptions|string): Promise<Track[]> {
        const tracks = (await this.rest.get(Routes['/api/search'](
            typeof data === 'string'
                ? { q: data }
                : data
        ))).map(track => this._patchCache(track));

        return tracks;
    }

    public async fetchId(data: number|string|RoutesGetIDLyricsOptions): Promise<Track> {
        const track = await this.rest.get(Routes['/api/get/{id}']({
            id: Number(typeof data === 'object' ? data.id : data)
        }));

        return this._patchCache(track);
    }

    public async fetchTrack(data: RoutesGetTrackLyricsOptions & { cached?: boolean; }): Promise<Track> {
        if (data.cached !== false) {
            const track = this.cache.find(t => data.album_name === t.albumName && data.artist_name === t.artistName && data.track_name === t.trackName && data.duration === t.duration);
            if (track) return track;

            const trackData = await this.rest.get(Routes['/api/get-cached'](data));
            return this._patchCache(trackData);
        }

        const trackData = await this.rest.get(Routes['/api/get'](data));
        return this._patchCache(trackData);
    }

    private _patchCache(track: Track|APITrackSignatureResponse): Track {
        const cache = this.cache.get(track.id.toString());
        if (cache) return Track._patch(cache, track);

        const newTrack = new Track(track, this);
        this.cache.set(track.id.toString(), newTrack);
        return newTrack;
    }
}