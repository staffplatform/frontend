const ROLES_TYPES = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    EMPLOYEE: "EMPLOYEE"
} as const

export type RolesTypes = typeof ROLES_TYPES[keyof typeof ROLES_TYPES]