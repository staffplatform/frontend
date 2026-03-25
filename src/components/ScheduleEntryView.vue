<script setup lang="ts">
import type { ISchedule } from '@/interfaces';
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

const isOpenSettings = ref(false)

const props = defineProps<{
    selectedEntry: ISchedule
}>()

const emit = defineEmits<{
    delete: [{ userId: string; date: string }]
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
</script>

<template>
    <div class="schedule-dialog-info__header">
        <div class="schedule-dialog-info__settings">
            <button class="schedule-dialog-info__settings-button" @click="handleSettings()">
                <AdjustmentsHorizontalIcon class="schedule-dialog-info__icon" />
            </button>
            <div class="schedule-dialog-info__settings-menu" v-if="isOpenSettings">
                <button @click="deleteForm(selectedEntry)" class="schedule-dialog-info__settings-action" type="button">
                    Удалить
                </button>
                <button class="schedule-dialog-info__settings-action" type="button">
                    Редактировать
                </button>
            </div>
        </div>
    </div>
    <div class="schedule-dialog-info">
        <div class="schedule-dialog-info__grid">
            <div class="schedule-dialog-info__item">
                <span class="schedule-dialog-info__label">Дата</span>
                <p class="schedule-dialog-info__value">{{ selectedEntry.date }}</p>
            </div>
            <div class="schedule-dialog-info__item">
                <span class="schedule-dialog-info__label">Время</span>
                <p class="schedule-dialog-info__value">{{ selectedEntry.startTime }} - {{ selectedEntry.endTime }}</p>
            </div>
            <div class="schedule-dialog-info__item">
                <span class="schedule-dialog-info__label">Тип смены</span>
                <p class="schedule-dialog-info__value">{{ selectedEntry.type }}</p>
            </div>
        </div>
        <div v-if="selectedEntry.comment" class="schedule-dialog-info__note">
            <span class="schedule-dialog-info__label">Комментарий</span>
            <p class="schedule-dialog-info__note-text">{{ selectedEntry.comment }}</p>
        </div>
    </div>
</template>

<style scoped>
.schedule-dialog-info__header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
}

.schedule-dialog-info__settings {
    position: relative;
}

.schedule-dialog-info__settings-button {
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

.schedule-dialog-info__settings-button:hover {
    background-color: #f3f4f6;
}

.schedule-dialog-info__icon {
    width: 24px;
    height: 24px;
    color: #6b7280;
}

.schedule-dialog-info__settings-menu {
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

.schedule-dialog-info__settings-action {
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

.schedule-dialog-info__settings-action:hover {
    background-color: #f3f4f6;
}
</style>
