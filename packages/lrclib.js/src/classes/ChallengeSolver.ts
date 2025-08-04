import type { APIPublishTokenData, APIResponse } from '../types/API.js';
import { createHash } from 'crypto';

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

    public solve(): APIPublishTokenData {
        this.nonce = ChallengeSolver.solveChallenge(this);

        return {
            prefix: this.prefix,
            nonce: this.nonce
        };
    }

    public static solveChallenge(data: APIResponse.Post.RequestChallenge): string {
        const target = this.decodeHex(data.target);

        let nonce = 0;

        while (true) {
            const input = `${data.prefix}${nonce}`;
            const hashed = this.sha256(input);

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
        return Uint8Array.from(Buffer.from(hex, 'hex'));
    }

    public static sha256(input: string): Uint8Array {
        const hash = createHash('sha256');
        hash.update(input);
        return Uint8Array.from(hash.digest());
    }
}