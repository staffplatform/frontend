<script setup lang="ts">
import type { IOrganizationEmployee } from '@/entities/employee/model/types';
import type { IStore } from '@/entities/store/model/types';
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';
import AppActionMenu from '@/shared/ui/action-menu/AppActionMenu.vue';
import AppInput from '@/shared/ui/input/AppInput.vue';
import AppButton from '@/shared/ui/button/AppButton.vue';
import { DateHelper } from '@/shared/lib/date';
import AppInfoBlock from '@/shared/ui/info-block/AppInfoBlock.vue';
import type { RolesTypes } from '@/shared/config/roles';

const isOpenSettings = ref(false)

const props = defineProps<{
    isEditStore: boolean
    editableStore: IStore
    employees: IOrganizationEmployee[] | null
    roles: Record<RolesTypes, string>
}>()

const emit = defineEmits<{
    edit: [store: IStore],
    delete: [store: IStore],
    "save-store": [],
    "cancel-store": []
}>()

const activeFromModel = computed({
    get: () => DateHelper.YYYYMMDD(props.editableStore.activeFrom) ?? "",
    set: (value) => {
        if (props.editableStore) {
            props.editableStore.activeFrom = value
        }
    }
})

function getEmployeeRole(role: RolesTypes) {
    if (!role) {
        return
    }
    return props.roles[role]
}

function handleSettings() {
    isOpenSettings.value = !isOpenSettings.value
}

</script>

<template>
    <section class="organization-stores__panel organization-stores__panel--details">
        <div v-if="editableStore" class="organization-stores__details">
            <div class="organization-stores__details-header">
                <p class="organization-stores__details-label">Магазин</p>
                <div class="organization-stores__settings">
                    <button
                        class="organization-stores__settings-button"
                        type="button"
                        @click="handleSettings"
                    >
                        <AdjustmentsHorizontalIcon class="organization-stores__settings-icon" />
                    </button>
                    <AppActionMenu
                        v-if="isOpenSettings"
                        @edit="emit('edit', editableStore)"
                        @delete="emit('delete', editableStore)"
                    />
                </div>
            </div>
            <h2 class="organization-stores__details-title">{{ editableStore.name }}</h2>

            <div class="organization-stores__details-list">
                <div class="organization-stores__details-row">
                    <span class="organization-stores__details-key">Город</span>
                    <AppInput 
                        v-model="editableStore.city" 
                        type="text"
                        :disabled="!isEditStore"
                        placeholder="Укажите город"
                    />
                </div>

                <div class="organization-stores__details-row">
                    <span class="organization-stores__details-key">Адрес</span>
                    <AppInput 
                        v-model="editableStore.address" 
                        type="text"
                        :disabled="!isEditStore"
                        placeholder="Укажите адрес"
                    />
                </div>

                <div class="organization-stores__details-row">
                    <span class="organization-stores__details-key">Создан</span>
                    <AppInput
                        v-model="activeFromModel"
                        type="date"
                        :disabled="!isEditStore"
                        placeholder="Укажите дату создания"
                    />
                </div>

                <div class="organization-stores__details-buttons">
                    <AppButton 
                        v-if="isEditStore" 
                        @click="emit('cancel-store')" 
                        type="button"
                    >
                        Отменить
                    </AppButton>
                <AppButton 
                    v-if="isEditStore" 
                    @click="emit('save-store')" 
                    type="button"
                >
                    Сохранить
                </AppButton>
                </div>

                <div class="organization-stores__details-row">
                    <details class="organization-stores__employees">
                        <summary class="organization-stores__employees-summary">
                            <span>Сотрудники</span>
                            <span class="organization-stores__employees-count">
                                {{ employees?.length ?? 0 }}
                            </span>
                        </summary>
                        <div
                            v-if="employees?.length"
                            class="organization-stores__employees-list"
                        >
                            <article
                                v-for="employee in employees"
                                :key="employee.userId"
                                class="organization-stores__employees-card"
                            >
                                <img
                                    v-if="typeof employee.avatarUrl === 'string' && employee.avatarUrl"
                                    :src="employee.avatarUrl"
                                    :alt="`Аватар ${employee.userId}`"
                                    class="organization-stores__employees-avatar organization-stores__employees-avatar--image"
                                />
                                <div v-else class="organization-stores__employees-avatar">
                                    {{ employee.userId?.[0] }}{{ employee.role?.[0] }}
                                </div>

                                <div class="organization-stores__employees-content">
                                    <p class="organization-stores__employees-name">
                                        {{ employee.lastName || 'Без фамилии' }}
                                        {{ employee.firstName || 'Без имени' }}
                                    </p>
                                    <p class="organization-stores__employees-meta">
                                        ID: {{ employee.userId }}
                                    </p>
                                    <p class="organization-stores__employees-meta">
                                        {{ employee.email }}
                                    </p>
                                    <p class="organization-stores__employees-role">
                                        {{ getEmployeeRole(employee.role) }}
                                    </p>
                                </div>
                            </article>
                        </div>

                        <p v-else class="organization-stores__employees-empty">
                            Список сотрудников пока пуст.
                        </p>
                    </details>
                </div>
            </div>
        </div>

        <AppInfoBlock 
            v-else 
            title="Магазин не выбран" 
            description="Выберите магазин слева, чтобы посмотреть подробную информацию."
        />
    </section>
</template>

<style scoped>
.organization-stores__panel {
    border: 1px solid #e5e7eb;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.organization-stores__panel--details {
    padding: 24px;
}

.organization-stores__details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
}

.organization-stores__details-header {
    display: flex;
    justify-content: space-between;
}

.organization-stores__details--empty {
    justify-content: center;
    min-height: 220px;
}

.organization-stores__details-label {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.02em;
    color: #6b7280;
    text-transform: uppercase;
}

.organization-stores__settings {
    position: relative;
}

.organization-stores__settings-button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 6px;
    border: none;
    border-radius: 10px;
    background-color: transparent;
    transition: background-color 0.2s ease;
}

.organization-stores__settings-button:hover {
    background-color: #f3f4f6;
}

.organization-stores__settings-icon {
    width: 24px;
    height: 24px;
    color: #6b7280;
}

.organization-stores__details-title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.15;
    color: #111827;
}

.organization-stores__details-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 6px;
}

.organization-stores__details-row {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f1f5f9;
}

.organization-stores__details-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.organization-stores__details-key {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: #6b7280;
}

.organization-stores__details-hint {
    margin: 0;
    font-size: 15px;
    line-height: 1.5;
    color: #4b5563;
}

.organization-stores__employees {
    grid-column: 1 / -1;
    width: 100%;
}

.organization-stores__employees[open] {
    border-color: #cbd5e1;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.organization-stores__employees-summary {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 52px 16px 18px;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
    color: #111827;
    cursor: pointer;
    list-style: none;
}

.organization-stores__employees-summary::-webkit-details-marker {
    display: none;
}

.organization-stores__employees-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 28px;
    margin-left: auto;
    margin-right: 14px;
    padding: 0 8px;
    border: 1px solid #dbe3ee;
    border-radius: 999px;
    background: #ffffff;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    color: #475569;
}

.organization-stores__employees-summary::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 20px;
    width: 9px;
    height: 9px;
    border-right: 1.5px solid #6b7280;
    border-bottom: 1.5px solid #6b7280;
    transform: translateY(-65%) rotate(45deg);
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.organization-stores__employees[open] .organization-stores__employees-summary::after {
    border-color: #111827;
    transform: translateY(-35%) rotate(225deg);
}

.organization-stores__employees-list {
    display: grid;
    gap: 10px;
    padding: 0 18px 18px;
}

.organization-stores__employees-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
}

.organization-stores__employees-avatar {
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

.organization-stores__employees-avatar--image {
    object-fit: cover;
    overflow: hidden;
}

.organization-stores__employees-content {
    min-width: 0;
}

.organization-stores__employees-name {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: #0f172a;
}

.organization-stores__employees-meta {
    margin: 2px 0 0;
    font-size: 13px;
    line-height: 1.4;
    color: #475569;
}

.organization-stores__employees-role {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    margin: 8px 0 0;
    padding: 4px 10px;
    border-radius: 999px;
    background: #e2e8f0;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.4;
    color: #334155;
}

.organization-stores__employees-empty {
    margin: 0;
    padding: 0 18px 18px;
    font-size: 14px;
    line-height: 1.5;
    color: #64748b;
}

@media (max-width: 900px) {
    .organization-stores__panel--details {
        padding: 20px;
    }

    .organization-stores__details-title {
        font-size: 22px;
    }

    .organization-stores__details-row {
        grid-template-columns: 1fr;
        gap: 4px;
    }

    .organization-stores__employees-summary {
        padding-right: 48px;
    }

    .organization-stores__employees-list {
        padding-bottom: 16px;
    }
}
</style>
