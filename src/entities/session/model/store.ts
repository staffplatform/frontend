import { defineStore } from "pinia";
import { getAccessToken, getRefreshToken } from "../api/tokenService";
import { userService } from "@/entities/user/api/userService";
import { useUserStore } from "@/entities/user/model/store";
import { useError } from "@/shared/lib/error/useError";

export const useAuthStore = defineStore("auth", () => {
    const store = useUserStore()
    const { logError } = useError()

    async function initAuth() {
        if (getAccessToken() || getRefreshToken()) {
            try {
                const me = await userService();
                if (me) {
                    store.setUser(me);
                }
            } catch (error) {
                if (error instanceof Error) { 
                    logError(error)
                }
            }
        }
    }

    return { initAuth }
})