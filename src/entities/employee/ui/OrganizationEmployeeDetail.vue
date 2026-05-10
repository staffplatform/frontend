<script setup lang="ts">
import type { IOrganizationEmployee } from "@/entities/employee/model/types";

const props = defineProps<{
    isEditEmployee: boolean;
    editableEmployee: IOrganizationEmployee | null;
    roles: Record<string, string>;
}>();

function getEmployeeRole(role?: string) {
    return role ? (props.roles[role] ?? role) : "Не указана";
}

function getEmployeeValue(value?: string | null) {
    return value || "Не указано";
}
</script>

<template>
    <section
        class="organization-employees__panel organization-employees__panel--details"
    >
        <div
            v-if="editableEmployee"
            class="organization-employees__details"
        >
            <p class="organization-employees__details-label">
                Сотрудник
            </p>

            <div class="organization-employees__hero">
                <img
                    v-if="editableEmployee.avatarUrl"
                    :src="editableEmployee.avatarUrl"
                    :alt="`Аватар ${editableEmployee.firstName} ${editableEmployee.lastName}`"
                    class="organization-employees__details-avatar organization-employees__details-avatar--image"
                />
                <div
                    v-else
                    class="organization-employees__details-avatar"
                >
                    {{ editableEmployee.firstName?.[0]
                    }}{{ editableEmployee.lastName?.[0] }}
                </div>

                <div class="organization-employees__identity">
                    <h2 class="organization-employees__details-title">
                        {{ editableEmployee.firstName }}
                        {{ editableEmployee.middleName }}
                        {{ editableEmployee.lastName }}
                    </h2>
                    <p class="organization-employees__details-hint">
                        {{
                            editableEmployee.jobTitle ||
                            getEmployeeRole(editableEmployee.role)
                        }}
                    </p>
                </div>
            </div>

            <div class="organization-employees__details-list">
                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key"
                        >ID пользователя</span
                    >
                    <span
                        class="organization-employees__details-value"
                        >{{ editableEmployee.userId }}</span
                    >
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key"
                        >Email</span
                    >
                    <span
                        class="organization-employees__details-value"
                        >{{ editableEmployee.email }}</span
                    >
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Фамилия
                    </span>
                    <span
                        class="organization-employees__details-value"
                    >
                        {{
                            getEmployeeValue(
                                editableEmployee.lastName,
                            )
                        }}
                    </span>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Имя
                    </span>
                    <span
                        class="organization-employees__details-value"
                    >
                        {{
                            getEmployeeValue(
                                editableEmployee.firstName,
                            )
                        }}
                    </span>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Отчество
                    </span>
                    <span
                        class="organization-employees__details-value"
                    >
                        {{
                            getEmployeeValue(
                                editableEmployee.middleName,
                            )
                        }}
                    </span>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Дата рождения
                    </span>
                    <span
                        class="organization-employees__details-value"
                    >
                        {{
                            getEmployeeValue(
                                editableEmployee.birthDate,
                            )
                        }}
                    </span>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Город работы
                    </span>
                    <span
                        class="organization-employees__details-value"
                    >
                        {{
                            getEmployeeValue(
                                editableEmployee.workCity,
                            )
                        }}
                    </span>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        ID магазина
                    </span>
                    <span
                        class="organization-employees__details-value"
                    >
                        {{
                            getEmployeeValue(editableEmployee.storeId)
                        }}
                    </span>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Активен с
                    </span>
                    <span
                        class="organization-employees__details-value"
                    >
                        {{
                            getEmployeeValue(
                                editableEmployee.activeFrom,
                            )
                        }}
                    </span>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Назначен
                    </span>
                    <span
                        class="organization-employees__details-value"
                    >
                        {{
                            getEmployeeValue(
                                editableEmployee.assignedAt,
                            )
                        }}
                    </span>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key"
                        >Роль</span
                    >
                    <span
                        class="organization-employees__details-value"
                    >
                        {{ getEmployeeRole(editableEmployee.role) }}
                    </span>
                </div>
            </div>
        </div>

        <div
            v-else
            class="organization-employees__details organization-employees__details--empty"
        >
            <p class="organization-employees__details-label">
                Сотрудник не выбран
            </p>
            <p class="organization-employees__details-hint">
                Выберите сотрудника слева, чтобы посмотреть подробную
                информацию.
            </p>
        </div>
    </section>
</template>

<style scoped>
.organization-employees__panel {
    border: 1px solid #e5e7eb;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.organization-employees__panel--details {
    padding: 24px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.organization-employees__details {
    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: left;
}

.organization-employees__details--empty {
    justify-content: center;
    min-height: 220px;
}

.organization-employees__details-label {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.02em;
    color: #6b7280;
    text-transform: uppercase;
}

.organization-employees__hero {
    display: flex;
    align-items: center;
    gap: 14px;
}

.organization-employees__details-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 72px;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #e2e8f0;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #334155;
}

.organization-employees__details-avatar--image {
    object-fit: cover;
    overflow: hidden;
}

.organization-employees__identity {
    min-width: 0;
}

.organization-employees__details-title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.15;
    color: #111827;
}

.organization-employees__details-hint {
    margin: 4px 0 0;
    font-size: 15px;
    line-height: 1.5;
    color: #4b5563;
}

.organization-employees__details-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 6px;
}

.organization-employees__details-row {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f1f5f9;
}

.organization-employees__details-key {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: #6b7280;
}

.organization-employees__details-value {
    min-width: 0;
    font-size: 14px;
    line-height: 1.4;
    color: #111827;
    overflow-wrap: anywhere;
}

@media (max-width: 900px) {
    .organization-employees__panel--details {
        padding: 20px;
    }

    .organization-employees__details-title {
        font-size: 22px;
    }

    .organization-employees__details-row {
        grid-template-columns: 1fr;
        gap: 4px;
    }
}
</style>
