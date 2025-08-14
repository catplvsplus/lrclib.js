<script lang="ts">
    import { Button } from '../../../lib/components/ui/button';
    import { Card, CardDescription, CardHeader, CardTitle } from '../../../lib/components/ui/card';
    import { Input } from '../../../lib/components/ui/input';
    import { player } from '../../../lib/helpers/classes/Player.svelte';
    import { PlayerTrack } from '../../../lib/helpers/classes/PlayerTrack.svelte';

    let parsing = $state(false);

    async function handleFileUpload(event: Event & { currentTarget: HTMLInputElement }) {
        const files = event.currentTarget.files;

        parsing = true;

        for (const file of files ?? []) {
            const track = await PlayerTrack.fromFile({
                file,
                fetch: true
            });

            player.play(track);
        }

        parsing = false;
    }
</script>

<Input type="file" accept="audio/*" multiple onchange={handleFileUpload} disabled={parsing}/>
<div>{player.queue.length} tracks</div>
<div class="flex gap-2">
    <Button disabled={!player.queue.length} onclick={() => player.clear()}>Clear</Button>
    <Button disabled={!player.skippable} onclick={() => player.skip()}>Play Next</Button>
    <Button disabled={!player.previousable} onclick={() => player.previous()}>Play Previous</Button>
    <Button disabled={!player.player} onclick={() => player.status === 'paused' ? player.play() : player.pause()}>{player.status === 'paused' ? 'Resume' : 'Pause'}</Button>
    <Button disabled={!player.player} onclick={() => player.stop()}>Stop</Button>
</div>
<div class="grid grid-cols-2 gap-2 w-full">
    <div class="grid gap-2">
        {#if player.playing}
            <Card class="border-2 border-primary">
                <CardHeader>
                    <CardTitle>Now Playing</CardTitle>
                    <CardDescription>{player.playing.title} - {player.playing?.artist}</CardDescription>
                </CardHeader>
            </Card>
        {:else}
            <div>No track is currently playing.</div>
        {/if}
        {#each player.queue as track (track.id)}
            <Card>
                <CardHeader>
                    <CardTitle>{track.title}</CardTitle>
                    <CardDescription>{track.artist} - {track.album}</CardDescription>
                </CardHeader>
            </Card>
        {/each}
    </div>
    <div class="grid gap-2 opacity-80">
        {#each player.history as track (track.id)}
            <Card>
                <CardHeader>
                    <CardTitle>{track.title}</CardTitle>
                    <CardDescription>{track.artist} - {track.album}</CardDescription>
                </CardHeader>
            </Card>
        {/each}
    </div>
</div>