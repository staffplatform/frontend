export const SCHEDULE_PERIOD_TYPES = {
    MONTH: 'month',
    WEEK: 'week',
} as const

export type SchedulePeriodType = typeof SCHEDULE_PERIOD_TYPES[keyof typeof SCHEDULE_PERIOD_TYPES]