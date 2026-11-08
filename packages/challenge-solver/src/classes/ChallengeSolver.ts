import type { APIResponse } from '@lrclib.js/api-types';
import * as wasm from '$wasm/wasm.js';
import { VanillaChallengeSolver } from './VanillaChallengeSolver';

export class ChallengeSolver extends VanillaChallengeSolver {
    public static async sha256(input: string): Promise<Uint8Array> {
        return wasm.hash(input);
    }

    public static decodeHex(hex: string): Uint8Array {
        return wasm.hex2bin(hex) ?? new Uint8Array();
    }

    public static verifyNonce(result: Uint8Array, target: Uint8Array): boolean {
        return wasm.verifyNonce(result, target);
    }

    public static async solve(data: APIResponse.Post.RequestChallenge): Promise<ChallengeSolver> {
        const solver = new ChallengeSolver(data);
        await solver.solve();
        return solver;
    }
}