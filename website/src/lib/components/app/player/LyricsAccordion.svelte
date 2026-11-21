<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { Item, ItemActions, ItemContent, ItemTitle } from '../../ui/item';
    import { Button } from '../../ui/button';
    import { ChevronUpIcon } from '@lucide/svelte';
    import type { ComponentProps, Snippet } from 'svelte';
    import type { APIResponse } from 'lrclib.js';
    import { LyricPlayer, type AudioPlayer } from '@groovytune/player';
    import { LRCParser } from '@braccato/parsers';
    import { braccatoLyricsToAppleMusicLyrics } from '../../../helpers/lyrics';
    import { cn } from 'cn';

    let {
        actions,
        lyrics: rawLyrics,
        player,
        lyricsPlayerProps,
        ...props
    }: {
        actions?: Snippet;
        lyrics: string|APIResponse.Get.TrackSignature|{ toJSON(): APIResponse.Get.TrackSignature; };
        player: AudioPlayer,
        lyricsPlayerProps?: ComponentProps<typeof LyricPlayer>;
    } & HTMLAttributes<HTMLDivElement> = $props();

    let lyrics = $derived.by(() => {
        if (typeof rawLyrics === 'string') return rawLyrics;

        const json = 'toJSON' in rawLyrics ? rawLyrics.toJSON() : rawLyrics;

        return json.syncedLyrics
            ? braccatoLyricsToAppleMusicLyrics(LRCParser.parse(json.syncedLyrics))
            : json.plainLyrics;
    });
</script>

<div
    {...props}
    class={cn("bg-white/20 rounded-2xl mt-2", props.class)}
>
    <Item class="p-5 pt-4 pb-0">
        <ItemContent>
            <ItemTitle class="text-lg font-semibold line-clamp-1">
                Lyrics
            </ItemTitle>
        </ItemContent>
        <ItemActions>
            {@render actions?.()}
            <Button size="icon-lg" variant="ghost" class="rounded-full bg-white/20">
                <ChevronUpIcon class="size-5"/>
            </Button>
        </ItemActions>
    </Item>
    {#if Array.isArray(lyrics)}
        <div class="mask-t-from-80% h-60">
            <LyricPlayer
                lines={$state.snapshot(lyrics)}
                currentTime={player.currentTime * 1000}
                setAlignPosition={0.1}
                alignAnchor="top"
                style="--amll-lp-font-size: 1.6em"
                playing={!player.paused && player.status === 'playing' && !!player.current}
                onLineClick={line => player.setCurrentTime(line.line.getLine().startTime / 1000)}
                {...lyricsPlayerProps}
                class={cn("size-full font-bold", lyricsPlayerProps?.class)}
            />
        </div>
    {:else if typeof lyrics === 'string'}
        <div class="p-5 pt-4 pb-0">
            <p class="text-sm text-white/80 whitespace-pre-line">{lyrics}</p>
        </div>
    {/if}
</div>