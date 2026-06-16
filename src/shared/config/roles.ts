export const ROLES_TYPES = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    EMPLOYEE: "EMPLOYEE"
} as const

export const ROLE_LABELS: Record<RolesTypes, string> = {
    OWNER: "Владелец",
    ADMIN: "Администратор",
    EMPLOYEE: "Сотрудник",
} as const;

export type RolesTypes = typeof ROLES_TYPES[keyof typeof ROLES_TYPES]