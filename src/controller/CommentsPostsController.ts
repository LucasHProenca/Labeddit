import { Request, Response } from "express";
import { ZodError } from "zod";
import { CommentsPostsBusiness } from "../business/CommentsPostsBusiness";
import { CreateCommentPostSchema } from "../dtos/createCommentPost.dto";
import { DeleteCommentPostSchema } from "../dtos/deleteCommentPost.dto";
import { EditCommentPostSchema } from "../dtos/editCommentPost.dto";
import { GetCommentSchema } from "../dtos/getCommentPost.dto";
import { PutLikeCommentSchema } from "../dtos/putLikeCommentPost.dto";
import { BaseError } from "../errors/BaseError";

export class CommentsPostsController {
    constructor(
        private commentsPostsBusiness: CommentsPostsBusiness
    ){}

    public getCommentsPosts = async (req: Request, res: Response) => {
        try {
            const input = GetCommentSchema.parse({
                post_id: req.params.id,
                token: req.headers.authorization
            })

            const output = await this.commentsPostsBusiness.getComments(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createCommentPost = async (req: Request, res: Response) => {
        try {
            const input = CreateCommentPostSchema.parse({
                post_id: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            })
            const output = await this.commentsPostsBusiness.createComment(input)

            res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editCommentPosts = async (req: Request, res: Response) => {
        try {
            const input = EditCommentPostSchema.parse({
                id: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            })
            const output = await this.commentsPostsBusiness.editComment(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deleteCommentPosts = async (req: Request, res: Response) => {
        try {
            const input = DeleteCommentPostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization
            })
            const output = await this.commentsPostsBusiness.deleteComment(input)

            res.status(200).send(output)
        } catch (error: any) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public putLikeComment = async (req: Request, res: Response) => {
        try {
            const input = PutLikeCommentSchema.parse({
                comment_id: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            })
            const output = await this.commentsPostsBusiness.likeDislikeComment(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}