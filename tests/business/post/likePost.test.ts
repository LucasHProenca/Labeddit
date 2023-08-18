import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import {PostBusiness} from "../../../src/business/PostBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock} from "../../mocks/IdGeneratorMock"
import { EditPostSchema } from "../../../src/dtos/editPost.dto"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"
import { PutLikePostSchema } from "../../../src/dtos/putLikePost.dto"
import { PostDB } from "../../../src/types"

describe("Testando likePost", () => {
    const postBusiness = new PostBusiness(
      new PostDatabaseMock(),
      new UserDatabaseMock(),
      new TokenManagerMock(),
      new IdGeneratorMock()
    )
  
    test("deve inserir um like ou um dislike no post", async () => {
      const input = PutLikePostSchema.parse({
        post_id: "id-mock-post2",
        token: "token-mock-fulano",
        like: true
      })
  
      const output = await postBusiness.likeDislikePost(input)
  
      expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(1)
        try {
            const input = PutLikePostSchema.parse({
                post_id:"id-mock-post1",
                token: "token-mock-fulan",
                like: true
            })
      
            await postBusiness.likeDislikePost(input)
        } catch (error) {
            if(error instanceof UnauthorizedError) {
                expect(error.statusCode).toBe(401)
            }
        }
      })

      test("deve disparar um erro se o id do post não existir", async () => {
        expect.assertions(1)
        try {
            const input = PutLikePostSchema.parse({
                post_id:"id-mock-post5",
                token: "token-mock-fulano",
                like: true
            })
      
            await postBusiness.likeDislikePost(input)
        } catch (error) {
            if(error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
            }
        }
      })

      test("deve disparar um erro caso quem criou o post tente dar like", async () => {
        expect.assertions(1)
        try {
            const input = PutLikePostSchema.parse({
                post_id:"id-mock-post1",
                token: "token-mock-fulano",
                like: true
            })
      
            await postBusiness.likeDislikePost(input)
        } catch (error) {
            if(error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403)
            }
        }
      })
})