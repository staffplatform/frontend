<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = defineProps<{
    currentItem: T | null;
    items: T[];
    itemKey: keyof T;
}>();

const emit = defineEmits<{
    select: [item: T];
}>();

function getItemKey(item: T) {
    return String(item[props.itemKey])
}
</script>

<template>
    <aside class="app-collection-panel">
        <ul class="app-collection-panel__list">
            <li
                v-for="item in items"
                :key="getItemKey(item)"
                class="app-collection-panel__item"
                :class="{
                    'app-collection-panel__item--active':
                        currentItem &&
                        getItemKey(currentItem) === getItemKey(item),
                }"
                @click="emit('select', item)"
            >
                <slot :item="item"></slot>
            </li>
        </ul>
    </aside>
</template>

<style scoped>
.app-collection-panel {
    padding: 14px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.app-collection-panel__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 600px;
    overflow-y: auto;
}

.app-collection-panel__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    cursor: pointer;
}

.app-collection-panel__item:hover {
    border-color: #d1d5db;
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.1);
}

.app-collection-panel__item--active {
    border-color: #111827;
    background: #f8fafc;
}

@media (max-width: 900px) {
    .app-collection-panel__item {
        padding: 16px;
    }
}
</style>
