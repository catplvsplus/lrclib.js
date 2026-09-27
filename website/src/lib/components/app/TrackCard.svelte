<script lang="ts">
    import { ClockIcon, MicVocalIcon, TextAlignCenterIcon, Music4, UserRoundIcon, Disc3Icon, PlayIcon, HeartIcon } from '@lucide/svelte';
    import { formatDuration } from '$lib/helpers/utils.js';
    import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Badge } from '$lib/components/ui/badge/index.js';
    import { resolve } from '$app/paths';
    import type { Track } from 'lrclib.js';
    import { MediaQuery } from 'svelte/reactivity';
    import { onMount } from 'svelte';
    import PersistentStorage from '../../classes/Storage.svelte';

    let { track }: { track: Track; } = $props();

    const isNotSmallScreen = new MediaQuery('(width >= 40rem)');
    const storage = PersistentStorage.get();

    let isTrackLiked = $derived(storage.likes.entries().find(v => v[0] === track.id));

    onMount(async () => {
        await storage.getTrackLike(track.id);
    });
</script>

<Card class="w-full">
    <CardHeader>
        <CardTitle class="text-sm line-clamp-2">
            <a href={resolve('/(app)/track/[id]', { id: String(track.id) })}>
                {track.trackName}
            </a>
        </CardTitle>
        <CardDescription class="text-xs text-muted-foreground line-clamp-2">
            <span>
                <UserRoundIcon class="size-3 inline"/>
                {track.artistName}
            </span>
            ·
            <span>
                <Disc3Icon class="size-3 inline"/>
                {track.albumName}
            </span>
        </CardDescription>
        <CardAction class="flex gap-2">
            {#if storage.supported}
                <Button
                    size={isNotSmallScreen.current ? "icon-sm" : "icon"}
                    variant="outline"
                    class={["rounded-xl", isTrackLiked && "text-primary!"]}
                    onclick={() => storage.setTrackLike(track.id)}
                >
                    <HeartIcon class={isTrackLiked ? "fill-current" : ""}/>
                </Button>
            {/if}
            <Button size={isNotSmallScreen.current ? "sm" : "icon"} variant="default" class="rounded-xl">
                <PlayIcon class="fill-current"/>
                <span class="sm:inline hidden">Play</span>
            </Button>
        </CardAction>
    </CardHeader>
    <CardContent class="grid gap-4">
        <div class="flex gap-1">
            <Badge class="bg-green-600/10 text-green-600 dark:bg-green-500/10 dark:text-green-500">
                <ClockIcon/>
                {formatDuration(track.duration)}
            </Badge>
            {#if track.isSynced()}
                <Badge class="bg-primary/10 text-primary">
                    <MicVocalIcon/>
                    Synced
                </Badge>
            {:else if !track.isInstrumental()}
                <Badge class="bg-blue-600/10 text-blue-600 dark:bg-blue-500/5 dark:text-blue-500">
                    <TextAlignCenterIcon/>
                    Plain
                </Badge>
            {:else}
                <Badge variant="secondary">
                    <Music4/>
                    Instrumental
                </Badge>
            {/if}
        </div>
    </CardContent>
</Card>