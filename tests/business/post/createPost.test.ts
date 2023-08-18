import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import {PostBusiness} from "../../../src/business/PostBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock} from "../../mocks/IdGeneratorMock"
import { CreatePostSchema } from "../../../src/dtos/createPost.dto"


describe("Testando createPosts", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new TokenManagerMock(),
    new IdGeneratorMock()
  )

  test("deve criar um novo post", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-astrodev",
      content: "novo post"
    })

    const output = await postBusiness.createPost(input)

    expect(output).toBe(undefined)
  })

  test("deve disparar um erro se o token não for válido", async () => {
    expect.assertions(2)
    try {
        const input = CreatePostSchema.parse({
            token: "token-mock-fulan",
            content: "fulaninho"
        })
  
        await postBusiness.createPost(input)
    } catch (error) {
        if(error instanceof BadRequestError) {
            expect(error.statusCode).toBe(400),
            expect(error.message).toBe("Token inválido")
        }
    }
  })

})