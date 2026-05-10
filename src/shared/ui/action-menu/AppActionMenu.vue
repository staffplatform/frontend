<script setup lang="ts">
defineEmits<{
    delete: []
    edit: []
}>()
</script>

<template>
    <div class="app-settings-menu">
        <button
            class="app-settings-menu__action"
            type="button"
            @click="$emit('delete')"
        >
            Удалить
        </button>

        <button
            class="app-settings-menu__action"
            type="button"
            @click="$emit('edit')"
        >
            Редактировать
        </button>
    </div>
</template>

<style scoped>
.app-settings-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 150px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    background-color: #ffffff;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
    z-index: 10;
}

.app-settings-menu__action {
    width: 100%;
    padding: 4px 10px;
    border: none;
    border-radius: 10px;
    background-color: transparent;
    color: #111827;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.app-settings-menu__action:hover {
    background-color: #f3f4f6;
}
</style>
