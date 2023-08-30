import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import {PostBusiness} from "../../../src/business/PostBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock} from "../../mocks/IdGeneratorMock"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testando getLikePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new TokenManagerMock(),
    new IdGeneratorMock()
  )

  test("deve retornar se o usuario já deu like ou dislike no post", async () => {
    const input = {
      token: "token-mock-astrodev",
      postId: "id-mock-post1"
    }

    const output = await postBusiness.getPostsLikes(input)

    expect(output).toEqual([{
        user_id: "id-mock-astrodev",
        post_id: "id-mock-post1",
        like: 1
    }
    ])
  })

  test("deve disparar um erro se o token não for válido", async () => {
    expect.assertions(2)
    try {
        const input = {
            token: "token-mock-fulan",
            post_id: "id-mock-post1"
        }
  
        await postBusiness.getPostsLikes(input)
    } catch (error) {
        if(error instanceof BadRequestError) {
            expect(error.statusCode).toBe(400),
            expect(error.message).toBe("Token inválido")
        }
    }
  })

  test("deve disparar um erro se o post não existir", async () => {
    expect.assertions(2)
    try {
        const input = {
            token: "token-mock-fulano",
            post_id: "id-mock-post5"
        }
  
        await postBusiness.getPostsLikes(input)
    } catch (error) {
        if(error instanceof NotFoundError) {
            expect(error.statusCode).toBe(404)
            expect(error.message).toBe("'post' não encontrado")
        }
    }
  })
})