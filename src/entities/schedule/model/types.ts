import type { IOrganizationEmployee } from "@/entities/employee/model/types";
import type { IStore } from "@/entities/store/model/types";

export interface ISchedule {
    id: string,
    userId: string,
    date: string,
    type: string,
    startTime: string,
    endTime: string,
    comment: string,
    createdById: string,
    updatedAt: string
}

export interface IScheduleForm {
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    comment: string;
}

export interface IScheduleMonth {
    year: string;
    month: string;
    daysInMonth: number;
    entries: ISchedule[];
    employees: IOrganizationEmployee[];
    store: IStore | null;
}

export interface IScheduleWeek {
    store: IStore;
    week: string;
    weekStart: string;
    weekEnd: string;
    employees: IOrganizationEmployee[];
    entries: ISchedule[];
}

export interface IScheduleEntryType {
    value: string;
    label: string;
}

export interface IScheduleTypes {
    entryTypes: IScheduleEntryType[];
}

export interface IDeleteScheduleParams {
    storeId: string;
    userId: string;
    date: string;
}