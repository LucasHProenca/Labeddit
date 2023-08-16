import z from "zod"

export interface PutLikeCommentInputDTO {
    comment_id: string,
    token: string
    like: boolean
}

export type PutLikeCommentOutputDTO = undefined

export const PutLikeCommentSchema = z.object({
    comment_id: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean()
}).transform(data => data as PutLikeCommentInputDTO)