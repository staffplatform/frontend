import type { IUser } from "@/entities/user/model/types"

export interface IAuthResponse {
    tokens: {
        "accessToken": string,
        "refreshToken": string,
    }
    user: IUser
}
