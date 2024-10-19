<script lang="ts">
    import Topbar from "$lib/components/Topbar.svelte";
    import { isPlaying } from "$lib/stores/isPlaying";
</script>

<Topbar bind:transparent={$isPlaying} bindSearchValue={false}/>
<div class="h-full">
    <slot/>
</div>
