import { computed, type Ref } from "vue";

type typeValidation = "email" | "password";

export function useValidation(
    type: typeValidation,
    validation: Ref<string>,
) {
    const errorText = computed(() => {
        const value = validation.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value.length === 0) {
            return "Это поле обязательно!";
        }

        if (type === "email") {
            if (!emailRegex.test(value)) {
                return "Неверный формат email";
            }
            return null;
        }

        if (type === "password") {
            if (value.length < 6) {
                return "Пароль должен содержать больше 6 значений";
            }
            return null;
        }

        return null;
    });

    return { errorText };
}