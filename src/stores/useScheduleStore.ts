import type { ISchedule } from "@/interfaces"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useScheduleStore = defineStore('schedule', () => {
    const schedule = ref(null)

    function setSchedule(value) {
        schedule.value = value
    }

    return { schedule, setSchedule }
})