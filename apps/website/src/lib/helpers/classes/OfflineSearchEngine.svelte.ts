import { type APIOptions, type Track } from 'lrclib.js';
import { useDebounce } from 'runed';
import { savedLyrics } from './SavedLyrics.svelte';

export class OfflineSearchEngine {
    public tracks: Track[] = $state([]);
    public status: OfflineSearchEngine.Status|null = $state(null);
    public debounceWait = $state(1000);

    private _search = useDebounce(
        (query: APIOptions.Get.Search) => {
            return savedLyrics
                .search(query, true)
                .then(tracks => {
                    this.tracks = tracks;
                    this.status = null;
                    return tracks;
                })
                .catch(err => {
                    this.tracks = [];
                    this.status = null;
                    throw err;
                })
        },
        () => this.debounceWait
    )

    constructor() {
        this._search = this._search.bind(this);
        this.search = this.search.bind(this);
        this.clear = this.clear.bind(this);
    }

    public async search(query: APIOptions.Get.Search|null): Promise<Track[]> {
        this.status = 'searching';

        return this._search(query ?? { q: '' });
    }

    public clear() {
        this.tracks = [];
        this.status = null;
    }
}

export namespace OfflineSearchEngine {
    export type Status = 'searching';
}

export const offlineSearchEngine = new OfflineSearchEngine();