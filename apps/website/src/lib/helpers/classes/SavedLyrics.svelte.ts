import lrclib, { Track, type APIOptions, type APIResponse } from 'lrclib.js';
import { PersistedState } from 'runed';

export class SavedLyrics {
    public liked = new PersistedState<number[]>('lrclib-offline-lyrics-liked', []);
    public saved = new PersistedState<APIResponse.Get.TrackSignature[]>('lrclib-offline-lyrics-saved', []);
    public savedLiked = $derived(this.saved.current.filter(t => this.liked.current.includes(t.id)));
    public library: (Track|number)[] = $state([]);
    public size = $derived(this.library.length ?? 0);
    public status: SavedLyrics.Status|null = $state(null);

    public like(track: number|APIResponse.Get.TrackSignature): this {
        const id = typeof track === 'number' ? track : track.id;
        if (this.liked.current.includes(id)) return this;

        this.liked.current.push(id);

        if (typeof track !== 'number') {
            this.save(track);
        }

        return this;
    }

    public unlike(track: number|APIResponse.Get.TrackSignature): this {
        const id = typeof track === 'number' ? track : track.id;
        this.liked.current = this.liked.current.filter(t => t !== id);
        return this;
    }

    public save(track: APIResponse.Get.TrackSignature): this {
        if (this.saved.current.some(t => t.id === track.id)) return this;

        this.saved.current.push(track);
        return this;
    }

    public remove(track: APIResponse.Get.TrackSignature): this {
        this.saved.current = this.saved.current.filter(t => t.id !== track.id);
        return this;
    }

    public isLiked(track: number|APIResponse.Get.TrackSignature): boolean {
        const id = typeof track === 'number' ? track : track.id;
        return this.liked.current.includes(id);
    }

    public isSaved(track: number|APIResponse.Get.TrackSignature): boolean {
        const id = typeof track === 'number' ? track : track.id;
        return this.saved.current.some(t => t.id === id);
    }

    public async fetch(id: number): Promise<Track> {
        const saved = this.saved.current.find(t => t.id === id);
        if (saved) return new Track(saved);

        return lrclib.fetchTrackById({ id });
    }

    public async search(query: APIOptions.Get.Search, offline?: boolean|SavedLyrics.FetchLibraryOptions): Promise<Track[]> {
        if (!offline) {
            const tracks = await lrclib.search(query).catch(() => null);
            if (offline === false || tracks?.length) return tracks ?? [];
        }

        const tracks = (await this.fetchLibrary(offline === true ? {} : offline))
            .filter(t => typeof t !== 'number');

        if ('track_name' in query) {
            const { track_name, artist_name, album_name } = query;

            const trackNameKeywords = SavedLyrics.splitKeywords(track_name);
            const artistNameKeywords = SavedLyrics.splitKeywords(artist_name ?? '');
            const albumNameKeywords = SavedLyrics.splitKeywords(album_name ?? '');
            const keywordLength = trackNameKeywords.length + artistNameKeywords.length + albumNameKeywords.length;

            return keywordLength
                ? tracks
                    .filter(track =>
                        trackNameKeywords.every(keyword => track.trackName.toLowerCase().includes(keyword)) &&
                        (artistNameKeywords.length ? artistNameKeywords.every(keyword => track.artistName.toLowerCase().includes(keyword)) : true) &&
                        (albumNameKeywords.length ? albumNameKeywords.every(keyword => track.albumName.toLowerCase().includes(keyword)) : true)
                    )
                    .map(t => new Track(t))
                : [];
        } else if ('q' in query) {
            const keywords = SavedLyrics.splitKeywords(query.q);

            return keywords.length
                ? tracks
                    .filter(track => keywords.every(keyword => SavedLyrics.isKeywordInTrack(track, keyword)))
                    .map(t => new Track(t))
                : [];
        }

        return [];
    }

    public async fetchLibrary(options?: SavedLyrics.FetchLibraryOptions): Promise<(Track|number)[]> {
        this.status = 'loading';

        const liked = options?.liked !== false ? this.liked.current.map(id => this.fetch(id).catch(() => id)) : [];
        const saved = options?.saved !== false ? this.saved.current.map(t => this.fetch(t.id)) : [];
        const tracks: Map<number, Track|number> = new Map();

        for (const track of await Promise.all([...liked, ...saved])) {
            const id = typeof track === 'number' ? track : track.id;
            if (!tracks.has(id)) tracks.set(id, track);

            const existing = tracks.get(id);
            if (typeof existing === 'number' && track instanceof Track) {
                tracks.set(id, track);
            }
        }

        this.status = null;

        return this.library = Array.from(tracks.values())
            .sort((a, b) => a instanceof Track && b instanceof Track ? a.trackName.localeCompare(b.trackName) : 0);
    }

    public clear(): this {
        this.liked.current = [];
        this.saved.current = [];
        return this;
    }
}

export namespace SavedLyrics {
    export type Status = 'loading';
    export interface FetchLibraryOptions {
        liked?: boolean;
        saved?: boolean;
    }

    export function splitKeywords(keywords: string): string[] {
        return keywords
            .split(/\s+/g)
            .filter(Boolean)
            .map(t => t.toLowerCase());
    }

    export function isKeywordInTrack(track: APIResponse.Get.TrackSignature, keyword: string): boolean {
        return (
            track.trackName.toLowerCase().includes(keyword) ||
            track.artistName.toLowerCase().includes(keyword) ||
            track.albumName.toLowerCase().includes(keyword)
        );
    }
}

export const savedLyrics = new SavedLyrics();