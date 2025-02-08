import type { APIOptions, APIResponse } from '../types/API.js';
import { Utils } from './Utils.js';

export class Routes {
    private constructor() {}

    public static [`/api/get`](options: APIOptions.Get.TrackSignatureOptions): `/api/get` {
        return `/api/get${Utils.recordToQueries(options)}` as `/api/get`;
    }

    public static [`/api/get/{id}`](options: APIOptions.Get.TrackById): `/api/get/{id}` {
        return `/api/get/${options.id}` as `/api/get/{id}`;
    }

    public static [`/api/search`](options: APIOptions.Get.Search): `/api/search` {
        return `/api/search${Utils.recordToQueries(options)}` as `/api/search`;
    }

    public static [`/api/publish`](): `/api/publish` {
        return `/api/publish`;
    }

    public static [`/api/request-challenge`](): `/api/request-challenge` {
        return `/api/request-challenge`;
    }
}

export namespace Routes {
    export interface Metadata {
        [`/api/get`]: [APIOptions.Get.TrackSignatureOptions, APIResponse.Get.TrackSignature];
        [`/api/get/{id}`]: [APIOptions.Get.TrackById, APIResponse.Get.TrackById];
        [`/api/search`]: [APIOptions.Get.Search, APIResponse.Get.SearchQuery];
        [`/api/publish`]: [APIOptions.Post.Publish, APIResponse.Post.Publish];
        [`/api/request-challenge`]: [APIOptions.Post.RequestChallenge, APIResponse.Post.RequestChallenge];
        [key: string]: [any, any];
    }
}