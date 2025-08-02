<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { mode, toggleMode } from 'mode-watcher';
    import Logo from '../../lib/components/svg/logo.svelte';
</script>
<Button onclick={toggleMode}>
    <Logo/>
</Button>