<script setup lang="ts">
import AppCollectionPanel from "@/components/AppCollectionPanel.vue";
import AppCollectionToolbar from "@/components/AppCollectionToolbar.vue";
import AppInfoBlock from "@/components/AppInfoBlock.vue";
import AppLoading from "@/components/AppLoading.vue";
import CreateOrganizationStore from "@/components/CreateOrganizationStore.vue";
import OrganizationStoreDetail from "@/components/OrganizationStoreDetail.vue";
import type {
    ICreateOrganizationStoreForm,
    IOrganizationEmployee,
    IStore,
} from "@/interfaces";
import {
    createStoreService,
    deleteStoreService,
    editStoreService,
    getCurrentStoresService,
    getEmployeesStoreService,
} from "@/services/storesService";
import { onMounted, ref } from "vue";

const searchStore = ref("");
const isStoresLoading = ref(false);

const isCreateStore = ref(false);
const isEditStore = ref<boolean>(false);

const currentStores = ref<IStore[]>([]);
const visibleStores = ref<IStore[]>([]);

const currentStore = ref<IStore | null>(null);
const editableStore = ref<IStore | null>(null);

const employees = ref<IOrganizationEmployee[] | null>(null);

type rolesType = "OWNER" | "ADMIN" | "EMPLOYEE";

const roles = ref<Record<rolesType, string>>({
    OWNER: "Владелец",
    ADMIN: "Администратор",
    EMPLOYEE: "Сотрудник",
});

function toggleOrganizationStore() {
    isCreateStore.value = !isCreateStore.value;
}

function setCurrentStore(store: IStore | null) {
    currentStore.value = store;
    editableStore.value = store ? { ...store } : null;
}

async function loadStores() {
    isStoresLoading.value = true;
    try {
        currentStores.value = await getCurrentStoresService();
        visibleStores.value = currentStores.value;
        setCurrentStore(visibleStores.value?.[0] ?? null);
    } finally {
        isStoresLoading.value = false;
    }
}

async function loadEmployees(store: IStore | null) {
    employees.value = store
        ? await getEmployeesStoreService(store)
        : null;
}

async function getStoreInfo(store: IStore) {
    setCurrentStore(store);
    await loadEmployees(store);
    isCreateStore.value = false;
    isEditStore.value = false;
}

async function onCreateOrganizationStore(
    storeData: ICreateOrganizationStoreForm,
) {
    try {
        await createStoreService(storeData);
        await loadStores();
        isCreateStore.value = false;
    } catch (error) {
        console.log(error);
    }
}

async function onEditOrganizationStore() {
    isEditStore.value = true;
}

async function onEditStore(store: IStore | null) {
    if (!store) {
        return;
    }
    await editStoreService(store);
    await loadStores();
    isEditStore.value = false;
}

function onCancelStore(store: IStore | null) {
    if (!store) {
        return;
    }
    isEditStore.value = false;
    editableStore.value = { ...store };
}

async function onDeleteOrganizationStore(store: IStore | null) {
    if (!store) {
        return;
    }

    await deleteStoreService(store.id);
    await loadStores();
}

function onSearchStore() {
    const search = searchStore.value.trim().toLowerCase();

    if (!search.length) {
        visibleStores.value = currentStores.value;
        return;
    }

    visibleStores.value = currentStores.value.filter((store) =>
        store.name.toLowerCase().includes(search),
    );
}

function onResetSearchStores() {
    searchStore.value = "";
    visibleStores.value = currentStores.value;
}

onMounted(async () => {
    await loadStores();
    await loadEmployees(currentStore.value);
});
</script>

<template>
    <div class="organization-stores">
        <h1 class="organization-stores__title">Список магазинов</h1>

        <AppCollectionToolbar
            v-model:search="searchStore"
            search-placeholder="Поиск по имени магазина"
            :action-text="
                !isCreateStore ? 'Добавить магазин' : 'Отменить'
            "
            @search="onSearchStore"
            @reset-search="onResetSearchStores"
            @action="toggleOrganizationStore"
        />

        <div v-if="isStoresLoading">
            <AppLoading />
        </div>
        <div
            v-else-if="visibleStores.length"
            class="organization-stores__layout"
        >
            <AppCollectionPanel
                :currentItem="currentStore"
                :items="visibleStores"
                item-key="id"
                @select="getStoreInfo"
            >
                <template v-slot="{ item }">
                    <div class="organization-stores__item-content">
                        <span class="organization-stores__item-name">
                            {{ item.name }}
                        </span>
                        <span
                            class="organization-stores__item-address"
                        >
                            {{ item.city }},
                            {{ item.address }}
                        </span>
                    </div>
                </template>
            </AppCollectionPanel>

            <OrganizationStoreDetail
                v-if="!isCreateStore"
                :isEditStore
                :editableStore
                :employees
                :roles
                @edit="onEditOrganizationStore"
                @save-store="onEditStore(editableStore)"
                @cancel-store="onCancelStore(currentStore)"
                @delete="onDeleteOrganizationStore(editableStore)"
            />
            <CreateOrganizationStore
                v-else
                @create-organization-store="onCreateOrganizationStore"
            />
        </div>
        <AppInfoBlock
            v-else
            title="Магазин не найден"
            description="Попробуйте изменить запрос или сбросить поиск."
        />
    </div>
</template>

<style scoped>
.organization-stores__title {
    margin: 0 0 16px;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.2;
    color: #111827;
}

.organization-stores__layout {
    display: grid;
    grid-template-columns: 450px minmax(0, 1fr);
    gap: 20px;
    align-items: start;
}

.organization-stores__item-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
}

.organization-stores__item-name {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    color: #111827;
}

.organization-stores__item-address {
    font-size: 14px;
    line-height: 1.4;
    color: #6b7280;
}

@media (max-width: 900px) {
    .organization-stores__layout {
        grid-template-columns: 1fr;
    }

    .organization-stores__item-name {
        font-size: 16px;
    }
}
</style>
