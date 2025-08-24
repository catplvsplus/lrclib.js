<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../../ui/card';
    import { cn } from '../../../helpers/utils';
    import { FullscreenIcon, Maximize2Icon } from '@lucide/svelte';
    import { Button } from '../../ui/button';
    import { player } from '../../../helpers/classes/Player.svelte';
    import { settings } from '../../../helpers/classes/Settings.svelte';
    import { resolve } from '$app/paths';
    import { fade } from 'svelte/transition';

    let { ...props }: {} & HTMLAttributes<HTMLDivElement> = $props();

    let coverURL = $derived(player.playing?.coverImageURL ?? `${resolve('/')}cover.png`);
</script>
<Card
    {...props}
    class={cn(
        'relative overflow-hidden',
        !settings.prefersReducedTransparency && 'dark',
        props.class
    )}
>
    <CardHeader class="flex items-center justify-between relative z-20">
        <CardTitle class="text-lg font-bold">Lyrics</CardTitle>
        <CardAction>
            <Button size="icon" variant="secondary" class="size-10 rounded-full overflow-hidden relative bg-foreground/20! text-foreground">
                <Maximize2Icon/>
            </Button>
        </CardAction>
    </CardHeader>
    <CardContent class="relative z-20">
        {player.playing?.syncedLyrics ?? player.playing?.lyrics}
    </CardContent>
    <div
        class="size-full absolute top-0 left-0 overflow-hidden"
        class:hidden={settings.prefersReducedTransparency || !player.playing}
    >
        <div class="absolute size-full backdrop-blur-3xl backdrop-saturate-150 z-10 bg-black/50"></div>
        {#key coverURL}
            <div
                class="size-full scale-125 object-cover object-center absolute"
                style="background-image: url({coverURL})"
                transition:fade={{ duration: settings.prefersReducedMotion ? 0 : 300 }}
            >
            </div>
        {/key}
    </div>
</Card>