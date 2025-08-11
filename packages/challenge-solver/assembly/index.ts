export function decodeHex(hex: string): Uint8Array {
    const len = hex.length;

    if (len % 2 != 0) {
        throw new Error("Hex string must have even length");
    }

    let out = new Uint8Array(len / 2);

    for (let i = 0; i < len; i += 2) {
        let hi = hex.charCodeAt(i);
        let lo = hex.charCodeAt(i + 1);

        let val = ((hi >= 0x30 && hi <= 0x39)
            ? hi - 0x30
            : (hi >= 0x41 && hi <= 0x46)
                ? hi - 0x41 + 10
                : -1) << 4;

        val |= (lo >= 0x30 && lo <= 0x39)
            ? lo - 0x30
            : (lo >= 0x41 && lo <= 0x46)
                ? lo - 0x41 + 10
                : -1;

        if (val < 0) {
            throw new Error("Invalid hex character");
        }

        out[i >> 1] = val;
    }

    return out;
}

export function verifyNonce(result: Uint8Array, target: Uint8Array): bool {
    if (result.length != target.length) {
        return false;
    }

    for (let i = 0; i < result.length - 1; i++) {
        if (result[i] > target[i]) {
            return false;
        } else if (result[i] < target[i]) {
            break;
        }
    }

    return true;
}

// export function solveChallenge(prefix: string, targetHex: string): string {
//     const target = decodeHex(targetHex);
//     let nonce = 0;

//     while (true) {
//         const input = prefix + nonce.toString();
//         const sha256 = new SHA256();

//         const hash: Uint8Array = sha256
//             .init()
//             .update(String.UTF8.encode(input) as Uint8Array)
//             .final();

//         if (verifyNonce(hash, target)) {
//             break;
//         } else {
//             nonce += 1;
//         }
//     }

//     return nonce.toString();
// }