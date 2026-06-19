<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '@/shared/ui/button/AppButton.vue';
import AppDialog from '@/shared/ui/dialog/AppDialog.vue';
import EmployeeDetailsView from '@/entities/employee/ui/EmployeeDetailsView.vue';
import ScheduleDialogDetail from '@/entities/schedule/ui/ScheduleDialogDetail.vue';
import { ERouterName } from '@/shared/config/router/ERouterName';
import type { IOrganizationEmployee } from '@/entities/employee/model/types';
import type { ISchedule, IScheduleForm, IScheduleMonth, IScheduleTypes, IScheduleWeek } from '@/entities/schedule/model/types';
import type { IStore } from '@/entities/store/model/types';
import { deleteScheduleEntryService, getMonthScheduleService, getScheduleTypesService, getWeekScheduleService, updateMonthScheduleService, updateWeekScheduleService } from '@/entities/schedule/api/scheduleService';
import { getCurrentStoresService } from '@/entities/store/api/storesService';
import { useScheduleStore } from '@/entities/schedule/model/store';
import { DateHelper } from '@/shared/lib/date';
import { HomeIcon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';
import MonthScheduleView from '@/entities/schedule/ui/MonthScheduleView.vue';
import WeekScheduleView from '@/entities/schedule/ui/WeekScheduleView.vue';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import ScheduleDialogForm from '@/features/create-organization-schedule/ui/ScheduleDialogForm.vue';
import { SCHEDULE_PERIOD_TYPES, type SchedulePeriodType } from '@/entities/schedule/model/constants';
import { useUserStore } from '@/entities/user/model/store';
import { ROLES_TYPES } from '@/shared/config/roles';
import AppLoading from '@/shared/ui/loading/AppLoading.vue';
import SelectStore from '@/features/select-store/ui/SelectStore.vue';
import AppDrawer from '@/shared/ui/drawer/AppDrawer.vue';

const router = useRouter()
const route = useRoute()
const toast = useToast();

const isLoading = ref(false)

const scheduleStore = useScheduleStore()
const userStore = useUserStore()
const stores = ref<IStore[]>([])
const scheduleTypes = ref<IScheduleTypes | null>(null)

const selectedEntry = ref<ISchedule | null>(null)
const selectedEmployee = ref<IOrganizationEmployee | null>(null)
const selectDay = ref<number | null>(null)
const selectStartTime = ref('')
const period = ref<SchedulePeriodType>(SCHEDULE_PERIOD_TYPES.MONTH)

const isStoreDialogOpen = ref<boolean>(false)
const isEmployeeDialogOpen = ref<boolean>(false)

const isScheduleCreateDialogOpen = ref(false)
const isScheduleDetailDialogOpen = ref(false)
const isScheduleEditDialogOpen = ref(false)

const currentPeriodLabel = computed(() => {
    const schedule: IScheduleMonth | IScheduleWeek | null = scheduleStore.schedule

    if(!schedule) {
        return ''
    }

    if ("weekStart" in schedule && "weekEnd" in schedule) {
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

const createSelectedDate = computed(() => {
    const store = scheduleStore.schedule

    if (!store || !("year" in store) || !("month" in store)) {
        return ''
    }

    return DateHelper.FullDate(Number(store.year), Number(store.month), Number(selectDay.value))
})

const currentRoleEmployee = computed(() => {
    const assignment = userStore.user?.storeAssignments.find(assignment => assignment.storeId === scheduleStore.schedule?.store?.id)

    return assignment?.role === ROLES_TYPES.OWNER || assignment?.role === ROLES_TYPES.ADMIN
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

    isLoading.value = true
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
                mode: SCHEDULE_PERIOD_TYPES.MONTH,
            },
            query: {
                storeId: params.storeId,
                year: year,
                month: Number(month),
            }
        })
        scheduleStore.setSchedule(null)
    } finally {
        isLoading.value = false
    }
}

async function loadWeek() {
    const params = getScheduleQueryParams()
    const { year, month, day } = getCurrentPeriod()

    scheduleStore.setSchedule(null)

    if (!params.storeId || !params.week) {
        return
    }

    isLoading.value = true
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
                mode: SCHEDULE_PERIOD_TYPES.WEEK,
            },
            query: {
                storeId: params.storeId,
                week: DateHelper.FullDate(year, month, day),
            }
        })
        scheduleStore.setSchedule(null)
    } finally {
        isLoading.value = false
    }
}

async function showStore() {
    stores.value = await getCurrentStoresService()
    isStoreDialogOpen.value = !isStoreDialogOpen.value
}

function showSchedule(value: number, time?: number) {
    selectDay.value = value

    if (time === undefined) {
        selectStartTime.value = ''
    } else if (time < 10) {
        selectStartTime.value = `0${time}:00`
    } else {
        selectStartTime.value = `${time}:00`
    }
    
    isScheduleCreateDialogOpen.value = !isScheduleCreateDialogOpen.value
}

function showEmployee(employee: IOrganizationEmployee) {
    selectedEmployee.value = employee
    isEmployeeDialogOpen.value = !isEmployeeDialogOpen.value
}

async function selectStore(store: IStore) {
    const {year, month} = getCurrentPeriod()

    router.push({
        name: ERouterName.SCHEDULE_MODE,
        params: {
            mode: SCHEDULE_PERIOD_TYPES.MONTH,
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
    const schedule = scheduleStore.schedule

    if (!schedule || !('year' in schedule) || !('month' in schedule)) {
        return
    }
    const fullDate = DateHelper.FullDate(Number(schedule.year), Number(schedule.month), day)
    
    return schedule.entries
        .filter((entry: ISchedule) => entry.date === fullDate)
        .sort((a: ISchedule, b: ISchedule) => (a.startTime ?? '').localeCompare(b.startTime ?? ''))
}

function showEntryInfo(entry: ISchedule) {
    selectedEntry.value = entry
    isScheduleDetailDialogOpen.value = !isScheduleDetailDialogOpen.value
}

async function handleScheduleSubmit(payload: IScheduleForm) {
    const schedule = scheduleStore.schedule

    if (!schedule || !schedule.store?.id) {
        return
    }

    try {
        if (route.params.mode === SCHEDULE_PERIOD_TYPES.MONTH && 'year' in schedule && 'month' in schedule) {
            const updatePayload = {
                storeId: schedule.store.id,
                year: schedule.year,
                month: schedule.month,
                entries: [
                    payload
                ]
            }
            const updateSchedule: IScheduleMonth = await updateMonthScheduleService(updatePayload)
            scheduleStore.setSchedule(updateSchedule)
        } else if (route.params.mode === SCHEDULE_PERIOD_TYPES.WEEK && 'week' in schedule) {
            const updatePayload = {
                storeId: schedule.store.id,
                week: schedule.week,
                entries: [
                    payload
                ]
            }
            const updateSchedule: IScheduleWeek = await updateWeekScheduleService(updatePayload)
            scheduleStore.setSchedule(updateSchedule)
        }
        isScheduleCreateDialogOpen.value = false
        isScheduleEditDialogOpen.value = false
    } catch(error) {
        if (error instanceof Error) {
            toast.error(error.message)
        }
    }
}

async function handleScheduleDelete(payload: {userId: string, date: string}) {
    const schedule = scheduleStore.schedule

    if (!schedule || !schedule.store) {
        return
    }

    try {
        await deleteScheduleEntryService({
            storeId: schedule.store.id,
            userId: payload.userId,
            date: payload.date
        })
        
        if (route.params.mode === SCHEDULE_PERIOD_TYPES.MONTH) {
            await loadMonth()
        } else {
            await loadWeek()
        }

        isScheduleDetailDialogOpen.value = false
    } catch(error) {
        if (error instanceof Error) {
            toast.error(error.message)
        }
    }
}

function handleScheduleEdit(payload: ISchedule) {
    selectedEntry.value = payload
    isScheduleEditDialogOpen.value = !isScheduleEditDialogOpen.value
    isScheduleDetailDialogOpen.value = false
}

async function handlePeriodPrev() {
    const params = getScheduleQueryParams()

    if (!params.storeId) {
        return
    }

    if (route.params.mode === SCHEDULE_PERIOD_TYPES.MONTH) {
        if (!params.year || !params.month) {
            return
        }

        const prevYear = Number(params.year) - 1
        const prevMonth = Number(params.month) - 1

        if (prevMonth < 1) {
            params.year = String(prevYear)
            params.month = String(12)
        } else {
            params.month = String(prevMonth)
        }

        router.push({
            name: ERouterName.SCHEDULE_MODE,
            params: {
                mode: SCHEDULE_PERIOD_TYPES.MONTH,
            },
            query: {
                storeId: params.storeId,
                year: params.year,
                month: Number(params.month),
            }
        })
    }

    if (route.params.mode === SCHEDULE_PERIOD_TYPES.WEEK) {
        if(!params.week) {
            return
        }

        const currentWeek = new Date(params.week)
        currentWeek.setDate(new Date(params.week).getDate() - 7)
        
        const formattedWeek = DateHelper.YYYYMMDD(currentWeek)

        router.push({
            name: ERouterName.SCHEDULE_MODE,
            params: {
                mode: SCHEDULE_PERIOD_TYPES.WEEK,
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

    if(route.params.mode === SCHEDULE_PERIOD_TYPES.MONTH) {
        if(!params.year || !params.month) {
            return 
        }

        const nextYear = Number(params.year) + 1
        const nextMonth = Number(params.month) + 1

        if (nextMonth > 12) {
            params.year = String(nextYear)
            params.month = String(1)
        } else {
            params.month = String(nextMonth)
        }

        router.push({
            name: ERouterName.SCHEDULE_MODE,
            params: {
                mode: SCHEDULE_PERIOD_TYPES.MONTH,
            },
            query: {
                storeId: params.storeId,
                year: params.year,
                month: Number(params.month),
            }
        })
    }

    if (route.params.mode === SCHEDULE_PERIOD_TYPES.WEEK) {
        if(!params.week) {
            return
        }

        const currentWeek = new Date(params.week)
        currentWeek.setDate(new Date(params.week).getDate() + 7)
        
        const formattedWeek = DateHelper.YYYYMMDD(currentWeek)

        router.push({
            name: ERouterName.SCHEDULE_MODE,
            params: {
                mode: SCHEDULE_PERIOD_TYPES.WEEK,
            },
            query: {
                storeId: params.storeId,
                week: formattedWeek,
            }
        })
    }
}

async function setPeriod(payload: SchedulePeriodType) {
    const params = getScheduleQueryParams()
    const { year, month, day } = getCurrentPeriod()
    period.value = payload

    if(payload === SCHEDULE_PERIOD_TYPES.MONTH) {
        if (params.week) {
            const newParams = new Date(params.week)
            const paramsYear = newParams.getFullYear()
            const paramsMonth = newParams.getMonth() + 1

            router.push({
                name: ERouterName.SCHEDULE_MODE,
                params: {
                    mode: SCHEDULE_PERIOD_TYPES.MONTH,
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
                    mode: SCHEDULE_PERIOD_TYPES.MONTH,
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
                mode: SCHEDULE_PERIOD_TYPES.WEEK,
            },
            query: {
                storeId: params.storeId,
                week: DateHelper.FullDate(Number(params.year), Number(params.month), day),
            }
        })
    }
}

watch(
    [() => route.query.storeId, () => route.query.year, () => route.query.month, () => route.query.week, () => route.params.mode]
    , async () => {
        if(route.params.mode === SCHEDULE_PERIOD_TYPES.MONTH) {
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
    <AppLoading v-if="isLoading"/>
    <div v-else-if="scheduleStore.schedule" class="schedule">
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
                    :class="{'is-active': route.params.mode === 'month'}"
                    @click="setPeriod(SCHEDULE_PERIOD_TYPES.MONTH)"
                    variant="primary"
                >
                    Месяц
                </AppButton>
                <AppButton
                    :class="{'is-active': route.params.mode === 'week'}"
                    @click="setPeriod(SCHEDULE_PERIOD_TYPES.WEEK)"
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
                        :key="employee.userId"
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
                <AppDrawer
                    v-if="isEmployeeDialogOpen && selectedEmployee" 
                    side="left"
                    @close="isEmployeeDialogOpen = false"
                >
                    <EmployeeDetailsView
                        :employee="selectedEmployee"
                    />
                </AppDrawer>
            </div>
            <template v-if="scheduleStore.schedule && 'month' in scheduleStore.schedule">
                <MonthScheduleView
                    :days="scheduleStore.schedule.daysInMonth"
                    :getEntriesByDay="getEntriesByDay"
                    @close-dialog="isScheduleCreateDialogOpen = false"
                    @show-info="showSchedule"
                    @show-entry-info="showEntryInfo"
                />
            </template>
            <template v-else-if="scheduleStore.schedule && 'week' in scheduleStore.schedule">
                <WeekScheduleView
                    :schedule-week="scheduleStore.schedule"
                    @close-dialog="isScheduleCreateDialogOpen = false"
                    @show-info="showSchedule"
                    @show-entry-info="showEntryInfo"
                />
            </template>
        </div>
        <AppDrawer
            v-if="isScheduleDetailDialogOpen && selectedEntry"
            title="Расписание"
            subtitle="Информация о смене"
            side="right"
            @close="isScheduleDetailDialogOpen = false"
        >
            <ScheduleDialogDetail 
                :selectedEntry="selectedEntry"
                :employees="scheduleStore.schedule.employees"
                :scheduleTypes="scheduleTypes"
                :currentRoleEmployee="currentRoleEmployee"
                @delete="handleScheduleDelete"
                @edit="handleScheduleEdit"
            />
        </AppDrawer>
        <AppDrawer 
            v-if="isScheduleCreateDialogOpen"
            title="Расписание"
            subtitle="Создать смену"
            side="right"
            @close="isScheduleCreateDialogOpen = false"
        >
            <ScheduleDialogForm
                mode="create"
                :employees="scheduleStore.schedule.employees"
                :scheduleTypes="scheduleTypes"
                :selectDate="createSelectedDate"
                :selectStartTime="selectStartTime"
                @save-entry="handleScheduleSubmit"
                @close="isScheduleCreateDialogOpen = false"
            >
            </ScheduleDialogForm>
        </AppDrawer>
        <AppDrawer 
            v-if="isScheduleEditDialogOpen && selectedEntry"
            title="Расписание"
            subtitle="Редактировать смену"
            side="right"
            @close="isScheduleEditDialogOpen = false"
        >
            <ScheduleDialogForm
                mode="edit"
                :selectedEntry="selectedEntry"
                :employees="scheduleStore.schedule.employees"
                :scheduleTypes="scheduleTypes"
                :selectDate="selectedEntry.date"
                :selectStartTime="selectStartTime"
                @save-entry="handleScheduleSubmit"
                @close="isScheduleCreateDialogOpen = false"
            >
            </ScheduleDialogForm>
        </AppDrawer>
        <SelectStore
            v-if="isStoreDialogOpen"
            title="Выберите магазин:"
            :stores
            @select-store="selectStore"
            @close="isStoreDialogOpen = false"
        />
    </div>
    <div v-else>
        <AppButton @click="showStore" variant="primary">
            <HomeIcon class="store-picker" />
        </AppButton>
        <SelectStore
            v-if="isStoreDialogOpen"
            title="Выберите магазин:"
            :stores
            @select-store="selectStore"
            @close="isStoreDialogOpen = false"
        />
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

.is-active {
    color: #ffffff;
    background-color: #5b6475;
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

</style>
