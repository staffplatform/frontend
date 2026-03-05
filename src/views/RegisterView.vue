<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import AppInput from "@/components/AppInput.vue";
import AppButton from "@/components/AppButton.vue";
import { ERouter } from "@/enums";
import { computed, reactive, ref, toRef } from "vue";
import { useValidation } from "@/composables/useValidation";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { registerService } from "@/services/registerService";

const isLoading = ref<boolean>(false);
const router = useRouter();
const toast = useToast();
const register = reactive({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
});

const { errorText: emailErrorText } = useValidation(
    "email",
    toRef(register, "email"),
);
const { errorText: passwordErrorText } = useValidation(
    "password",
    toRef(register, "password"),
);

const { errorText: firstNameErrorText } = useValidation(
    "text",
    toRef(register, "firstName"),
);

const { errorText: lastNameErrorText } = useValidation(
    "text",
    toRef(register, "lastName"),
);

const isSubmitDisable = computed(() => {
    return (
        isLoading.value ||
        !!emailErrorText.value ||
        !!passwordErrorText.value ||
        !!firstNameErrorText.value ||
        !!lastNameErrorText.value
    );
});

const submitForm = async () => {
    isLoading.value = true
    try {
        await registerService(register)
        await router.push({ path: ERouter.DASHBOARD });
        toast.success("Вы успешно зарегистрировались!");
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.data.message);
        }
    } finally {
        isLoading.value = false
    }
};
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
            <div class="justify-center">
                <label>
                    test.user1@example.com
                    <span class="label-text text-gray-900"
                        >Почта</span
                    >
                    <AppInput
                        type="email"
                        v-model="register.email"
                        :error="emailErrorText"
                        placeholder="Введите почту"
                    />
                </label>
            </div>
            <div>
                <label>
                    StrongPass222
                    <span class="label-text text-gray-900"
                        >Пароль</span
                    >
                    <AppInput
                        type="password"
                        v-model="register.password"
                        :error="passwordErrorText"
                        placeholder="Введите пароль"
                    />
                </label>
            </div>
            <div>
                <label>
                    Ivan
                    <span class="label-text text-gray-900"
                        >Имя</span
                    >
                    <AppInput
                        type="text"
                        v-model="register.firstName"
                        :error="firstNameErrorText"
                        placeholder="Укажите имя"
                    />
                </label>
            </div>
            <div>
                <label>
                    Ivanov
                    <span class="label-text text-gray-900"
                        >Фамилия</span
                    >
                    <AppInput
                        type="text"
                        v-model="register.lastName"
                        :error="lastNameErrorText"
                        placeholder="Укажите фамилию"
                    />
                </label>
            </div>
            <AppButton :disabled="isSubmitDisable">Зарегистрироваться</AppButton>
        </form>
        <div class="flex justify-center items-center gap-2">
            <p class="flex-grow-0 text-gray-900">Уже есть аккаунт?</p>
            <AppButton variant="secondary" :to="ERouter.AUTH">
              Войти
            </AppButton>
        </div>
    </AppModal>
</template>