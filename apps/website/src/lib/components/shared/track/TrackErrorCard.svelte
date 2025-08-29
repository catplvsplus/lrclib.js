<script lang="ts">
    import { Card, CardContent } from "@/components/ui/card";
    import { CloudAlertIcon } from '@lucide/svelte';

    let {
        id
    }: {
        id: number;
    } = $props();
</script>

<Card>
    <CardContent>
        <CloudAlertIcon class="size-16 mx-auto"/>
        <div class="text-center">
            <h4 class="font-bold text-lg">Track unavailable</h4>
            <p class="text-sm opacity-70">This track is not saved offline</p>
            <span class="text-xs opacity-60">Track ID: {id}</span>
        </div>
    </CardContent>
</Card>