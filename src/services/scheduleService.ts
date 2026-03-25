import type { IScheduleMonth } from "@/interfaces";
import { useApi } from "@/composables/useApi";

interface ScheduleServiceParams {
    storeId: string;
    year: string;
    month: string;
}

interface DeleteScheduleEntryParams {
    storeId: string;
    userId: string;
    date: string;
}

export function getMonthScheduleService({ storeId, year, month }: ScheduleServiceParams) {
    const api = useApi(import.meta.env.VITE_API);
    return api.get<IScheduleMonth>(`/schedule/month?storeId=${storeId}&year=${year}&month=${month}`)
}

export function updateMonthScheduleService(options) {
    const api = useApi(import.meta.env.VITE_API);
    return api.put('/schedule/month', options)
}

export function deleteMonthScheduleService({ storeId, userId, date }: DeleteScheduleEntryParams) {
    const api = useApi(import.meta.env.VITE_API);
    const searchParams = new URLSearchParams({
        storeId,
        userId,
        date,
    })

    return api.del(`/schedule/entry?${searchParams.toString()}`)
}

export function getScheduleTypesService() {
    const api = useApi(import.meta.env.VITE_API);
    return api.get('/schedule/types')
}
