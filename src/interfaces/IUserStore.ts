export interface IUserStore {
    storeId: string;
    storeName: string;
    storeCity: string;
    role: "OWNER" | "ADMIN" | "EMPLOYEE";
    activeFrom: string;
    assignedAt: string;
}
