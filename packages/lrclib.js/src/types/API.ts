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
             * Name of the album
             */
            album_name?: string;
            /**
             * Track's duration in seconds
             */
            duration: number;
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
        export interface Publish {
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
            /**
             * Plain lyrics for the track
             */
            plainLyrics: string;
            /**
             * Synchronized lyrics for the track
             */
            syncedLyrics: string;
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
            trackName: string;
            artistName: string;
            albumName: string;
            duration: number;
            instrumental: boolean;
            plainLyrics: string;
            syncedLyrics: string;
        }

        export interface TrackById extends TrackSignature {}

        export interface SearchQuery extends Array<TrackSignature> {}

        export interface SearchTrackSignature extends Array<TrackSignature> {}
    }

    export namespace Post {
        export interface Publish {}

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