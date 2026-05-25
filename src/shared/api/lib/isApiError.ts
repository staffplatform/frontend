import type { IApiError } from "../model/types";

export function isApiError(error: unknown): error is IApiError {
    return error instanceof Error 
        && "data" in error 
        && "status" in error 
        && error.data !== undefined
}