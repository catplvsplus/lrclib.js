// @ts-check
import lrclib, { ChallengeSolver } from 'lrclib.js';
import { solveChallenge } from './packages/challenge-solver/wasm';

console.log('Starting...');

const challenge = await lrclib.requestChallenge();

console.log('Chalenge:', challenge);
console.log('Solving...');

let wasmTime = Date.now();

console.log(`${challenge.prefix}:${solveChallenge(challenge.prefix, challenge.target)}`, `Time taken: ${wasmTime = Date.now() - wasmTime}ms`);

let jsTime = Date.now();

const solver = new ChallengeSolver(challenge);
await solver.solve();

console.log(`${challenge.prefix}:${solver.nonce}`, `Time taken: ${jsTime = Date.now() - jsTime}ms`);
console.log(wasmTime > jsTime ? 'WASM is slower than JS' : 'WASM is faster than JS');