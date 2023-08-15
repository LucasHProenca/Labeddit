import { PostDB, PostModel } from "../types"

export class Posts {
    constructor(
        private id: string,
        private content: string,
        private comments: number,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string,
        private creatorId: string,
        private creatorName: string
    ) { }

    public getId(): string {
        return this.id
    }

    public getCreatorId(): string {
        return this.creatorId
    }

    public getCreatorName(): string {
        return this.creatorName
    }

    public getContent(): string {
        return this.content
    }

    public getComment(): number {
        return this.comments
    }

    public getLikes(): number {
        return this.likes
    }

    public getDislikes(): number {
        return this.dislikes
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }

    public setId(value: string): void {
        this.id = value
    }

    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public setCreatorName(value: string): void {
        this.creatorName = value
    }

    public setContent(value: string): void {
        this.content = value
    }

    public setComment(value: number): void {
        this.comments = value
    }

    public addComment = (): void => {
        this.comments++
    }

    public removeComment = (): void => {
        this.comments--
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public addLike = (): void => {
        this.likes++
    }

    public removeLike = (): void => {
        this.likes--
    }

    public addDislike = (): void => {
        this.dislikes++
    }

    public removeDislike = (): void => {
        this.dislikes--
    }

    public setDislkes(value: number): void {
        this.dislikes = value
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }

    public toPostDB(): PostDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        }
    }

    public toPostModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                name: this.creatorName
            }
        }
    }
}