<script setup lang="ts">
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import type { IEmployee, IScheduleTypes } from '@/interfaces';
import { ref } from 'vue';

interface ScheduleEntryFormPayload {
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    comment: string;
}

const props = defineProps<{
    employees: IEmployee[]
    scheduleTypes: IScheduleTypes
    selectDate: string
}>()

const emit = defineEmits<{
    close: [];
    submit: [payload: ScheduleEntryFormPayload];
    delete: [payload: ScheduleEntryFormPayload]
}>();

const form = ref<ScheduleEntryFormPayload>({
    userId: '',
    date: props.selectDate,
    startTime: '',
    endTime: '',
    type: '',
    comment: '',
});

function submitForm() {
    emit('submit', { ...form.value });
}
</script>

<template>
    <aside class="schedule-form-card">
        <div class="schedule-form-card__header">
            <div>
                <p class="schedule-form-card__eyebrow">Расписание</p>
                <h2 class="schedule-form-card__title">Создать смену</h2>
            </div>
        </div>

        <div class="schedule-form-card__body">
            <label class="schedule-form-card__field">
                <span>Сотрудники</span>
                <select class="schedule-form-card__select" v-model="form.userId">
                    <option
                        v-for="employee in props.employees"
                        :key="employee.userId"
                        :value="employee.userId"
                    >
                        {{ employee.lastName }} {{ employee.firstName }}
                    </option>
                </select>
            </label>

            <label class="schedule-form-card__field">
                <span>Дата</span>
                <AppInput v-model="form.date" type="date" />
            </label>

            <label class="schedule-form-card__field">
                <span>Начало смены</span>
                <AppInput v-model="form.startTime" type="time" />
            </label>

            <label class="schedule-form-card__field">
                <span>Конец смены</span>
                <AppInput v-model="form.endTime" type="time" />
            </label>

            <label class="schedule-form-card__field">
                <span>Тип смены</span>
                <select class="schedule-form-card__select" v-model="form.type">
                    <option
                        v-for="type in props.scheduleTypes.entryTypes"
                        :key="type.value"
                        :value="type.value"
                    >
                        {{ type.label }}
                    </option>
                </select>
            </label>

            <label class="schedule-form-card__field">
                <span>Комментарий</span>
                <textarea
                    v-model="form.comment"
                    class="schedule-form-card__textarea"
                    placeholder="Добавьте комментарий"
                    rows="4"
                />
            </label>
        </div>

        <div class="schedule-form-card__actions">
            <AppButton @click="emit('close')" variant="secondary">Отмена</AppButton>
            <AppButton @click="submitForm" variant="primary">Сохранить</AppButton>
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

.schedule-form-card__textarea {
    width: 100%;
    min-height: 110px;
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    resize: vertical;
}

.schedule-form-card__select {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    background-color: #fff;
    color: #111827;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.schedule-form-card__select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.schedule-form-card__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 24px;
}
</style>
