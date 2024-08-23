export interface RoutesGetTrackLyricsOptions {
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
    album_name: string;
    /**
     * Track's duration in seconds
     */
    duration: number;
}

export interface RoutesGetCachedTrackLyricsOptions extends RoutesGetTrackLyricsOptions {}

export interface RoutesGetIDLyricsOptions {
    /**
     * 	ID of the lyrics record
     */
    id: number;
}

export interface RoutesGetSearchQueryOptions {
    /**
     * Search for keyword present in ANY fields (track's title, artist name or album name)
     */
    q: string;
}

export interface RoutesGetSearchTrackFieldsOptions {
    /**
     * Search for keyword in track's title
     */
    track_name: string;
    /**
     * Search for keyword in track's artist name
     */
    artist_name?: string;
    /**
     * Search for keyword in track's album name
     */
    album_name?: string;
}

export interface RoutesPostPublishOptions {
    trackName: string;
    artistName: string;
    albumName: string;
    duration: number;
    plainLyrics: string;
    syncedLyrics: string;
}

export interface APIErrorResponse {
    code: number;
    name: string;
    message: string;
}

export interface APITrackSignatureResponse {
    /**
     * ID of the track
     */
    id: number;
    /**
     * Name of the track
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
     * Track's duration in seconds
     */
    duration: number;
    /**
     * Is the track instrumental
     */
    instrumental: boolean;
    /**
     * Plain lyrics
     */
    plainLyrics: string;
    /**
     * Synced lyrics
     */
    syncedLyrics: string;
}

export type APISearchResponse = APITrackSignatureResponse[];
