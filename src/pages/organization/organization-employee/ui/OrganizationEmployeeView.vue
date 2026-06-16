<script setup lang="ts">
import AppCollectionPanel from "@/shared/ui/collection-panel/AppCollectionPanel.vue";
import AppCollectionToolbar from "@/shared/ui/collection-toolbar/AppCollectionToolbar.vue";
import AppInfoBlock from "@/shared/ui/info-block/AppInfoBlock.vue";
import AppLoading from "@/shared/ui/loading/AppLoading.vue";
import CreateOrganizationEmployee from "@/features/create-organization-employee/ui/CreateOrganizationEmployee.vue";
import OrganizationEmployeeDetail from "@/entities/employee/ui/OrganizationEmployeeDetail.vue";
import type {
    ICreateOrganizationEmployeeForm,
} from "@/features/create-organization-employee/model/types";
import type {
    IOrganizationEmployee,
} from "@/entities/employee/model/types";
import type {
    IStore,
} from "@/entities/store/model/types";
import {
    getCurrentStoresService,
    getEmployeesStoreService,
} from "@/entities/store/api/storesService";
import { createUserService } from "@/entities/user/api/userService";
import { onMounted, ref } from "vue";

const searchEmployee = ref("");

const isEmployeesLoading = ref(false);
const isCreateEmployee = ref(false);
const isEditEmployee = ref(false);

const currentStores = ref<IStore[]>([]);

const currentEmployees = ref<IOrganizationEmployee[]>([]);
const visibleEmployees = ref<IOrganizationEmployee[]>([]);

const currentEmployee = ref<IOrganizationEmployee | null>(null);
const editableEmployee = ref<IOrganizationEmployee | null>(null);

function toggleOrganizationEmployee() {
    isCreateEmployee.value = !isCreateEmployee.value;
    isEditEmployee.value = false;
}

function setCurrentEmployee(employee: IOrganizationEmployee | null) {
    currentEmployee.value = employee;
    editableEmployee.value = employee ? { ...employee } : null;
}

function uniqueEmployees(employees: IOrganizationEmployee[]): IOrganizationEmployee[] {
    const newUniqueEmployees = new Set<string>();

    return employees.filter((employee) => {
        if (newUniqueEmployees.has(employee.userId)) {
            return false;
        }
        newUniqueEmployees.add(employee.userId);
        return true;
    });
}

async function loadEmployees() {
    isEmployeesLoading.value = true;

    try {
        currentStores.value = await getCurrentStoresService();
        const employeesByStores = await Promise.all(
            currentStores.value.map((store) =>
                getEmployeesStoreService(store),
            ),
        );
        currentEmployees.value = uniqueEmployees(
            employeesByStores.flat(),
        );
        visibleEmployees.value = currentEmployees.value;
        setCurrentEmployee(currentEmployees.value[0] ?? null);
    } finally {
        isEmployeesLoading.value = false;
    }
}

function getEmployeeInfo(employee: IOrganizationEmployee) {
    setCurrentEmployee(employee);
    isCreateEmployee.value = false;
    isEditEmployee.value = false;
}

async function onCreateOrganizationEmployee(
    employeeData: ICreateOrganizationEmployeeForm,
) {
    try {
        await createUserService(employeeData)
        await loadEmployees();
        isCreateEmployee.value = false;
    } catch (error) {
        console.log(error);
    }
}

function getEmployeeSearchText(employee: IOrganizationEmployee) {
    return [
        employee.firstName,
        employee.lastName,
        `${employee.firstName} ${employee.lastName}`,
        employee.email,
        employee.jobTitle,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function onSearchEmployee() {
    const search = searchEmployee.value.trim().toLowerCase();

    if (!search.length) {
        visibleEmployees.value = currentEmployees.value;
        return;
    }

    visibleEmployees.value = currentEmployees.value.filter(
        (employee) =>
            getEmployeeSearchText(employee).includes(search),
    );
}

function onResetSearchEmployees() {
    searchEmployee.value = "";
    visibleEmployees.value = currentEmployees.value;
}

onMounted(loadEmployees);
</script>

<template>
    <div class="organization-employees">
        <h1 class="organization-employees__title">
            Список сотрудников
        </h1>

        <AppCollectionToolbar
            v-model:search="searchEmployee"
            search-placeholder="Поиск по имени сотрудника"
            :action-text="
                !isCreateEmployee ? 'Добавить сотрудника' : 'Отменить'
            "
            @search="onSearchEmployee"
            @reset-search="onResetSearchEmployees"
            @action="toggleOrganizationEmployee"
        />

        <div v-if="isEmployeesLoading">
            <AppLoading />
        </div>
        <div
            v-else-if="visibleEmployees.length"
            class="organization-employees__layout"
        >
            <AppCollectionPanel
                :currentItem="currentEmployee"
                :items="visibleEmployees"
                item-key="userId"
                @select="getEmployeeInfo"
            >
                <template v-slot="{ item }">
                    <div class="organization-employees__item-wrapper">
                        <img
                            v-if="item.avatarUrl"
                            :src="item.avatarUrl"
                            :alt="`Аватар ${item.firstName} ${item.lastName}`"
                            class="organization-employees__avatar organization-employees__avatar--image"
                        />
                        <div
                            v-else
                            class="organization-employees__avatar"
                        >
                            {{ item.firstName?.[0] }}
                            {{ item.lastName?.[0] }}
                        </div>
                        <div
                            class="organization-employees__item-content"
                        >
                            <span
                                class="organization-employees__item-name"
                            >
                                {{ item.firstName }}
                                {{ item.lastName }}
                            </span>
                            <span
                                class="organization-employees__item-meta"
                                >{{ item.email }}</span
                            >
                            <span
                                v-if="item.jobTitle"
                                class="organization-employees__item-meta"
                            >
                                {{ item.jobTitle }}
                            </span>
                        </div>
                    </div>
                </template>
            </AppCollectionPanel>

            <OrganizationEmployeeDetail
                v-if="!isCreateEmployee"
                :isEditEmployee
                :editableEmployee
            />
            <CreateOrganizationEmployee
                v-else
                :stores="currentStores"
                @create-organization-employee="onCreateOrganizationEmployee"
            />
        </div>
        <AppInfoBlock
            v-else
            title="Сотрудник не найден"
            description="Попробуйте изменить запрос или сбросить поиск."
        />
    </div>
</template>

<style scoped>
.organization-employees__title {
    margin: 0 0 16px;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.2;
    color: #111827;
}

.organization-employees__layout {
    display: grid;
    grid-template-columns: 450px minmax(0, 1fr);
    gap: 20px;
    align-items: start;
}

.organization-employees__item-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.organization-employees__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #e2e8f0;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #334155;
}

.organization-employees__avatar--image {
    object-fit: cover;
    overflow: hidden;
}

.organization-employees__item-content {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
    text-align: left;
}

.organization-employees__item-name {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    color: #111827;
}

.organization-employees__item-meta {
    font-size: 14px;
    line-height: 1.4;
    color: #6b7280;
}

@media (max-width: 900px) {
    .organization-employees__layout {
        grid-template-columns: 1fr;
    }

    .organization-employees__item-name {
        font-size: 16px;
    }
}
</style>
