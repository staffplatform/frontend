import type { IScheduleMonth, IScheduleWeek } from "@/entities/schedule/model/types"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useScheduleStore = defineStore('schedule', () => {
    const schedule = ref<IScheduleMonth | IScheduleWeek | null>(null)

    function setSchedule(value: IScheduleMonth | IScheduleWeek | null) {
        schedule.value = value
    }

    return { schedule, setSchedule }
})
