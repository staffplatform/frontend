import { useApi } from "@/shared/api/lib/useApi";
import { userService } from "@/entities/user/api/userService";
import { useUserStore } from "@/entities/user/model/store";
import { setToken } from "@/entities/session/api/tokenService";
import type { IAuthResponse } from "@/features/auth/model/types";

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
