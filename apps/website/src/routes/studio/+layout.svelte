<script lang="ts">
    import NavBar from '$lib/components/shared/NavBar.svelte';

    let props = $props();
</script>

<NavBar addSearchBox={true}/>
{@render props.children?.()}