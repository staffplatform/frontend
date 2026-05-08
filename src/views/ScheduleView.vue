<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '@/components/AppButton.vue';
import AppDialog from '@/components/AppDialog.vue';
import EmployeeDetailsView from '@/components/EmployeeDetailsView.vue';
import ScheduleDialogDetail from '@/components/ScheduleDialogDetail.vue';
import { ERouterName } from '@/enums';
import type { IOrganizationEmployee, ISchedule, IScheduleTypes, IStore } from '@/interfaces';
import { deleteScheduleEntryService, getMonthScheduleService, getScheduleTypesService, getWeekScheduleService, updateMonthScheduleService } from '@/services/scheduleService';
import { getCurrentStoresService } from '@/services/storesService';
import { useScheduleStore } from '@/stores/useScheduleStore';
import { DateHelper } from '@/utils/date';
import { HomeIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';
import MonthScheduleView from '@/components/MonthScheduleView.vue';
import WeekScheduleView from '@/components/WeekScheduleView.vue';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import ScheduleDialogForm from '@/components/ScheduleDialogForm.vue';

type periodType = 'month' | 'week'

const router = useRouter()
const route = useRoute()
const toast = useToast();

const scheduleStore = useScheduleStore()
const stores = ref<IStore[] | null>(null)
const scheduleTypes = ref<IScheduleTypes | null>(null)

const selectedEntry = ref<ISchedule | null>(null)
const selectedEmployee = ref<IOrganizationEmployee | null>(null)
const selectDay = ref<number | null>(null)
const selectStartTime = ref(null)
const period = ref<periodType>('month')

const isStoreDialogOpen = ref<boolean>(false)
const isEmployeeDialogOpen = ref<boolean>(false)

const isScheduleCreateDialogOpen = ref(false)
const isScheduleDetailDialogOpen = ref(false)
const isScheduleEditDialogOpen = ref(false)

const currentPeriodLabel = computed(() => {
    const schedule = scheduleStore.schedule

    if(!schedule) {
        return ''
    }

    if (schedule.weekStart && schedule.weekEnd) {
        const weekStart = schedule.weekStart
        const weekEnd = schedule.weekEnd
        return `${format(weekStart, 'd MMMM', { locale: ru })} - ${format(weekEnd, 'd MMMM', { locale: ru })}`
    }

    if (schedule.year && schedule.month) {
        const date = new Date(`${schedule.year} ${schedule.month}`)
        const month = format(date, 'LLLL', {locale: ru})
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${schedule.year}`
    }
})

function getScheduleQueryParams() {
    const storeId = typeof route.query.storeId === 'string' ? route.query.storeId : null
    const year = typeof route.query.year === 'string' ? route.query.year : null
    const month = typeof route.query.month === 'string' ? route.query.month : null
    const week = typeof route.query.week === 'string' ? route.query.week : null
    const day = typeof route.query.day === 'string' ? route.query.day : null

    return { storeId, year, month, week, day }
}

function getCurrentPeriod() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()

    return { now, year, month, day }
}

async function loadMonth() {
    const params = getScheduleQueryParams()
    const { year, month } = getCurrentPeriod()

    if (!params.storeId || !params.year || !params.month) {
        return
    }
    scheduleStore.setSchedule(null)

    try {
        const schedule = await getMonthScheduleService({
            storeId: params.storeId,
            year: params.year,
            month: params.month,
        })
        scheduleStore.setSchedule(schedule)
    } catch (error) {
        router.push({
            name: ERouterName.SCHEDULE_MODE,
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

async function loadWeek() {
    const params = getScheduleQueryParams()
    const { year, month, day } = getCurrentPeriod()

    scheduleStore.setSchedule(null)

    try {
        const schedule = await getWeekScheduleService({
            storeId: params.storeId,
            week: params.week
        })
        scheduleStore.setSchedule(schedule)
    } catch (error) {
        router.push({
            name: ERouterName.SCHEDULE_MODE,
            params: {
                mode: 'week',
            },
            query: {
                storeId: params.storeId,
                week: DateHelper.FullDate(year, month, day),
            }
        })
        scheduleStore.setSchedule(null)
    }
}

async function showStore() {
    stores.value = await getCurrentStoresService()
    isStoreDialogOpen.value = !isStoreDialogOpen.value
}

function showSchedule(value: number, time) {
    selectDay.value = value

    if (time < 10) {
        selectStartTime.value = `0${time}:00`
    } else {
        selectStartTime.value = `${time}:00`
    }
    
    isScheduleCreateDialogOpen.value = !isScheduleCreateDialogOpen.value
}

function showEmployee(employee: IOrganizationEmployee) {
    console.log('employee', employee)
    selectedEmployee.value = employee
    isEmployeeDialogOpen.value = !isEmployeeDialogOpen.value
}

async function selectStore(store: IStore) {
    const {year, month} = getCurrentPeriod()

    router.push({
        name: ERouterName.SCHEDULE_MODE,
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
    isScheduleDetailDialogOpen.value = !isScheduleDetailDialogOpen.value
}

async function handleScheduleSubmit(payload) {
    const schedule = scheduleStore.schedule

    if (!schedule) {
        return
    }

    try {
        if (route.params.mode === 'month') {
            const updateSchedule = await updateMonthScheduleService({
                storeId: schedule.store.id,
                year: schedule.year,
                month: schedule.month,
                entries: [
                    payload
                ]
            })
            scheduleStore.setSchedule(updateSchedule)
        } else {
            const updateSchedule = await updateWeekScheduleService({
                storeId: schedule.store.id,
                week: schedule.week,
                entries: [
                    payload
                ]
            })
            scheduleStore.setSchedule(updateSchedule)
        }
        isScheduleCreateDialogOpen.value = false
        isScheduleEditDialogOpen.value = false
    } catch(error) {
        if (error instanceof Error) {
            toast.error(error.data.message);
        }
    }
}

async function handleScheduleDelete(payload) {
    payload.storeId = scheduleStore.schedule.store.id
    try {
        await deleteScheduleEntryService(payload)
        
        if (route.params.mode === 'month') {
            await loadMonth()
        } else {
            await loadWeek()
        }

        isScheduleDetailDialogOpen.value = false
    } catch(error) {
        if (error instanceof Error) {
            toast.error(error.data.message);
        }
    }
}

function handleScheduleEdit(payload) {
    selectedEntry.value = payload
    isScheduleEditDialogOpen.value = !isScheduleEditDialogOpen.value
    isScheduleDetailDialogOpen.value = false
}

async function handlePeriodPrev() {
    const params = getScheduleQueryParams()

    if (!params.storeId) {
        return
    }

    if (route.params.mode === 'month') {
        if (!params.year || !params.month) {
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
            name: ERouterName.SCHEDULE_MODE,
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

    if (route.params.mode === 'week') {
        if(!params.week) {
            return
        }

        const currentWeek = new Date(params.week)
        currentWeek.setDate(new Date(params.week).getDate() - 7)
        
        const formattedWeek = DateHelper.YYYYMMDD(currentWeek)

        router.push({
            name: ERouterName.SCHEDULE_MODE,
            params: {
                mode: 'week',
            },
            query: {
                storeId: params.storeId,
                week: formattedWeek,
            }
        })
    }
}

async function handlePeriodNext() {
    const params = getScheduleQueryParams()

    if (!params.storeId) {
        return
    }

    if(route.params.mode === 'month') {
        if(!params.year || !params.month) {
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
            name: ERouterName.SCHEDULE_MODE,
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

    if (route.params.mode === 'week') {
        if(!params.week) {
            return
        }

        const currentWeek = new Date(params.week)
        currentWeek.setDate(new Date(params.week).getDate() + 7)
        
        const formattedWeek = DateHelper.YYYYMMDD(currentWeek)

        router.push({
            name: ERouterName.SCHEDULE_MODE,
            params: {
                mode: 'week',
            },
            query: {
                storeId: params.storeId,
                week: formattedWeek,
            }
        })
    }
}

async function setPeriod(payload: periodType) {
    const params = getScheduleQueryParams()
    const { year, month, day } = getCurrentPeriod()
    period.value = payload

    if(payload === 'month') {
        if (params.week) {
            const newParams = new Date(params.week)
            const paramsYear = newParams.getFullYear()
            const paramsMonth = newParams.getMonth() + 1

            router.push({
                name: ERouterName.SCHEDULE_MODE,
                params: {
                    mode: 'month',
                },
                query: {
                    storeId: params.storeId,
                    year: paramsYear,
                    month: paramsMonth,
                }
            })
        } else {
            router.push({
                name: ERouterName.SCHEDULE_MODE,
                params: {
                    mode: 'month',
                },
                query: {
                    storeId: params.storeId,
                    year: year,
                    month: Number(month),
                }
            })
        }
    } else {
        router.push({
            name: ERouterName.SCHEDULE_MODE,
            params: {
                mode: 'week',
            },
            query: {
                storeId: params.storeId,
                week: DateHelper.FullDate(params.year, params.month, day),
            }
        })
    }
}

function converterCurrentDate(fullDate, day) {
    const newDate = new Date(fullDate)
    newDate.setDate(day)

    return newDate
}

watch(
    [() => route.query.storeId, () => route.query.year, () => route.query.month, () => route.query.week, () => route.params.mode]
    , async () => {
        if(route.params.mode === 'month') {
            await loadMonth()
        } else {
            await loadWeek()
        }
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
                    <p class="schedule-period__value">{{ currentPeriodLabel }}</p>
                </div>
            </div>
            <div class="period-buttons">
                <AppButton
                    @click="setPeriod('month')"
                    variant="primary"
                >
                    Месяц
                </AppButton>
                <AppButton
                    @click="setPeriod('week')"
                    variant="primary"
                >
                    Неделя
                </AppButton>
            </div>
            <div class="arrow-buttons">
                <AppButton @click="handlePeriodPrev()" variant="primary">Назад</AppButton>
                <AppButton @click="handlePeriodNext()" variant="primary">Вперед</AppButton>
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
            <template v-if="route.params.mode === 'month'">
                <MonthScheduleView
                    :days="scheduleStore.schedule.daysInMonth"
                    :isScheduleCreateDialogOpen="isScheduleCreateDialogOpen"
                    :employees="scheduleStore.schedule.employees"
                    :scheduleTypes="scheduleTypes"
                    :getEntriesByDay="getEntriesByDay"
                    :selectDate="DateHelper.FullDate(scheduleStore.schedule.year, scheduleStore.schedule.month, selectDay)"
                    @save-entry="handleScheduleSubmit"
                    @close-dialog="isScheduleCreateDialogOpen = false"
                    @show-info="showSchedule"
                    @show-entry-info="showEntryInfo"
                />
            </template>
            <template v-else>
                <WeekScheduleView
                    :days="scheduleStore.schedule.daysInMonth"
                    :isScheduleCreateDialogOpen="isScheduleCreateDialogOpen"
                    :employees="scheduleStore.schedule.employees"
                    :selectedEntry="selectedEntry"
                    :scheduleTypes="scheduleTypes"
                    :schedule-week="scheduleStore.schedule"
                    :selectDate="DateHelper.YYYYMMDD(converterCurrentDate(scheduleStore.schedule.week, selectDay))"
                    :selectStartTime="selectStartTime"
                    @save-entry="handleScheduleSubmit"
                    @close-dialog="isScheduleCreateDialogOpen = false"
                    @show-info="showSchedule"
                    @show-entry-info="showEntryInfo"
                />
            </template>
        </div>
        <AppDialog v-if="isScheduleDetailDialogOpen" @close="isScheduleDetailDialogOpen = false">
            <ScheduleDialogDetail 
                :selectedEntry="selectedEntry"
                :employees="scheduleStore.schedule.employees"
                :scheduleTypes="scheduleTypes"
                @delete="handleScheduleDelete"
                @edit="handleScheduleEdit"
                />
        </AppDialog>
        <AppDialog v-if="isScheduleCreateDialogOpen" @close="isScheduleCreateDialogOpen = false">
            <ScheduleDialogForm
                mode="create"
                :days="scheduleStore.schedule.daysInMonth"
                :isScheduleCreateDialogOpen="isScheduleCreateDialogOpen"
                :employees="scheduleStore.schedule.employees"
                :scheduleTypes="scheduleTypes"
                :schedule-week="scheduleStore.schedule"
                :selectDate="DateHelper.FullDate(scheduleStore.schedule.year, scheduleStore.schedule.month, selectDay)"
                :selectStartTime="selectStartTime"
                @save-entry="handleScheduleSubmit"
                @close-dialog="isScheduleCreateDialogOpen = false"
                @show-info="showSchedule"
                @show-entry-info="showEntryInfo"
            >
            </ScheduleDialogForm>
        </AppDialog>
        <AppDialog v-if="isScheduleEditDialogOpen" @close="isScheduleEditDialogOpen = false">
            <ScheduleDialogForm
                mode="edit"
                :selectedEntry="selectedEntry"
                :days="scheduleStore.schedule.daysInMonth"
                :isScheduleCreateDialogOpen="isScheduleCreateDialogOpen"
                :employees="scheduleStore.schedule.employees"
                :scheduleTypes="scheduleTypes"
                :schedule-week="scheduleStore.schedule"
                :selectDate="DateHelper.YYYYMMDD(converterCurrentDate(scheduleStore.schedule.week, selectDay))"
                :selectStartTime="selectStartTime"
                @save-entry="handleScheduleSubmit"
                @close-dialog="isScheduleCreateDialogOpen = false"
                @show-info="showSchedule"
                @show-entry-info="showEntryInfo"
            >
            </ScheduleDialogForm>
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

<style scoped>
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
</style>
