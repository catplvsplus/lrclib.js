<script lang="ts">
    import { InputGroup, InputGroupButton, InputGroupInput } from '../ui/input-group';
    import Solver from '#lib/helpers/challenge-solver.ts?worker';
    import { LoaderCircleIcon } from '@lucide/svelte';
    import { onDestroy } from 'svelte';

    let token: string|null = $state(null);
    let isSolving: boolean = $state(false);
    let abortController: AbortController|null = null;

    async function solve(): Promise<string> {
        abortController?.abort();
        abortController = new AbortController();

        const signal = abortController.signal;
        const challenge = {
            prefix: '1cNdiaHCqsE2O0vGzEuuJcbcrznTlWRF',
            target: '000000FF00000000000000000000000000000000000000000000000000000000',
        };
        const solver = new Solver({ name: 'Challenge Solver' });

        solver.postMessage({
            type: 'start',
            data: {
                prefix: challenge.prefix,
                target: challenge.target,
            }
        });

        isSolving = true;

        signal?.addEventListener('abort', () => {
            solver.terminate();
            isSolving = false;
        });

        return new Promise((resolve, reject) => {
            solver.addEventListener('message', (event) => {
                const { type, data, error } = event.data;

                switch (type) {
                    case 'result':
                        isSolving = false;
                        resolve(token = `${challenge.prefix}:${data.nonce}`);
                        solver.terminate();
                        break;
                    case 'attempt':
                        isSolving = true;
                        console.log(`Attempt`, data);
                        break;
                    case 'error':
                        isSolving = false;
                        reject(error);
                        break;
                }
            });
        });
    }

    onDestroy(() => {
        abortController?.abort();
    });
</script>

<InputGroup>
    <InputGroupInput value={token} placeholder={isSolving ? 'Solving...' : 'Click "Solve" to start'}/>
    <InputGroupButton onclick={() => !isSolving ? solve() : abortController?.abort()}>
        {#if isSolving}
            <LoaderCircleIcon class="animate-spin"/>
        {:else}
            Solve
        {/if}
    </InputGroupButton>
</InputGroup>