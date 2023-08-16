import express from "express"
import { CommentsPostsBusiness } from "../business/CommentsPostsBusiness"
import { CommentsPostsController } from "../controller/CommentsPostsController"
import { CommentsPostsDatabase } from "../database/CommentsPostsDatabase"
import { PostDatabase } from "../database/PostsDatabase"
import { UserDatabase } from "../database/UsersDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"


export const commentRouter = express.Router()

const commentController = new CommentsPostsController(
    new CommentsPostsBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new CommentsPostsDatabase(),
        new TokenManager(),
        new IdGenerator()
    )
)

commentRouter.get("/:id", commentController.getCommentsPosts)
commentRouter.post("/:id", commentController.createCommentPost)
commentRouter.put("/:id", commentController.editCommentPosts)
commentRouter.delete("/:id", commentController.deleteCommentPosts)
commentRouter.put("/:id/like", commentController.putLikeComment)