<script lang="ts">
    import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
    import { userInterface } from '$lib/helpers/classes/UserInterface.svelte';
    import { Button } from '@/components/ui/button/index';
    import { ListMusicIcon, MicVocalIcon } from '@lucide/svelte';
    import { cn } from '$lib/helpers/utils';
</script>

<div class="flex items-center gap-2 w-full justify-between lg:justify-end">
    <Tooltip>
        <TooltipTrigger>
            {#snippet child({ props })}
                <Button
                    {...props}
                    size="icon"
                    variant="secondary"
                    class={cn(
                        "size-10 lg:w-fit lg:px-4 rounded-full overflow-hidden relative bg-foreground/10 hover:bg-foreground/20 text-foreground/80 font-semibold text-sm",
                        userInterface.playerMenu === 'lyrics' ? "bg-foreground/30 text-foreground" : ""
                    )}
                    onclick={() => userInterface.playerMenu = 'lyrics'}
                >
                    <MicVocalIcon class="size-5"/>
                    <span class="hidden lg:block">
                        Lyrics
                    </span>
                </Button>
            {/snippet}
        </TooltipTrigger>
        <TooltipContent>Show lyrics</TooltipContent>
    </Tooltip>
    <Tooltip>
        <TooltipTrigger>
            {#snippet child({ props })}
                <Button
                    {...props}
                    size="icon"
                    variant="secondary"
                    class={cn(
                        "size-10 xl:w-fit xl:px-4 rounded-full overflow-hidden relative bg-foreground/10 hover:bg-foreground/20 text-foreground/80 font-semibold text-sm",
                        userInterface.playerMenu === 'queue' ? "bg-foreground/30 text-foreground" : ""
                    )}
                    onclick={() => userInterface.playerMenu = 'queue'}
                >
                    <ListMusicIcon class="size-5"/>
                    <span class="hidden xl:block">
                        Queue
                    </span>
                </Button>
            {/snippet}
        </TooltipTrigger>
        <TooltipContent>Show queue</TooltipContent>
    </Tooltip>
</div>