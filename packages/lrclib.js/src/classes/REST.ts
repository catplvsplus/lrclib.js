import ky, { type Options } from 'ky';
import { Routes } from './Routes.js';
import { Utils } from './Utils.js';

export interface RESTOptions {
    baseURL?: string;
    baseHeaders?: Record<string, string>;
}

export class REST implements RESTOptions {
    public static baseURL: string = 'https://lrclib.net';
    public static baseHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Lrclib-Client': `lrclib.js@${Utils.version} (https://github.com/catplvsplus/lrclib.js)`
    };

    public baseURL = REST.baseURL;
    public baseHeaders = REST.baseHeaders;

    public constructor(options?: RESTOptions) {
        if (options?.baseURL) this.baseURL = options.baseURL;
        if (options?.baseHeaders) this.baseHeaders = options.baseHeaders;
    }

    public async get<T extends keyof Routes.Metadata>(route: T, options?: Options & { json?: Routes.Metadata[T][0] }): Promise<Routes.Metadata[T][1]> {
        return REST.get<T>(route, {
            headers: {
                ...this.baseHeaders,
                ...options?.headers
            },
            ...options
        });
    }

    public async post<T extends keyof Routes.Metadata>(route: T, options?: Options & { json?: Routes.Metadata[T][0] }): Promise<Routes.Metadata[T][1]> {
        return REST.post<T>(route, {
            headers: {
                ...this.baseHeaders,
                ...options?.headers
            },
            ...options,
        });
    }

    public static async get<T extends keyof Routes.Metadata>(route: T, options?: Options & { json?: Routes.Metadata[T][0] }): Promise<Routes.Metadata[T][1]> {
        return ky.get<Routes.Metadata[T][1]>(`${this.baseURL}${String(route)}`, {
            headers: {
                ...this.baseHeaders,
                ...options?.headers
            },
            ...options
        }).then(res => res.json());
    }

    public static async post<T extends keyof Routes.Metadata>(route: T, options?: Options & { json?: Routes.Metadata[T][0] }): Promise<Routes.Metadata[T][1]> {
        return ky.post<Routes.Metadata[T][1]>(`${this.baseURL}${String(route)}`, {
            headers: {
                ...this.baseHeaders,
                ...options?.headers
            },
            ...options,
        }).then(res => res.json());
    }
}