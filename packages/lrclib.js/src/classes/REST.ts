import ky, { type Options } from 'ky';
import type { RoutesMetadata } from './Routes.js';

export interface RESTOptions {
    baseURL?: string;
}

export class REST {
    public static baseURL: string = 'https://lrclib.net';
    public static headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    public baseURL: string = REST.baseURL;
    public headers: Record<string, string> = REST.headers;

    constructor(options?: RESTOptions) {
        this.baseURL = options?.baseURL ?? this.baseURL;
    }

    public async get<T extends keyof RoutesMetadata>(route: T, options?: Options & { json?: RoutesMetadata[T][0] }): Promise<RoutesMetadata[T][1]> {
        return REST.get<T>(route, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options
        });
    }

    public async post<T extends keyof RoutesMetadata>(route: T, options?: Options & { json?: RoutesMetadata[T][0] }): Promise<RoutesMetadata[T][1]> {
        return REST.post<T>(route, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options,
        });
    }

    public static async get<T extends keyof RoutesMetadata>(route: T, options?: Options & { json?: RoutesMetadata[T][0] }): Promise<RoutesMetadata[T][1]> {
        return ky.get<RoutesMetadata[T][1]>(`${this.baseURL}${String(route)}`, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options
        }).then(res => res.json());
    }

    public static async post<T extends keyof RoutesMetadata>(route: T, options?: Options & { json?: RoutesMetadata[T][0] }): Promise<RoutesMetadata[T][1]> {
        return ky.post<RoutesMetadata[T][1]>(`${this.baseURL}${String(route)}`, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options,
        }).then(res => res.json());
    }
}