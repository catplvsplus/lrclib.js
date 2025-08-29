import { ChallengeSolver, type APIResponse } from 'lrclib.js';

// TODO: Use faster method for solving proof-of-work challenge like https://lrclibup.boidu.dev/
export class TokenSolver {
    private _onSolved: ((err?: Error) => void)[] = [];

    public attempts: number|null = $state(null);
    public solver: ChallengeSolver|null = $state(null);
    public status: TokenSolver.State|null = $state(null);

    public onAbort: (() => void)|null = $state(null);

    public constructor() {
        this.solve = this.solve.bind(this);
        this.abort = this.abort.bind(this);
    }

    get onSolved(): Promise<ChallengeSolver> {
        return new Promise((resolve, reject) => {
            if (this.status !== 'solving') return reject(new Error('Token solver is not solving'));

            this._onSolved.push((err) => err ? reject(err) : resolve(this.solver!));
        });
    }

    public async solve(challenge: APIResponse.Post.RequestChallenge): Promise<ChallengeSolver> {
        if (this.status === 'solving') throw new Error('Token solver is already solving');

        this.solver = new ChallengeSolver(challenge, {
            onAttempt: () => {
                this.attempts = this.solver?.attempts ?? null;
                this.status = 'solving';
            }
        });

        this.solver.abortController?.signal.addEventListener('abort', () => {
            this.status = 'aborted';
            this.attempts = null;

            this.onAbort?.();
        });;

        await this.solver.solve()
            .then(() => {
                this.status = 'solved';
                this._onSolved.forEach(solve => solve());
                this._onSolved = [];
            })
            .catch(err => {
                console.error(err);
                this.abort();

                this._onSolved.forEach(solve => solve(err));
                this._onSolved = [];

                throw err;
            });

        return this.solver;
    }

    public reset(andAbort?: boolean): void {
        if (andAbort === false && this.status === 'solving') {
            throw new Error('Token solver is still solving');
        }

        this.abort();
        this._onSolved = [];
        this.status = null;
    }

    public async abort(): Promise<void> {
        this.status = 'aborted';
        this.attempts = null;

        if (this.solver && !this.solver.aborted) {
            this.solver?.abort();
        }
    }
}

export namespace TokenSolver {
    export type State = 'solving'|'solved'|'aborted';
}

export const tokenSolver = new TokenSolver();