import ChallengeSolver from '$lib/workers/challengeSolver?worker';
import lrclib, { type APIResponse } from 'lrclib.js';
import type { Events, Responses } from '../workers';

// TODO: Use faster method for solving proof-of-work challenge like https://lrclibup.boidu.dev/
export class TokenSolver {
    private onSolvedEvents: ((token: string) => void)[] = [];

    public solver: InstanceType<typeof ChallengeSolver>|null = $state(null);
    public status: TokenSolver.State = $state(null);
    public attempts: number|null = $state(null);
    public nonce: number|null = $state(null);
    public token: string|null = $state(null);

    public start: number|null = $state(null);
    public end: number|null = $state(null);

    public onTerminatedEvent: (() => void)|null = null;

    constructor() {
        this.solve = this.solve.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.onMessage = this.onMessage.bind(this);
    }

    get onSolved(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.status !== 'solving' && this.status !== 'idle') {
                reject(new Error('Token solver is not solving a challenge'));
                return;
            }

            this.onSolvedEvents.push(resolve);
        });
    }

    public async solve(challenge?: APIResponse.Post.RequestChallenge): Promise<string> {
        if (this.status !== null) throw new Error('Token solver is already solving a challenge');

        challenge ??= await lrclib.requestChallenge();

        this.attempts = null;
        this.nonce = null;
        this.status = 'idle';

        this.solver = new ChallengeSolver();

        this.solver.addEventListener('message', this.onMessage);

        this.postMessage({
            type: 'CHALLENGE',
            data: challenge
        });

        return this.onSolved;
    }

    public async terminate(emitEvent: boolean = true) {
        this.solver?.terminate();
        this.solver?.removeEventListener('message', this.onMessage);

        if (emitEvent) this.onTerminatedEvent?.();
    }

    public reset() {
        this.solver = null;
        this.status = null;
        this.attempts = null;
        this.nonce = null;
        this.token = null;

        this.start = null;
        this.end = null;
    }

    private postMessage(message: Events.ChallengeSolver.Any) {
        if (this.solver) this.solver.postMessage(message);
    }

    private onMessage(event: MessageEvent<Responses.ChallengeSolver.Any>) {
        const data = event.data;

        switch (data.type) {
            case 'READY':
                this.status = 'idle';
                break;
            case 'ATTEMPT':
                this.status = 'solving';
                this.attempts = data.attempts;
                this.nonce = data.nonce;

                if (this.start === null) {
                    this.start = Date.now();
                }

                break;
            case 'COMPLETE':
                this.status = 'solved';
                this.token = data.token;
                this.onSolvedEvents.forEach(cb => cb(data.token));

                this.end = Date.now();
                break;
            case 'ERROR':
                console.error(data.message);
                this.status = 'idle';
                this.terminate(true);
                break;
            case 'EXIT':
                this.terminate(false);
                this.status = 'idle';
                break;
        }
    }
}

export namespace TokenSolver {
    export type State = 'solving'|'solved'|'idle'|null;
}

export const tokenSolver = new TokenSolver();