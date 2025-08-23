<script lang="ts">
    import { toast } from 'svelte-sonner';
    import { Button } from '../../../lib/components/ui/button';
    import { Card, CardDescription, CardHeader, CardTitle } from '../../../lib/components/ui/card';
    import { Input } from '../../../lib/components/ui/input';
    import { player } from '../../../lib/helpers/classes/Player.svelte';
    import { PlayerTrack } from '../../../lib/helpers/classes/PlayerTrack.svelte';
    import { onMount } from 'svelte';
    import { userInterface } from '../../../lib/helpers/classes/UserInterface.svelte';
    import { resolve } from '$app/paths';
    import { AspectRatio } from '$lib/components/ui/aspect-ratio';
    import { blur } from 'svelte/transition';
    import PlayerBackground from '$lib/components/shared/player/PlayerBackground.svelte';
    import Queue from '$lib/components/shared/player/Queue.svelte';

    let parsing = $state(false);

    async function handleFileUpload(event: Event & { currentTarget: HTMLInputElement }) {
        const files = event.currentTarget.files;

        parsing = true;

        for (const file of files ?? []) {
            await PlayerTrack.fromFile({
                file,
                fetch: true
            })
            .then(track => player.play(track))
            .catch(err => toast.error(String(err)));
        }

        parsing = false;
    }

    onMount(() => {
        userInterface.playerMode = 'hidden';

        return () => {
            userInterface.playerMode = 'visible';
        };
    });

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>

<div class="grid grid-cols-3 gap-2 min-h-full w-full">
    <div class="col-span-2">
        <h1 class="text-2xl font-bold">Player</h1>
        <Queue/>
    </div>
    <div class="flex flex-col gap-2 p-4 bg-card border shadow-lg rounded-xl relative overflow-hidden dark">
        <PlayerBackground {coverURL}/>
        <AspectRatio ratio={1/1} class="h-fit shadow overflow-hidden rounded-lg relative z-10">
            {#key coverURL}
                <img class="size-full object-cover absolute top-0 left-0" src={coverURL} alt="" transition:blur>
            {/key}
            <img class="size-full object-cover opacity-0" src={coverURL} alt="">
        </AspectRatio>
        <div class="text-center relative z-10">
            <h1 class="w-full text-2xl font-bold text-foreground truncate line-clamp-2 whitespace-normal">{player.playing?.title ?? ''}</h1>
            <p class="text-foreground/80 text-sm truncate">
                {[player.playing?.artist, player.playing?.album].filter(Boolean).join(' • ')}
            </p>
        </div>
    </div>
</div>

<Input type="file" accept="audio/*" multiple onchange={handleFileUpload} disabled={parsing}/>
<div>{player.queue.length} tracks</div>
<div class="flex gap-2">
    <Button disabled={!player.queue.length} onclick={() => player.clear()}>Clear</Button>
    <Button disabled={!player.skippable} onclick={() => player.skip()}>Play Next</Button>
    <Button disabled={!player.previousable} onclick={() => player.previous()}>Play Previous</Button>
    <Button disabled={!player.player} onclick={() => player.status === 'paused' ? player.play() : player.pause()}>{player.status === 'paused' ? 'Resume' : 'Pause'}</Button>
    <Button disabled={!player.player} onclick={() => player.stop()}>Stop</Button>
</div>