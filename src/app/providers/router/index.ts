import { createWebHistory, createRouter } from "vue-router";
import { AuthView } from "@/pages/auth";
import { RegisterView } from "@/pages/register";
import { ERouter } from "@/shared/config/router/ERouter";
import { ERouterName } from "@/shared/config/router/ERouterName";
import { useUserStore } from "@/entities/user/model/store";
import { userService } from "@/entities/user/api/userService";
import {useError} from "@/shared/lib/error/useError";
import { getAccessToken, getRefreshToken } from "@/entities/session/api/tokenService";
import { ProfileView } from "@/pages/profile";
import { ScheduleView } from "@/pages/schedule";
import { OrganizationView } from "@/pages/organization";
import { OrganizationStoresView } from "@/pages/organization/organization-store";
import { OrganizationEmployeeView } from "@/pages/organization/organization-employee";

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
        name: ERouterName.SCHEDULE_MODE,
    },
    {
        path: ERouter.ORGANIZATION,
        component: OrganizationView,
        name: ERouterName.ORGANIZATION,
        redirect:ERouter.ORGANIZATION_STORES,
        children: [
            {
                path: ERouter.ORGANIZATION_STORES,
                component: OrganizationStoresView,
                name: ERouterName.ORGANIZATION_STORES,
            },
            {
                path: ERouter.ORGANIZATION_EMPLOYEES,
                component: OrganizationEmployeeView,
                name: ERouterName.ORGANIZATION_EMPLOYEES,
            }
        ]
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
