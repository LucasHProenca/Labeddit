import { BaseDatabase } from "../../src/database/BaseDatabase";
import {LikesDislikesDB, PostDB, PostDBWithCreatorName, POST_LIKE} from "../../src/types"


const postsMock: PostDB[] = [
    {
        id: "id-mock-post1",
        creator_id: "id-mock-fulano",
        content: "teste",
        comments: 1, 
        likes: 3,
        dislikes: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "id-mock-post2",
        creator_id: "id-mock-astrodev",
        content: "teste",
        comments: 1, 
        likes: 3,
        dislikes: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
]

const postWithCreatorNameMock: PostDBWithCreatorName[] = [
  {
    id: "id-mock-post1",
    creator_id: "id-mock-fulano",
    content: "teste",
    comments: 1, 
    likes: 3,
    dislikes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_name: "Fulano"
},
{
    id: "id-mock-post2",
    creator_id: "id-mock-astrodev",
    content: "teste",
    comments: 1, 
    likes: 3,
    dislikes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_name: "Astrodev"
},
]

const likeDB: LikesDislikesDB[] = [
  {
    user_id: "id-mock-fulano",
    post_id: "id-mock-post1",
    like: 0
  },
  {
    user_id: "id-mock-astrodev",
    post_id: "id-mock-post2",
    like: 0
  },
]

export class PostDatabaseMock extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikesPosts"
    public async findPosts(q?: string): Promise<PostDB[]> {
  
      if(q) {
        return postsMock.filter(post => 
            post.content.toLocaleLowerCase()
            .includes(q.toLocaleLowerCase()))
      }else {
        return postsMock
      }
    }
  
    public async findPost(id: string): Promise<PostDB | undefined> {
      return postsMock.filter(post => post.id === id)[0]
    }
  
    public async insertPost(postDB: PostDB): Promise<void> {
    }
  
    public async updatePost(postDB: PostDB): Promise<void> {
    }
  
    public async deletePost(id: string): Promise<void> {
    }
  
    public async findPostWithCreatorName(id: string): Promise<PostDBWithCreatorName | undefined> {
      
      return postWithCreatorNameMock.filter((post => post.id === id))[0] || undefined
    }
  
    public findLikeDislike = async (
      likeDislikeDB: LikesDislikesDB
    ): Promise<POST_LIKE | undefined> => {
  
      // const [result]: Array<LikesDislikesDB | undefined> = await BaseDatabase
      //   .connection(PostDatabaseMock.TABLE_LIKES_DISLIKES)
      //   .select()
      //   .where({
      //     user_id: likeDislikeDB.user_id,
      //     post_id: likeDislikeDB.post_id
      //   })

      const [result]: Array<LikesDislikesDB | undefined> = likeDB.filter((post => post.post_id === likeDislikeDB.post_id &&
        post.user_id === likeDislikeDB.user_id))

  
      if (result === undefined) {
        return undefined
  
      } else if (result.like === 1) {
        return POST_LIKE.ALREADY_LIKED
  
      } else {
        return POST_LIKE.ALREADY_DISLIKED
      }
    }
  
    public removeLikeDislike = async (likeDislikeDB: LikesDislikesDB): Promise<void> => {
    }
  
    public updateLikeDislike = async (likeDislikeDB: LikesDislikesDB): Promise<void> => {
    }
  
    public insertLikeDislike = async (likeDislikeDB: LikesDislikesDB): Promise<void> => {
    }
}