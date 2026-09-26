<script lang="ts">
    import { ClockIcon, MicVocalIcon, TextAlignCenterIcon, Music4, UserRoundIcon, Disc3Icon, PlayIcon, HeartIcon } from '@lucide/svelte';
    import { formatDuration } from '$lib/helpers/utils.js';
    import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Badge } from '$lib/components/ui/badge/index.js';
    import { resolve } from '$app/paths';
    import type { Track } from 'lrclib.js';
    import { MediaQuery } from 'svelte/reactivity';

    let { track }: { track: Track; } = $props();

    const isNotSmallScreen = new MediaQuery('(width >= 40rem)');
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
        {#if isNotSmallScreen.current}
            <CardAction class="flex gap-2">
                <Button size="icon-sm" variant="outline" class="rounded-xl">
                    <HeartIcon/>
                </Button>
                <Button size="sm" variant="default" class="rounded-xl">
                    <PlayIcon class="fill-current"/>
                    Play
                </Button>
            </CardAction>
        {/if}
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
        {#if !isNotSmallScreen.current}
            <div class="grid grid-cols-2 gap-2">
                <Button size="default" variant="outline" class="rounded-xl">
                    <HeartIcon/>
                    Favorite
                </Button>
                <Button size="default" variant="default" class="rounded-xl">
                    <PlayIcon class="fill-current"/>
                    Play
                </Button>
            </div>
        {/if}
    </CardContent>
</Card>