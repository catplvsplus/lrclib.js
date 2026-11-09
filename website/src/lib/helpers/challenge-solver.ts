import { wasm, type APIResponse } from 'lrclib.js';

let challenge: APIResponse.Post.RequestChallenge|null = null;

self.addEventListener('message', async (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'start':
            challenge = data;
            break;
        case 'solve':
            if (!challenge) throw new Error('Challenge is not defined');

            const nonce = (await wasm.ChallengeSolver.getWASM()).solveChallenge(challenge?.prefix, challenge?.target);

            postMessage({
                type: 'result',
                data: {
                    nonce
                }
            })
            break;
        default:
            console.warn(`Unknown message type: ${type}`);
    }
});