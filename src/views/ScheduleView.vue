<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '@/components/AppButton.vue';
import AppDialog from '@/components/AppDialog.vue';
import EmployeeDetailsView from '@/components/EmployeeDetailsView.vue';
import ScheduleEntryForm from '@/components/ScheduleEntryForm.vue';
import ScheduleEntryView from '@/components/ScheduleEntryView.vue';
import { ERouterName } from '@/enums';
import type { IEmployee, ISchedule, IScheduleTypes, IStore } from '@/interfaces';
import { deleteMonthScheduleService, getMonthScheduleService, getScheduleTypesService, updateMonthScheduleService } from '@/services/scheduleService';
import { getCurrentStoresService } from '@/services/storesService';
import { useScheduleStore } from '@/stores/useScheduleStore';
import { DateHelper } from '@/utils/date';
import { HomeIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const router = useRouter()
const route = useRoute()
const toast = useToast();

const scheduleStore = useScheduleStore()
const stores = ref<IStore[] | null>(null)
const scheduleTypes = ref<IScheduleTypes | null>(null)

const selectedEntry = ref<ISchedule | null>(null)
const selectedEmployee = ref<IEmployee | null>(null)
const selectDay = ref<number | null>(null)

const isStoreDialogOpen = ref<boolean>(false)
const isScheduleDialogOpen = ref<boolean>(false)
const isEmployeeDialogOpen = ref<boolean>(false)

const currentMonthLabel = computed(() => {
    const schedule = scheduleStore.schedule

    if(!schedule) {
        return ''
    }

    return new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(Number(schedule.year), Number(schedule.month) - 1, 1))
})

function getScheduleQueryParams() {
    const storeId = typeof route.query.storeId === 'string' ? route.query.storeId : null
    const year = typeof route.query.year === 'string' ? route.query.year : null
    const month = typeof route.query.month === 'string' ? route.query.month : null

    return { storeId, year, month }
}

function getCurrentPeriod() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    return {now, year, month}
}

async function loadSchedule() {
    const params = getScheduleQueryParams()
    const {year, month} = getCurrentPeriod()

    if (!params.storeId || !params.year || !params.month) {
        return
    }

    try {
        const schedule = await getMonthScheduleService({
            storeId: params.storeId,
            year: params.year,
            month: params.month,
        })
        scheduleStore.setSchedule(schedule)
    } catch (error) {
        router.push({
            name: ERouterName.SCHEDULE,
            params: {
                mode: 'month',
            },
            query: {
                storeId: params.storeId,
                year: year,
                month: Number(month),
            }
        })
        scheduleStore.setSchedule(null)
    }
}

async function showStore() {
    stores.value = await getCurrentStoresService()
    isStoreDialogOpen.value = !isStoreDialogOpen.value
}

function showSchedule(value: number) {
    selectDay.value = value
    isScheduleDialogOpen.value = !isScheduleDialogOpen.value
}

function showEmployee(employee: IEmployee) {
    selectedEmployee.value = employee
    isEmployeeDialogOpen.value = !isEmployeeDialogOpen.value
}

async function selectStore(store: IStore) {
    const {year, month} = getCurrentPeriod()

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

    isStoreDialogOpen.value = false
}

function getEntriesByDay(day: number) {
    if (!scheduleStore.schedule) {
        return
    }
    const fullDate = DateHelper.FullDate(scheduleStore.schedule.year, scheduleStore.schedule.month, day)
    
    return scheduleStore.schedule.entries
        .filter((entry: ISchedule) => entry.date === fullDate)
        .sort((a: ISchedule, b: ISchedule) => (a.startTime ?? '').localeCompare(b.startTime ?? ''))
}

function showEntryInfo(entry: ISchedule) {
    selectedEntry.value = entry
}

async function handleScheduleSubmit(payload) {
    const schedule = scheduleStore.schedule

    if (!schedule) {
        return
    }

    try {
        const updateSchedule = await updateMonthScheduleService({
            storeId: schedule.store.id,
            year: schedule.year,
            month: schedule.month,
            entries: [
                payload
            ]
        })

        scheduleStore.setSchedule(updateSchedule)

        isScheduleDialogOpen.value = false
    } catch(error) {
        if (error instanceof Error) {
            toast.error(error.data.message);
        }
    }

}

async function handleScheduleDelete(payload) {
    payload.storeId = scheduleStore.schedule.store.id
    try {
        await deleteMonthScheduleService(payload)
        await loadSchedule()

        selectedEntry.value = null
    } catch(error) {
        if (error instanceof Error) {
            toast.error(error.data.message);
        }
    }
}

async function handleSchedulePrev() {
    const params = getScheduleQueryParams()

    if (!params.storeId || !params.year || !params.month) {
        return
    }

    const prevYear = Number(params.year) - 1
    const prevMonth = Number(params.month) - 1

    if (prevMonth < 1) {
        params.year = prevYear
        params.month = 12
    } else {
        params.month = prevMonth
    }

    router.push({
        name: ERouterName.SCHEDULE,
        params: {
            mode: 'month',
        },
        query: {
            storeId: params.storeId,
            year: params.year,
            month: Number(params.month),
        }
    })
}

async function handleScheduleNext() {
    const params = getScheduleQueryParams()

    if (!params.storeId || !params.year || !params.month) {
        return
    }

    const nextYear = Number(params.year) + 1
    const nextMonth = Number(params.month) + 1

    if (nextMonth > 12) {
        params.year = nextYear
        params.month = 1
    } else {
        params.month = nextMonth
    }

    router.push({
        name: ERouterName.SCHEDULE,
        params: {
            mode: 'month',
        },
        query: {
            storeId: params.storeId,
            year: params.year,
            month: Number(params.month),
        }
    })
}

watch(
    [() => route.query.storeId, () => route.query.year, () => route.query.month]
    , async () => {
        await loadSchedule()
    },
    {immediate: true}
)

onMounted(async () => {
    const types = await getScheduleTypesService()
    if (!types) {
        return 
    }
    scheduleTypes.value = types
})

</script>
<template>
    <div v-if="scheduleStore.schedule" class="schedule">
        <div class="schedule-panel">
            <div class="schedule-actions">
                <AppButton @click="showStore" variant="primary">
                    <HomeIcon class="store-picker" />
                </AppButton>
                <div class="schedule-period">
                    <span class="schedule-period__label">Текущий период</span>
                    <p class="schedule-period__value">{{ currentMonthLabel }}</p>
                </div>
            </div>
            <div class="period-buttons">
                <AppButton variant="primary">Месяц</AppButton>
                <AppButton variant="primary">Неделя</AppButton>
                <AppButton variant="primary">День</AppButton>
            </div>
            <div class="arrow-buttons">
                <AppButton @click="handleSchedulePrev()" variant="primary">Назад</AppButton>
                <AppButton @click="handleScheduleNext()" variant="primary">Вперед</AppButton>
            </div>
        </div>
        <div class="schedule-info">
            <div>
                <h1 class="schedule-employees">Сотрудники {{ scheduleStore.schedule.employees.length }}</h1>
                <div class="schedule-cards">
                    <div
                        class="schedule-card" 
                        v-for="employee in scheduleStore.schedule.employees" 
                        @click="showEmployee(employee)"
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
                <AppDialog v-if="isEmployeeDialogOpen" @close="isEmployeeDialogOpen = false">
                    <EmployeeDetailsView
                        :employee="selectedEmployee"
                    />
                </AppDialog>
            </div>
            <div class="schedule-content">
                <div class="calendar">
                    <div 
                        class="calendar-item" 
                        v-for="day in scheduleStore.schedule.daysInMonth"
                        :key="day"
                        @click="showSchedule(day)"
                    >
                        {{ day }}
                        <div
                            class="calendar-item__info" 
                            v-for="entry in getEntriesByDay(day)" 
                            @click.stop="showEntryInfo(entry)" 
                            :key="entry.id"
                        >
                            <p>{{ entry.startTime }} - {{ entry.endTime }}</p>
                        </div>
                    </div>
                    <AppDialog v-if="isScheduleDialogOpen" @close="isScheduleDialogOpen = false">
                        <ScheduleEntryForm 
                            :employees="scheduleStore.schedule.employees"
                            :scheduleTypes
                            :selectDate="DateHelper.FullDate(scheduleStore.schedule.year, scheduleStore.schedule.month, selectDay)"
                            @submit="handleScheduleSubmit"
                        />
                    </AppDialog>
                </div>
            </div>
        </div>
        <AppDialog v-if="selectedEntry" @close="selectedEntry = null" title="Информация о смене">
            <ScheduleEntryView 
                :selectedEntry
                @delete="handleScheduleDelete"
                />
        </AppDialog>
        <AppDialog v-if="isStoreDialogOpen" @close="isStoreDialogOpen = false" title="Выберите магазин:">
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
        <AppButton @click="showStore" variant="primary">
            <HomeIcon class="store-picker" />
        </AppButton>
        <AppDialog v-if="isStoreDialogOpen" @close="isStoreDialogOpen = false" title="Выберите магазин:">
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
    align-items: center;
    gap: 5px;
}

.schedule-period {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 140px;
    padding: 4px 8px;
}

.schedule-period__label {
    color: #5b6475;
    font-size: 11px;
    text-transform: uppercase;
}

.schedule-period__value {
    color: #16213e;
    font-size: 18px;
    font-weight: 600;
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
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: #fff;
}

.schedule-card {
    padding: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #000;
    border-radius: 10px;
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

.schedule-content {
    display: flex;
    align-items: flex-start;
    gap: 20px;
}

.calendar-item {
    width: 140px;
    height: 140px;
    background-color: #fff;
    border: 1px solid #000;
}

.calendar-item__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    min-width: 360px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.schedule-dialog-info__grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 12px;
}

.schedule-dialog-info__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 6px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.schedule-dialog-info__label {
    display: inline-block;
    margin-bottom: 6px;
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.schedule-dialog-info__value {
    color: #111827;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
}

.schedule-dialog-info__note {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    border-radius: 14px;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
}

.schedule-dialog-info__note-text {
    color: #1f2937;
    line-height: 1.6;
    white-space: pre-wrap;
}

</style>
