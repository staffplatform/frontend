<script setup lang="ts">
import AppButton from '../button/AppButton.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
    title?: string
    subtitle?: string
    side: 'left' | 'right'
}>()
const emit = defineEmits<{
    close: []
}>()
</script>
<template>
    <div class="menu-backdrop">
        <aside :class="['menu-panel', `menu-panel--${props.side}`]">
            <div class="menu-panel__head">
                <div class="menu-panel__info">
                    <h2 class="menu-panel__title">{{ title }}</h2>
                    <span class="menu-panel__subtitle">{{ subtitle }}</span>
                </div>
                <AppButton @click="emit('close')" variant="primary" >
                    <XMarkIcon class="dialog-button-close__icon" />
                </AppButton>
            </div>

            <slot/>
        </aside>
    </div>
</template>

<style>
.menu-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.25);
}

.menu-panel {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: min(32rem, 85vw);
    height: 100%;
    background: #ffffff;
}

.menu-panel--left {
    margin-right: auto;
}

.menu-panel--right {
    margin-left: auto;
}

.menu-panel__title {
    font-size: 22px;
}

.menu-panel__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>