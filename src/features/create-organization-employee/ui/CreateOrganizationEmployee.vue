<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import type { IStore } from "@/entities/store/model/types";
import type { ICreateOrganizationEmployeeForm } from "@/features/create-organization-employee/model/types";
import AppButton from "@/shared/ui/button/AppButton.vue";
import AppInput from "@/shared/ui/input/AppInput.vue";
import { useValidation } from "@/shared/lib/validation/useValidation";

const props = defineProps<{
    stores: IStore[];
}>();

const form = ref({
    email: "",
    password: "",
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    workCity: "",
    storeId: "",
    activeFrom: "",
});

const { errorText: emailErrorText } = useValidation(
    "email",
    toRef(form.value, "email"),
);

const { errorText: passwordErrorText } = useValidation(
    "password",
    toRef(form.value, "password"),
);

const { errorText: lastNameErrorText } = useValidation(
    "text",
    toRef(form.value, "lastName"),
);

const { errorText: firstNameErrorText } = useValidation(
    "text",
    toRef(form.value, "firstName"),
);

const { errorText: middleNameErrorText } = useValidation(
    "text",
    toRef(form.value, "middleName"),
);

const { errorText: birthDateErrorText } = useValidation(
    "text",
    toRef(form.value, "birthDate"),
);

const { errorText: workCityErrorText } = useValidation(
    "text",
    toRef(form.value, "workCity"),
);

const { errorText: activeFromErrorText } = useValidation(
    "text",
    toRef(form.value, "activeFrom"),
);

const isSubmitDisable = computed(() => {
    return (
        !!emailErrorText.value ||
        !!passwordErrorText.value ||
        !!lastNameErrorText.value ||
        !!firstNameErrorText.value ||
        !!middleNameErrorText.value ||
        !!birthDateErrorText.value ||
        !!workCityErrorText.value ||
        !!activeFromErrorText.value
    );
});

const emit = defineEmits<{
    "create-organization-employee": [
        employeeData: ICreateOrganizationEmployeeForm,
    ];
}>();

function createOrganizationEmployee() {
    emit("create-organization-employee", form.value);
}
</script>

<template>
    <section
        class="organization-employees__panel organization-employees__panel--details"
    >
        <div class="organization-employees__details">
            <p class="organization-employees__details-label">
                Новый сотрудник
            </p>
            <h2 class="organization-employees__details-title">
                Добавьте сотрудника в магазин
            </h2>

            <div class="organization-employees__details-list">
                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Email
                    </span>
                    <AppInput
                        v-model="form.email"
                        type="email"
                        :error="emailErrorText"
                        placeholder="ivan.ivanov@example.com"
                    />
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Пароль
                    </span>
                    <AppInput
                        v-model="form.password"
                        type="password"
                        :error="passwordErrorText"
                        placeholder="Введите пароль"
                    />
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Фамилия
                    </span>
                    <AppInput
                        v-model="form.lastName"
                        type="text"
                        :error="lastNameErrorText"
                        placeholder="Иванов"
                    />
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Имя
                    </span>
                    <AppInput
                        v-model="form.firstName"
                        type="text"
                        :error="firstNameErrorText"
                        placeholder="Иван"
                    />
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Отчество
                    </span>
                    <AppInput
                        v-model="form.middleName"
                        type="text"
                        :error="middleNameErrorText"
                        placeholder="Иванович"
                    />
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Дата рождения
                    </span>
                    <AppInput
                        v-model="form.birthDate"
                        type="date"
                        :error="birthDateErrorText"
                    />
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Город работы
                    </span>
                    <AppInput
                        v-model="form.workCity"
                        type="text"
                        :error="workCityErrorText"
                        placeholder="Москва"
                    />
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key"
                        >Магазин</span
                    >
                    <select
                        v-model="form.storeId"
                        class="select w-full"
                    >
                        <option
                            v-for="store in stores"
                            :key="store.id"
                            :value="store.id"
                        >
                            {{ store.name }}
                        </option>
                    </select>
                </div>

                <div class="organization-employees__details-row">
                    <span class="organization-employees__details-key">
                        Активен с
                    </span>
                    <AppInput
                        v-model="form.activeFrom"
                        type="date"
                        :error="activeFromErrorText"
                    />
                </div>

                <div class="organization-employees__details-buttons">
                    <AppButton
                        type="button"
                        @click="createOrganizationEmployee"
                        :disabled="isSubmitDisable"
                    >
                        Добавить сотрудника
                    </AppButton>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.organization-employees__panel--details {
    padding: 24px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.organization-employees__details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
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

.organization-employees__details-title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.15;
    color: #111827;
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
    align-items: center;
    padding-bottom: 14px;
    border-bottom: 1px solid #f1f5f9;
}

.organization-employees__details-key {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: #6b7280;
}

.organization-employees__details-buttons {
    display: flex;
    justify-content: flex-end;
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
        gap: 8px;
        align-items: stretch;
    }
}
</style>
