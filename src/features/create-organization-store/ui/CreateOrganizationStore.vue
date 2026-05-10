<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import AppInput from "@/shared/ui/input/AppInput.vue";
import AppButton from "@/shared/ui/button/AppButton.vue";
import type { ICreateOrganizationStoreForm } from "@/features/create-organization-store/model/types";
import { useValidation } from "@/shared/lib/validation/useValidation";

const form = ref<ICreateOrganizationStoreForm>({
    name: "",
    city: "",
    address: "",
    activeFrom: "",
});

const { errorText: nameErrorText } = useValidation(
    "text",
    toRef(form.value, "name"),
);

const { errorText: activeFromErrorText } = useValidation(
    "text",
    toRef(form.value, "activeFrom"),
);

const isSubmitDisable = computed(() => {
    return (
        !!nameErrorText.value ||
        !!activeFromErrorText.value
    );
});

const emit = defineEmits<{
    "create-organization-store": [
        storeData: ICreateOrganizationStoreForm,
    ];
}>();

function createOrganizationStore() {
    emit("create-organization-store", form.value);
}
</script>

<template>
    <section class="organization-stores-create">
        <p class="organization-stores-create__label">Новый магазин</p>
        <h2 class="organization-stores-create__title">
            Заполните данные магазина
        </h2>

        <div class="organization-stores-create__list">
            <div class="organization-stores-create__row">
                <span class="organization-stores-create__key"
                    >Название магазина</span
                >
                <AppInput
                    v-model="form.name"
                    class="organization-stores-create__input"
                    type="text"
                    :error="nameErrorText"
                    placeholder="Например, Центральный"
                />
            </div>

            <div class="organization-stores-create__row">
                <span class="organization-stores-create__key"
                    >Город</span
                >
                <AppInput
                    v-model="form.city"
                    class="organization-stores-create__input"
                    type="text"
                    placeholder="Например, Москва"
                />
            </div>

            <div class="organization-stores-create__row">
                <span class="organization-stores-create__key"
                    >Адрес</span
                >
                <AppInput
                    v-model="form.address"
                    class="organization-stores-create__input"
                    type="text"
                    placeholder="Улица, дом, офис"
                />
            </div>

            <div class="organization-stores-create__row">
                <span class="organization-stores-create__key"
                    >Активен с</span
                >
                <AppInput
                    v-model="form.activeFrom"
                    class="organization-stores-create__input"
                    :error="activeFromErrorText"
                    type="date"
                />
            </div>
        </div>
        <AppButton 
            @click="createOrganizationStore()" 
            :disabled="isSubmitDisable"
        >
            Создать магазин
        </AppButton>
    </section>
</template>

<style scoped>
.organization-stores-create {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
    background-color: #ffffff;
}

.organization-stores-create__label {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.02em;
    color: #6b7280;
    text-transform: uppercase;
}

.organization-stores-create__title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.15;
    color: #111827;
}

.organization-stores-create__list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 6px;
}

.organization-stores-create__row {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    padding-bottom: 14px;
    border-bottom: 1px solid #f1f5f9;
}

.organization-stores-create__key {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: #6b7280;
}

.organization-stores-create__input {
    width: 100%;
}

@media (max-width: 900px) {
    .organization-stores-create__title {
        font-size: 22px;
    }

    .organization-stores-create__row {
        grid-template-columns: 1fr;
        gap: 8px;
        align-items: stretch;
    }
}
</style>
