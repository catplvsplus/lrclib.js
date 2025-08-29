import lrclib, { type APIOptions, type Track } from 'lrclib.js';
import { useDebounce } from 'runed';


export class SearchEngine {
    public tracks: Track[] = $state([]);
    public status: SearchEngine.Status|null = $state(null);
    public debounceWait = $state(1000);

    private _search = useDebounce(
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

export namespace SearchEngine {
    export type Status = 'searching';
}

export const searchEngine = new SearchEngine();