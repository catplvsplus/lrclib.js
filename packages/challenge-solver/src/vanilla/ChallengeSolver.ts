import type { APIPublishTokenData, APIResponse } from '@lrclib.js/api-types';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { subtle } from 'uncrypto';

export class ChallengeSolver extends AsyncEventEmitter<ChallengeSolver.Events> implements APIResponse.Post.RequestChallenge {
    private _nonce: number = 0;
    private _attempts: number = 0;
    private _solveStartTime: number|null = null;
    private _solveEndTime: number|null = null;
    private _solveLastUpdate: number|null = null;

    public abortController: AbortController|null = null;

    public readonly prefix: string;
    public readonly target: string;

    constructor(data: APIResponse.Post.RequestChallenge, public readonly options?: ChallengeSolver.Options) {
        super();
        this.prefix = data.prefix;
        this.target = data.target;
    }

    get nonce(): number { return this._nonce; }
    get attempts(): number { return this._attempts; }
    get token(): string { return `${this.prefix}:${this._nonce}`; }
    get solveStartTime(): number|null { return this._solveStartTime; }
    get solveEndTime(): number|null { return this._solveEndTime; }
    get solveLastUpdate(): number|null { return this._solveLastUpdate; }
    get solved(): boolean { return !!this.solveStartTime && !!this.solveEndTime; }
    get aborted(): boolean { return !!this.abortController?.signal.aborted; }

    get data(): APIPublishTokenData {
        return {
            prefix: this.prefix,
            nonce: this._nonce.toString()
        };
    }

    public async solve(): Promise<this> {
        if (this.solved) return this;

        this.abortController = new AbortController();
        this._solveStartTime = Date.now();
        this._solveEndTime = null;
        this._attempts = 0;
        this._nonce = 0;

        const target = await ChallengeSolver.decodeHex(this.target);

        while (true) {
            if (this.abortController.signal.aborted) break;

            this._attempts++;
            this._solveLastUpdate = Date.now();
            this.options?.onAttempt?.(this);
            this.emit('attempt', this);

            const input = `${this.prefix}${this._nonce}`;
            const hashed = await ChallengeSolver.sha256(input);

            if (await ChallengeSolver.verifyNonce(hashed, target)) break;

            this._nonce++;
        }

        this._solveEndTime = this._solveLastUpdate;

        if (this.abortController.signal.aborted) {
            this._solveStartTime = null;
            this._solveEndTime = null;
            this._solveLastUpdate = null;

            this.emit('abort', this);
            throw new ChallengeSolver.AbortError('Solve aborted');
        }

        this.emit('solved', this);
        return this;
    }

    public abort(): void {
        if (this.abortController) this.abortController.abort();
    }

    /**
     * @deprecated No longer needed
     */
    public static isNode(): boolean {
       return typeof process !== 'undefined' && !!process.versions && !!process.versions.node;
    }

    public static async sha256(input: string): Promise<Uint8Array> {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await subtle.digest('SHA-256', data);
        return new Uint8Array(hashBuffer);
    }

    public static async decodeHex(hex: string): Promise<Uint8Array> {
        return Uint8Array.fromHex(hex);
    }

    public static async verifyNonce(hash: Uint8Array, target: Uint8Array): Promise<boolean> {
        if (hash.length !== target.length) return false;

        for (let i = 0; i < hash.length - 1; i++) {
            if (hash[i] > target[i]) {
                return false;
            } else if (hash[i] < target[i]) {
                return true;
            }
        }

        return true;
    }

    public static async solve(data: APIResponse.Post.RequestChallenge): Promise<ChallengeSolver> {
        const solver = new ChallengeSolver(data);
        await solver.solve();
        return solver;
    }
}

export namespace ChallengeSolver {
    export class AbortError extends Error {}

    export interface Options {
        /**
         * @deprecated Use the `attempt` event instead.
         */
        onAttempt?: (solver: ChallengeSolver) => void;
    }

    export interface Events {
        attempt: [solver: ChallengeSolver];
        solved: [solver: ChallengeSolver];
        abort: [solver: ChallengeSolver];
    }
}