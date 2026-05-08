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
    role?: string;
    assignedAt?: string;
    storeId?: string;
    workCity?: string;
}