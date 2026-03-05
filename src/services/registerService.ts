import { useApi } from "@/composables/useApi";
import type { IAuthResponse, IUser } from "@/interfaces";
import { setToken } from "./tokenService";
import { userService } from "./userService";
import { useUserStore } from "@/stores/useUserStore";

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