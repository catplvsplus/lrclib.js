import { wasm, type APIResponse } from 'lrclib.js';

let challenge: APIResponse.Post.RequestChallenge|null = null;

self.addEventListener('message', async (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'start':
            challenge = data;
            self.postMessage({ type: 'ready' });
            break;
        case 'solve':
            if (!challenge) throw new Error('Challenge is not defined');

            if (data?.quick) {
                const nonce = await wasm.ChallengeSolver.wasmSolve(challenge?.prefix, challenge?.target);

                self.postMessage({
                    type: 'result',
                    data: {
                        nonce
                    }
                });
                self.close();
                break;
            }

            const solver = new wasm.ChallengeSolver(challenge);

            solver.on('attempt', () => self.postMessage({
                type: 'attempt',
                data: {
                    nonce: solver.nonce
                }
            }));

            self.postMessage({
                type: 'result',
                data: {
                    nonce: (await solver.solve()).nonce
                }
            });
            self.close();
            break;
        default:
            console.warn(`Unknown message type: ${type}`);
    }
});