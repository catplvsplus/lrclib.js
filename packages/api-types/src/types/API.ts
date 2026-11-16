export namespace APIOptions {
    export namespace Get {
        export interface TrackSignatureOptions {
            /**
             * Title of the track
             */
            track_name: string;
            /**
             * Name of the artist
             */
            artist_name: string;
            /**
             * Name of the album (recommended)
             */
            album_name?: string;
            /**
             * Track's duration in seconds (must be between 1 and 3600)
             */
            duration?: number;
        }

        export interface TrackById {
            /**
             * ID of the lyrics record
             */
            id: number;
        }

        export interface SearchQuery {
            /**
             * Search for keyword present in ANY fields (track's title, artist name or album name)
             */
            q: string;
        }

        export interface SearchTrackSignature {
            /**
             * Search for keyword in track's title
             */
            track_name: string;
            /**
             * Search for keyword in artist's name
             */
            artist_name?: string;
            /**
             * Search for keyword in album's name
             */
            album_name?: string;
        }

        export type Search = SearchQuery|SearchTrackSignature;
    }

    export namespace Post {
        export interface PublishInstrumental {
            /**
             * Title of the track
             */
            trackName: string;
            /**
             * Track's artist name
             */
            artistName: string;
            /**
             * Track's album name
             */
            albumName: string;
            /**
             * Track's duration
             */
            duration: number;
        }

        export interface PublishSyncedLyrics extends PublishInstrumental {
            /**
             * Synced lyrics for the track
             */
            syncedLyrics: string;
        }

        export interface PublishPlainLyrics extends PublishInstrumental {
            /**
             * Plain lyrics for the track
             */
            plainLyrics: string;
        }

        export interface PublishLyricsfile extends PublishInstrumental {
            /**
             * Raw Lyricsfile YAML for the track.
             */
            lyricsfile: string;
        }

        export type Publish = PublishInstrumental|PublishSyncedLyrics|PublishPlainLyrics|PublishLyricsfile;

        export interface Flag {
            /**
             * ID of the track to flag
             */
            trackId: number;
            /**
             * 	Optional reason for the flag
             */
            content?: string;
        }

        export interface RequestChallenge {}
    }
}

export namespace APIResponse {
    export interface Error {
        code: number;
        name: string;
        message: string;
    }

    export namespace Get {
        export interface TrackSignature {
            /**
             * Unique, stable ID of the lyrics record
             */
            id: number;
            /**
             * Alias of trackName, kept for backwards compatibility
             */
            name: string;
            /**
             * Title of the track
             */
            trackName: string;
            /**
             * Name of the artist
             */
            artistName: string;
            /**
             * Name of the album
             */
            albumName: string;
            /**
             * Track duration in seconds
             */
            duration: number;
            /**
             * `true` when the track has no lyrics
             */
            instrumental: boolean;
            /**
             * `true` when `lyricsfile` contains word-level timings (`lines[].words`)
             */
            hasWordSync: boolean;
            /**
             * Plain, unsynced lyrics. `null` for instrumental records
             */
            plainLyrics: string|null;
            /**
             * LRC-formatted lyrics with line timestamps. `null` from instrumental records
             */
            syncedLyrics: string|null;
            /**
             * Raw Lyricsfile YAML document. Every record is guaranteed to include one
             */
            lyricsfile: string;
        }

        export type TrackById = TrackSignature;
        export type SearchQuery = TrackSignature[];
        export type SearchTrackSignature = TrackSignature[];

        export interface PartialSearch extends Omit<TrackSignature, 'plainLyrics'|'syncedLyrics'|'lyricsfile'> {
            /**
             * 	`true` when plain lyrics are available
             */
            hasPlainLyrics: boolean;
            /**
             * `true` when LRC-synced lyrics are available
             */
            hasSyncedLyrics: boolean;
            /**
             * `true` when a raw Lyricsfile YAML document is available
             */
            hasLyricsfile: boolean;
        }
    }

    export namespace Post {
        export type Publish = void;
        export type Flag = void;

        export interface RequestChallenge {
            prefix: string;
            target: string;
        }
    }
}

export interface APIError<Name extends APIError.Name|string> {
    code: Name extends APIError.Name ? APIError.Code[Name] : number;
    name: Name;
    message: string;
}

export namespace APIError {
    export const Code = {
        ValidationError: 400,
        IncorrectPublishTokenError: 400,
        InvalidAppIdError: 401,
        MissingApiKeyError: 401,
        InvalidApiKeyError: 401,
        TrackNotFound: 404,
        RateLimitExceeded: 429,
        UnknownError: 500,
        ServerOverloaded: 503
    } as const;

    export type Name = keyof typeof Code;
    export type Code = typeof Code;
}
export interface APIPublishTokenData {
    prefix: string;
    nonce: string;
}