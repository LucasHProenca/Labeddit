import { PostLikeModel } from "../types";

export class PostVote {
    constructor(
        private userId: string,
        private postId: string,
        private vote: number
    ) { }

    public getUserId(): string {
        return this.userId;
    }

    public setUserId(value: string): void {
        this.userId = value;
    }

    public getPostId(): string {
        return this.postId;
    }

    public setPostId(value: string): void {
        this.postId = value;
    }

    public getVote(): number {
        return this.vote;
    }

    public setVote(value: number): void {
        this.vote = value;
    }

    public toPostVoteModel(): PostLikeModel {
        return {
            userId: this.userId,
            postId: this.postId,
            like: this.vote
        }
    }
}