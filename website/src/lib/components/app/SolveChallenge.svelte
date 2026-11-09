<script lang="ts">
    import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';
    import Solver from '#lib/helpers/challenge-solver.ts?worker';
    import { KeyIcon, LoaderCircleIcon } from '@lucide/svelte';
    import { onDestroy } from 'svelte';
    import lrclib from 'lrclib.js';

    let token: string|null = $state(null);
    let isSolving: boolean = $state(false);
    let abortController: AbortController|null = null;

    async function solve(quick: boolean = true): Promise<string> {
        const challenge = await lrclib.requestChallenge();
        const solver = new Solver({ name: 'Challenge Solver' });

        abortController?.abort();
        abortController = new AbortController();

        const signal = abortController.signal;

        signal?.addEventListener('abort', () => {
            solver.terminate();
            isSolving = false;
        });

        return new Promise((resolve, reject) => {
            solver.addEventListener('error', error => {
                reject(error.error);
            });

            solver.addEventListener('message', (event) => {
                const { type, data, error } = event.data;

                switch (type) {
                    case 'ready':
                        solver.postMessage({
                            type: 'solve',
                            data: { quick }
                        });
                        break;
                    case 'result':
                        isSolving = false;
                        resolve(token = `${challenge.prefix}:${data.nonce}`);
                        solver.terminate();
                        break;
                    case 'attempt':
                        isSolving = true;
                        token = `${challenge.prefix}:${data.attempt - 1}`;
                        break;
                    case 'error':
                        isSolving = false;
                        reject(error);
                        break;
                }
            });

            solver.postMessage({
                type: 'start',
                data: {
                    prefix: challenge.prefix,
                    target: challenge.target,
                }
            });

            isSolving = true;
        });
    }

    onDestroy(() => {
        abortController?.abort();
    });
</script>

<InputGroup>
    <InputGroupAddon align="inline-start">
        {#if isSolving}
            <LoaderCircleIcon class="animate-spin"/>
        {:else}
            <KeyIcon/>
        {/if}
    </InputGroupAddon>
    <InputGroupInput bind:value={token} placeholder={isSolving ? 'Solving...' : 'Click "Solve" to start'}/>
    <InputGroupAddon align="inline-end">
        <InputGroupButton
            variant={isSolving ? 'destructive' : 'default'}
            onclick={() => !isSolving ? solve() : abortController?.abort()}
        >
            {#if isSolving}
                Abort
            {:else}
                Solve
            {/if}
        </InputGroupButton>
    </InputGroupAddon>
</InputGroup>