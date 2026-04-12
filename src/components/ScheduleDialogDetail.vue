<script setup lang="ts">
import type { IEmployee, ISchedule, IScheduleTypes } from '@/interfaces';
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

const isOpenSettings = ref(false)

const props = defineProps<{
    selectedEntry: ISchedule
    employees: IEmployee[]
    scheduleTypes: IScheduleTypes | null
}>()

const emit = defineEmits<{
    delete: [{ userId: string; date: string }]
    edit: any
}>()

function handleSettings() {
    isOpenSettings.value = !isOpenSettings.value
}

function deleteForm(entry) {
    emit('delete', {
        userId: entry.userId,
        date: entry.date
    })
}

function editForm(entry) {
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
</script>

<template>
    <aside class="schedule-form-card">
        <div class="schedule-form-card__header">
            <div>
                <p class="schedule-form-card__eyebrow">Расписание</p>
                <h2 class="schedule-form-card__title">Информация о смене</h2>
            </div>
            <div class="schedule-form-card__settings">
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
            <div class="schedule-form-card__field">
                <span>Дата</span>
                <div class="schedule-form-card__value">{{ selectedEntry.date }}</div>
            </div>

            <div class="schedule-form-card__field">
                <span>Начало смены</span>
                <div class="schedule-form-card__value">{{ selectedEntry.startTime }}</div>
            </div>

            <div class="schedule-form-card__field">
                <span>Конец смены</span>
                <div class="schedule-form-card__value">{{ selectedEntry.endTime }}</div>
            </div>

            <div class="schedule-form-card__field">
                <span>Сотрудник</span>
                <div class="schedule-form-card__value">{{ getEmployeeName(selectedEntry.userId) }}</div>
            </div>

            <div class="schedule-form-card__field">
                <span>Тип смены</span>
                <div class="schedule-form-card__value">{{ getScheduleTypeLabel(selectedEntry.type) }}</div>
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
    width: 360px;
    min-width: 360px;
    padding: 20px;
    border: 1px solid #d6d6d6;
    border-radius: 16px;
    background-color: #fff;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.schedule-form-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
}

.schedule-form-card__eyebrow {
    margin-bottom: 6px;
    color: #6b7280;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.schedule-form-card__title {
    font-size: 24px;
    font-weight: 600;
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
