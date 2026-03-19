import { useApi } from "@/composables/useApi";
import type { IStore } from "@/interfaces";

export async function getCurrentStoresService(): Promise<IStore[]> {
    const api = useApi(import.meta.env.VITE_API);
    return await api.get<IStore[]>("/stores/my");
}
