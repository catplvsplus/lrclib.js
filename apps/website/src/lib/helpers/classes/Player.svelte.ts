import { toast } from 'svelte-sonner';
import { PlayerTrack } from './PlayerTrack.svelte';

export class Player {
    public queue: PlayerTrack[] = $state([]);
    public playing: PlayerTrack|null = $state(null);
    public history: PlayerTrack[] = $state([]);

    public player: HTMLAudioElement|null = $state(null);
    public status: Player.Status|null = $state(null);
    public currentTime: number = $state(0);

    public skippable: boolean = $derived(!!this.queue.length && !!this.player);
    public previousable: boolean = $derived(!!this.history.length && !!this.player);
    public progress: number = $derived.by(() => {
        return this.player && this.playing ? (this.currentTime / this.player.duration) * 100 : 0;
    });

    public filesParsing: File[] = $state([]);
    public filesInput: HTMLInputElement|null = $state(null);

    get tracks() {
        return [this.queue, this.playing ? [this.playing] : [], this.history].flat();
    }

    public async initialize(audio?: HTMLAudioElement) {
        if (this.player) {
            console.warn('Player already initialized');
            return;
        }

        this.player = audio ?? new Audio();

        this.player.addEventListener('pause', () => this.status = 'paused');
        this.player.addEventListener('play', () => this.status = 'playing');
        this.player.addEventListener('playing', () => this.status = 'playing');

        this.player.addEventListener('waiting', () => this.status = 'buffering');
        this.player.addEventListener('loadstart', () => this.status = 'buffering');
        this.player.addEventListener('abort', () => this.stop());

        const endOrSkip = () => {
            if (!this.queue.length) {
                const currentTrack = this.playing;

                if (currentTrack) {
                    this.history.unshift(currentTrack);
                    this.playing = null;
                }

                this.status = null;
                this.player!.src = '';
                this.player!.currentTime = 0;
                return;
            }

            this.skip();
        }

        this.player.addEventListener('error', () => endOrSkip());
        this.player.addEventListener('ended', () => endOrSkip());
        this.player.addEventListener('timeupdate', () => this.currentTime = this.player?.currentTime ?? 0);
    }

    public async destroy() {
        if (this.player) {
            this.stop();
            this.player.remove();
            this.player = null;
        }

        for (const track of this.tracks) {
            track.destroy();
            this.remove(track);
        }

        this.queue = [];
        this.playing = null;
        this.history = [];
    }

    public add(track: PlayerTrack): this {
        this.queue.push(track);
        return this;
    }

    public addNext(track: PlayerTrack): this {
        this.queue.unshift(track);
        return this;
    }

    public remove(track: PlayerTrack|number): this {
        const index = typeof track === 'number' ? track : this.queue.indexOf(track);
        if (index !== -1) this.queue.splice(index, 1);
        return this;
    }

    public clear(): this {
        this.queue = [];
        return this;
    }

    public clearHistory(): this {
        for (const track of this.history) {
            track.destroy();
        }

        this.history = [];
        return this;
    }

    public stop(): this {
        if (!this.player) throw new Error('Player not initialized');

        const currentTrack = this.playing;

        if (currentTrack) {
            this.history.unshift(currentTrack);
            this.remove(currentTrack);
            this.playing = null;
        }

        this.player.currentTime = 0;
        this.player.pause();
        this.player.src = '';

        return this;
    }

    public async play(track?: PlayerTrack): Promise<void> {
        if (!this.player) throw new Error('Player not initialized');

        switch (this.status) {
            case 'buffering':
            case 'playing':
                if (track) this.add(track);
                break;
            case 'paused':
                if (track) {
                    this.add(track);
                } else {
                    this.player.play();
                }
                break;
            default:
                this.load(track);
                this.player.play();
                break;
        }
    }

    public load(track?: PlayerTrack): this {
        if (!this.player) throw new Error('Player not initialized');

        track ??= this.queue.at(0);
        if (!track || this.playing) return this;

        this.player.src = track.audioURL;
        this.player.currentTime = 0;
        this.player.load();
        this.playing = track;

        console.log(`Now playing: ${track.title} - ${track.artist}`, track.audioURL);

        return this;
    }

    public async skip(to: number = 0): Promise<void> {
        if (!this.player) throw new Error('Player not initialized');
        if (!this.queue.length) return;

        const addToHistory = this.queue.splice(0, to);
        const nextTrack = this.queue.shift();
        const currentTrack = this.playing;

        if (currentTrack) {
            this.history.unshift(currentTrack);
            this.playing = null;
        }

        if (nextTrack) {
            this.load(nextTrack);
            this.player.play();
        }

        for (const track of addToHistory) {
            this.history.unshift(track);
        }
    }

    public async previous(): Promise<void> {
        if (!this.player) throw new Error('Player not initialized');
        if (!this.history.length) return;

        const previousTrack = this.history.shift();
        const currentTrack = this.playing;

        if (!previousTrack) return;

        if (currentTrack) {
            this.queue.unshift(currentTrack);
            this.playing = null;
        }

        this.load(previousTrack);
        this.player.play();
    }

    public move(from: number, to: number): this {
        if (!this.player) throw new Error('Player not initialized');
        if (from < 0 || from >= this.queue.length || to < 0 || to >= this.queue.length) return this;

        const [track] = this.queue.splice(from, 1);
        this.queue.splice(to, 0, track);
        return this;
    }

    public pause(): this {
        if (!this.player) throw new Error('Player not initialized');
        this.player.pause();
        return this;
    }

    public async addTracksFromFiles(files: FileList): Promise<void> {
        this.filesParsing.push(...Array.from(files));

        for (const file of files) {
            await PlayerTrack
                .fromFile({ file })
                .then(async track => {
                    this.filesParsing = this.filesParsing.filter(f => f !== file);
                    track.status = 'fetching';

                    await player.play(track);
                    await track.fetchMetadata().catch(console.error);

                    track.fetch()
                        .catch(console.error)
                        .finally(() => {
                            track.status = null;
                        });

                    return track;
                })
                .catch(err => {
                    console.error(err);
                    toast.error(String(err));
                    return null;
                });
        }
    }
}

export namespace Player {
    export type Status = 'playing'|'paused'|'buffering'|'error';
}

export const player = new Player();