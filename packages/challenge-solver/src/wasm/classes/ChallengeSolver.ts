import { ChallengeSolver as VanillaChallengeSolver } from '../../vanilla/ChallengeSolver.js';
import type { APIResponse } from '@lrclib.js/api-types';
import * as wasm from '$wasm/wasm.js';

export type WASMExports = Awaited<ReturnType<typeof wasm.instantiate>>;
export type WASMEnv = {};

export class ChallengeSolver extends VanillaChallengeSolver {
    private static _wasm: WASMExports|null = null;

    public static get isNodeOrBun() {
        return typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    }

    public constructor(data: APIResponse.Post.RequestChallenge, public readonly options?: VanillaChallengeSolver.Options) {
        super(data, options);

        ChallengeSolver.getWASM();
    }

    public static async getWASM(): Promise<WASMExports> {
        return this._wasm ??= await ChallengeSolver.instantiate(await ChallengeSolver.compile());
    }

    public static async sha256(input: string): Promise<Uint8Array> {
        return (await ChallengeSolver.getWASM()).hash(input);
    }

    public static async decodeHex(hex: string): Promise<Uint8Array> {
        return (await ChallengeSolver.getWASM()).hex2bin(hex) ?? new Uint8Array();
    }

    public static async verifyNonce(result: Uint8Array, target: Uint8Array): Promise<boolean> {
        return (await ChallengeSolver.getWASM()).verifyNonce(result, target);
    }

    public static async solve(data: APIResponse.Post.RequestChallenge): Promise<ChallengeSolver> {
        const solver = new ChallengeSolver(data);
        await solver.solve();
        return solver;
    }

    public static async wasmSolve(prefix: string, target: string): Promise<number> {
        return (await ChallengeSolver.getWASM()).solveChallenge(prefix, target);
    }

    public static async instantiate(module: WebAssembly.Module, imports?: Record<'env', unknown>): Promise<WASMExports> {
        return wasm.instantiate(
            module,
            imports ?? { env: null }
            // {
            //     env: imports?.env ?? {},
            //     index: {
            //         onAttempt: (nonce: number, done: boolean) => void 0,
            //         ...imports?.index ?? {}
            //     }
            // }
        );
    }

    public static async compile(url?: string|URL): Promise<WebAssembly.Module> {
        url = url instanceof URL ? url : new URL(url ?? "../wasm.wasm", import.meta.url);

        return ChallengeSolver.isNodeOrBun
            ? WebAssembly.compile(await (await import("node:fs/promises")).readFile(url))
            : WebAssembly.compileStreaming(globalThis.fetch(url))
    }
}