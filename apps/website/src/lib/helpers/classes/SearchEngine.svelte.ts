import lrclib, { type APIOptions, type Track } from 'lrclib.js';
import { useDebounce } from 'runed';
import { createUseQueryParams } from 'svelte-query-params';
import z from 'zod';
import { stringifyQuery } from '../utils';

export class SearchEngine {
    public tracks: Track[] = $state([]);
    public status: SearchEngine.Status|null = $state(null);
    public debounceWait = $state(1000);

    private _search = useDebounce(
        (query: APIOptions.Get.Search) => lrclib.search(query)
            .then(tracks => {
                this.tracks = tracks;
                this.status = null;
                return tracks;
            })
            .catch(err => {
                this.tracks = [];
                this.status = null;
                throw err;
            }),
        () => this.debounceWait
    )

    public useQueryParams = createUseQueryParams({
        q: z.string().optional(),
        track_name: z.string().optional(),
        artist_name: z.string().optional(),
        album_name: z.string().optional(),
    })

    constructor() {
        this._search = this._search.bind(this);
        this.search = this.search.bind(this);
        this.clear = this.clear.bind(this);
    }

    public async search(query: APIOptions.Get.Search): Promise<Track[]> {
        this.status = 'searching';

        return this._search(query);
    }

    public clear() {
        this.tracks = [];
        this.status = null;
    }

    public fixURLQueries(options: SearchEngine.FixURLQueriesOptions) {
        let queryString = stringifyQuery(options.query);

        if (!queryString) return;

        if (options.isAdvanced) {
            options.helper.update({ track_name: queryString });
            options.helper.remove('q');
        } else {
            options.helper.update({ q: queryString });
            options.helper.remove('track_name', 'artist_name', 'album_name');
        }
    }
}

export namespace SearchEngine {
    export type Status = 'searching';

    export interface FixURLQueriesOptions {
        query: APIOptions.Get.Search;
        helper: ReturnType<SearchEngine['useQueryParams']>[1];
        isAdvanced: boolean;
    }
}

export const searchEngine = new SearchEngine();