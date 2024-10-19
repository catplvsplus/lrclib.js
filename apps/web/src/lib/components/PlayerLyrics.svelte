<script lang="ts">
    import type { TrackSyncedLyrics } from 'lrclib';
    import { cn, getAdlibs, getBlurAmount } from '../helpers/utils';

    export let lyrics: TrackSyncedLyrics|string;
    export let currentTime: number;
    export let currentTimeLineIndex: number|undefined;
    export let allowBlur: boolean = false;

    let container: HTMLDivElement;
    let isSynced: boolean;
    let scrollOwner: 'user'|'auto' = 'auto';

    $: lyrics, isSynced = typeof lyrics !== 'string';
    $: currentTimeLineIndex, (() => {
        const line = container?.querySelector<HTMLDivElement>(`#lyric-${currentTimeLineIndex}`);
        if (!line) return;

        // container.scrollTop = line.offsetTop - (container.offsetHeight / 2) + line.offsetHeight / 2;
        if (scrollOwner === 'auto') {
            line.scrollIntoView({
                behavior: 'smooth',
                block: ('center'),
                inline: 'nearest'
            });
        } else {
            updateScrollOwner();
        }
    })();

    function updateScrollOwner() {
        if (!isSynced) return;

        const line = container?.querySelector<HTMLDivElement>(`#lyric-${currentTimeLineIndex}`);
        if (!line) return;

        const isVisible = container.scrollTop > line.offsetTop - (container.offsetHeight / 2) + line.offsetHeight / 2 || container.scrollTop < line.offsetTop - (container.offsetHeight / 2) - line.offsetHeight / 2;

        if (isVisible && scrollOwner === 'auto') {
            scrollOwner = 'user';
        } else if (!isVisible && scrollOwner === 'user') {
            scrollOwner = 'auto';
        }
    }
</script>

<div
    {...$$props}
    class={cn("h-full w-full overflow-y-auto text-5xl font-bold p-6 leading-relaxed no-scrollbar", $$props.class)}
    bind:this={container}
    style={isSynced ? "mask: var(--mask); -webkit-mask: var(--mask);" : ""}
    on:wheel={updateScrollOwner}
>
    {#if typeof lyrics !== 'string'}
        {#each lyrics as line, index}
            {@const { startAdlibs, endAdlibs, line: newLine } = getAdlibs(line.text)}
            {@const blurAmount = allowBlur
                ? typeof currentTimeLineIndex === 'number'
                    ? getBlurAmount(index, currentTimeLineIndex ?? index)
                    : 'filter: blur(2px);'
                : ''}
            {@const active = index === currentTimeLineIndex}
            <a
                href="#lyric-{index}"
                class={cn(
                    'block data-[active="true"]:scale-105 data-[active="true"]:translate-x-[2%] hover:text-white/60 hover:!blur-0 text-neutral-400/60',
                    allowBlur ? 'data-[active="false"]:opacity-55 data-[active="true"]:animate-glow data-[active="true"]:text-white/80' : 'text-neutral-400/50 data-[active="true"]:text-white noblur',
                    index === 0 ? 'beginning' : '',
                    index === lyrics.length - 1 ? 'ending' : ''
                )}
                id="lyric-{index}"
                style="transition: 0.5s; max-width: 90%;{blurAmount}"
                on:click|preventDefault={() => {
                    currentTime = line.timeMs / 1000;
                    updateScrollOwner();
                }}
                data-active={active}
            >
                {#if startAdlibs.length}
                    {#each startAdlibs as adlib}
                        <p class="text-3xl font-normal adlib">{adlib}</p>
                    {/each}
                {/if}
                {newLine}
                {#if endAdlibs.length}
                    {#each endAdlibs as adlib}
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