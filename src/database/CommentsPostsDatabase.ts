import { CommentDB, CommentDBWithCreatorName, COMMENT_LIKE, LikesDislikesCommentsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { PostDatabase } from "./PostsDatabase";
import { UserDatabase } from "./UsersDatabase";

export class CommentsPostsDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments_posts"
    public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikesComments"

    public async findComments(post_id: string): Promise<CommentDB[]> {
        let result: CommentDB[] = []

        result = await BaseDatabase.connection(CommentsPostsDatabase.TABLE_COMMENTS).where({ post_id })

        return result
    }

    public async findComment(id: string): Promise<CommentDB | undefined> {
        const [commentDBExists]: CommentDB[] = await BaseDatabase.connection(CommentsPostsDatabase.TABLE_COMMENTS).where({ id })
        return commentDBExists
    }

    public async insertComment(commentDB: CommentDB): Promise<void> {
        await BaseDatabase.connection(CommentsPostsDatabase.TABLE_COMMENTS).insert(commentDB)
    }

    public async updateComment(commentDB: CommentDB): Promise<void> {
        await BaseDatabase.connection(CommentsPostsDatabase.TABLE_COMMENTS).update(commentDB).where({ id: commentDB.id })
    }

    public async deleteComment(id: string): Promise<void> {
        await BaseDatabase.connection(CommentsPostsDatabase.TABLE_COMMENTS).del().where({ id })
    }

    public async findCommentWithCreatorName(id: string): Promise<CommentDBWithCreatorName | undefined> {
        const [result] = await BaseDatabase
          .connection(CommentsPostsDatabase.TABLE_COMMENTS)
          .select(
            `${CommentsPostsDatabase.TABLE_COMMENTS}.id`,
            `${CommentsPostsDatabase.TABLE_COMMENTS}.user_id`,
            `${CommentsPostsDatabase.TABLE_COMMENTS}.post_id`,
            `${CommentsPostsDatabase.TABLE_COMMENTS}.content`,
            `${CommentsPostsDatabase.TABLE_COMMENTS}.likes`,
            `${CommentsPostsDatabase.TABLE_COMMENTS}.dislikes`,
            `${CommentsPostsDatabase.TABLE_COMMENTS}.created_at`,
            `${CommentsPostsDatabase.TABLE_COMMENTS}.updated_at`,
            `${UserDatabase.TABLE_USERS}.nickname as creator_name`
          )
          .join(
            `${UserDatabase.TABLE_USERS}`,
            `${CommentsPostsDatabase.TABLE_COMMENTS}.user_id`,
            "=",
            `${UserDatabase.TABLE_USERS}.id`
          )
          .where({ [`${CommentsPostsDatabase.TABLE_COMMENTS}.id`]: id })
    
        return result as CommentDBWithCreatorName | undefined
      }

      public findLikeDislike = async (
        likeDislikeCommentDB: LikesDislikesCommentsDB
      ): Promise<COMMENT_LIKE | undefined> => {
    
        const [result]: Array<LikesDislikesCommentsDB | undefined> = await BaseDatabase
          .connection(CommentsPostsDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
          .select()
          .where({
            user_id: likeDislikeCommentDB.user_id,
            comment_id: likeDislikeCommentDB.comment_id
          })
    
        if (result === undefined) {
          return undefined
    
        } else if (result.like === 1) {
          return COMMENT_LIKE.ALREADY_LIKED
    
        } else {
          return COMMENT_LIKE.ALREADY_DISLIKED
        }
      }
    
      public removeLikeDislike = async (likeDislikeCommentDB: LikesDislikesCommentsDB): Promise<void> => {
        await BaseDatabase.connection(CommentsPostsDatabase.TABLE_LIKES_DISLIKES_COMMENTS).del()
          .where({ user_id: likeDislikeCommentDB.user_id, comment_id: likeDislikeCommentDB.comment_id })
      }
    
      public updateLikeDislike = async (likeDislikeCommentDB: LikesDislikesCommentsDB): Promise<void> => {
        await BaseDatabase.connection(CommentsPostsDatabase.TABLE_LIKES_DISLIKES_COMMENTS).update(likeDislikeCommentDB)
          .where({ user_id: likeDislikeCommentDB.user_id, comment_id: likeDislikeCommentDB.comment_id })
      }
    
      public insertLikeDislike = async (likeDislikeCommentDB: LikesDislikesCommentsDB): Promise<void> => {
        await BaseDatabase.connection(CommentsPostsDatabase.TABLE_LIKES_DISLIKES_COMMENTS).insert(likeDislikeCommentDB)
      }
}