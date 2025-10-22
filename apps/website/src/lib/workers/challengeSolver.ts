import { ChallengeSolver, type APIResponse } from 'lrclib.js';
import type { Events, Responses } from '../helpers/workers';

let challenge: APIResponse.Post.RequestChallenge|null = null;
let solver: ChallengeSolver|null = null;

post({ type: 'READY' });

self.addEventListener('message', async (event: MessageEvent<Events.ChallengeSolver.Any>) => {
    const data = event.data;

    switch (data.type) {
        case 'CHALLENGE':
            challenge = data.data;
            solveChallenge();
            break;
        case 'TERMINATE':
            exit();
            break;
    }
});

async function solveChallenge() {
    if (!challenge) error('No challenge to solve');

    solver = new ChallengeSolver(challenge, {
        onAttempt: data => post({
            type: 'ATTEMPT',
            attempts: data.attempts,
            nonce: data.nonce
        })
    });

    try {
        await solver.solve();

        post({ type: 'COMPLETE', token: solver.token });
        exit();
    } catch (err) {0
        error(String(err));
    }
}

function post(message: Responses.ChallengeSolver.Any) {
    self.postMessage(message);
}

function error(message: string): never {
    post({ type: 'ERROR', message });
    self.close();
    throw new Error(message);
}

function exit(): never {
    solver?.abort();
    post({ type: 'EXIT' });
    self.close();
    throw new Error('Worker terminated');
}