import type { IDeleteScheduleParams, IScheduleForm, IScheduleMonth, IScheduleTypes, IScheduleWeek } from "@/entities/schedule/model/types";
import { useApi } from "@/shared/api/lib/useApi";

interface IMonthScheduleServiceParams {
    storeId: string;
    year: string;
    month: string;
    entries?: IScheduleForm[];
}

interface IWeekScheduleServiceParams {
    storeId: string;
    week: string;
    entries?: IScheduleForm[];
}

const api = useApi(import.meta.env.VITE_API);

export function getMonthScheduleService({ storeId, year, month }: IMonthScheduleServiceParams) {
    return api.get<IScheduleMonth>(`/schedule/month?storeId=${storeId}&year=${year}&month=${month}`)
}

export function getWeekScheduleService({storeId, week}: IWeekScheduleServiceParams) {
    return api.get<IScheduleWeek>(`/schedule/week?storeId=${storeId}&week=${week}`)
}

export function updateMonthScheduleService(options: IMonthScheduleServiceParams) {
    return api.put<IMonthScheduleServiceParams, IScheduleMonth>('/schedule/month', options)
}

export function updateWeekScheduleService(options: IWeekScheduleServiceParams) {
    return api.put<IWeekScheduleServiceParams, IScheduleWeek>('/schedule/week', options)
}

export function deleteScheduleEntryService({ storeId, userId, date }: IDeleteScheduleParams) {
    const searchParams = new URLSearchParams({
        storeId,
        userId,
        date,
    })

    return api.del(`/schedule/entry?${searchParams.toString()}`)
}

export function getScheduleTypesService() {
    return api.get<IScheduleTypes>('/schedule/types')
}
