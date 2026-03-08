<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import AppHeader from './components/AppHeader.vue';
import AppMenu from './components/AppMenu.vue';
import { useUserStore } from './stores/useUserStore';
import { useRoute } from 'vue-router';

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

<style scoped>
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding-right: 10px;
    padding-left: 10px;

}
</style>