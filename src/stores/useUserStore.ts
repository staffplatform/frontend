import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { IUser } from "@/interfaces";
import { clearTokens } from "@/services/tokenService";

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