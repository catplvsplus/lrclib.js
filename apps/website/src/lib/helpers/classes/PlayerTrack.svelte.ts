import { LRC, type APIResponse } from 'lrclib.js';
import { LyricsContentType, type IAudioMetadata } from 'music-metadata';
import { formatLRCDuration } from '../metadata';

export class PlayerTrack {
    public lyrics?: APIResponse.Get.TrackSignature;
    public metadata?: IAudioMetadata;
    public cover?: string;
    public audio: File;

    constructor(options: PlayerTrack.Options) {
        this.lyrics = options.lyrics;
        this.audio = options.audio;
        this.metadata = options.metadata;
    }

    get plainLyrics() {
        return this.lyrics?.plainLyrics
            ?? this.metadata?.common.lyrics?.find(l => l.contentType === LyricsContentType.lyrics && l.text)?.text
            ?? ((this.lyrics?.syncedLyrics ? LRC.toPlain(LRC.parse(this.lyrics.syncedLyrics)).trim() : null) || null);
    }

    get syncedLyrics() {
        return this.lyrics?.syncedLyrics
            ?? this.metadata?.common.lyrics
                ?.find(l => l.contentType === LyricsContentType.lyrics && l.syncText)?.syncText
                .map(l => `[${formatLRCDuration(l.timestamp ?? 0)}] ${l.text}`)
                .join('\n')
            ?? null;
    }

    get duration() {
        return this.lyrics?.duration || this.metadata?.format.duration;
    }

    get title() {
        return this.lyrics?.trackName || this.metadata?.common.title;
    }

    get artist() {
        return this.lyrics?.artistName || this.metadata?.common.artist;
    }

    get album() {
        return this.lyrics?.albumName || this.metadata?.common.album;
    }
}

export namespace PlayerTrack {
    export interface Options {
        lyrics: APIResponse.Get.TrackSignature;
        audio: File;
        metadata: IAudioMetadata;
    }
}