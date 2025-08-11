import { Routes } from '@lrclib.js/api-types';
import { Utils } from './Utils.js';

export interface RESTOptions {
    baseURL?: string;
    headers?: HeadersInit;
    fetch?: typeof fetch;
}

export class REST implements RESTOptions {
    public static baseURL: string = 'https://lrclib.net';
    public static headers: HeadersInit = {
        'Accept': 'application/json',
        'Lrclib-Client': `lrclib.js@${Utils.version} (https://github.com/catplvsplus/lrclib.js)`
    };

    public baseURL = REST.baseURL;
    public headers = REST.headers;
    public fetch: typeof fetch = fetch;

    public constructor(options?: RESTOptions) {
        if (options?.baseURL) this.baseURL = options.baseURL;
        if (options?.headers) this.headers = options.headers;
        if (options?.fetch) this.fetch = options.fetch;
    }

    public async get<T extends keyof Routes.Metadata>(route: T, options?: REST.Options<Routes.Metadata[T][0]>, fetchClient: typeof fetch = this.fetch): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        return REST.get<T>(route, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options
        }, fetchClient);
    }

    public async post<T extends keyof Routes.Metadata>(route: T, options?: REST.Options<Routes.Metadata[T][0]>, fetchClient: typeof fetch = this.fetch): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        return REST.post<T>(route, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options,
        }, fetchClient);
    }

    public static async get<T extends keyof Routes.Metadata>(route: T, options?: REST.Options<Routes.Metadata[T][0]>, fetchClient: typeof fetch = fetch): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        const request = REST.parseOption(`${this.baseURL}${String(route)}`, {
            method: 'GET',
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options,
        });

        return fetchClient(`${this.baseURL}${String(route)}`, request);
    }

    public static async post<T extends keyof Routes.Metadata>(route: T, options?: REST.Options<Routes.Metadata[T][0]>, fetchClient: typeof fetch = fetch): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        const request = REST.parseOption(`${this.baseURL}${String(route)}`, {
            method: 'POST',
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options,
        });

        return fetchClient(request);
    }
}

export namespace REST {
    export interface JSONResponse<T = any> extends Omit<Response, 'json'> {
        json<R = T>(): Promise<R>;
    }

    export interface Options<J = any> extends Omit<RequestInit, 'headers'> {
        headers?: HeadersInit;
        json?: J;
    }

    export function parseOption(info: RequestInfo, options: Options): Request {
        options.headers = new Headers(options.headers ?? {});

        if (options.json) {
            options.headers.set('Content-Type', 'application/json');
            options.body = JSON.stringify(options.json ?? {});

            delete options.json;
        }

        return new Request(info, options);
    }
}