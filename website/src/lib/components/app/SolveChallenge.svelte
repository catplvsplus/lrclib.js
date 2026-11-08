<script lang="ts">
    import lrclib from 'lrclib.js';
    import { InputGroup, InputGroupButton, InputGroupInput } from '../ui/input-group';
    import Solver from '#lib/helpers/challenge-solver.ts?worker';
    import { LoaderCircleIcon } from '@lucide/svelte';

    let token: string|null = $state(null);
    let isSolving: boolean = $state(false);

    async function solve(): Promise<string> {
        const challenge = await lrclib.requestChallenge();
        const solver = new Solver({ name: 'Challenge Solver' });

        solver.postMessage({
            type: 'start',
            challenge
        });

        return new Promise((resolve, reject) => {
            solver.addEventListener('message', (event) => {
                const { type, data, error } = event.data;

                switch (type) {
                    case 'result':
                        isSolving = false;
                        resolve(token = `${data.prefix}:${data.nonce}`);
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
</script>

<InputGroup>
    <InputGroupInput value={token}/>
    <InputGroupButton onclick={solve} disabled={isSolving}>
        {#if isSolving}
            <LoaderCircleIcon class="animate-spin"/>
        {:else}
            Solve
        {/if}
    </InputGroupButton>
</InputGroup>