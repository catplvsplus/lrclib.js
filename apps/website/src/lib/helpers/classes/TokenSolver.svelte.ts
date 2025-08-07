import { ChallengeSolver, type APIResponse } from 'lrclib.js';

export class TokenSolver {
    private _onSolved: (() => void)[] = [];

    public attempts: number|null = $state(null);
    public solver: ChallengeSolver|null = $state(null);
    public status: TokenSolver.State|null = $state(null);

    public constructor() {
        this.solve = this.solve.bind(this);
        this.abort = this.abort.bind(this);
    }

    get onSolved(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.status !== 'solving') return reject(new Error('Token solver is not solving'));

            this._onSolved.push(() => resolve(true));
        });
    }

    public async solve(challenge: APIResponse.Post.RequestChallenge, onAbort?: () => void): Promise<ChallengeSolver> {
        if (this.solver) throw new ChallengeSolver.AbortError();

        this.solver = new ChallengeSolver(challenge, {
            onAttempt: () => {
                this.attempts = this.solver?.attempts ?? null;
                this.status = 'solving';
            },
            onAbort: () => {
                this.status = 'aborted';
                onAbort?.();
            }
        });

        await this.solver.solve();

        this.status = 'solved';
        this._onSolved.forEach(solve => solve());
        this._onSolved = [];

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
        this.solver?.abort();
        this.status = 'aborted';
        this.attempts = null;
        this.solver = null;
    }
}

export namespace TokenSolver {
    export type State = 'solving'|'solved'|'aborted';
}

export const tokenSolver = new TokenSolver();