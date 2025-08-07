<script lang="ts">
    import Sidebar from '@/components/shared/main/Sidebar.svelte';
    import Topbar from '@/components/shared/Topbar.svelte';
    import { cn } from '$lib/helpers/utils';

    let { children } = $props();
</script>

<Topbar/>
<div class={cn("min-h-full pt-16 flex justify-center relative overflow-clip sm:pb-0 pb-20")}>
    <div class={cn("bg-radial -top-1/4 from-primary/10 to-transparent to-80% absolute size-dvh")}></div>
    <main class="container sm:pt-4 sm:pl-4 flex gap-4 z-10">
        <Sidebar/>
        <div class="w-full p-4 pl-0">
            {@render children?.()}
        </div>
    </main>
</div>