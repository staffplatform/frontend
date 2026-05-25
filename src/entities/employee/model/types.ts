import type { RolesTypes } from "@/shared/config/roles";

export interface IOrganizationEmployee {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    avatarUrl: string;
    activeFrom?: string;
    birthDate?: string;
    jobTitle: string;
    role: RolesTypes;
    assignedAt?: string;
    storeId?: string;
    workCity?: string;
}