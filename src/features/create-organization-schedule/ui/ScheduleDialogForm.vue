<script setup lang="ts">
import AppButton from '@/shared/ui/button/AppButton.vue';
import AppInput from '@/shared/ui/input/AppInput.vue';
import type { IOrganizationEmployee } from '@/entities/employee/model/types';
import type { ISchedule, IScheduleTypes } from '@/entities/schedule/model/types';
import { ref, watch } from 'vue';

interface ScheduleEntryFormPayload {
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    comment: string;
}

const props = defineProps<{
    employees: IOrganizationEmployee[]
    scheduleTypes: IScheduleTypes | null
    selectDate: string
    selectStartTime: string
    selectedEntry?: ISchedule
    mode: string
}>()

const emit = defineEmits<{
    close: [];
    "save-entry": [payload: ScheduleEntryFormPayload];
    delete: [payload: ScheduleEntryFormPayload]
}>();

const form = ref<ScheduleEntryFormPayload>({
    userId: '',
    date: props.selectDate,
    startTime: props.selectStartTime ?? '',
    endTime: '',
    type: '',
    comment: '',
});

function submitForm() {
    const payload = { ...form.value };
    emit('save-entry', payload);
}

watch(() => [props.selectedEntry, props.mode], () => {
    if (props.mode === "edit" && props.selectedEntry) {
        form.value = {
            userId: props.selectedEntry.userId ?? '',
            date: props.selectedEntry.date ?? '',
            startTime: props.selectedEntry.startTime ?? '',
            endTime: props.selectedEntry.endTime ?? '',
            type: props.selectedEntry.type ?? '',
            comment: props.selectedEntry.comment ?? '',
        };
        return;
    }

    form.value = {
        userId: '',
        date: props.selectDate ?? '',
        startTime: props.selectStartTime ?? '',
        endTime: '',
        type: '',
        comment: '',
    }
}, {immediate: true})

</script>

<template>
    <aside class="schedule-form-card">
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
                        v-for="type in props.scheduleTypes?.entryTypes ?? []"
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
            <AppButton
                @click="submitForm" 
                variant="primary"
            >
                {{ props.mode === 'create' ? 'Создать' : 'Редактировать ' }}
            </AppButton>
        </div>
    </aside>
</template>

<style scoped>
.schedule-form-card {
    padding: 20px;
    min-width: 360px;
    width: 100%;
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
