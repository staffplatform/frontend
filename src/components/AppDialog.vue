<script setup lang="ts">
import AppButton from './AppButton.vue';
import AppModal from './AppModal.vue';

defineProps<{
    title: string
}>()
const emit = defineEmits(['close'])
</script>

<template>
<Teleport to="body">
    <div class="dialog">
        <AppModal>
            <div class="dialog-header">
                <AppButton @click="emit('close')" class="dialog-button-close" variant="primary">X</AppButton>
            </div>
            <h1 class="dialog-title">{{ title }}</h1>
            <slot></slot>
        </AppModal>
    </div>
</Teleport>
</template>

<style>

.dialog {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.dialog-header {
    display: flex;
    justify-content: flex-end;
}

.dialog-title {
    font-size: 18px;
}
.dialog-button-close {
    width: 20px;
    height: 20px;
}
</style>