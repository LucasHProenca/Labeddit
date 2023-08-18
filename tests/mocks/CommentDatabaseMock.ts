import { BaseDatabase } from "../../src/database/BaseDatabase";
import { CommentDB, CommentDBWithCreatorName, COMMENT_LIKE, LikesDislikesCommentsDB, PostDB } from "../../src/types";

const commentsMock: CommentDB[] = [{
    id: "id-mock-comment1",
    user_id: "id-mock-fulano",
    post_id: "id-mock-post1",
    content: "comentário 1",
    likes: 5,
    dislikes: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
},
{
    id: "id-mock-comment2",
    user_id: "id-mock-astrodev",
    post_id: "id-mock-post2",
    content: "comentário 2",
    likes: 2,
    dislikes: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}
]


const commentWithCreatorNameMock: CommentDBWithCreatorName[] = [
    {
        id: "id-mock-comment1",
        user_id: "id-mock-fulano",
        post_id: "id-mock-post1",
        content: "comentário 1",
        likes: 5,
        dislikes: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator_name: "Fulano"
    },
    {
        id: "id-mock-comment2",
        user_id: "id-mock-astrodev",
        post_id: "id-mock-post2",
        content: "comentário 2",
        likes: 2,
        dislikes: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator_name: "Astrodev"
    }
]

const likeDB: LikesDislikesCommentsDB[] = [
    {
        user_id: "id-mock-fulano",
        comment_id: "id-mock-post1",
        like: 0
    },
    {
        user_id: "id-mock-astrodev",
        comment_id: "id-mock-post2",
        like: 0
    },
]

export class CommentDatabaseMock extends BaseDatabase {
    public static TABLE_COMMENTS = "comments_posts"
    public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikesComments"

    public async findComments(post_id: string): Promise<CommentDB[]> {

        return commentsMock.filter(comment => comment.post_id === post_id)
    }

    public async findComment(id: string): Promise<CommentDB | undefined> {
        return commentsMock.filter(comment => comment.id === id)[0]
    }

    public async insertComment(commentDB: CommentDB): Promise<void> {
    }

    public async updateComment(commentDB: CommentDB): Promise<void> {
    }

    public async deleteComment(id: string): Promise<void> {
    }

    public async findCommentWithCreatorName(id: string): Promise<CommentDBWithCreatorName | undefined> {

        return commentWithCreatorNameMock.filter((comment => comment.id === id))[0] || undefined
    }

    public findLikeDislike = async (
        likeDislikeCommentDB: LikesDislikesCommentsDB
    ): Promise<COMMENT_LIKE | undefined> => {

        // const [result]: Array<LikesDislikesCommentsDB | undefined> = await BaseDatabase
        //   .connection(CommentsPostsDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
        //   .select()
        //   .where({
        //     user_id: likeDislikeCommentDB.user_id,
        //     comment_id: likeDislikeCommentDB.comment_id
        //   })

        const [result]: Array<LikesDislikesCommentsDB | undefined> = likeDB.filter((comment => comment.comment_id
            === likeDislikeCommentDB.comment_id &&
            comment.user_id === likeDislikeCommentDB.user_id))

        if (result === undefined) {
            return undefined

        } else if (result.like === 1) {
            return COMMENT_LIKE.ALREADY_LIKED

        } else {
            return COMMENT_LIKE.ALREADY_DISLIKED
        }
    }

    public removeLikeDislike = async (likeDislikeCommentDB: LikesDislikesCommentsDB): Promise<void> => {
    }

    public updateLikeDislike = async (likeDislikeCommentDB: LikesDislikesCommentsDB): Promise<void> => {
    }

    public insertLikeDislike = async (likeDislikeCommentDB: LikesDislikesCommentsDB): Promise<void> => {

    }
}