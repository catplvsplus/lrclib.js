<script lang="ts">
    import type { TrackSyncedLyrics } from 'lrclib';
    import { cn, getAdlibs } from '../helpers/utils';

    export let lyrics: TrackSyncedLyrics|string;
    export let currentTime: number;
    export let currentTimeLineIndex: number|undefined;
    export let allowBlur: boolean = false;

    let container: HTMLDivElement;
    let isSynced: boolean;

    $: lyrics, isSynced = typeof lyrics !== 'string';
    $: currentTimeLineIndex, (() => {
        const line = container?.querySelector<HTMLDivElement>(`#lyric-${currentTimeLineIndex}`);
        if (!line) return;

        // container.scrollTop = line.offsetTop - (container.offsetHeight / 2) + line.offsetHeight / 2;
        line.scrollIntoView({
            behavior: 'smooth',
            block: ('center'),
            inline: 'nearest'
        });
    })();
</script>

<div
    {...$$props}
    class={cn("h-full w-full overflow-y-auto text-5xl font-bold p-6 leading-relaxed no-scrollbar", $$props.class)}
    bind:this={container}
    style={isSynced ? "mask: var(--mask); -webkit-mask: var(--mask);" : ""}
>
    {#if typeof lyrics !== 'string'}
        {#each lyrics as line, index}
            {@const { adlibs, line: newLine } = getAdlibs(line.text)}
            <a
                href="#lyric-{index}"
                class={cn(
                    'block data-[active="true"]:text-white/80 data-[active="true"]:scale-105 data-[active="true"]:translate-x-[2%] data-[active="true"]:animate-glow hover:text-white/85 hover:!blur-0 text-muted-foreground/60',
                    allowBlur ? 'data-[active="false"]:blur-sm' : 'data-[active="false"]:opacity-55 noblur',
                    index === 0 ? 'beginning' : '',
                    index === lyrics.length - 1 ? 'ending' : ''
                )}
                id="lyric-{index}"
                style="transition: 0.5s; max-width: 90%;"
                on:click|preventDefault={() => currentTime = line.timeMs / 1000}
                data-active={index === currentTimeLineIndex}
            >
                {newLine}
                {#if adlibs.length}
                    {#each adlibs as adlib}
                        <p class="text-3xl font-normal adlib">{adlib}</p>
                    {/each}
                {/if}
            </a>
        {/each}
    {:else}
        {@const lines = (lyrics ?? '').split('\n')}
        {#each lines as line, index}
            {#if line}
                <p class={cn(
                        "select-text text-white/80",
                        index === 0 ? 'beginning' : '',
                        index === lines.length - 1 ? 'ending' : ''
                    )}
                >{line}</p>
            {:else}
                <br class="leading-10"/>
            {/if}
        {/each}
    {/if}
</div>

<style lang="scss">
    .beginning {
        margin-top: 50%;
    }

    p.beginning {
        margin-top: 10%;
    }

    .ending {
        margin-bottom: 50%;
    }

    @media (max-width: 760px) {
        div {
            @apply text-3xl leading-normal;

            a {
                @apply data-[active="true"]:scale-105 data-[active="true"]:translate-x-[2%];
                margin-bottom: 1rem;

                &:not(.noblur) {
                    @apply data-[active="false"]:blur-[2px];
                }
            }

            p {
                font-size: 1.4rem;
            }

            .beginning {
                margin-top: 40%;
            }

            .ending {
                margin-bottom: 20%;
            }
        }
    }

    @media (max-width: 430px) {
        div {
            padding: 1rem;
        }
    }
</style>