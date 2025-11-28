export namespace Utils {
    /**
     * The version of the library
     */
    export const version: string = process.env.LRCLIB_VERSION;

    export interface JSONEncodable<T> {
        toJSON(): T;
    }

    export function isJSONEncodable<T = any>(value: any): value is JSONEncodable<T> {
        return typeof value.toJSON === 'function';
    }
}