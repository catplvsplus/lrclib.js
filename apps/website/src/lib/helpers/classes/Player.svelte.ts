import type { PlayerTrack } from './PlayerTrack.svelte';

export class Player {
    public queue: PlayerTrack[] = $state([]);
    public playing: PlayerTrack|null = $state(null);
    public history: PlayerTrack[] = $state([]);

    public player: HTMLAudioElement|null = $state(null);
}

export namespace Player {
}