// @ts-check
import { ChallengeSolver } from 'lrclib.js';

console.log('Starting...');

// const challenge = await lrclib.requestChallenge();
const challenge = {
    prefix: '5LvUhe1RHUnIkQDDODq6VU0fCS7DXOjO',
    target: '000000FF00000000000000000000000000000000000000000000000000000000'
};

console.log('Chalenge:', challenge);
console.log('Solving...');

const solver = new ChallengeSolver(challenge, {
    onAttempt: console.log,
});

await solver.solve();

console.log(solver.token);