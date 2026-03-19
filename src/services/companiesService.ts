import { useApi } from "@/composables/useApi";

export async function companiesService() {
    const api = useApi(import.meta.env.VITE_API)
    return await api.get('/companies')
}