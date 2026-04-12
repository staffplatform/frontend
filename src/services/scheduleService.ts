import type { IScheduleMonth } from "@/interfaces";
import { useApi } from "@/composables/useApi";

interface IMonthScheduleServiceParams {
    storeId: string;
    year: string;
    month: string;
}

interface IWeekScheduleServiceParams {
    storeId: string;
    week: string;
}

interface IDeleteScheduleEntryParams {
    storeId: string;
    userId: string;
    date: string;
}

const api = useApi(import.meta.env.VITE_API);

export function getMonthScheduleService({ storeId, year, month }: IMonthScheduleServiceParams) {
    return api.get<IScheduleMonth>(`/schedule/month?storeId=${storeId}&year=${year}&month=${month}`)
}

export function updateMonthScheduleService(options) {
    return api.put('/schedule/month', options)
}

export function getWeekScheduleService({storeId, week}: IWeekScheduleServiceParams) {
    return api.get(`/schedule/week?storeId=${storeId}&week=${week}`)
}

export function deleteScheduleEntryService({ storeId, userId, date }: IDeleteScheduleEntryParams) {
    const searchParams = new URLSearchParams({
        storeId,
        userId,
        date,
    })

    return api.del(`/schedule/entry?${searchParams.toString()}`)
}

export function getScheduleTypesService() {
    return api.get('/schedule/types')
}
