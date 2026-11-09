// @ts-check
import lrclib, { ChallengeSolver, wasm } from 'lrclib.js';
import ms from 'ms';

console.log('Starting...');

let challenge = await lrclib.requestChallenge();

challenge = {
    prefix: '1cNdiaHCqsE2O0vGzEuuJcbcrznTlWRF', // '5wZfr5mLmXiHOk87f3R63C3Q1gATu0HN',
    target: '000000FF00000000000000000000000000000000000000000000000000000000',
};

console.log('Solving...');

// Pure wasm solver

let pureWasmTime = Date.now();
const nonce = wasm.solveChallenge(challenge.prefix, challenge.target);

pureWasmTime = Date.now() - pureWasmTime;

// Challenge solvers
const wasmSolver = new wasm.ChallengeSolver(challenge);
const vanillaSolver = new ChallengeSolver(challenge);

wasmSolver.on('attempt', (solver) => {
    console.log(`[wasm] Attempt #${solver.attempts}`);
});

vanillaSolver.on('attempt', (solver) => {
    console.log(`[vanilla] Attempt #${solver.attempts}`);
});

await wasmSolver.solve();
await vanillaSolver.solve();

if (wasmSolver.nonce !== vanillaSolver.nonce || wasmSolver.nonce !== nonce) {
    console.error('[error] Nonce mismatch between wasm and vanilla solvers');
    process.exit(1);
}

const wasmTime = (wasmSolver.solveEndTime ?? 0) - (wasmSolver.solveStartTime ?? 0);
const vanillaTime = (vanillaSolver.solveEndTime ?? 0) - (vanillaSolver.solveStartTime ?? 0);

const sorted = [
    { name: 'wasm', time: wasmTime },
    { name: 'vanilla', time: vanillaTime },
    { name: 'pure wasm', time: pureWasmTime },
];

sorted.sort((a, b) => a.time - b.time);

console.log('[note] All solvers completed successfully');
console.log('[note] Token:', wasmSolver.prefix + ':' + wasmSolver.nonce);

for (const { name, time } of sorted) {
    console.log(`[note] Time taken (${name}):`, ms(time));
}

console.log('[note] Time difference:', ms(sorted[1].time - sorted[0].time), `(${sorted[0].name} was faster)`);
console.log('[note] Challenge prefix:', challenge.prefix);
console.log('[note] Challenge target:', challenge.target);