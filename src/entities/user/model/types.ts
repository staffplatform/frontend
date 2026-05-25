import type { RolesTypes } from "@/shared/config/roles";

export interface IUserStore {
    storeId: string;
    storeName: string;
    storeCity: string;
    role: RolesTypes;
    activeFrom: string;
    assignedAt: string;
}


export interface IUser {
    id: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    birthDate: string;
    avatarUrl?: string;
    jobTitle?: string;
    workCity?: string;
    workAddress?: string;
    companyAddress?: string;
    storeAssignments: IUserStore[];
    createdAt: string;
    updatedAt: string;
}
