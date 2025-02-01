<script lang="ts">
    import { base } from '$app/paths';
    import { Search } from 'lucide-svelte';
    import { cn } from '../../helpers/utils';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    const placeholders: string[] = [
        "Search...",
        "Search for a song...",
        "Search for an artist...",
        "Search for an album..."
    ];

    let { value = $bindable(""), ...props }: { value?: string; [key: string]: any; } = $props();
    let currentPlaceholder = $state(0);
    let isFocused = $state(false);

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        if (value) window.location.href = `${base}/search?q=${encodeURIComponent(value)}`;
    }

    onMount(() => {
        setInterval(() => {
            if (isFocused || value) return;
            currentPlaceholder = currentPlaceholder + 1 >= placeholders.length ? 0 : currentPlaceholder + 1;
        }, 10000);
    });
</script>

<form
    onsubmit={onSubmit}
    {...props}
    class={cn(
        "flex border rounded-lg overflow-hidden h-11 w-full bg-background/50 focus-within:border-primary",
        props.class
    )}
>
    {#key currentPlaceholder}
        <!-- <span>{placeholders[currentPlaceholder]}</span> -->
        <input type="text" in:fade placeholder={placeholders[currentPlaceholder]} class="py-2 px-4 w-full outline-none bg-transparent" bind:value onfocus={() => isFocused = true} onblur={() => isFocused = false}/>
    {/key}
    <button class="p-2 w-11 h-11 flex-shrink-0 outline-none bg-none text-primary flex justify-center items-center enabled:scale-110 transition-transform duration-300" disabled={!value}>
        <Search size={20}/>
    </button>
</form>