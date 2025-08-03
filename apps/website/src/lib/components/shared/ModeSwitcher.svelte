<script lang="ts">
    import { userPrefersMode } from 'mode-watcher';
    import { MonitorIcon, MoonIcon, SunIcon } from "@lucide/svelte";
    import { Tabs, TabsList } from '../ui/tabs';
    import TabsTrigger from '../ui/tabs/tabs-trigger.svelte';
    import { cn } from '../../helpers/utils';

    let props: { [key: string]: any; } = $props();
</script>

<Tabs {...props} bind:value={userPrefersMode.current}>
    <TabsList>
        <TabsTrigger value="light" class="size-8">
            <SunIcon/>
        </TabsTrigger>
        <TabsTrigger value="dark" class="size-8">
            <MoonIcon/>
        </TabsTrigger>
        <TabsTrigger value="system" class="size-8">
            <MonitorIcon/>
        </TabsTrigger>
    </TabsList>
</Tabs>