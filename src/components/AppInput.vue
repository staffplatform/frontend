<script setup lang="ts">
import { ref } from "vue";
import type { InputType } from "@/constants/form";

interface AppInputProps {
    type: InputType;
    error: string | null;
    placeholder: string;
}

const isActive = ref(false);
const model = defineModel();

defineProps<AppInputProps>()

const onBlur = () => {
    isActive.value = true;
};
</script>

<template>
    <input
        :type="type"
        class="input w-full"
        v-model="model"
        @blur="onBlur"
        :placeholder="placeholder"
    />
    <div v-if="error && isActive" class="relative pb-2">
        <span class="absolute pt-1 text-red-500">
            {{ error }}
        </span>
    </div>
</template>
