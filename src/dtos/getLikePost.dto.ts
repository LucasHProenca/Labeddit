import z from "zod"
import { PostLikeModel } from "../types"

export interface GetPostLikeInputDTO {
    token: string
}

export type GetPostLikeOutputDTO = PostLikeModel[]

export const GetPostLikeSchema = z.object({
    token: z.string().min(1)
}).transform(data => data as GetPostLikeInputDTO)