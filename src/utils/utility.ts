export function validateStringParam(param: string | string[] | undefined, paramName: string): string {
    if (!param && Array.isArray(param)) {
        throw new Error(`Invalid or missing ${paramName}`);
    }

    return param as string;
}

export function validateNumberParam(param: string | string[] | undefined, paramName: string): number {
    if (!param && Array.isArray(param)) {
        throw new Error(`Invalid or missing ${paramName}`);
    }

    return parseInt(param as string);
}
