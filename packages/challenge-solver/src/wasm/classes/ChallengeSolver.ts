import { ChallengeSolver as VanillaChallengeSolver } from '../../vanilla/ChallengeSolver.js';
import type { APIResponse } from '@lrclib.js/api-types';
import * as wasm from '$wasm/wasm.js';

export type WASMExports = Awaited<ReturnType<typeof wasm.instantiate>>;
export type WASMEnv = Record<'env', unknown>;

export class ChallengeSolver extends VanillaChallengeSolver {
    private static _wasm: WASMExports|null = null;

    public static wasmURL: URL = new URL("../wasm.wasm", import.meta.url);

    public constructor(data: APIResponse.Post.RequestChallenge) {
        super(data);

        ChallengeSolver.getInstance();
    }

    /**
     * Checks if the code is running in a Node.js environment.
     */
    public static isNode() {
        return typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    }

    /**
     * A singleton method to get the WASM exports instance.
     */
    public static async getInstance(): Promise<WASMExports> {
        return this._wasm ??= await ChallengeSolver.instantiate(await ChallengeSolver.compile());
    }

    public static async sha256(input: string): Promise<Uint8Array> {
        return (await ChallengeSolver.getInstance()).hash(input);
    }

    public static async decodeHex(hex: string): Promise<Uint8Array> {
        return (await ChallengeSolver.getInstance()).hex2bin(hex) ?? new Uint8Array();
    }

    public static async verifyNonce(result: Uint8Array, target: Uint8Array): Promise<boolean> {
        return (await ChallengeSolver.getInstance()).verifyNonce(result, target);
    }

    public static async solve(data: APIResponse.Post.RequestChallenge): Promise<ChallengeSolver> {
        const solver = new ChallengeSolver(data);
        await solver.solve();
        return solver;
    }

    /**
     * Solves the challenge directly using the WebAssembly module without creating an instance of ChallengeSolver.
     */
    public static async wasmSolve(prefix: string, target: string): Promise<number> {
        return (await ChallengeSolver.getInstance()).solveChallenge(prefix, target);
    }

    /**
     * Creates a new instance of the WebAssembly module.
     */
    public static async instantiate(module: WebAssembly.Module, imports?: WASMEnv): Promise<WASMExports> {
        return wasm.instantiate(
            module,
            imports ?? { env: null }
        );
    }

    /**
     * Compiles the WebAssembly module from the specified URL or the default URL.
     */
    public static async compile(url?: string|URL): Promise<WebAssembly.Module> {
        url = url instanceof URL ? url : new URL(url ?? "../wasm.wasm", import.meta.url);

        return ChallengeSolver.isNode()
            ? WebAssembly.compile(await (await import("node:fs/promises")).readFile(url))
            : WebAssembly.compileStreaming(globalThis.fetch(url))
    }
}