import { useApi } from "@/shared/api/useApi";
import type { IUser } from "@/entities/user/model/types";

export async function profileService(data: Pick<IUser, "firstName" | "lastName" | "birthDate">) {
    const api = useApi(import.meta.env.VITE_API);
    return api.patch<typeof data, IUser>("/users/me", data)
}
