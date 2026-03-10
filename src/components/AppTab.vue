<script setup lang="ts">
const props = defineProps<{title: string}>()
</script>
<template>
    <details class="accordion">
        <summary class="accordion-title">
            <span class="accordion-title__text">{{ props.title }}</span>
            <span class="accordion-title__actions" @click.stop>
                <slot name="actions"></slot>
            </span>
        </summary>
        <div class="accordion__list">
            <slot></slot>
        </div>
    </details>
</template>

<style scoped>
.accordion {
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
}

.accordion-title {
    cursor: pointer;
    padding: 8px;
    font-size: 18px;
    font-weight: 700;
    color: #000000;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
}

.accordion-title__actions {
    margin-left: auto;
    display: none;
    align-items: center;
}

.accordion[open] .accordion-title__actions {
    display: inline-flex;
}

.accordion-title::before {
    content: "▶";
    display: inline-block;
    line-height: 1;
    transition: transform 0.2s ease;
    transform-origin: center;
}

.accordion[open] .accordion-title::before {
    transform: rotate(90deg);
}

.accordion__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>