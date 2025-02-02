<script lang="ts">
    import { base } from '$app/paths';
    import type { Track } from 'lrclib';
    import { Badge } from '../ui/badge';
    import { DateTime } from 'luxon';
    import { isPreviewAllowed } from '../../helpers/stores';
    import { fly, slide } from 'svelte/transition';
    import { cn } from '../../helpers/utils';

    let { result = $bindable(), ...props }: { result: Track; [key: string]: any; } = $props();
    let preview: [string, number][] = $derived(
        result.plainLyrics
            .split('\n')
            .map((l, i) => [l, i])
            .filter(l => !!l[0])
            .splice(0, 3) as [string, number][]
    );

    const animationDelay = Math.random() * 100;
</script>

<div
    {...props}
    class={cn(
        "flex flex-col p-4 gap-2 bg-card border border-border/50 shadow-sm rounded-lg mb-4 w-full break-inside-avoid-column will-change-transform",
        props.class
    )}
>
    <div>
        <div class="flex justify-between">
            <h1 class="text-lg font-bold text-primary w-full text-ellipsis overflow-hidden leading-5">
                <a href="{base}/track?id={result.id}" title="{result.trackName}">
                    {result.trackName}
                </a>
            </h1>
            <p class="text-muted-foreground text-sm shrink-0 leading-5">{DateTime.fromSeconds(result.duration).toFormat('mm:ss')}</p>
        </div>
        <div class="items-center text-muted-foreground leading-5 text-sm text-ellipsis overflow-hidden">
            <span title="{result.artistName}">{result.artistName}</span>
            <span class="inline-block mx-0.5">•</span>
            <span title="{result.albumName}">{result.albumName}</span>
        </div>
    </div>
    <div class="flex flex-wrap gap-1">
        {#if result.isSynced()}
            <Badge variant="outline" class="bg-green-600/10 border-current text-green-600">Synced</Badge>
        {:else}
            <Badge variant="outline">Unsynced</Badge>
        {/if}
        {#if result.isInstrumental()}
            <Badge variant="outline">Instrumental</Badge>
        {/if}
    </div>
    {#if !result.isInstrumental() && $isPreviewAllowed}
        <div class="p-3 mt-1 rounded-lg bg-foreground/5 dark:text-foreground/80 will-change-transform" in:fly={{ y: 50, delay: animationDelay }} out:slide={{ delay: animationDelay }}>
            <div class="text-ellipsis text-xl font-bold tracking-tight leading-6">
                {#each preview as lyric}
                    <p>
                        <a href="{base}/track?id={result.id}#line-{lyric[1]}" title="{lyric[0]}">{lyric[0]}</a>
                    </p>
                {/each}
            </div>
        </div>
    {/if}
</div>