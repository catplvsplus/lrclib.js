<script lang="ts">
    import Topbar from "@/components/shared/home/Topbar.svelte";

    let { children } = $props();
</script>

<Topbar/>
{@render children?.()}