import { useApi } from "@/shared/api/lib/useApi";
import type { IAuthResponse } from "@/features/auth/model/types";
import { setToken } from "@/entities/session/api/tokenService";
import { userService } from "@/entities/user/api/userService";
import { useUserStore } from "@/entities/user/model/store";

export interface IRegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function registerService(user: IRegisterDto) {
    const store = useUserStore();

    const api = useApi(import.meta.env.VITE_API)
    const data: IAuthResponse = await api.post("/auth/register", user)

    setToken("accessToken", data.tokens.accessToken)
    setToken("refreshToken", data.tokens.refreshToken)

    const me = await userService();
    
    if (me) {
        store.setUser(me);
    }

    return me
}
