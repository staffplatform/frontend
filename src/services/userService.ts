import { useApi } from "@/composables/useApi";
import type { IUser } from "@/interfaces";
import { clearTokens, getAccessToken, getRefreshToken, setToken } from "@/services/tokenService";

export async function userService(): Promise<IUser | null> {
    const api = useApi(import.meta.env.VITE_API);
    const token = getAccessToken()

    if (token) {
        return await api.get("/users/me")
    } 
    const refreshToken = getRefreshToken()

    if(!refreshToken) {
        console.error('Токен не найден')
        return null
    }

    try {
        const date = await api.post<{refreshToken: string}, {tokens: {accessToken: string, refreshToken: string}}>("/auth/refresh", { refreshToken });

        setToken('accessToken', date.tokens.accessToken)
        setToken('refreshToken', date.tokens.refreshToken)

        return await api.get("/users/me")
    } catch {
        clearTokens()

        return null;
    }
}