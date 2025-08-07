import { PersistedState, useDebounce } from 'runed';
import type { PublishTrackSchema } from '../schema';

export class PublishDraf {
    public draft = new PersistedState<Partial<PublishTrackSchema>>('lrclib-upload-draft', {});
    public status: PublishDraft.Status|null = $state(null);
    public debounceWait = $state(1000);

    get isEmpty() {
        return !this.draft.current
            || !Object.keys(this.draft.current).length
            || Object.values(this.draft.current).every(v => !v);
    };

    private _save = useDebounce(
        (data: Partial<PublishTrackSchema>) => this.set(data),
        () => this.debounceWait
    );

    public async save(data: Partial<PublishTrackSchema>): Promise<this> {
        this.status = 'saving';
        await this._save(data);
        return this;
    }

    public set(data: Partial<PublishTrackSchema>): this {
        this.draft.current = data;
        this.status = !this.isEmpty ? 'saved' : null;
        return this;
    }
}

export namespace PublishDraft {
    export type Status = 'saving'|'saved';
}

export const publishDraft = new PublishDraf();