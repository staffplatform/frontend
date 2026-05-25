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

const toast = useToast()
const { user, setUser } = useUserStore();
const localUser = ref<IUser | null>(user && {...user})
const isEdit = ref(false)

function editProfile() {
    localUser.value = user ? { ...user } : null
    isEdit.value = true
}

async function saveProfile() {
    if (!localUser.value) {
        return
    }

    const payload = {
        firstName: localUser.value.firstName,
        lastName: localUser.value.lastName,
        birthDate: DateHelper.YYYYMMDD(localUser.value.birthDate) ?? ''
    };

    try {
        const data: IUser = await profileService(payload)
        setUser(data)
        localUser.value = {...data}
        isEdit.value = false;
    } catch (error) {
        if (isApiError(error)) {
            toast.error(error.data.message);
        }
    }
}

function cancelProfile() {
    localUser.value = user ? { ...user } : null
    isEdit.value = false
}
</script>

<template>
    <section class="profile">
        <div class="profile__header">
                <h1 class="profile__title">Профиль</h1>
                <p class="profile__subtitle">Информация о вашем аккаунте</p>
        </div>

        <div v-if="user && localUser">
            <AppTab title="Личная информация">
                <template #actions>
                    <button @click="editProfile()" class="profile__edit-btn" type="button" aria-label="Редактировать профиль">
                        <PencilSquareIcon class="profile__edit-icon" />
                    </button>
                </template>
                <div class="profile-info">
                    <div class="profile-card">
                        <label class="profile-card__label">Номер пользователя</label>
                        <div class="profile-card__field">
                            <AppInput v-model="localUser.id" type="text" disabled />
                        </div>
                    </div>

                    <div class="profile-card">
                        <label class="profile-card__label">Почта</label>
                        <div class="profile-card__field">
                            <AppInput v-model="localUser.email" type="text" disabled />
                        </div>
                    </div>

                    <div class="profile-card">
                        <label class="profile-card__label">Имя</label>
                        <div class="profile-card__field">
                            <AppInput v-model="localUser.firstName" type="text" :disabled="!isEdit" placeholder="Поле не заполнено" />
                        </div>
                    </div>

                    <div class="profile-card">
                        <label class="profile-card__label">Фамилия</label>
                        <div class="profile-card__field">
                            <AppInput v-model="localUser.lastName" type="text" :disabled="!isEdit" placeholder="Поле не заполнено" />
                        </div>
                    </div>

                    <div class="profile-card">
                        <label class="profile-card__label">День рождения</label>
                        <div class="profile-card__field" v-if="isEdit">
                            <AppInput v-model="localUser.birthDate" type="date" placeholder="Поле не заполнено" />
                        </div>
                        <div class="profile-card__readonly" v-else>
                            {{ DateHelper.DDMMYYYY(user.birthDate) || "Поле не заполнено" }}
                        </div>
                    </div>

                    <div v-if="isEdit" class="profile-card__buttons">
                        <AppButton @click="cancelProfile" variant="primary">Отменить</AppButton>
                        <AppButton @click="saveProfile" variant="primary">Сохранить</AppButton>
                    </div>
                </div>
            </AppTab>
        </div>

        <div class="profile__empty" v-else>
            Данные пользователя недоступны
        </div>
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
