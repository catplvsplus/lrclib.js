import { type APIOptions } from 'lrclib.js';
import { useDebounce } from 'runed';
import { savedLyrics } from './SavedLyrics.svelte';
import { isQueryEmpty } from '../utils';
import { BaseSearchEngine } from './BaseSearchEngine.svelte';

export class OfflineSearchEngine extends BaseSearchEngine {
    protected _search = useDebounce(
        (query: APIOptions.Get.Search) => {
            const isEmpty = isQueryEmpty(query);

            if (isEmpty) {
                this.status = null;
                return Promise.resolve(this.tracks = []);
            }

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
        super();

        this._search = this._search.bind(this);
    }
}

export const offlineSearchEngine = new OfflineSearchEngine();