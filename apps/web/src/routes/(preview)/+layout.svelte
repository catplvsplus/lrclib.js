<script lang="ts">
    import Topbar from "$lib/components/Topbar.svelte";
    import { isPlaying } from "$lib/stores/isPlaying";
</script>

<Topbar transparent={!$isPlaying}/>
<div class="h-full">
    <slot/>
</div>
