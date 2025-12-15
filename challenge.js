import lrclib, { ChallengeSolver } from 'lrclib.js';

const challenge = await lrclib.requestChallenge();
const solver = await (new ChallengeSolver(challenge)).solve();

console.log(solver.token);