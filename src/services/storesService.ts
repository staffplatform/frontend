import { useApi } from "@/composables/useApi";
import type { ICreateOrganizationStoreForm, IOrganizationEmployee, IStore } from "@/interfaces";

const api = useApi(import.meta.env.VITE_API);

export async function getCurrentStoresService(): Promise<IStore[]> {
    return await api.get<IStore[]>("/stores/my");
}

export async function getEmployeesStoreService(store: IStore): Promise<IOrganizationEmployee[]> {
    return await api.get<IOrganizationEmployee[]>(`/stores/${store.id}/employees`);
}

export async function createStoreService(data: ICreateOrganizationStoreForm) {
    return await api.post(`/stores`, data);
}

export async function editStoreService(store: IStore) {
    return await api.patch(`/stores/${store.id}`, {
        name: store.name,
        city: store.city,
        address: store.address,
        activeFrom: store.activeFrom,
    })
}
export async function deleteStoreService(id: string) {
    return await api.del(`/stores/${id}`)
}
