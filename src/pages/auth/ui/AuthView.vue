<script setup lang="ts">
import { computed, reactive, ref, toRef } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import AppModal from "@/shared/ui/modal/AppModal.vue";
import AppInput from "@/shared/ui/input/AppInput.vue";
import AppButton from "@/shared/ui/button/AppButton.vue";
import { ERouter } from "@/shared/config/router/ERouter";
import { authService } from "@/features/auth/api/authService";
import { useValidation } from "@/shared/lib/validation/useValidation";

const isLoading = ref<boolean>(false);
const router = useRouter();
const toast = useToast();
const auth = reactive({
    email: "",
    password: "",
});

const { errorText: emailErrorText } = useValidation(
    "email",
    toRef(auth, "email"),
);
const { errorText: passwordErrorText } = useValidation(
    "password",
    toRef(auth, "password"),
);

const isSubmitDisable = computed(() => {
    return (
        isLoading.value ||
        !!emailErrorText.value ||
        !!passwordErrorText.value
    );
});

const submitForm = async () => {
    isLoading.value = true;
    try {
        await authService(auth);
        await router.push({ path: ERouter.SCHEDULE });
        toast.success("Вы успешно авторизовались!");
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.data.message);
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <AppModal>
        <h2 class="text-xl text-gray-900 font-bold text-center">
            Авторизация
        </h2>
        <p class="text-center text-gray-900">
            Войдите в свою учетную запись
        </p>
        <form
            class="flex flex-col gap-6"
            @submit.prevent="submitForm"
        >
            <div>
                <label>
                    employee@example.com
                    <span class="label-text text-gray-900"
                        >Почта</span
                    >
                    <AppInput
                        type="email"
                        v-model="auth.email"
                        :error="emailErrorText"
                        placeholder="Введите почту"
                    />
                </label>
            </div>
            <div>
                <label>
                    StrongPass123
                    <span class="label-text text-gray-900"
                        >Пароль</span
                    >
                    <AppInput
                        type="password"
                        v-model="auth.password"
                        :error="passwordErrorText"
                        placeholder="Введите пароль"
                    />
                </label>
            </div>
            <AppButton :disabled="isSubmitDisable">Войти</AppButton>
        </form>
        <div class="flex justify-center items-center gap-2">
            <p class="flex-grow-0 text-gray-900">Нет аккаунта?</p>
            <AppButton variant="secondary" :to="ERouter.REGISTER"
                >Зарегистрироваться</AppButton
            >
        </div>
    </AppModal>
</template>
