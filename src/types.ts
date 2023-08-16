export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export enum POST_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
}

export interface CommentDB {
    id: string,
    user_id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface LikesDislikesDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface PostModel {
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface CommentModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        nickname: string
    },
    post: {
        id: string,
        nickname: string
    }
}

export interface UserModel {
    id: string,
    nickname: string,
    email: string,
    role: USER_ROLES,
    createdAt: string
}

export interface PostDBWithCreatorName {
    id: string,
    creator_id: string,
    content: string,
    comment: number,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator_name: string
}