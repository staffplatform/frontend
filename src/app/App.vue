<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import AppHeader from '@/widgets/header/ui/AppHeader.vue';
import { AppMenu } from '@/widgets/app-menu';
import { useUserStore } from '@/entities/user/model/store';

const userStore = useUserStore()
const { user, isLoggedIn } = storeToRefs(userStore)
const isMenuOpen = ref(false)

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
    isMenuOpen.value = false
}
</script>

<template>
    <div class="container">
        <AppHeader
            :user="user"
            :isLogin="isLoggedIn"
            :logout="userStore.clearUser"
            @toggle-menu="toggleMenu"
        />
        <AppMenu
            :is-open="isMenuOpen"
            :is-login="isLoggedIn"
            @close="closeMenu"
        />
        <div>
            <RouterView />
        </div>
    </div>
</template>