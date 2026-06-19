<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
import AppButton from '@/shared/ui/button/AppButton.vue';
import AppModal from '@/shared/ui/modal/AppModal.vue';

defineProps<{
    title?: string
    subtitle? : string
}>()
const emit = defineEmits(['close'])
</script>

<template>
<Teleport to="body">
    <div class="dialog">
        <AppModal>
            <div class="dialog-header">
                <div>
                    <h1 class="dialog-title">{{ title }}</h1>
                    <p>{{ subtitle }}</p>
                </div>
                <AppButton @click="emit('close')" variant="primary" >
                    <XMarkIcon class="dialog-button-close__icon" />
                </AppButton>
            </div>
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
    padding-bottom: 10px;
    border-bottom: 1px solid #9a9a9a8a;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.dialog-title {
    font-size: 22px;
}

.dialog-button-close__icon {
    width: 16px;
    height: 16px;
}
</style>
