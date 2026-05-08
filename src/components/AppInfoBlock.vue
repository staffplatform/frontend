<script setup lang="ts">
const props = defineProps<{
    title: string
    description: string
}>()
</script>
<template>
    <div class="app-info-block">
        <p class="app-info-block__title">{{ title }}</p>
        <span class="app-info-block__text">
            {{ description }}
        </span>
    </div>
</template>
<style scoped>
.app-info-block {
    padding: 32px 20px;
    border: 1px dashed #d1d5db;
    background: #ffffff;
    text-align: center;
}

.app-info-block__title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
}

.app-info-block__text {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    color: #6b7280;
}
</style>