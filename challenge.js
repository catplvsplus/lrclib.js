// @ts-check
import { ChallengeSolver } from 'lrclib.js';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

console.log('Starting...');

// const challenge = await lrclib.requestChallenge();
const challenge = {
    prefix: '5LvUhe1RHUnIkQDDODq6VU0fCS7DXOjO',
    target: '000000FF00000000000000000000000000000000000000000000000000000000'
};

console.log('Chalenge:', challenge);

const worker = import.meta.resolve('@lrclib.js/challenge-solver/workers/wasm');
const wasm = await readFile(fileURLToPath(import.meta.resolve('@lrclib.js/challenge-solver/challenge-solver.wasm')));

console.log('Solving...');

// const solver = await (new GoChallengeSolver(challenge, {
//     worker: new Worker(worker, { type: 'module' }),
//     wasmURL: new Uint8Array(wasm).buffer
// })).solve();

const solver = await (new ChallengeSolver(challenge)).solve();

console.log(solver.token);