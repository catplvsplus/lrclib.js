import ky, { type KyResponse, type Options } from 'ky';
import { Routes } from './Routes.js';
import { Utils } from './Utils.js';

export interface RESTOptions {
    baseURL?: string;
    headers?: Record<string, string>;
}

export class REST implements RESTOptions {
    public static baseURL: string = 'https://lrclib.net';
    public static headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Lrclib-Client': `lrclib.js@${Utils.version} (https://github.com/catplvsplus/lrclib.js)`
    };

    public baseURL = REST.baseURL;
    public headers = REST.headers;

    public constructor(options?: RESTOptions) {
        if (options?.baseURL) this.baseURL = options.baseURL;
        if (options?.headers) this.headers = options.headers;
    }

    public async get<T extends keyof Routes.Metadata>(route: T, options?: Options & { json?: Routes.Metadata[T][0] }): Promise<KyResponse<Routes.Metadata[T][1]>> {
        return REST.get<T>(route, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options
        });
    }

    public async post<T extends keyof Routes.Metadata>(route: T, options?: Options & { json?: Routes.Metadata[T][0] }): Promise<KyResponse<Routes.Metadata[T][1]>> {
        return REST.post<T>(route, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options,
        });
    }

    public static async get<T extends keyof Routes.Metadata>(route: T, options?: Options & { json?: Routes.Metadata[T][0] }): Promise<KyResponse<Routes.Metadata[T][1]>> {
        return ky.get<Routes.Metadata[T][1]>(`${this.baseURL}${String(route)}`, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options
        });
    }

    public static async post<T extends keyof Routes.Metadata>(route: T, options?: Options & { json?: Routes.Metadata[T][0] }): Promise<KyResponse<Routes.Metadata[T][1]>> {
        return ky.post<Routes.Metadata[T][1]>(`${this.baseURL}${String(route)}`, {
            headers: {
                ...this.headers,
                ...options?.headers
            },
            ...options,
        });
    }
}