import type { IScheduleMonth } from "@/interfaces"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useScheduleStore = defineStore('schedule', () => {
    const schedule = ref<IScheduleMonth | null>(null)

    function setSchedule(value: IScheduleMonth | null) {
        schedule.value = value
    }

    return { schedule, setSchedule }
})