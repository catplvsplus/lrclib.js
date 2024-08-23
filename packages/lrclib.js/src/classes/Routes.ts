import { Utils } from './Utils.js';
import type { APISearchResponse, APITrackSignatureResponse, RoutesGetCachedTrackLyricsOptions, RoutesGetIDLyricsOptions, RoutesGetSearchQueryOptions, RoutesGetTrackLyricsOptions, RoutesPostPublishOptions } from '../types/API.js';

export class Routes {
    public static [`/api/get`](options: RoutesGetTrackLyricsOptions): `/api/get` {
        return `/api/get${Utils.recordToSearchQuery(options)}` as `/api/get`;
    }

    public static [`/api/get-cached`](options: RoutesGetCachedTrackLyricsOptions): `/api/get-cached` {
        return `/api/get-cached${Utils.recordToSearchQuery(options)}` as `/api/get-cached`;
    }

    public static [`/api/get/{id}`](options: RoutesGetIDLyricsOptions): `/api/get/{id}` {
        return `/api/get/${options.id}` as `/api/get/{id}`;
    }

    public static [`/api/search`](options: RoutesGetSearchQueryOptions|RoutesGetSearchQueryOptions): `/api/search` {
        return `/api/search${Utils.recordToSearchQuery(options)}` as `/api/search`;
    }

    public static [`/api/publish`](): `/api/publish` {
        return `/api/publish`;
    }

    public static [`/api/request-challenge`](): `/api/request-challenge` {
        return `/api/request-challenge`;
    }
};

export interface RoutesMetadata {
    [`/api/get`]: [any, APITrackSignatureResponse];
    [`/api/get-cached`]: [any, APITrackSignatureResponse];
    [`/api/get`]: [any, APITrackSignatureResponse];
    [`/api/search`]: [any, APISearchResponse];
    [`/api/publish`]: [RoutesPostPublishOptions, any];
    [`/api/request-challenge`]: [any, any];
    [key: string]: [any, any];
}