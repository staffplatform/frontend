<script setup lang="ts">
import { ERouter } from '@/enums';
import type { IUser } from '@/interfaces';
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

interface AppHeaderProps {
    user: IUser | null,
    isLogin: boolean,
    logout: () => void
}

const route = useRoute()
const router = useRouter()
const props = defineProps<AppHeaderProps>()
const emit = defineEmits<{
    (event: 'toggle-menu'): void
}>()

const initials = computed(() => {
    const firstName = props.user?.firstName.split('')[0] || ''
    const lastName = props.user?.lastName.split('')[0] || ''
    return `${firstName}${lastName}`
})

function logout() {
    props.logout();
    router.push({ path: ERouter.AUTH });
}
</script>
<template>
    <div class="header">
        <div class="header-info">
            <button v-if="props.isLogin" type="button" @click="emit('toggle-menu')">
                <div class="menu">
                    <span class="menu-plate"></span>
                    <span class="menu-plate"></span>
                    <span class="menu-plate"></span>
                </div>
            </button>
            <h1 class="header-title">{{ route.name ?? '' }}</h1>
        </div>
        <div class="buttons">
            <div v-if="props.isLogin" class="user-button">{{ initials }}</div>
            <button v-if="props.isLogin" @click="logout" class="auth-button">Выйти</button>
        </div>
    </div>
</template>
<style scoped>
.header {
    position: relative;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.header-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.header-title {
    font-size: 26px;
}

.menu {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: 40px;
    width: 40px;
    background-color: #ffffff;
    border-radius: 5px;
    border: 1px solid #000000;
    cursor: pointer;
}

.menu-plate {
    height: 2px;
    width: 24px;
    background-color: #000000;
}

.buttons {
    display: flex;
    gap: 10px;
}

.user-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #000000;
}

.auth-button {
    padding: 5px;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #000000;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
}
</style>