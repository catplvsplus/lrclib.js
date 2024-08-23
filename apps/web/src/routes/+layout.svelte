<script lang="ts">
    import { ModeWatcher } from 'mode-watcher';
    import '$lib/styles/app.pcss';
    import '$lib/styles/global.scss';
    import Topbar from '../lib/components/Topbar.svelte';
</script>

<ModeWatcher defaultMode="system"/>
<Topbar/>
<slot/>
