import { VanillaChallengeSolver } from 'lrclib.js';

let solver: VanillaChallengeSolver|null = null;

self.addEventListener('message', async (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'start':
            solver = new VanillaChallengeSolver(data.challenge);

            solver.on('attempt', () => {
                self.postMessage({
                    type: 'attempt',
                    data: {
                        nonce: solver?.nonce,
                        attempts: solver?.attempts,
                        solveStartTime: solver?.solveStartTime,
                        solveEndTime: solver?.solveEndTime,
                        solveLastUpdate: solver?.solveLastUpdate
                    }
                })
            });
            break;
        case 'abort':
            solver?.abortController?.abort();
            break;
        case 'solve':
            await solver?.solve();
            self.postMessage({
                type: 'solved',
                data: {
                    nonce: solver?.nonce,
                    attempts: solver?.attempts,
                    solveStartTime: solver?.solveStartTime,
                    solveEndTime: solver?.solveEndTime,
                    solveLastUpdate: solver?.solveLastUpdate
                }
            });
            break;
        default:
            console.warn(`Unknown message type: ${type}`);
    }
});