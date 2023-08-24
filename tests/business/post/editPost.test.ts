import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import {PostBusiness} from "../../../src/business/PostBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock} from "../../mocks/IdGeneratorMock"
import { EditPostSchema } from "../../../src/dtos/editPost.dto"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"



describe("Testando editPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new TokenManagerMock(),
    new IdGeneratorMock()
  )

  test("deve editar um post", async () => {
    const input = EditPostSchema.parse({
      token: "token-mock-fulano",
      id: "id-mock-post1",
      content: "novo post"
    })

    const output = await postBusiness.editPost(input)

    expect(output).toBe(undefined)
  })

  test("deve disparar um erro se o token não for válido", async () => {
    expect.assertions(1)
    try {
        const input = EditPostSchema.parse({
            token: "token-mock-fulan",
            id:"id-mock-post1",
            content: "fulaninho"
        })
  
        await postBusiness.editPost(input)
    } catch (error) {
        if(error instanceof UnauthorizedError) {
            expect(error.statusCode).toBe(401)
        }
    }
  })

  test("deve disparar um erro se o id do post não existir", async () => {
    expect.assertions(2)
    try {
        const input = EditPostSchema.parse({
            token: "token-mock-fulano",
            id: "id-mock-post5",
            content: "fulaninho"
        })
  
        await postBusiness.editPost(input)
    } catch (error) {
        if(error instanceof NotFoundError) {
            expect(error.statusCode).toBe(404),
            expect(error.message).toBe("'post' não encontrado")
        }
    }
  })

  test("deve disparar um erro se o usuário não for o dono do post", async () => {
    expect.assertions(2)
    try {
        const input = EditPostSchema.parse({
            token: "token-mock-astrodev",
            id: "id-mock-post1",
            content: "fulaninho"
        })
  
        await postBusiness.editPost(input)
    } catch (error) {
        if(error instanceof ForbiddenError) {
            expect(error.statusCode).toBe(403),
            expect(error.message).toBe("Somente quem criou o post pode editá-lo")
        }
    }
  })

})