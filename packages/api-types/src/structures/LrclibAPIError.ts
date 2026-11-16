import type { APIError } from '../types/API';

export class LrclibAPIError<Name extends APIError.Name|string> extends Error implements APIError<Name> {
    public code: Name extends APIError.Name ? APIError.Code[Name] : number;
    public name: Name;

    public constructor(data: APIError<Name>) {
        super(data.message);

        this.name = data.name;
        this.code = data.code;
    }
}