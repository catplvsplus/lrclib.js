<script lang="ts">
    import Topbar from "@/components/shared/Topbar.svelte";
    import { cn } from '$lib/helpers/utils';

    let { children } = $props();
</script>

<Topbar/>

<div class={cn("min-h-full pt-16 flex justify-center relative overflow-clip")}>
    <div class={cn("bg-radial -top-1/4 from-primary/10 to-transparent to-80% absolute size-dvh")}></div>
    <main class="container p-4 flex flex-col gap-4 z-10">
        {@render children?.()}
    </main>
</div>