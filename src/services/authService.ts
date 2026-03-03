import { useApi } from "@/composables/useApi";
import { userService } from "@/services/userService";
import { useUserStore } from "@/stores/useUserStore";
import { setToken } from "@/services/tokenService";
import type {IToken, IUser} from "@/interfaces";

interface ILogin {
    tokens: {
        "accessToken": string,
        "refreshToken": string,
    }
    user: IUser
}

export async function authService(email: string, password: string) {
    const store = useUserStore();

    const api = useApi(import.meta.env.VITE_API);
    const date: ILogin = await api.post<{ email: string; password: string }, ILogin>(
        "/auth/login", 
        { email, password }
    );

    setToken("accessToken", date.tokens.accessToken)
    setToken("refreshToken", date.tokens.refreshToken)

    const me = await userService();
    store.setUser(me);

    return me;
}
