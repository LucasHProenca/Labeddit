import { CommentsPostsDatabase } from "../database/CommentsPostsDatabase";
import { PostDatabase } from "../database/PostsDatabase";
import { UserDatabase } from "../database/UsersDatabase";
import { CreateCommentPostInputDTO, CreateCommentPostOutputDTO } from "../dtos/createCommentPost.dto";
import { DeleteCommentPostInputDTO, DeleteCommentPostOutputDTO } from "../dtos/deleteCommentPost.dto";
import { EditCommentPostInputDTO, EditCommentPostOutputDTO } from "../dtos/editCommentPost.dto";
import { GetCommentInputDTO, GetCommentOutputDTO } from "../dtos/getCommentPost.dto";
import { GetCommentLikeInputDTO } from "../dtos/getLikeComment.dto";
import { PutLikeCommentInputDTO, PutLikeCommentOutputDTO } from "../dtos/putLikeCommentPost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Comments } from "../models/Comments";
import { Posts } from "../models/Posts";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentDB, CommentModel, COMMENT_LIKE, LikesDislikesCommentsDB, PostDB, USER_ROLES } from "../types";

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

        const postIdExists = await this.postDatabase.findPostWithCreatorName(post_id)

        // console.log(postIdExists)
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
            postIdExists.id,
            postCreatorExists.nickname
        )

        await this.commentDatabase.insertComment(comment.toCommentDB())
        
        const post = new Posts(
            postIdExists.id,
            postIdExists.content,
            postIdExists.comments,
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

        // console.log(postEdited)
        // const updatedPostDB = post.toPostDB()
        await this.postDatabase.updatePost(postEdited)

        const output: CreateCommentPostOutputDTO = undefined

        return output
    }

    public editComment = async (input: EditCommentPostInputDTO): Promise<EditCommentPostOutputDTO> => {

        const { id, content, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }
        const commentDB = await this.commentDatabase.findComment(id)

        if (!commentDB) {
            throw new NotFoundError("'comentário' não encontrado")
        }

        if (payload.id !== commentDB.user_id) {
            throw new ForbiddenError("Somente quem criou o comentário pode editá-lo")
        }

        const postIdExists = await this.postDatabase.findPostWithCreatorName(commentDB.post_id)

        if(!postIdExists) {
            throw new NotFoundError("Post não existe")
        }

        const postCreatorExists = await this.userDatabase.findUserById(postIdExists.creator_id)

        if(!postCreatorExists) {
            throw new BadRequestError("Criador do post não existe")
        }
        const comment = new Comments(
            commentDB.id, commentDB.content, commentDB.likes, commentDB.dislikes, commentDB.created_at, commentDB.updated_at,
            payload.id, payload.name, postIdExists.id, postCreatorExists.nickname 
        )

        content && comment.setContent(content)
        comment.setUpdatedAt(new Date().toISOString())

        const commentEdited: CommentDB = {
            id: comment.getId(),
            user_id: comment.getCreatorId(),
            post_id: comment.getPostId(),
            content: comment.getContent(),
            likes: comment.getLikes(),
            dislikes: comment.getDislikes(),
            created_at: comment.getCreatedAt(),
            updated_at: comment.getUpdatedAt()
        }

        await this.commentDatabase.updateComment(commentEdited)

        const output: EditCommentPostOutputDTO = undefined

        return output
    }

    public deleteComment = async (input: DeleteCommentPostInputDTO): Promise<DeleteCommentPostOutputDTO> => {
        const { id, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const commentExists = await this.commentDatabase.findComment(id)

        if (!commentExists) {
            throw new NotFoundError("'id' do comentário não existe")
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== commentExists.user_id) {
                throw new ForbiddenError("Somente admins e o dono do comentário podem deleta-lo")
            }
        }

        const postIdExists = await this.postDatabase.findPostWithCreatorName(commentExists.post_id)

        if(!postIdExists) {
            throw new NotFoundError("Post não existe")
        }

        const postCreatorExists = await this.userDatabase.findUserById(postIdExists.creator_id)

        if(!postCreatorExists) {
            throw new BadRequestError("Criador do post não existe")
        }


        await this.commentDatabase.deleteComment(id)

        const post = new Posts(
            postIdExists.id,
            postIdExists.content,
            postIdExists.comments,
            postIdExists.likes,
            postIdExists.dislikes,
            postIdExists.created_at,
            postIdExists.updated_at,
            postIdExists.creator_id,
            postIdExists.creator_name
        )

        post.removeComment()

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

        await this.postDatabase.updatePost(postEdited)
        const output: DeleteCommentPostOutputDTO = undefined

        return output
    }

    public likeDislikeComment = async (input: PutLikeCommentInputDTO): Promise<PutLikeCommentOutputDTO> => {
        const { comment_id, token, like } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        if (like !== undefined) {
            if (typeof like !== "boolean") {
                throw new BadRequestError("'like' deve ser do tipo boolean")
            }
        }

        const commentDBWithCreatorName = await this.commentDatabase.findCommentWithCreatorName(comment_id)

        if (!commentDBWithCreatorName) {
            throw new NotFoundError("'comment' não encontrado")
        }

        if (payload.id === commentDBWithCreatorName.user_id) {
            throw new ForbiddenError("Quem criou o comentário não pode dar like ou dislike")
        }

        const postIdExists = await this.postDatabase.findPostWithCreatorName(commentDBWithCreatorName.post_id)

        if(!postIdExists) {
            throw new NotFoundError("Post não existe")
        }

        const postCreatorExists = await this.userDatabase.findUserById(postIdExists.creator_id)

        if(!postCreatorExists) {
            throw new BadRequestError("Criador do post não existe")
        }
        const comment = new Comments(
            commentDBWithCreatorName.id,
            commentDBWithCreatorName.content,
            commentDBWithCreatorName.likes,
            commentDBWithCreatorName.dislikes,
            commentDBWithCreatorName.created_at,
            commentDBWithCreatorName.updated_at,
            commentDBWithCreatorName.user_id,
            commentDBWithCreatorName.creator_name,
            commentDBWithCreatorName.post_id,
            postCreatorExists.nickname
        )

        const likeSQlite = like ? 1 : 0

        const likesDislikesCommentDB: LikesDislikesCommentsDB = {
            user_id: payload.id,
            comment_id: comment_id,
            like: likeSQlite
        }

        const likeDislikeExists = await this.commentDatabase.findLikeDislike(likesDislikesCommentDB)

        if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likesDislikesCommentDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likesDislikesCommentDB)
                comment.removeLike()
                comment.addDislike()
            }
        } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
            if (!like) {
                await this.commentDatabase.removeLikeDislike(likesDislikesCommentDB)
                comment.removeDislike()
            } else {
                await this.commentDatabase.updateLikeDislike(likesDislikesCommentDB)
                comment.removeDislike()
                comment.addLike()
            }
        } else {
            await this.commentDatabase.insertLikeDislike(likesDislikesCommentDB)
            like ? comment.addLike() : comment.addDislike()
        }

        const updatedCommentDB = comment.toCommentDB()
        await this.commentDatabase.updateComment(updatedCommentDB)

        const output: PutLikeCommentOutputDTO = undefined

        return output
    }

    public async getCommentsLikes(input: GetCommentLikeInputDTO): Promise<GetCommentOutputDTO> {
        const { token, comment_id } = input;
    
        const payload = this.tokenManager.getPayload(token);
        if (payload === null) {
          throw new BadRequestError("Token inválido");
        }
        
        const user = await this.userDatabase.findUserById(payload.id)
        const comment = await this.commentDatabase.findComment(comment_id)

        if(!user) {
            throw new NotFoundError("'user' não encontrado")
        }

        if(!comment) {
            throw new NotFoundError("'comment' não encontrado")
        }

        const searchInDb = {
            user_id: user.id,
            comment_id: comment.id
        }

        const output: GetCommentOutputDTO = await this.commentDatabase.getLikes(searchInDb)
        return output
      }
}