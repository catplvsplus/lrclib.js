import type { APIPublishTokenData, APIResponse } from '../types/API.js';

export class ChallengeSolver implements APIResponse.Post.RequestChallenge {
    private _nonce: number = 0;
    private _attempts: number = 0;
    private _solveStartTime: number|null = null;
    private _solveEndTime: number|null = null;
    private _solveLastUpdate: number|null = null;

    public readonly prefix: string;
    public readonly target: string;

    public onAttempt?: (solver: ChallengeSolver) => void;

    constructor(data: APIResponse.Post.RequestChallenge) {
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

    get data(): APIPublishTokenData {
        return {
            prefix: this.prefix,
            nonce: this._nonce.toString()
        };
    }

    public async solve(): Promise<APIPublishTokenData> {
        if (this.solved) return this.data;

        this._solveStartTime = Date.now();
        this._solveEndTime = null;
        this._attempts = 0;
        this._nonce = 0;

        const target = ChallengeSolver.decodeHex(this.target);

        while (true) {
            this._attempts++;
            this._solveLastUpdate = Date.now();
            this.onAttempt?.(this);

            const input = `${this.prefix}${this._nonce}`;
            const hashed = await ChallengeSolver.sha256(input);

            if (ChallengeSolver.verifyNonce(hashed, target)) break;

            this._nonce++;
        }

        this._solveEndTime = this._solveLastUpdate;

        return this.data;
    }
}

export namespace ChallengeSolver {
    let nodeCrypto: typeof import('node:crypto')|null = null;

    export async function resolveNodeCrypto(): Promise<typeof import('node:crypto')> {
        return nodeCrypto ??= await import('node:crypto');
    }

    export async function nodeSHA256(input: string): Promise<Uint8Array> {
        const crypto = await resolveNodeCrypto();
        const hash = crypto.createHash('sha256');
        hash.update(input);
        return Uint8Array.from(hash.digest());
    }

    export async function webSHA256(input: string): Promise<Uint8Array> {
        const Uint8 = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', Uint8);
        return new Uint8Array(hashBuffer);
    }

    export function isNode(): boolean {
       return typeof process !== 'undefined' && !!process.versions && !!process.versions.node;
    }

    export async function sha256(input: string, useNode?: boolean): Promise<Uint8Array> {
        return (useNode ?? ChallengeSolver.isNode())
            ? ChallengeSolver.nodeSHA256(input)
            : ChallengeSolver.webSHA256(input);
    }

    export function decodeHex(hex: string): Uint8Array {
        return new Uint8Array(
            Array.from({ length: hex.length / 2 }, (_, i) => parseInt(hex.slice(i * 2, (i + 1) * 2), 16))
        );
    }

    export function verifyNonce(result: Uint8Array, target: Uint8Array): boolean {
        if (result.length !== target.length) return false;

        for (let i = 0; i < result.length - 1; i++) {
            if (result[i] > target[i]) {
                return false;
            } else if (result[i] < target[i]) {
                break;
            }
        }

        return true;
    }

    export async function solve(data: APIResponse.Post.RequestChallenge): Promise<ChallengeSolver> {
        const solver = new ChallengeSolver(data);
        await solver.solve();
        return solver;
    }
}