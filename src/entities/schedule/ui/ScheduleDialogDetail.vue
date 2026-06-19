<script setup lang="ts">
import type { IOrganizationEmployee } from '@/entities/employee/model/types';
import type { ISchedule, IScheduleTypes } from '@/entities/schedule/model/types';
import type { RolesTypes } from '@/shared/config/roles';
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

interface IScheduleDetailItem {
    label: string,
    type: keyof ISchedule
    formatter?: (value: string) => string
}

const props = defineProps<{
    selectedEntry: ISchedule
    employees: IOrganizationEmployee[]
    scheduleTypes: IScheduleTypes | null
    currentRoleEmployee: Boolean
}>()

const emit = defineEmits<{
    delete: [{ userId: string; date: string }]
    edit: [ISchedule]
}>()

const isOpenSettings = ref(false)

const scheduleDetailItems: IScheduleDetailItem[] = [
    {
        label: 'Дата',
        type: 'date',
    },
    {
        label: 'Начало смены',
        type: 'startTime',
    },
    {
        label: 'Конец смены',
        type: 'endTime',
    },
    {
        label: 'Сотрудник',
        type: 'userId',
        formatter: getEmployeeName,
    },
    {
        label: 'Тип смены',
        type: 'type',
        formatter: getScheduleTypeLabel,
    },
]

function handleSettings() {
    isOpenSettings.value = !isOpenSettings.value
}

function deleteForm(entry: ISchedule) {
    emit('delete', {
        userId: entry.userId,
        date: entry.date
    })
}

function editForm(entry: ISchedule) {
    emit('edit', entry)
}

function getEmployeeName(employeeUserId: string) {
    const employee = props.employees.find(user => user.userId === employeeUserId)

    if (!employee) {
        return ''
    }

    return `${employee.lastName} ${employee.firstName}`
}

function getScheduleTypeLabel(type: string) {
    return props.scheduleTypes?.entryTypes.find((entry) => entry.value === type)?.label ?? type
}

function getScheduleDetailValue(scheduleDetail: IScheduleDetailItem) {
    const value = props.selectedEntry[scheduleDetail.type]

    return scheduleDetail.formatter ? scheduleDetail.formatter(value) : value
}
</script>

<template>
    <aside class="schedule-form-card">
        <div class="schedule-form-card__header">
            <div v-if="currentRoleEmployee" class="schedule-form-card__settings">
                <button class="schedule-form-card__settings-button" @click="handleSettings()">
                    <AdjustmentsHorizontalIcon class="schedule-form-card__header-icon" />
                </button>
                <div v-if="isOpenSettings" class="schedule-form-card__settings-menu">
                    <button
                        @click="deleteForm(selectedEntry)"
                        class="schedule-form-card__settings-action"
                        type="button"
                    >
                        Удалить
                    </button>
                    <button
                        @click="editForm(selectedEntry)"
                        class="schedule-form-card__settings-action"
                        type="button"
                    >
                        Редактировать
                    </button>
                </div>
            </div>
        </div>

        <div class="schedule-form-card__body">
            <div class="schedule-form-card__field" v-for="scheduleDetail in scheduleDetailItems" :key="scheduleDetail.type">
                <span>{{ scheduleDetail.label }}</span>
                <div class="schedule-form-card__value">{{ getScheduleDetailValue(scheduleDetail) }}</div>
            </div>

            <div v-if="selectedEntry.comment" class="schedule-form-card__field">
                <span>Комментарий</span>
                <div class="schedule-form-card__textarea schedule-form-card__textarea--readonly">
                    {{ selectedEntry.comment }}
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
.schedule-form-card {
    min-width: 360px;
    width: 100%;
    border-radius: 16px;
}

.schedule-form-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 20px;
}

.schedule-form-card__header-icon {
    width: 24px;
    height: 24px;
    color: #6b7280;
    flex-shrink: 0;
}

.schedule-form-card__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.schedule-form-card__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.schedule-form-card__field span {
    font-size: 14px;
    font-weight: 500;
}

.schedule-form-card__value,
.schedule-form-card__textarea {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    background-color: #fff;
    color: #111827;
}

.schedule-form-card__value {
    display: flex;
    align-items: center;
}

.schedule-form-card__textarea {
    min-height: 110px;
    resize: vertical;
}

.schedule-form-card__textarea--readonly {
    white-space: pre-wrap;
    line-height: 1.5;
}

.schedule-form-card__settings {
    position: relative;
}

.schedule-form-card__settings-button {
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

.schedule-form-card__settings-button:hover {
    background-color: #f3f4f6;
}

.schedule-form-card__settings-menu {
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
}

.schedule-form-card__settings-action {
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

.schedule-form-card__settings-action:hover {
    background-color: #f3f4f6;
}
</style>
