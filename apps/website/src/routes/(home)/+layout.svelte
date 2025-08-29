<script lang="ts">
    import Topbar from "@/components/shared/Topbar.svelte";
    import { cn } from '$lib/helpers/utils';
    import GradientBackground from '@/components/shared/GradientBackground.svelte';

    let { children } = $props();
</script>

<Topbar/>

<div class={cn("min-h-full pt-16 flex justify-center relative overflow-clip")}>
    <GradientBackground/>
    <main class="container p-4 flex flex-col gap-4 z-10">
        {@render children?.()}
    </main>
</div>