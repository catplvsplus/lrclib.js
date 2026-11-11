import { AudioPlayer } from '@groovytune/player';
import { ACCEPTED_AUDIO_TYPES } from '../helpers/constants';
import { PlayerTrack } from './PlayerTrack.svelte';
import type { Track } from 'lrclib.js';
import { resource } from 'runed';
import { braccatoLyricsToAppleMusicLyrics } from '../helpers/lyrics';
import { LRCParser } from '@braccato/parsers';

export class Player extends AudioPlayer<PlayerTrack> {
    private _currentCoverImage = resource(
        () => this.current,
        async track => track?.getImageURL()
    );

    private _currentMetadata = resource(
        () => this.current,
        async track => track?.getMetadata()
    );

    private _currentLyrics = resource(
        () => this.current,
        async track => track?.getLyrics()
    );

    private _currentSyncedLyrics = resource(
        () => this._currentLyrics.current,
        async lyrics => lyrics?.isSynced()
            ? braccatoLyricsToAppleMusicLyrics(LRCParser.parse(lyrics.syncedLyrics))
            : null
    );

    public currentCoverImage = $derived(this._currentCoverImage.current);
    public currentMetadata = $derived(this._currentMetadata.current);
    public currentLyrics = $derived(this._currentLyrics.current);
    public currentSyncedLyrics = $derived(this._currentSyncedLyrics.current);

    public async init(options?: AudioPlayer.Options<PlayerTrack>): Promise<void> {
        super.init(options);
    }

    public async playFiles(files: File[], lyrics?: Track): Promise<void> {
        for (const file of files) {
            if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
                console.warn(`File type ${file.type} is not supported. Skipping file ${file.name}.`);
                continue;
            }

            const track = new PlayerTrack({ source: file, lyrics });

            this.queue.add([track]);
            track.getMetadata().catch(err => console.error('Failed to get metadata for track', err));
        }

        await this.play();
    }
}