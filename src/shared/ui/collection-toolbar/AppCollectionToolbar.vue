<script setup lang="ts">
import AppButton from "@/shared/ui/button/AppButton.vue";
import AppInput from "@/shared/ui/input/AppInput.vue";

const props = defineProps<{
    actionText: string;
    searchPlaceholder: string;
}>();

const modelSearch = defineModel<string>("search");

const emit = defineEmits<{
    search: [];
    resetSearch: [];
    action: [];
}>();
</script>

<template>
    <div class="app-collection-toolbar">
        <div class="app-collection-toolbar__filter">
            <div class="app-collection-toolbar__search-wrapper">
                <AppInput
                    v-model="modelSearch"
                    class="app-collection-toolbar__search"
                    type="text"
                    :placeholder="searchPlaceholder"
                    @keydown.enter="emit('search')"
                />
                <button
                    v-if="modelSearch?.length"
                    class="app-collection-toolbar__reset"
                    type="button"
                    @click="emit('resetSearch')"
                >
                    X
                </button>
            </div>
            <AppButton @click="emit('search')">Найти</AppButton>
        </div>
        <AppButton @click="emit('action')" variant="primary">
            {{ actionText }}
        </AppButton>
    </div>
</template>

<style scoped>
.app-collection-toolbar {
    display: flex;
    justify-content: space-between;
}

.app-collection-toolbar__filter {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.app-collection-toolbar__search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 450px;
}

.app-collection-toolbar__search-wrapper :deep(input) {
    padding-right: 42px;
}

.app-collection-toolbar__search {
    flex: 0 1 450px;
}

.app-collection-toolbar__reset {
    position: absolute;
    right: 10px;
    display: flex;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background-color: #d8d8d8;
    cursor: pointer;
}

@media (max-width: 900px) {
    .app-collection-toolbar__filter {
        flex-direction: column;
        align-items: stretch;
    }

    .app-collection-toolbar__search {
        flex-basis: auto;
    }
}
</style>
