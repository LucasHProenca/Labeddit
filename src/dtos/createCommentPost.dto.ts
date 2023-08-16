import z from "zod"

export interface CreateCommentPostInputDTO {
    post_id: string,
    content: string,
    token: string
}

export type CreateCommentPostOutputDTO = undefined

export const CreateCommentPostSchema = z.object({
    post_id: z.string().min(1),
    content: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as CreateCommentPostInputDTO)