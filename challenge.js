// @ts-check
import lrclib, { ChallengeSolver, VanillaChallengeSolver } from 'lrclib.js';
import ms from 'ms';

console.log('Starting...');

const challenge =  await lrclib.requestChallenge();

console.log('Chalenge:', challenge);
console.log('Solving...');

const wasmSolver = new ChallengeSolver(challenge);

wasmSolver.on('attempt', (solver) => {
    console.log(`[wasm] Attempt #${solver.attempts}`);
});

wasmSolver.on('solved', (solver) => {
    console.log(`[wasm] Solved in ${ms((solver.solveEndTime ?? 0) - (solver.solveStartTime ?? 0))}ms with token "${solver.prefix}:${solver.nonce}"`);
    console.log('[wasm] Challenge solved:', challenge);
});

wasmSolver.on('abort', (solver) => {
    console.log('[wasm] Solve aborted');
});

await wasmSolver.solve();

const vanillaSolver = new VanillaChallengeSolver(challenge);

vanillaSolver.on('attempt', (solver) => {
    console.log(`[vanilla] Attempt #${solver.attempts}`);
});

vanillaSolver.on('solved', (solver) => {
    console.log(`[vanilla] Solved in ${ms((solver.solveEndTime ?? 0) - (solver.solveStartTime ?? 0))}ms with token "${solver.prefix}:${solver.nonce}"`);
    console.log('[vanilla] Challenge solved:', challenge);
});

vanillaSolver.on('abort', (solver) => {
    console.log('[vanilla] Solve aborted');
});

await vanillaSolver.solve();

if (wasmSolver.nonce !== vanillaSolver.nonce) {
    console.error('[error] Nonce mismatch between wasm and vanilla solvers');
    process.exit(1);
}

const wasmTime = (wasmSolver.solveEndTime ?? 0) - (wasmSolver.solveStartTime ?? 0);
const vanillaTime = (vanillaSolver.solveEndTime ?? 0) - (vanillaSolver.solveStartTime ?? 0);

console.log('[note] All solvers completed successfully');
console.log('[note] Token: ', wasmSolver.prefix + ':' + wasmSolver.nonce);
console.log('[note] Time taken (wasm): ', ms(wasmTime));
console.log('[note] Time taken (vanilla): ', ms(vanillaTime));
console.log('[note] Time difference: ', ms(Math.abs(wasmTime - vanillaTime)), `(${wasmTime > vanillaTime ? 'vanilla' : 'wasm'} was faster)`);
console.log('[note] Time ratio (wasm/vanilla): ', (wasmTime / vanillaTime).toFixed(2));
console.log('[note] Time ratio (vanilla/wasm): ', (vanillaTime / wasmTime).toFixed(2));
console.log('[note] Challenge prefix: ', challenge.prefix);
console.log('[note] Challenge target: ', challenge.target);