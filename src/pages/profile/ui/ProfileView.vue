<script setup lang="ts">
import AppButton from "@/shared/ui/button/AppButton.vue";
import AppInput from "@/shared/ui/input/AppInput.vue";
import AppTab from "@/shared/ui/tab/AppTab.vue";
import { useUserStore } from "@/entities/user/model/store";
import { ref } from "vue";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import { profileService } from "@/entities/user/api/profileService";
import { useToast } from "vue-toastification";
import { DateHelper } from "@/shared/lib/date";
import type { IUser } from "@/entities/user/model/types";
import { isApiError } from "@/shared/api/lib/isApiError";
import { ROLE_LABELS, type RolesTypes } from "@/shared/config/roles";

const toast = useToast();
const { user, setUser } = useUserStore();
const localUser = ref<IUser | null>(user && { ...user });
const isEdit = ref(false);

const profileItems = [
    {
        label: "Номер пользователя",
        key: "id",
        inputType: "text",
        editable: false,
    },
    {
        label: "Почта",
        key: "email",
        inputType: "text",
        editable: true,
    },
    {
        label: "Имя",
        key: "firstName",
        inputType: "text",
        editable: true,
    },
    {
        label: "Фамилия",
        key: "lastName",
        inputType: "text",
        editable: true,
    },
    {
        label: "Отчество",
        key: "middleName",
        inputType: "text",
        editable: true,
    },
    {
        label: "День рождения",
        key: "birthDate",
        inputType: "date",
        editable: true,
    },
];

const profileStoreItems = [
    {
        label: "Номер магазина",
        key: "storeId",
        editable: true,
    },
    {
        label: "Название магазина",
        key: "storeName",
        editable: true,
    },
    {
        label: "Роль",
        key: "role",
        editable: true,
    },
    {
        label: "Активен",
        key: "activeFrom",
        editable: true,
    },
];

function getEmployeeRole(role: RolesTypes) {
    if (!role) {
        return;
    }
    return ROLE_LABELS[role];
}

function editProfile() {
    localUser.value = user ? { ...user } : null;
    isEdit.value = !isEdit.value;
}

async function saveProfile() {
    if (!localUser.value) {
        return;
    }

    const payload = {
        firstName: localUser.value.firstName,
        lastName: localUser.value.lastName,
        birthDate: DateHelper.YYYYMMDD(localUser.value.birthDate) ?? "",
    };

    try {
        const data: IUser = await profileService(payload);
        setUser(data);
        localUser.value = { ...data };
        isEdit.value = !isEdit.value;
    } catch (error) {
        if (isApiError(error)) {
            toast.error(error.data.message);
        }
    }
}

function cancelProfile() {
    localUser.value = user ? { ...user } : null;
    isEdit.value = !isEdit.value;
}
</script>

<template>
    <section class="profile">
        <div class="profile__header">
            <h1 class="profile__title">Профиль</h1>
            <p class="profile__subtitle">Информация о вашем аккаунте</p>
        </div>

        <div v-if="user && localUser" class="profile__tabs">
            <AppTab title="Личная информация">
                <template #actions>
                    <button
                        @click="editProfile()"
                        class="profile__edit-btn"
                        type="button"
                        aria-label="Редактировать профиль"
                    >
                        <PencilSquareIcon class="profile__edit-icon" />
                    </button>
                </template>
                <div class="profile-info">
                    <div
                        v-for="profileItem in profileItems"
                        class="profile-card"
                        :key="profileItem.key"
                    >
                        <label class="profile-card__label">{{ profileItem.label }}</label>
                        <div class="profile-card__field">
                            <AppInput
                                v-model="localUser[profileItem.key]"
                                type="text"
                                :disabled="!profileItem.editable || !isEdit"
                                placeholder="Поле не заполнено"
                            />
                        </div>
                    </div>

                    <div v-if="isEdit" class="profile-card__buttons">
                        <AppButton @click="cancelProfile" variant="primary">Отменить</AppButton>
                        <AppButton @click="saveProfile" variant="primary">Сохранить</AppButton>
                    </div>
                </div>
            </AppTab>
            <AppTab title="Место работы">
                <div class="profile-info">
                    <AppTab
                        v-for="storeAssignment in localUser.storeAssignments"
                        class="profile-card-magazine"
                        :title="`Магазин ${storeAssignment.storeName}`"
                        :key="storeAssignment.storeId"
                    >
                        <div v-for="profileStore in profileStoreItems" :key="profileStore.key">
                            <label class="profile-card__label">{{ profileStore.label }}</label>
                            <div class="profile-card__field">
                                <AppInput
                                    :model-value="
                                        profileStore.key === 'role'
                                            ? getEmployeeRole(storeAssignment.role)
                                            : storeAssignment[profileStore.key]
                                    "
                                    type="text"
                                    disabled
                                    placeholder="Поле не заполнено"
                                />
                            </div>
                        </div>
                    </AppTab>

                    <div v-if="isEdit" class="profile-card__buttons">
                        <AppButton @click="cancelProfile" variant="primary">Отменить</AppButton>
                        <AppButton @click="saveProfile" variant="primary">Сохранить</AppButton>
                    </div>
                </div>
            </AppTab>
        </div>

        <div class="profile__empty" v-else>Данные пользователя недоступны</div>
    </section>
</template>

<style scoped>
.profile {
    max-width: 840px;
    margin: 0 auto;
    padding: 24px 16px;
}

.profile__header {
    display: flex;
    flex-direction: column;
    margin-bottom: 18px;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.profile__title {
    margin: 0 0 4px;
    font-size: 30px;
    line-height: 1.2;
    color: #111827;
}

.profile__subtitle {
    margin: 0;
    color: #4b5563;
}

.profile__tabs {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.profile__edit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 8px;
    color: #6b7280;
    cursor: pointer;
    background: #ffffff;
}

.profile__edit-btn:hover {
    color: #374151;
}

.profile__edit-icon {
    width: 18px;
    height: 18px;
}

.profile-card {
    flex: 1 1 calc(50% - 6px);
    min-width: 280px;
    padding: 14px;
    background-color: #fff;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 6px 24px rgba(17, 24, 39, 0.06);
}

.profile-card-magazine {
    flex: 1 1 calc(50% - 6px);
    min-width: 280px;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
}

.profile-card__label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #6b7280;
}

.profile-card__field :deep(.input) {
    border-radius: 10px;
    border-color: #d1d5db;
}

.profile-card__readonly {
    min-height: 42px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    color: #6b7280;
    background: #f9fafb;
}

.profile__empty {
    padding: 20px;
    border: 1px dashed #d1d5db;
    border-radius: 12px;
    color: #6b7280;
    text-align: center;
}

.profile-card__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-basis: 100%;
}

@media (max-width: 720px) {
    .profile-card {
        flex-basis: 100%;
        min-width: 0;
    }
}
</style>
