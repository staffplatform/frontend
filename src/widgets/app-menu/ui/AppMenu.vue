<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { ERouter } from '@/shared/config/router/ERouter';
import { ERouterName } from '@/shared/config/router/ERouterName';

interface AppMenuProps {
    isOpen: boolean,
    isLogin: boolean
}

const props = defineProps<AppMenuProps>()
const emit = defineEmits<{
    (event: 'close'): void
}>()

const menuLinks = computed(() => {
    if (props.isLogin) {
        return [
            { to: ERouter.PROFILE, label: ERouterName.PROFILE },
            { to: ERouter.ORGANIZATION, label: ERouterName.ORGANIZATION },
            { to: ERouter.SCHEDULE, label: ERouterName.SCHEDULE },
        ];
    }
})
</script>
<template>
    <button
        v-if="props.isOpen"
        type="button"
        class="menu-backdrop"
        @click="emit('close')"
    ></button>

    <aside class="menu-panel" :class="{ 'menu-panel--open': props.isOpen }">
        <div class="menu-panel-head">
            <h2 class="menu-title">Меню</h2>
            <button type="button" class="menu-close" @click="emit('close')">
                Закрыть
            </button>
        </div>
        <nav class="menu-nav">
            <RouterLink
                v-for="link in menuLinks"
                :key="link.to"
                :to="link.to"
                class="menu-link"
                @click="emit('close')"
            >
                {{ link.label }}
            </RouterLink>
        </nav>
    </aside>
</template>

<style scoped>
.menu-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    border: none;
    z-index: 998;
}

.menu-title {
    font-size: 24px;
    color: #000000;
}

.menu-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: min(32rem, 85vw);
    height: 100vh;
    background: #ffffff;
    border-right: 1px solid #e4e4e7;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.15);
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 999;
    padding: 16px;
}

.menu-panel--open {
    transform: translateX(0);
}

.menu-panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.menu-close {
    border: 1px solid #000000;
    border-radius: 8px;
    padding: 6px 10px;
    background: #fff;
    cursor: pointer;
}

.menu-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.menu-link {
    color: #111827;
    text-decoration: none;
    border: 1px solid #000000;
    border-radius: 10px;
    padding: 10px 12px;
}

.menu-link:hover {
    background: #f8fafc;
}
</style>
