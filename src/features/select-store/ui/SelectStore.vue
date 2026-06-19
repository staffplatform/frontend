<script setup lang="ts">
import type { IStore } from "@/entities/store/model/types";
import AppDialog from "@/shared/ui/dialog/AppDialog.vue";
import AppInput from "@/shared/ui/input/AppInput.vue";
import { computed, ref } from "vue";
import { BuildingStorefrontIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
    title: string
    stores: IStore[];
}>();
const emit = defineEmits<{
    "select-store": [store: IStore];
    close: [];
}>();

const searchStore = ref("");

const filterSearchStore = computed(() => {
    return props.stores?.filter((store: IStore) =>
        store.name
            .toLowerCase()
            .includes(searchStore.value.toLowerCase()),
    );
});

function selectStore(store: IStore) {
    emit("select-store", store);
}
</script>
<template>
    <AppDialog :title @close="emit('close')">
        <AppInput
            v-model="searchStore"
            type="text"
            placeholder="Введите название магазина"
        />
        <ul
            v-if="filterSearchStore.length"
            class="select-store__cards"
        >
            <li
                v-for="store in filterSearchStore"
                class="select-store__card"
                :key="store.id"
            >
                <button
                    class="select-store__card-button"
                    @click="selectStore(store)"
                >
                    <BuildingStorefrontIcon class="store-icon" />
                    <div class="select-store__card-info">
                        <p>{{ store.name }}</p>
                        <span>{{ store.city }}, {{ store.address }}</span>
                    </div>
                </button>
            </li>
        </ul>
        <div v-else class="select-store__not-found">
            Магазин не найден
        </div>
    </AppDialog>
</template>

<style>
.select-store__cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 450px;
    overflow-y: scroll;
}

.select-store__card {
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
}

.select-store__card-button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    gap: 15px;
}

.select-store__card-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

.select-store__not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.store-icon {
    width: 26x;
    height: 26px;
    flex-shrink: 0;
}
</style>