<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import AppInput from "@/components/AppInput.vue";
import AppButton from "@/components/AppButton.vue";
import { ERouter } from "@/enums";

const submitForm = () => {};
</script>

<template>
    <AppModal>
        <h2 class="text-xl text-gray-900 font-bold text-center">
            Создать аккаунт
        </h2>
        <p class="text-center text-gray-900">
            Заполните форму для регистрации
        </p>
        <form
            class="flex flex-col gap-4"
            @submit.prevent="submitForm"
        >
            <div>
                <label>
                    <span class="label-text text-gray-900"
                        >Почта</span
                    >
                    <AppInput
                        type="email"
                        placeholder="Введите почту"
                    />
                </label>
            </div>
            <div>
                <label>
                    <span class="label-text text-gray-900"
                        >Пароль</span
                    >
                    <AppInput
                        type="password"
                        placeholder="Введите пароль"
                    />
                </label>
            </div>
            <AppButton>Зарегистрироваться</AppButton>
        </form>
        <div class="flex justify-center items-center gap-2">
            <p class="flex-grow-0 text-gray-900">Уже есть аккаунт?</p>
            <AppButton variant="secondary" :to="ERouter.AUTH">
              Войти
            </AppButton>
        </div>
    </AppModal>
</template>