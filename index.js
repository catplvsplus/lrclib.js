import lrclib, { ChallengeSolver } from "lrclib.js";

console.log("Starting challenge solver...");
const challenge = await lrclib.requestChallenge();

console.log("Challenge received:", challenge);
const solver = new ChallengeSolver(challenge, {
    onAttempt: s => console.log("Nonce:", s.nonce, "Attempts:", s.attempts),
});

console.log("Solving challenge...");
await solver.solve();

console.log("Challenge solved:", solver.data);