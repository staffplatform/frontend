<script setup lang="ts">
import { ref } from "vue";
import type { InputType } from "@/shared/config/form";

interface AppInputProps {
    type: InputType;
    error?: string | null;
    placeholder?: string;
    disabled?: boolean;
}

const isActive = ref(false);
const model = defineModel();

defineProps<AppInputProps>();

defineOptions({
    inheritAttrs: false,
});

const onBlur = () => {
    isActive.value = true;
};
</script>

<template>
    <div class="app-input">
        <input
            class="input w-full"
            v-model="model"
            v-bind="$attrs"
            @blur="onBlur"
            :type="type"
            :disabled="disabled"
            :placeholder="placeholder"
        />
        <span v-if="error && isActive" class="app-input__error">
            {{ error }}
        </span>
    </div>
</template>

<style scoped>
.app-input {
    width: 100%;
}

.app-input__error {
    display: block;
    margin-top: 4px;
    color: #ef4444;
    font-size: 14px;
    line-height: 1.35;
}
</style>
