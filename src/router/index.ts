import { createWebHistory, createRouter } from "vue-router";
import AuthView from "@/views/AuthView.vue";
import RegisterView from "@/views/RegisterView.vue";
import { ERouter } from "@/enums";
import { useUserStore } from "@/stores/useUserStore";
import { userService } from "@/services/userService";
import DashboardView from "@/views/DashboardView.vue";
import {useError} from "@/composables/useError";
import { getAccessToken, getRefreshToken } from "@/services/tokenService";

const { logError } = useError()

const routes = [
    {
        path: "/",
        redirect: ERouter.AUTH,
        name: "Home",
    },
    {
        path: ERouter.AUTH,
        component: AuthView,
        name: "Auth",
    },
    {
        path: ERouter.REGISTER,
        component: RegisterView,
        name: "Register",
    },
    {
        path: ERouter.DASHBOARD,
        component: DashboardView,
        name: "Dashboard",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    const store = useUserStore();
    if (getAccessToken() || getRefreshToken()) {
        try {
            const me = await userService();
            if (me) {
                store.setUser(me);
            }
        } catch (error) {
            logError(error)
        }
    }

    if (
        !store.isLoggedIn &&
        to.path !== ERouter.AUTH &&
        to.path !== ERouter.REGISTER
    ) {
        return { name: "Auth" };
    }
    if (
        store.isLoggedIn &&
        (to.path === ERouter.AUTH || to.path === ERouter.REGISTER)
    ) {
        return { name: "Dashboard" };
    }
    return true;
});

export default router;
