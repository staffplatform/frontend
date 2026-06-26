import { createWebHistory, createRouter } from "vue-router";
import { ERouter } from "@/shared/config/router/ERouter";
import { ERouterName } from "@/shared/config/router/ERouterName";
import { useUserStore } from "@/entities/user/model/store";

const routes = [
    {
        path: "/",
        redirect: ERouter.AUTH,
        name: ERouterName.HOME,
    },
    {
        path: ERouter.AUTH,
        name: ERouterName.AUTH,
        component: () => import("@/pages/auth/ui/AuthView.vue"),
    },
    {
        path: ERouter.REGISTER,
        component: () => import("@/pages/register/ui/RegisterView.vue"),
        name: ERouterName.REGISTER,
    },
    {
        path: ERouter.PROFILE,
        component: () => import("@/pages/profile/ui/ProfileView.vue"),
        name: ERouterName.PROFILE,
    },
    {
        path: ERouter.SCHEDULE,
        component: () => import("@/pages/schedule/ui/ScheduleView.vue"),
        name: ERouterName.SCHEDULE,
    },
    {
        path: '/schedule/:mode',
        component: () => import("@/pages/schedule/ui/ScheduleView.vue"),
        name: ERouterName.SCHEDULE_MODE,
    },
    {
        path: ERouter.ORGANIZATION,
        component: () => import("@/pages/organization/ui/OrganizationView.vue"),
        name: ERouterName.ORGANIZATION,
        redirect: ERouter.ORGANIZATION_STORES,
        children: [
            {
                path: ERouter.ORGANIZATION_STORES,
                component: () => import("@/pages/organization/organization-store/ui/OrganizationStoresView.vue"),
                name: ERouterName.ORGANIZATION_STORES,
            },
            {
                path: ERouter.ORGANIZATION_EMPLOYEES,
                component: () => import("@/pages/organization/organization-employee/ui/OrganizationEmployeeView.vue"),
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
