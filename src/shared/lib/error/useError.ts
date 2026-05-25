import type { IApiError } from "@/shared/api/model/types";
import { EStatus } from "@/shared/config/status/EStatus";
import {useToast} from "vue-toastification";

const toast = useToast()

export function useError() {
    function logError(error: Error, show: boolean = false) {
        console.log('error', error)
        let errorMessage: string = ''

        if (error instanceof Error) {
            errorMessage = error.message
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            errorMessage = String(error);
        }

        console.error('Error:', errorMessage);

        if (show) {
            toast.error(errorMessage)
        }
    }

    function handleHttpError(error: IApiError, show: boolean = false) {
        let errorMessage: string = ''

        switch (error.status) {
            case EStatus.BAD_REQUEST:
                errorMessage = error.data.message || error.name || "Неверный запрос"
                break
            case EStatus.UNAUTHORIZED:
                errorMessage =
                    error.data.message ||
                    error.name ||
                    "Необходима авторизация"
                break
            case EStatus.FORBIDDEN:
                errorMessage =
                    error.data.message || error.name || "Доступ запрещён"
                break
            case EStatus.NOT_FOUND:
                errorMessage =
                    error.data.message || error.name || "Ресурс не найден"
                break
            case EStatus.INTERNAL_SERVER_ERROR:
                errorMessage =
                    error.data.message || error.name || "Ошибка сервера"
                break
            case EStatus.BAD_GATEWAY:
                errorMessage = error.data.message || error.name || "Ошибка шлюза";
                break
            case EStatus.SERVICE_UNAVAILABLE:
                errorMessage =
                    error.data.message ||
                    error.name ||
                    "Сервис недоступен"
                break
            default:
                errorMessage = "Произошла ошибка";
        }

        if (show) {
            toast.error(errorMessage)
            return
        }

        return;
    }

    return { handleHttpError, logError };
}
