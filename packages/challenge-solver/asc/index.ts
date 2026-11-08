/// <reference path="../../../node_modules/assemblyscript/dist/assemblyscript.d.ts" />

import { hex2bin, sha256Hash, } from "wasm-crypto/assembly/crypto";

export function solveChallenge(prefix: string, target: string): i32 {
    let attempts: i32 = 0;
    let nonce: i32 = 0;

    const targetBytes = hex2bin(target)!;

    while (true) {
        attempts++;

        const input = prefix + nonce.toString();
        const hashed = sha256Hash(stringToBytes(input));

        if (verifyNonce(hashed, targetBytes)) break;

        nonce++;
    }

    return nonce;
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