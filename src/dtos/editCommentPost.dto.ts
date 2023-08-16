import z from "zod"

export interface EditCommentPostInputDTO {
    id: string,
    content?: string,
    token: string
}

export type EditCommentPostOutputDTO = undefined

export const EditCommentPostSchema = z.object({
    id: z.string().min(1),
    content: z.string().min(1).optional(),
    token: z.string().min(1)
}).transform(data => data as EditCommentPostInputDTO)