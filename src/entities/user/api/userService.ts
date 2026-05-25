import { useApi } from "@/shared/api/lib/useApi";
import type { IUser } from "@/entities/user/model/types";
import type { ICreateOrganizationEmployeeForm } from "@/features/create-organization-employee/model/types";
import { clearTokens, getAccessToken, getRefreshToken, setToken } from "@/entities/session/api/tokenService";

const api = useApi(import.meta.env.VITE_API);

export async function userService(): Promise<IUser | null> {
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

export async function createUserService(data: ICreateOrganizationEmployeeForm) {
    return await api.post<ICreateOrganizationEmployeeForm, IUser>("/users", data)
}
