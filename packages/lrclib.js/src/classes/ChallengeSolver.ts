import type { APIPublishTokenData, APIResponse } from '../types/API.js';

export class ChallengeSolver implements APIResponse.Post.RequestChallenge {
    public prefix: string;
    public target: string;
    public nonce?: string;

    constructor(data: APIResponse.Post.RequestChallenge) {
        this.prefix = data.prefix;
        this.target = data.target;
    }

    get data(): APIPublishTokenData {
        if (!this.nonce) throw new Error('Challenge not solved');

        return {
            prefix: this.prefix,
            nonce: this.nonce
        }
    }

    get token(): string {
        if (!this.nonce) throw new Error('Challenge not solved');
        return `${this.prefix}:${this.nonce}`;
    }

    public async solve(): Promise<APIPublishTokenData> {
        this.nonce = await ChallengeSolver.solveChallenge(this);

        return {
            prefix: this.prefix,
            nonce: this.nonce
        };
    }

    public static async solveChallenge(data: APIResponse.Post.RequestChallenge): Promise<string> {
        const target = this.decodeHex(data.target);

        let nonce = 0;

        while (true) {
            const input = `${data.prefix}${nonce}`;
            const hashed = await this.sha256(input);

            if (this.verifyNonce(hashed, target)) break;

            nonce += 1;
        }

        return nonce.toString();
    }

    public static verifyNonce(result: Uint8Array, target: Uint8Array): boolean {
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

    public static decodeHex(hex: string): Uint8Array {
        return new Uint8Array(
            Array.from({ length: hex.length / 2 }, (_, i) => parseInt(hex.slice(i * 2, (i + 1) * 2), 16))
        );
    }

    public static async sha256(input: string): Promise<Uint8Array> {
        return this.isNode()
            ? ChallengeSolver.nodeSHA256(input)
            : ChallengeSolver.browserSHA256(input);
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

    export async function browserSHA256(input: string): Promise<Uint8Array> {
        const Uint8 = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', Uint8);
        return new Uint8Array(hashBuffer);
    }

    export function isNode(): boolean {
       return typeof process !== 'undefined' && !!process.versions && !!process.versions.node;
    }
}