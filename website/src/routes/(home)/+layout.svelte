<script lang="ts">
    import Topbar from '$lib/components/app/Topbar.svelte';

    let { children } = $props();
</script>

<Topbar/>
<div class="w-full h-[calc(100%-4rem)]">
    {@render children()}
</div>