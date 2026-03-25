<script setup lang="ts">
import type { IEmployee } from '@/interfaces';
import { computed } from 'vue';

const props = defineProps<{
    employee: IEmployee
}>()

const fullName = computed(() => `${props.employee.lastName} ${props.employee.firstName}`.trim())
</script>
<template>
    <div class="employee-dialog-info">
        <div class="employee-dialog-info__hero">
            <img
                class="employee-dialog-info__avatar"
                :src="employee.avatarUrl"
                :alt="fullName"
            >
            <div class="employee-dialog-info__identity">
                <span class="employee-dialog-info__eyebrow">Сотрудник</span>
                <h2 class="employee-dialog-info__name">{{ fullName }}</h2>
                <p class="employee-dialog-info__role">{{ employee.jobTitle }}</p>
            </div>
        </div>

        <div class="employee-dialog-info__grid">
            <div class="employee-dialog-info__note">
                <span class="employee-dialog-info__label">ID сотрудника</span>
                <p class="employee-dialog-info__note-text">{{ employee.userId }}</p>
            </div>
            <div class="employee-dialog-info__item">
                <span class="employee-dialog-info__label">Email</span>
                <p class="employee-dialog-info__value">{{ employee.email }}</p>
            </div>
            <div class="employee-dialog-info__item">
                <span class="employee-dialog-info__label">Имя</span>
                <p class="employee-dialog-info__value">{{ employee.firstName }}</p>
            </div>
            <div class="employee-dialog-info__item">
                <span class="employee-dialog-info__label">Фамилия</span>
                <p class="employee-dialog-info__value">{{ employee.lastName }}</p>
            </div>
            <div class="employee-dialog-info__item">
                <span class="employee-dialog-info__label">Должность</span>
                <p class="employee-dialog-info__value">{{ employee.jobTitle }}</p>
            </div>
        </div>

    </div>
</template>

<style scoped>
.employee-dialog-info {
    min-width: 360px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.employee-dialog-info__hero {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.employee-dialog-info__avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    background-color: #e5e7eb;
}

.employee-dialog-info__identity {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.employee-dialog-info__eyebrow {
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.employee-dialog-info__name {
    margin: 0;
    color: #111827;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
}

.employee-dialog-info__role {
    margin: 0;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
}

.employee-dialog-info__grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 12px;
}

.employee-dialog-info__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 6px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.employee-dialog-info__label {
    display: inline-block;
    margin-bottom: 6px;
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.employee-dialog-info__value {
    margin: 0;
    color: #111827;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
}

.employee-dialog-info__note {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    border-radius: 14px;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
}

.employee-dialog-info__note-text {
    margin: 0;
    color: #1f2937;
    line-height: 1.6;
    word-break: break-all;
}
</style>
