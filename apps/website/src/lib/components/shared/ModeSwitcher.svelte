<script lang="ts">
    import { userPrefersMode } from 'mode-watcher';
    import { MonitorIcon, MoonIcon, SunIcon } from "@lucide/svelte";
    import { Tabs, TabsList } from '../ui/tabs';
    import TabsTrigger from '../ui/tabs/tabs-trigger.svelte';

    let {
        labels = false,
        ...props
    }: {
        labels?: boolean;
        [key: string]: any;
    } = $props();
</script>

<Tabs bind:value={userPrefersMode.current}>
    <TabsList {...props}>
        <TabsTrigger value="light" class={!labels ? "size-8" : "h-full w-fit"}>
            <SunIcon/>
            <span class:hidden={!labels}>Light</span>
        </TabsTrigger>
        <TabsTrigger value="dark" class={!labels ? "size-8" : "h-full w-fit"}>
            <MoonIcon/>
            <span class:hidden={!labels}>Dark</span>
        </TabsTrigger>
        <TabsTrigger value="system" class={!labels ? "size-8" : "h-full w-fit"}>
            <MonitorIcon/>
            <span class:hidden={!labels}>System</span>
        </TabsTrigger>
    </TabsList>
</Tabs>