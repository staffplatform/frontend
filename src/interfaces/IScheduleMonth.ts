import type { IOrganizationEmployee } from "./IOrganizationEmployee";
import type { ISchedule } from "./ISchedule";
import type { IStore } from "./IStore";

export interface IScheduleMonth {
    year: string;
    month: string;
    daysInMonth: number[];
    entries: ISchedule[];
    employees: IOrganizationEmployee[];
    store: IStore | null;
}
