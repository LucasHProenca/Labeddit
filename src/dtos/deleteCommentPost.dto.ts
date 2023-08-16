import z from "zod"

export interface DeleteCommentPostInputDTO {
    id: string,
    token: string
}

export type DeleteCommentPostOutputDTO = undefined

export const DeleteCommentPostSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as DeleteCommentPostInputDTO)