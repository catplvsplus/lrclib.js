<script lang="ts">
    import Button from './ui/button/button.svelte';
    import Play from 'lucide-svelte/icons/play';
    import Pause from 'lucide-svelte/icons/pause';
    import Unmuted from 'lucide-svelte/icons/volume-2';
    import Muted from 'lucide-svelte/icons/volume-off';
    import Download from 'lucide-svelte/icons/download';
    import { cn, writeID3Tags } from '../helpers/utils';
    import type { Track } from 'lrclib';
    import { parseBlob } from 'music-metadata';
    import { buttonVariants } from './ui/button';
    import { onMount } from 'svelte';

    export let paused: boolean;
    export let muted: boolean;
    export let track: Track;
    export let blob: Blob;
    export let name: string;

    let downloadURL: string = '';

    onMount(async () => {
        const buff = await writeID3Tags(blob, track);
        downloadURL = URL.createObjectURL(new Blob([buff]));
        console.log(name, downloadURL);
    });
</script>

<div {...$$props} class={cn("flex items-center gap-4", $$props.class)}>
    <a
        class={cn(
            buttonVariants({ variant: 'default' }),
            "h-12 w-12 p-0 rounded-full bg-background/20 hover:bg-background/40",
            downloadURL ? "" : "opacity-30"
        )}
        download={name}
        href={downloadURL}
        target="_blank"
    >
        <Download/>
    </a>
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