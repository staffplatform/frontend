<script setup lang="ts">
import AppButton from '@/components/AppButton.vue';
import AppDialog from '@/components/AppDialog.vue';
import { ERouterName } from '@/enums';
import type { ISchedule, IStore } from '@/interfaces';
import { scheduleService } from '@/services/scheduleService';
import { getCurrentStoresService } from '@/services/storesService';
import { useScheduleStore } from '@/stores/useScheduleStore';
import { HomeIcon } from '@heroicons/vue/24/outline';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const scheduleStore = useScheduleStore()
const selectedEntry = ref<ISchedule | null>(null)
const stores = ref<IStore[] | null>(null)
const isOpen = ref<boolean>(false)

async function showDialog() {
    stores.value = await getCurrentStoresService()
    isOpen.value = !isOpen.value
}

async function selectStore(store: IStore) {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    router.push({
        name: ERouterName.SCHEDULE,
        params: {
            mode: 'month',
        },
        query: {
            storeId: store.id,
            year: year,
            month: month,
        }
    })

    isOpen.value = false
}

function getEntriesByDay(day: number) {
    if (!scheduleStore.schedule) {
        return
    }
    const fullDate = `${scheduleStore.schedule.year}-${String(scheduleStore.schedule.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    
    return scheduleStore.schedule.entries
        .filter((entry: ISchedule) => entry.date === fullDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

function showEntryInfo(entry: ISchedule) {
    selectedEntry.value = entry
}

watch(
    [() => route.query.storeId, () => route.query.year, () => route.query.month]
    , async () => {
        const storeId = typeof route.query.storeId === 'string' ? route.query.storeId : null
        const year = typeof route.query.year === 'string' ? route.query.year : null
        const month = typeof route.query.month === 'string' ? route.query.month : null

        if (!storeId || !year || !month) {
            return
        }

        const schedule = await scheduleService({
            storeId: storeId,
            year: year,
            month: month,
        })

        scheduleStore.setSchedule(schedule)
    },
    {immediate: true}
)
</script>
<template>
    <div v-if="scheduleStore.schedule" class="schedule">
        <div class="schedule-panel">
            <div class="schedule-actions">
                <AppButton @click="showDialog" variant="primary">
                    <HomeIcon class="store-picker" />
                </AppButton>
                <AppButton variant="primary">Создать смену</AppButton>
            </div>
            <div class="period-buttons">
                <AppButton variant="primary">Месяц</AppButton>
                <AppButton variant="primary">Неделя</AppButton>
                <AppButton variant="primary">День</AppButton>
            </div>
            <div class="arrow-buttons">
                <AppButton variant="primary">Назад</AppButton>
                <AppButton variant="primary">Вперед</AppButton>
            </div>
        </div>
        <div class="schedule-info">
            <div>
                <h1 class="schedule-employees">Сотрудники {{ scheduleStore.schedule.employees.length }}</h1>
                <div class="schedule-cards">
                    <div
                        class="schedule-card" 
                        v-for="employee in scheduleStore.schedule.employees" 
                        :key="employee.id"
                    >
                        <img class="schedule-card__image" src="https://media.istockphoto.com/id/459008937/ru/%D1%84%D0%BE%D1%82%D0%BE/lego-%D0%B4%D0%B8%D1%81%D0%BF%D0%BB%D0%B5%D0%B9-%D1%80%D0%B8%D1%81%D1%83%D0%BD%D0%BE%D0%BA.jpg?s=612x612&w=0&k=20&c=oPCV_hPEDoDuwU_RQoMpJxVTC2fem9-P3eWcEZ3gp50=" alt="Аватар">
                        <div class="schedule-card__info">
                            <p class="schedule-card__name">
                                {{ employee.lastName }} {{ employee.firstName }}
                            </p>
                            <span class="schedule-card__position">
                                {{ employee.jobTitle }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="calendar">
                    <div 
                        class="calendar-item" 
                        v-for="day in scheduleStore.schedule.daysInMonth"
                        :key="day"
                    >
                        {{ day }}
                        <div v-for="entry in getEntriesByDay(day)" @click="showEntryInfo(entry)" :key="entry.id">
                            <p>{{ entry.startTime }} - {{ entry.endTime }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AppDialog v-if="selectedEntry" @close="selectedEntry = null" title="Информация о смене">
            <div class="schedule-dialog-info">
                <p>Дата: {{ selectedEntry.date }}</p>
                <p>Время: {{ selectedEntry.startTime }} - {{ selectedEntry.endTime }}</p>
                <p>Тип: {{ selectedEntry.type }}</p>
                <p v-if="selectedEntry.comment">Комментарий: {{ selectedEntry.comment }}</p>
            </div>
        </AppDialog>
        <AppDialog v-if="isOpen" @close="isOpen = false" title="Выберите магазин:">
            <ul class="card-stores">
                <li v-for="store in stores" class="card-store" :key="store.id">
                    <button @click="selectStore(store)">
                        <p>{{ store.name }}</p>
                        <span>{{ store.city }}, {{ store.address }}</span>
                    </button>
                </li>
            </ul>
        </AppDialog>
    </div>
    <div v-else>
        <AppButton @click="showDialog" variant="primary">
            <HomeIcon class="store-picker" />
        </AppButton>
        <AppDialog v-if="isOpen" @close="isOpen = false" title="Выберите магазин:">
            <ul class="card-stores">
                <li v-for="store in stores" class="card-store" :key="store.id">
                    <button @click="selectStore(store)">
                        <p>{{ store.name }}</p>
                        <span>{{ store.city }}, {{ store.address }}</span>
                    </button>
                </li>
            </ul>
        </AppDialog>
    </div>
</template>

<style>

.schedule-panel {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    gap: 5px;
}

.schedule-actions {
    display: flex;
    gap: 5px;
}

.schedule-info {
    display: flex;
    justify-content: space-between;
}

.period-buttons {
    display: flex;
    gap: 5px;
}

.arrow-buttons {
    display: flex;
    gap: 5px;
}

.schedule-employees {
    margin-bottom: 16px;
    font-size: 26px;
}

.schedule-cards {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.schedule-card {
    display: flex;
    align-items: center;
    gap: 10px;
}

.schedule-card__image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}

.calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.calendar-item {
    width: 140px;
    height: 140px;
    background-color: #fff;
    border: 1px solid #000;
}



.store-picker {
    width: 34px;
    height: 34px;
}

.card-stores {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.card-store {
    padding: 4px;
    border: 1px solid #000;
}

.card-store button {
    width: 100%;
}

.schedule-dialog-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

</style>
