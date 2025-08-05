<script lang="ts">
    import lrclib, { ChallengeSolver, type APIPublishTokenData, type APIResponse } from 'lrclib.js';
    import { Button } from '../../../lib/components/ui/button';

    let challenge: APIResponse.Post.RequestChallenge|null = $state(null);
    let token: Promise<APIPublishTokenData>|null = $state(null);

    async function requestChallenge() {
        challenge = await lrclib.requestChallenge();
    }

    async function solveChallenge() {
        if (!challenge) return;

        const solver = new ChallengeSolver(challenge);

        token = solver.solve();
    }
</script>

<div class="pt-16">
    {#if !challenge}
        <Button onclick={requestChallenge}>Request challenge</Button>
    {:else if !token}
        <p>Prefix: {challenge.prefix}</p>
        <p>Target: {challenge.target}</p>
        <Button onclick={solveChallenge}>Solve challenge</Button>
    {/if}

    {#if token}
        {#await token}
            Loading...
        {:then token}
            <p>Token: {token.prefix}:{token.nonce}</p>
        {/await}
    {/if}
</div>