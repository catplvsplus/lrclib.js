export namespace Utils {
    /**
     * The version of the library
     */
    export const version: string = '[VI]{{inject}}[/VI]';

    export interface JSONEncodable<T> {
        toJSON(): T;
    }

    export function isJSONEncodable<T = any>(value: any): value is JSONEncodable<T> {
        return typeof value.toJSON === 'function';
    }
}