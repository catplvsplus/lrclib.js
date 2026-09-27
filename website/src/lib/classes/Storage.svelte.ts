import { IndexedDB, type IndexedDBSchema } from '@catplvsplus/idb';
import type { APIResponse } from 'lrclib.js';
import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

export class PersistentStorage {
    public idb: IndexedDB<PersistentStorage.Schema>|null = null;
    public supported: boolean = $state(false);

    public likes = new SvelteMap<number, boolean>();

    public async init() {
        if (this.idb) return;

        this.supported = await IndexedDB.persist();
        this.idb = await IndexedDB.open<PersistentStorage.Schema>({
            name: 'lrclib.js',
            version: 1,
            stores: [
                {
                    name: 'tracks',
                    keyPath: 'id'
                },
                {
                    name: 'likes',
                    keyPath: 'id'
                }
            ]
        });
    }

    public isSupported(): this is PersistentStorage & { idb: IndexedDB<PersistentStorage.Schema>; } {
        return this.supported;
    }

    public async setTrackLike(id: number, value?: boolean): Promise<boolean> {
        if (!this.isSupported()) return false;

        const like = value ? !value : await this.getTrackLike(id);

        if (like) {
            await this.idb.delete('likes', id);
            this.likes.delete(id);
            return false;
        } else {
            await this.idb.put('likes', { id });
            this.likes.set(id, true);
            return true;
        }
    }

    public async getTrackLike(id: number): Promise<boolean> {
        if (!this.isSupported()) return false;

        const liked = await this.idb.get('likes', id).then((like) => !!like);

        if (liked) {
            this.likes.set(id, liked);
        }

        return liked;
    }
}

export namespace PersistentStorage {
    export interface Schema extends IndexedDBSchema {
        tracks: APIResponse.Get.TrackSignature;
        likes: Pick<APIResponse.Get.TrackSignature, 'id'>;
    }

    export const contextKey = Symbol('PersistentStorage');

    export function get(): PersistentStorage {
        return getContext(contextKey);
    }

    export function set(storage: PersistentStorage): PersistentStorage {
        setContext(contextKey, storage);
        return storage;
    }
}

export default PersistentStorage;