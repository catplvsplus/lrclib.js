import type { APIOptions, Track } from 'lrclib.js';
import { isQueryEmpty } from '../utils';
import { useDebounce } from 'runed';

export abstract class BaseSearchEngine {
    public tracks: Track[] = $state([]);
    public status: BaseSearchEngine.Status|null = $state(null);
    public debounceWait = $state(500);

    constructor() {
        this.search = this.search.bind(this);
        this.clear = this.clear.bind(this);
    }

    protected abstract _search: ReturnType<typeof useDebounce<[query: APIOptions.Get.Search], Promise<Track[]>>>;

    public async search(query: APIOptions.Get.Search|null): Promise<Track[]> {
        this.status = 'searching';

        const isEmpty = query && this.checkEmpty(query);
        if (isEmpty) return isEmpty;

        return this._search(query ?? { q: '' });
    }

    public checkEmpty(query: APIOptions.Get.Search): Track[]|null {
        if (isQueryEmpty(query)) {
            this.status = null;
            return this.tracks = [];
        }

        return null;
    }

    public clear() {
        this.tracks = [];
        this.status = null;
    }
}

export namespace BaseSearchEngine {
    export type Status = 'searching';
}