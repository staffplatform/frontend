import type { IEmployee } from "./IEmployee";
import type { ISchedule } from "./ISchedule";
import type { IStore } from "./IStore";

export interface IScheduleMonth {
    year: string;
    month: string;
    daysInMonth: number[];
    entries: ISchedule[];
    employees: IEmployee[];
    store: IStore | null;
}
