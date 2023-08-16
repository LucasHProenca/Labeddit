import { CommentsPostsDatabase } from "../database/CommentsPostsDatabase";
import { PostDatabase } from "../database/PostsDatabase";
import { UserDatabase } from "../database/UsersDatabase";
import { CreateCommentPostInputDTO, CreateCommentPostOutputDTO } from "../dtos/createCommentPost.dto";
import { GetCommentInputDTO, GetCommentOutputDTO } from "../dtos/getCommentPost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Comments } from "../models/Comments";
import { Posts } from "../models/Posts";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentModel, PostDB } from "../types";

export class CommentsPostsBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private commentDatabase: CommentsPostsDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ) {}

    public getComments = async (input: GetCommentInputDTO): Promise<GetCommentOutputDTO> => {
        const {post_id, token} = input

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("Token inválido")
        }

        const commentsModel: CommentModel[] = []
        const commentsDB = await this.commentDatabase.findComments(post_id)
        

        for (let commentDB of commentsDB) {
            const userIdExists = await this.userDatabase.findUserById(commentDB.user_id)
            const postIdExists = await this.postDatabase.findPost(commentDB.post_id)
            
            if(!userIdExists) {
                throw new BadRequestError("Comentário com criador não identificado")
            }

            if(!postIdExists) {
                throw new BadRequestError("Post não existe")
            }

            const postCreatorExists = await this.userDatabase.findUserById(postIdExists.creator_id)

            if(!postCreatorExists) {
                throw new BadRequestError("Criador do post não existe")
            }

            const comment = new Comments (
                commentDB.id,
                commentDB.content,
                commentDB.likes,
                commentDB.dislikes,
                commentDB.created_at,
                commentDB.updated_at,
                commentDB.user_id,
                userIdExists.nickname,
                commentDB.post_id,
                postCreatorExists.nickname
            )

            commentsModel.push(comment.toCommentModel())
        }

        const output: GetCommentOutputDTO = commentsModel

        return output
    }

    public createComment = async (input: CreateCommentPostInputDTO): Promise<CreateCommentPostOutputDTO> => {
        const {post_id, content, token} = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()

        const commentIdExists = await this.commentDatabase.findComment(id)

        if(commentIdExists) {
            throw new BadRequestError("'id' já existe")
        }

        const postIdExists = await this.postDatabase.findPostWithCreatorName(post_id)

        if(!postIdExists) {
            throw new NotFoundError("Post não existe")
        }

        const postCreatorExists = await this.userDatabase.findUserById(postIdExists.creator_id)

        if(!postCreatorExists) {
            throw new BadRequestError("Criador do post não existe")
        }

        const comment = new Comments(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name,
            postIdExists.creator_id,
            postCreatorExists.nickname
        )

        await this.commentDatabase.insertComment(comment.toCommentDB())
        
        const post = new Posts(
            postIdExists.id,
            postIdExists.content,
            postIdExists.comment,
            postIdExists.likes,
            postIdExists.dislikes,
            postIdExists.created_at,
            postIdExists.updated_at,
            postIdExists.creator_id,
            postIdExists.creator_name
        )

        if(comment) {
            post.addComment()
        }

        const postEdited: PostDB = {
            id: post.getId(),
            creator_id: post.getCreatorId(),
            content: post.getContent(),
            comments: post.getComment(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            created_at: post.getCreatedAt(),
            updated_at: post.getUpdatedAt()
        }

        // const updatedPostDB = post.toPostDB()
        await this.postDatabase.updatePost(postEdited)

        const output: CreateCommentPostOutputDTO = undefined

        return output
    }
}