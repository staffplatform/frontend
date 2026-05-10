import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { IUser } from "@/entities/user/model/types";
import { clearTokens } from "@/entities/session/api/tokenService";

export const useUserStore = defineStore("user", () => {
    const user = ref<null | IUser>(null);
    const isLoggedIn = computed(() => !!user.value);

    function setUser(userData: IUser) {
        user.value = userData;
    }

    function clearUser() {
        user.value = null;
        clearTokens()
    }

    return { user, isLoggedIn, setUser, clearUser };
});
