import { createWebHistory, createRouter } from "vue-router";
import AuthView from "@/views/AuthView.vue";
import RegisterView from "@/views/RegisterView.vue";
import { ERouter, ERouterName } from "@/enums";
import { useUserStore } from "@/stores/useUserStore";
import { userService } from "@/services/userService";
import {useError} from "@/composables/useError";
import { getAccessToken, getRefreshToken } from "@/services/tokenService";
import ProfileView from "@/views/ProfileView.vue";
import ScheduleView from "@/views/ScheduleView.vue";

const { logError } = useError()

const routes = [
    {
        path: "/",
        redirect: ERouter.AUTH,
        name: ERouterName.HOME,
    },
    {
        path: ERouter.AUTH,
        component: AuthView,
        name: ERouterName.AUTH,
    },
    {
        path: ERouter.REGISTER,
        component: RegisterView,
        name: ERouterName.REGISTER,
    },
    {
        path: ERouter.PROFILE,
        component: ProfileView,
        name: ERouterName.PROFILE,
    },
    {
        path: ERouter.SCHEDULE,
        component: ScheduleView,
        name: ERouterName.SCHEDULE,
    },
    {
        path: '/schedule/:mode',
        component: ScheduleView,
    
    }
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
        return { path: ERouter.AUTH };
    }
    if (
        store.isLoggedIn &&
        (to.path === ERouter.AUTH || to.path === ERouter.REGISTER)
    ) {
        return { path: ERouter.SCHEDULE };
    }
    return true;
});

export default router;
