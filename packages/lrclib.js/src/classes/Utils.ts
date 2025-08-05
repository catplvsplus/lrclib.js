export namespace Utils {
    /**
     * The version of the library
     */
    export const version: string = '[VI]{{inject}}[/VI]';

    /**
     * Convert a record to a query string
     * @param record The record to convert to queries
     * @returns The query string
     */
    export function recordToQueries(record: Record<string, any>): string {
        const entries = Object.entries(record);
        if (!entries.length) return '';

        return '?' + entries
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    }

    export interface JSONEncodable<T> {
        toJSON(): T;
    }

    export function isJSONEncodable<T = any>(value: any): value is JSONEncodable<T> {
        return typeof value.toJSON === 'function';
    }
}