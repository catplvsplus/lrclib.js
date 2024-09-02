<script lang="ts">
    import Button from './ui/button/button.svelte';
    import Play from 'lucide-svelte/icons/play';
    import Pause from 'lucide-svelte/icons/pause';
    import Unmuted from 'lucide-svelte/icons/volume-2';
    import Muted from 'lucide-svelte/icons/volume-off';
    import Download from 'lucide-svelte/icons/download';
    import { cn, isID3WriteSupported, writeID3Tags } from '../helpers/utils';
    import type { APITrackSignatureResponse, Track, TrackSyncedLyrics } from 'lrclib';
    import { buttonVariants } from './ui/button';
    import { onDestroy, onMount } from 'svelte';

    export let paused: boolean;
    export let muted: boolean;
    export let lyrics: TrackSyncedLyrics|string;
    export let cover: Uint8Array|undefined;
    export let track: Pick<APITrackSignatureResponse, 'artistName'|'trackName'>;
    export let blob: Blob;
    export let name: string;

    let downloadURL: string = '';

    onMount(async () => {
        if (!isID3WriteSupported(blob)) return;

        const buff = await writeID3Tags({ blob, track, lyrics, cover }).catch(() => null);
        if (!buff) return;

        downloadURL = URL.createObjectURL(new Blob([buff]));
    });

    onDestroy(() => downloadURL ? URL.revokeObjectURL(downloadURL) : null);
</script>

<div {...$$props} class={cn("flex items-center gap-4", $$props.class)}>
    {#if downloadURL}
        <a
            class={cn(
                buttonVariants({ variant: 'default' }),
                "h-12 w-12 p-0 rounded-full bg-background/20 hover:bg-background/40",
                downloadURL ? "" : "opacity-30"
            )}
            download={downloadURL ? name : null}
            href={downloadURL}
            target={"_blank"}
            rel="noreferrer noopener"
            title={downloadURL ? "Download" : "Download not supported"}
        >
            <Download/>
        </a>
    {:else}
        <Button
            disabled
            variant='default'
            class={cn(
                "h-12 w-12 p-0 rounded-full bg-background/20 hover:bg-background/40",
                downloadURL ? "" : "opacity-30"
            )}
        >
            <Download/>
        </Button>
    {/if}
    <Button
        on:click={() => paused = !paused}
        class={cn(
            "h-16 w-16 p-0 rounded-full bg-background/20 hover:bg-background/40"
        )}
    >
        {#if paused}<Play size="30"/>{:else}<Pause size="30"/>{/if}
    </Button>
    <Button
        on:click={() => muted = !muted}
        class={cn(
            "h-12 w-12 p-0 rounded-full",
            !muted ? "bg-background/20 hover:bg-background/40" : "!bg-primary/10 text-primary"
        )}
    >
        {#if muted}<Muted/>{:else}<Unmuted/>{/if}
    </Button>
</div>