import z from "zod"
import { PostLikeModel } from "../types"

export interface GetCommentLikeInputDTO {
    comment_id: string
    token: string
}

export type GetCommentLikeOutputDTO = {
    user_id: string,
    comment_id: string,
    like: number,
}

export const GetCommentLikeSchema = z.object({
    comment_id: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as GetCommentLikeInputDTO)