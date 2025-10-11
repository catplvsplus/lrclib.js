import lrclib, { type APIOptions } from 'lrclib.js';
import { useDebounce } from 'runed';
import { BaseSearchEngine } from './BaseSearchEngine.svelte';


export class SearchEngine extends BaseSearchEngine {
    protected _search = useDebounce(
        (query: APIOptions.Get.Search) => {

            return lrclib
                .search(query)
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

export const searchEngine = new SearchEngine();