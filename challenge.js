// @ts-check
import lrclib, { ChallengeSolver } from 'lrclib.js';

console.log('Starting...');

const challenge =  await lrclib.requestChallenge();

console.log('Chalenge:', challenge);
console.log('Solving...');

// let wasmTime = Date.now();

// const wasmNonce = await new Promise(res => solveChallenge(
//     challenge.prefix,
//     challenge.target,
//     (nonce, done) => done && res(nonce)
// ));

// console.log(`${challenge.prefix}:${wasmNonce}`, `Time taken: ${wasmTime = Date.now() - wasmTime}ms`);

let jsTime = Date.now();

const solver = new ChallengeSolver(challenge);
await solver.solve();

console.log(`${challenge.prefix}:${solver.nonce}`, `Time taken: ${jsTime = Date.now() - jsTime}ms`);
// console.log(wasmTime > jsTime ? 'WASM is slower than JS' : 'WASM is faster than JS');