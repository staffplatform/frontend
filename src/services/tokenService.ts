import Cookies from "js-cookie";

type TokenKey = "accessToken" | "refreshToken";

export function getAccessToken() {
    return Cookies.get("accessToken")
}
export function setToken(type: TokenKey, token: string): void {
    Cookies.set(type, token);
}

export function deleteAccessToken() {
    Cookies.remove("accessToken")
}

export function getRefreshToken() {
    return Cookies.get("refreshToken")
}

export function deleteRefreshToken() {
    Cookies.remove("refreshToken")
}

export function clearTokens() {
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
}