/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/decodeHex
 * @param hex `~lib/string/String`
 * @returns `~lib/typedarray/Uint8Array`
 */
export declare function decodeHex(hex: string): Uint8Array;
/**
 * assembly/index/verifyNonce
 * @param result `~lib/typedarray/Uint8Array`
 * @param target `~lib/typedarray/Uint8Array`
 * @returns `bool`
 */
export declare function verifyNonce(result: Uint8Array, target: Uint8Array): boolean;
