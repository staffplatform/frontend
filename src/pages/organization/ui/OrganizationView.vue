<script setup lang="ts">
import AppButton from '@/shared/ui/button/AppButton.vue';
import { ERouter } from '@/shared/config/router/ERouter';
import { RouterView, useRoute } from 'vue-router';

const route = useRoute()

</script>
<template>
    <section class="organization">

        <div class="organization__actions">
            <div class="organization__tabs">
                <AppButton
                    :class="{'active': route.path === ERouter.ORGANIZATION_STORES}"
                    :to="ERouter.ORGANIZATION_STORES"
                    variant="primary"
                >
                    Магазины
                </AppButton>
                <AppButton
                    :class="{'active': route.path === ERouter.ORGANIZATION_EMPLOYEES}"
                    :to="ERouter.ORGANIZATION_EMPLOYEES"
                    variant="primary"
                >
                    Сотрудники
                </AppButton>
            </div>
        </div>
        <RouterView/>
    </section>
</template>

<style scoped>
.organization__actions {
    display: flex;
    justify-content: space-between;
}

.organization__tabs {
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
}

.active {
    background: #111827;
    color: #ffffff;
    border-color: #111827;
}
</style>
