<script lang="ts">
    import { ModeWatcher } from 'mode-watcher';
    import '$lib/styles/app.pcss';
    import '$lib/styles/global.scss';
</script>

<ModeWatcher defaultMode="system"/>
<slot/>