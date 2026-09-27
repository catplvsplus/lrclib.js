// @ts-check
import lrclib, { ChallengeSolver } from 'lrclib.js';

console.log('Starting...');

const challenge = await lrclib.requestChallenge();

console.log('Chalenge:', challenge);
console.log('Solving...');

const solver = new ChallengeSolver(challenge, {
    onAttempt: c => console.log(`Attempt: (${c.attempts}) ${c.nonce}`),
});

await solver.solve();

console.log(solver.token);