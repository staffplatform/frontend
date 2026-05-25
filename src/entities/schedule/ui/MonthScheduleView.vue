<script setup lang="ts">
import type { ISchedule } from '@/entities/schedule/model/types';

const props = defineProps<{
    days: number
    getEntriesByDay: (day: number) => ISchedule[] | undefined
}>()

const emit = defineEmits<{
    "show-info": [day: number]
    "show-entry-info": [entry: ISchedule]
    "close-dialog": []
}>()

function showInfoDay(day: number) {
    emit('show-info', day)
}

function showEntryInfo(entry: ISchedule) {
    emit('show-entry-info', entry)
}
</script>

<template>
    <div class="schedule-content">
        <div class="calendar">
            <div
                v-for="day in days"
                :key="day"
                class="calendar-item"
                @click="showInfoDay(day)"
            >
                {{ day }}

                <div
                    v-for="entry in getEntriesByDay(day)"
                    :key="entry.id"
                    class="calendar-item__info"
                    @click.stop="showEntryInfo(entry)"
                >
                    <p>{{ entry.startTime }} - {{ entry.endTime }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.schedule-content {
    display: flex;
    align-items: flex-start;
    gap: 20px;
}

.calendar-item {
    width: 140px;
    height: 140px;
    background-color: #fff;
    border: 1px solid #000;
}

.calendar-item__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
