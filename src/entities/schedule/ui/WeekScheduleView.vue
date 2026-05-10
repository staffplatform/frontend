<script setup lang="ts">
import { computed } from 'vue';
import { DateHelper } from '@/shared/lib/date';
import type { IOrganizationEmployee } from '@/entities/employee/model/types';
import type { ISchedule, IScheduleTypes } from '@/entities/schedule/model/types';

const props = defineProps<{
    days: number,
    scheduleWeek: any
    getEntriesByDay: (day: number) => ISchedule[] | undefined
    isScheduleDialogOpen: boolean
    employees: IOrganizationEmployee[]
    scheduleTypes: IScheduleTypes | null
    selectDate: string
    selectStartTime: string
}>()

const emit = defineEmits<{
    "save-entry": [payload: any]
    "show-info": [value: any]
    "show-entry-info": [entry: ISchedule]
    "close-dialog": []
}>()

const hours = Array.from({ length: 24 }, (_, index) => ({
    value: index,
    label: `${String(index).padStart(2, '0')}:00`,
}))

const weekDays = computed(() => {
    const startDate = new Date(props.scheduleWeek.weekStart)
    const endDate = new Date(props.scheduleWeek.weekEnd)

    const currentDate = new Date(startDate)
    const days = []

    while (currentDate <= endDate) {
        days.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
})

function handleCellClick(day, time) {
    const date = new Date(day)
    date.setHours(time)

    emit('show-info', date.getDate(), time)
}

function getShiftForCell(day, hourValue) {
    const date = new Date(day)
    date.setHours(hourValue)

    const formattedDate = DateHelper.YYYYMMDD(date)

    return props.scheduleWeek.entries.filter((entry) =>
        entry.date === formattedDate &&
        entry.startTime &&
        Number(entry.startTime.slice(0, 2)) === hourValue &&
        entry.endTime
    )
}

function formatDay(day: Date) {
    return day
        .toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
        })
        .replace(/^./, (char) => char.toUpperCase())
}

function handleShiftClick(shift: ISchedule) {
    emit('show-entry-info', shift)
}

</script>
<template>
    <div class="schedule-week">
        <div class="week-corner"></div>
        <div class="week-header">
            <p
                v-for="day in weekDays"
                :key="day"
                class="week-header__day"
            >
                {{ formatDay(day) }}
            </p>
        </div>

        <div class="week-time-column">
            <div class="week-time-column__item" v-for="hour in hours" :key="hour.value">
                {{ hour.label }}
            </div>
        </div>

        <div class="week-body">
            <div v-for="day in weekDays" :key="day.toISOString()" class="day-column">
                <div v-for="hour in hours" :key="hour.value" class="day-column__cell" @click="handleCellClick(day, hour.value)">
                    <div v-for="shift in getShiftForCell(day, hour.value)" :key="shift.id">
                        <p v-if="shift" class="day-column__shift-time" @click.stop="handleShiftClick(shift)">
                            {{ shift.startTime }} - {{ shift.endTime }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.schedule-week {
    display: grid;
    grid-template-columns: 80px repeat(7, minmax(0, 1fr));
    grid-template-rows: 60px 1fr;
}

.week-corner {
    grid-column: 1;
    grid-row: 1;
    background-color: #fff;
    border: 1px solid #000;
}

.week-header {
    display: grid;
    grid-column: 2 / 9;
    grid-row: 1;
    grid-template-columns: repeat(7, minmax(0, 1fr));
}

.week-header__day {
    display: flex;
    justify-content: center;
    background-color: #fff;
    border: 1px solid #000;
}

.week-time-column {
    grid-column: 1;
    grid-row: 2;
}
.week-time-column__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60px;
    background-color: #fff;
    border: 1px solid #000;
}
.week-body {
  display: grid;
  grid-column: 2 / 9;
  grid-row: 2;
  grid-template-columns: repeat(7, 140px);
}

.day-column {
  display: grid;
  grid-template-rows: repeat(24, 60px);
}

.day-column__cell {
  border: 1px solid #000;
  background-color: #fff;
}

.day-column__shift-time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
