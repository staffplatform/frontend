import { format, isValid, parseISO } from "date-fns";

const toDate = (value: string | Date | null): Date | null => {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : parseISO(value);
    return isValid(date) ? date : null;
};

export const DateHelper = {
    YYYYMMDD(value: string | Date | null): string | null {
        const date = toDate(value);
        return date ? format(date, "yyyy-MM-dd") : null;
    },
    DDMMYYYY(value: string | Date | null): string {
        const date = toDate(value);
        return date ? format(date, "dd.MM.yyyy") : "";
    },
    FullDate(year, month, day) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }
}
