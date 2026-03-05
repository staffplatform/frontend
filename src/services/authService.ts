import { useApi } from "@/composables/useApi";
import { userService } from "@/services/userService";
import { useUserStore } from "@/stores/useUserStore";
import { setToken } from "@/services/tokenService";
import type { IAuthResponse } from "@/interfaces";

interface ILoginDto {
    email: string;
    password: string;
}

export async function authService(user: ILoginDto) {
    const store = useUserStore();

    const api = useApi(import.meta.env.VITE_API);
    const data: IAuthResponse = await api.post(
        "/auth/login", 
        user
    );

    setToken("accessToken", data.tokens.accessToken)
    setToken("refreshToken", data.tokens.refreshToken)

    const me = await userService();

    if (me) {
        store.setUser(me);
    }

    return me;
}
