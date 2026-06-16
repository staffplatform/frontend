import { EMethod } from "@/shared/config/method/EMethod";
import { EStatus } from "@/shared/config/status/EStatus";
import Cookies from "js-cookie";
import type { IApiError } from "../model/types";
import { clearTokens, getRefreshToken, setToken } from "@/entities/session/api/tokenService";

export function useApi(baseUrl: string) {
    async function request<T, R>(
        method: EMethod,
        url: string,
        body?: T,
        isRetry = false
    ): Promise<R> {
        const fullUrl = baseUrl + url;
        const options: RequestInit = {
            method: method,
            headers: {
                Authorization: `Bearer ${Cookies.get("accessToken")}`,
                "Content-Type": "application/json;charset=utf-8",
            },
            credentials: "include",
        };

        if (method !== EMethod.GET) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(fullUrl, options);

        if (!response.ok) {
            if (response.status === EStatus.UNAUTHORIZED && !isRetry) {
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    clearTokens();
                    throw new Error("Сессия истекла");
                }

                const refreshResponse = await fetch(baseUrl + "/auth/refresh", {
                    method: EMethod.POST,
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    credentials: "include",
                    body: JSON.stringify({ refreshToken }),
                });

                if (!refreshResponse.ok) {
                    clearTokens();
                    throw new Error("Сессия истекла");
                }

                const data = await refreshResponse.json();

                setToken("accessToken", data.tokens.accessToken);
                setToken("refreshToken", data.tokens.refreshToken);

                return request(method, url, body, true);
            }
            const error = new Error() as IApiError;
            error.status = response.status;
            error.data = await response.json();
            throw error;
        }
        if (response.status === 204) {
            return undefined as R
        }

        return await response.json();
    }

    function get<R>(url: string): Promise<R> {
        return request(EMethod.GET, url);
    }

    function post<T, R>(url: string, body: T): Promise<R> {
        return request(EMethod.POST, url, body);
    }

    function put<T, R>(url: string, body: T): Promise<R> {
        return request(EMethod.PUT, url, body);
    }

    function del<R>(url: string): Promise<R> {
        return request(EMethod.DELETE, url);
    }

    function patch<T, R>(url: string, body: T): Promise<R>  {
        return request(EMethod.PATCH, url, body);
    }

    return { get, post, put, patch, del };
}
