import { CommentDB, CommentModel } from "../types"


export class Comments {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string,
        private creatorId: string,
        private creatorNickname: string,
        private postId: string,
        private postCreatorNickname: string
    ){}

    private getId(): string {
        return this.id
    }

    private getContent(): string {
        return this.content
    }

    private getLikes(): number {
        return this.likes
    }

    private getDislikes(): number {
        return this.dislikes
    }

    private getCreatedAt(): string {
        return this.createdAt
    }

    private getUpdatedAt(): string {
        return this.updatedAt
    }

    private getCreatorId(): string {
        return this.creatorId
    }

    private getCreatorNickname(): string {
        return this.creatorNickname
    }

    private getPostId(): string {
        return this.postId
    }

    private getPostCreatorNickname(): string {
        return this.postCreatorNickname
    }

    public setId(value: string): void {
        this.id = value
    }

    public setContent(value: string): void {
        this.content = value
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }

    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public setCreatorNickName(value: string): void {
        this.creatorNickname = value
    }

    public setPostId(value: string): void {
        this.postId = value
    }

    public setPostCreatorNickname(value: string): void {
        this.postCreatorNickname = value
    }

    public toCommentDB(): CommentDB {
        return {
            id: this.id,
            user_id: this.creatorId,
            post_id: this.postId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }

    public toCommentModel(): CommentModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                nickname: this.creatorNickname
            },
            post: {
                id: this.postId,
                nickname: this.postCreatorNickname
            }
        }
    }
}