import { useApi } from "@/composables/useApi";

export function scheduleService({ storeId, year, month }) {
    const api = useApi(import.meta.env.VITE_API);
    return api.get(`/schedule/month?storeId=${storeId}&year=${year}&month=${month}`)
}