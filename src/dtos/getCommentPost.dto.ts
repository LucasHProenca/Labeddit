import z from "zod"
import {CommentModel} from "../types"

export interface GetCommentInputDTO {
    post_id: string,
    token: string
}

export type GetCommentOutputDTO = CommentModel[]

export const GetCommentSchema = z.object({
    post_id: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as GetCommentInputDTO)