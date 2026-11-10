/// <reference path="../../../node_modules/assemblyscript/dist/assemblyscript.d.ts" />

import { hex2bin as h2b, sha256Hash } from "wasm-crypto/assembly/crypto";

export function solveChallenge(
    prefix: string,
    target: string
): i32 {
    let nonce: i32 = 0;

    const targetBytes = hex2bin(target)!;

    while (true) {
        if (verifyNonce(hash(prefix + nonce.toString()), targetBytes)) {
            return nonce;
        }

        nonce++;
    }
}

export function verifyChallenge(
    prefix: string,
    target: string,
    nonce: i32
): bool {
    return verifyNonce(hash(prefix + nonce.toString()), hex2bin(target)!);
}

export function hex2bin(hex: string): Uint8Array|null {
    return h2b(hex);
}

export function hash(input: string): Uint8Array {
    return sha256Hash(stringToBytes(input));
}

export function verifyNonce(hash: Uint8Array, target: Uint8Array): bool {
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

export function stringToBytes(str: string): Uint8Array {
    const bytes = new Uint8Array(str.length);

    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }

    return bytes;
}