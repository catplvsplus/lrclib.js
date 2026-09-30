import { AudioPlayer, type QueueItem } from '@groovytune/player';
import { ACCEPTED_AUDIO_TYPES } from '../helpers/constants';
import { PlayerTrack } from './PlayerTrack.svelte';
import type { Track } from 'lrclib.js';

export class Player extends AudioPlayer {
    public async init(options?: AudioPlayer.Options<QueueItem>): Promise<void> {
        super.init(options);
    }

    public async playFiles(files: File[], lyrics?: Track): Promise<void> {
        for (const file of files) {
            if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
                console.warn(`File type ${file.type} is not supported. Skipping file ${file.name}.`);
                continue;
            }

            const track = new PlayerTrack({ source: file, lyrics });

            await this.play(track);
            track.getMetadata().catch(err => console.error('Failed to get metadata for track', err));
        }
    }
}