<script lang="ts">
    import { KawarpBackground, LyricPlayer } from '@groovytune/player';
    import { cn } from 'cn';
    import type { HTMLAttributes } from 'svelte/elements';
    import { playerContext } from '../../../helpers/contexts';
    import isMobile from 'is-mobile';
    import { EllipsisVerticalIcon, FastForwardIcon, PauseIcon, PlayIcon, RewindIcon, SixteenthNotesIcon, StarIcon } from '@lucide/svelte';
    import { ScrollArea } from '../../ui/scroll-area';
    import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '../../ui/item';
    import { Button } from '../../ui/button';

    let {
        ...props
    }: HTMLAttributes<HTMLDivElement> = $props();

    const player = playerContext.get();
</script>

<div
    class={cn("size-full rounded-2xl bg-muted relative overflow-hidden", props.class)}
>
    {#if player.currentCoverImage && !player.current?.coverLoadError}
        {#key player.currentCoverImage}
            <KawarpBackground
                class="size-full absolute top-0 left-0 z-0 bg-black brightness-90"
                image={player.currentCoverImage}
                blurPasses={isMobile() ? 10 : 7}
                saturation={isMobile() ? 4 : 2.5}
                transitionDuration={1000}
                tintColor={[0.16, 0.16, 0.24]}
                tintIntensity={0.5}
                animationSpeed={0.5}
                scale={3}
            />
        {/key}
    {/if}
    <ScrollArea class="size-full absolute top-0 left-0 z-0 p-4 dark text-white">
        <div class="aspect-square w-full object-cover rounded-xl overflow-hidden flex justify-center items-center bg-background border/20">
            {#if player.currentCoverImage && !player.current?.coverLoadError}
                {#key player.currentCoverImage}
                    <img
                        src={player.currentCoverImage}
                        class="size-full object-cover"
                        alt=""
                        onerror={() => player.current && (player.current.coverLoadError = true)}
                    >
                {/key}
            {:else}
                <SixteenthNotesIcon class="size-30 text-muted-foreground"/>
            {/if}
        </div>
        <Item size="xs" class="px-0 py-4">
            <ItemContent>
                <ItemTitle class="text-lg font-semibold line-clamp-1">
                    {player.current?.title ?? "No track playing"}
                </ItemTitle>
                <ItemDescription class="text-sm font-semibold text-current/50 line-clamp-1">
                    {player.current?.artist ?? "Unknown artist"}
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button size="icon-lg" variant="ghost" class="size-8 rounded-full bg-white/20 backdrop-saturate-150">
                    <StarIcon/>
                </Button>
                <Button size="icon-lg" variant="ghost" class="size-8 rounded-full bg-white/20 backdrop-saturate-150">
                    <EllipsisVerticalIcon/>
                </Button>
            </ItemActions>
        </Item>
        <div class="py-2">
            <div class="w-full h-2 rounded-full bg-white/30 backdrop-saturate-150 overflow-hidden">
                <span class="block h-full bg-white rounded-l-full" style="width: {player.progress ?? 0}%;"></span>
            </div>
        </div>
        <div class="flex gap-4 justify-evenly items-center">
            <Button
                size="icon-lg"
                variant="ghost"
                disabled={!player.previousable}
                class="size-20 rounded-full"
                onclick={() => player.previous()}
            >
                <RewindIcon class="size-8 fill-current"/>
            </Button>
            <Button
                size="icon-lg"
                variant="ghost"
                disabled={!player.current}
                class="size-20 rounded-full"
                onclick={() => player.togglePlay()}
            >
                <PlayIcon class={[!player.paused ? "hidden" : "", "size-10 fill-current"]}/>
                <PauseIcon class={[player.paused ? "hidden" : "", "size-10 fill-current"]}/>
            </Button>
            <Button
                size="icon-lg"
                variant="ghost"
                disabled={!player.nextable}
                class="size-20 rounded-full"
                onclick={() => player.next()}
            >
                <FastForwardIcon class="size-8 fill-current"/>
            </Button>
        </div>
        {#if player.currentLyrics}
            <div class="bg-white/20 rounded-2xl p-4">
                {#if player.currentSyncedLyrics}
                    <LyricPlayer
                        lines={player.currentSyncedLyrics}
                        currentTime={player.currentTime}
                        playing={!player.paused}
                    />
                {/if}
            </div>
        {/if}
    </ScrollArea>
</div>