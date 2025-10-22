import type { APIResponse } from 'lrclib.js';

export namespace Events {
    export namespace ChallengeSolver {
        export type Any = Challenge|Terminate;

        export interface Challenge {
            type: 'CHALLENGE';
            data: APIResponse.Post.RequestChallenge;
        }

        export interface Terminate {
            type: 'TERMINATE';
        }
    }
}

export namespace Responses {
    export namespace ChallengeSolver {
        export type Any = Complete|Attempt|Ready|Error|Exit;

        export interface Complete {
            type: 'COMPLETE';
            token: string;
        }

        export interface Attempt {
            type: 'ATTEMPT';
            attempts: number;
            nonce: number;
        }

        export interface Ready {
            type: 'READY';
        }

        export interface Error {
            type: 'ERROR';
            message?: string;
        }

        export interface Exit {
            type: 'EXIT';
        }
    }
}