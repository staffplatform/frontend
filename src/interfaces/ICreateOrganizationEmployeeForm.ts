export interface ICreateOrganizationEmployeeForm {
    email: string;
    password: string;
    lastName: string;
    firstName: string;
    middleName?: string;
    birthDate: string;
    workCity: string;
    storeId?: string;
    activeFrom?: string;
}
