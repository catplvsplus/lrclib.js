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
            id: number;
            name: string;
            trackName: string;
            artistName: string;
            albumName: string;
            duration: number;
            instrumental: boolean;
            plainLyrics: string|null;
            syncedLyrics: string|null;
            lyricsfile: string;
        }

        export type TrackById = TrackSignature;
        export type SearchQuery = TrackSignature[];
        export type SearchTrackSignature = TrackSignature[];
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

export interface APIPublishTokenData {
    prefix: string;
    nonce: string;
}