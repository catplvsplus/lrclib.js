import { APIError, LrclibAPIError, Routes } from '@lrclib.js/api-types';
import { Utils } from './Utils.js';

export interface RESTOptions {
    baseURL?: string;
    headers?: HeadersInit;
    fetch?: typeof fetch;
    retries?: number;
    timeout?: number;
}

export class REST implements RESTOptions {
    public static baseURL: string = 'https://lrclib.net';
    public static headers: HeadersInit = {
        'Accept': 'application/json',
        'Lrclib-Client': `lrclib.js@${Utils.version} (https://github.com/catplvsplus/lrclib.js)`
    };

    public baseURL: string = REST.baseURL;
    public headers: Headers = new Headers(REST.headers);
    public fetch: typeof fetch = fetch;
    public retries: number = 3;
    public timeout: number = 5000;

    public constructor(options?: RESTOptions) {
        if (options?.baseURL) this.baseURL = options.baseURL;
        if (options?.headers) this.headers = new Headers(options.headers);
        if (options?.fetch) this.fetch = options.fetch;
        if (options?.retries !== undefined) this.retries = options.retries;
        if (options?.timeout !== undefined) this.timeout = options.timeout;
    }

    public async get<T extends keyof Routes.Metadata>(
        route: T,
        options?: REST.Options<Routes.Metadata[T][0]>,
        fetchClient: typeof fetch = this.fetch
    ): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        return REST.fetch<T>(route, {
            method: 'GET',
            headers: {
                ...this.headers,
                ...options?.headers
            },
            retries: this.retries,
            timeout: this.timeout,
            ...options
        }, fetchClient);
    }

    public async post<T extends keyof Routes.Metadata>(
        route: T,
        options?: REST.Options<Routes.Metadata[T][0]>,
        fetchClient: typeof fetch = this.fetch
    ): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        return REST.fetch<T>(route, {
            method: 'POST',
            headers: {
                ...this.headers,
                ...options?.headers
            },
            retries: this.retries,
            timeout: this.timeout,
            ...options,
        }, fetchClient);
    }

    /**
     * @deprecated Use `REST.fetch` instead. This method will be removed in future versions.
     */
    public static async post<T extends keyof Routes.Metadata>(
        route: T,
        options?: REST.Options<Routes.Metadata[T][0]> & Partial<Record<'retries'|'timeout', number>>,
        fetchClient: typeof fetch = fetch
    ): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        return REST.fetch<T>(
            route,
            {
                method: 'POST',
                ...options
            },
            fetchClient
        );
    }

    /**
     * @deprecated Use `REST.fetch` instead. This method will be removed in future versions.
     */
    public static async get<T extends keyof Routes.Metadata>(
        route: T,
        options?: REST.Options<Routes.Metadata[T][0]> & Partial<Record<'retries'|'timeout', number>>,
        fetchClient: typeof fetch = fetch
    ): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        return REST.fetch<T>(
            route,
            {
                method: 'GET',
                ...options
            },
            fetchClient
        );
    }

    public static async fetch<T extends keyof Routes.Metadata>(
        route: T,
        options?: REST.Options<Routes.Metadata[T][0]> & Pick<Required<REST.Options<Routes.Metadata[T][0]>>, 'method'> & Partial<Record<'retries'|'timeout', number>>,
        fetchClient: typeof fetch = fetch
    ): Promise<REST.JSONResponse<Routes.Metadata[T][1]>> {
        let retries = options?.retries ?? 3;
        let attempts = 0;

        while (true) {
            const request = REST.createRequest(`${this.baseURL}${String(route)}`, {
                method: '',
                redirect: 'follow',
                headers: {
                    ...this.headers,
                    ...options?.headers
                },
                ...options,
            });

            const response = await fetchClient(`${this.baseURL}${String(route)}`, request);

            if (response.ok) {
                return response;
            }

            if (
                (response.status !== APIError.Code.RateLimitExceeded && response.status !== APIError.Code.ServerOverloaded) ||
                (retries && attempts >= retries)
            ) {
                throw new LrclibAPIError(
                    response.headers.get('Content-Type') === 'application/json'
                        ? await response.json()
                        : {
                            code: response.status,
                            name: response.statusText,
                            message: await response.text()
                        }
                );
            }

            const retryAfter = Number(response.headers.get('Retry-After'));
            const delay = Number.isFinite(retryAfter) && retryAfter > 0
                ? retryAfter * 1000
                : 1000 * Math.pow(2, attempts);

            await new Promise(resolve => setTimeout(resolve, delay));
            attempts++;
        }
    }
}

export namespace REST {
    export interface JSONResponse<T = any> extends Omit<Response, 'json'> {
        json<R = T>(): Promise<R>;
    }

    export interface Options<J = any> extends Omit<RequestInit, 'headers'> {
        method?: 'GET'|'POST'|'PUT'|'DELETE'|'PATCH'|(string & {});
        headers?: HeadersInit;
        json?: J;
    }

    /**
     * @deprecated Use `REST.createRequest` instead. This method will be removed in future versions.
     */
    export function parseOption(info: RequestInfo, options: Options): Request {
        return REST.createRequest(info, options);
    }

    export function createRequest(info: RequestInfo, options: Options): Request {
        options.headers = new Headers(options.headers ?? {});

        if (options.json) {
            options.headers.set('Content-Type', 'application/json');
            options.body = JSON.stringify(options.json ?? {});

            delete options.json;
        }

        return new Request(info, options);
    }
}