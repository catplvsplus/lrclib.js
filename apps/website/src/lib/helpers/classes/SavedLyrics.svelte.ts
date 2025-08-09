import lrclib, { Track, type APIResponse } from 'lrclib.js';
import { PersistedState } from 'runed';

export class SavedLyrics {
    public liked = new PersistedState<number[]>('lrclib-offline-lyrics-liked', []);
    public saved = new PersistedState<APIResponse.Get.TrackSignature[]>('lrclib-offline-lyrics-saved', []);

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

    public clear(): this {
        this.liked.current = [];
        this.saved.current = [];
        return this;
    }
}

export const savedLyrics = new SavedLyrics();