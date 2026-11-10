import Solver from '#lib/helpers/challenge-solver.ts?worker';
import { resolve } from '$app/paths';
import type { PublishSchema } from '../schemas/publish';
import lrclib from 'lrclib.js';

export class LyricsPublisher {
    public isPublishing = $derived(false);

    private _publishData: PublishSchema|null = null;
    private _publishStartTime: number|null = $state(null);
    private _abortController: AbortController|null = null;
    private _publishPromise: Promise<void>|null = null;

    public get publishData(): PublishSchema|null { return this._publishData; }
    public get publishStartTime(): number|null { return this._publishStartTime; }
    public get publishPromise(): Promise<void>|null { return this._publishPromise; }

    public publish(data: PublishSchema): Promise<void> {
        this.abort();

        this._publishData = data;
        this._publishStartTime = Date.now();
        this._abortController = new AbortController();
        this.isPublishing = true;

        return this._publishPromise = this
            ._publish(data)
            .finally(() => {
                this._publishData = null;
                this._publishStartTime = null;
                this._abortController = null;
                this._publishPromise = null;
                this.isPublishing = false;
            });
    }

    public abort(): void {
        this._abortController?.abort();
        this._publishPromise = null;
        this.isPublishing = false;
    }

    private async _publish(data: PublishSchema, options?: LyricsPublisher.PublishOptions): Promise<void> {
        const signal = this._abortController?.signal;
        const challenge = await lrclib.requestChallenge({ signal });
        const solver = new Solver({ name: 'Challenge Solver' });

        const token: string = await new Promise((resolve, reject) => {
            signal?.addEventListener('abort', () => {
                solver.terminate();
                reject(new Error('Publish aborted'));
            });

            solver.addEventListener('error', error => {
                reject(error.error);
            });

            solver.addEventListener('message', (event) => {
                const { type, data } = event.data;

                switch (type) {
                    case 'ready':
                        solver.postMessage({
                            type: 'solve',
                            data: { quick: options?.quick ?? true }
                        });
                        break;
                    case 'result':
                        resolve(`${challenge.prefix}:${data.nonce}`);
                        solver.terminate();
                        break;
                }
            });

            solver.postMessage({
                type: 'start',
                data: {
                    prefix: challenge.prefix,
                    target: challenge.target,
                }
            });
        });

        const res = await fetch(resolve('/(app)/publish'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Publish-Token': token,
                'X-Publish-Target': challenge.target,
            },
            body: JSON.stringify(data),
            signal
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to publish track (${res.status}): ${errorText}`);
        }
    }
}

export namespace LyricsPublisher {
    export interface PublishOptions {
        quick?: boolean;
    }
}