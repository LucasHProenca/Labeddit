import { CommentDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentsPostsDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments_posts"

    public async findComments(post_id: string): Promise<CommentDB[]> {
        let result: CommentDB[] = []

        result = await BaseDatabase.connection(CommentsPostsDatabase.TABLE_COMMENTS).where({post_id})

        return result
    }

    public async findComment(id: string): Promise<CommentDB | undefined> {
        const [commentDBExists]: CommentDB[] = await BaseDatabase.connection(CommentsPostsDatabase.TABLE_COMMENTS).where({id})
        return commentDBExists
    }

    public async insertComment(commentDB: CommentDB): Promise<void> {
        await BaseDatabase.connection(CommentsPostsDatabase.TABLE_COMMENTS).insert(commentDB)
    }
}