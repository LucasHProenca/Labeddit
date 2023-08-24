import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import {PostBusiness} from "../../../src/business/PostBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock} from "../../mocks/IdGeneratorMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"
import { DeletePostSchema } from "../../../src/dtos/deletePost.dto"



describe("Testando deletePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new TokenManagerMock(),
    new IdGeneratorMock()
  )

  test("deve deletar um post", async () => {
    const input = DeletePostSchema.parse({
      token: "token-mock-fulano",
      id: "id-mock-post1",
    })

    const output = await postBusiness.deletePosts(input)

    expect(output).toBe(undefined)
  })

  test("deve disparar um erro se o token não for válido", async () => {
    expect.assertions(1)
    try {
        const input = DeletePostSchema.parse({
            token: "token-mock-fulan",
            id:"id-mock-post1",
        })
  
        await postBusiness.deletePosts(input)
    } catch (error) {
        if(error instanceof UnauthorizedError) {
            expect(error.statusCode).toBe(401)
        }
    }
  })

  test("deve disparar um erro se o id do post não existir", async () => {
    expect.assertions(2)
    try {
        const input = DeletePostSchema.parse({
            token: "token-mock-fulano",
            id: "id-mock-post5",
        })
  
        await postBusiness.deletePosts(input)
    } catch (error) {
        if(error instanceof NotFoundError) {
            expect(error.statusCode).toBe(404),
            expect(error.message).toBe("'id' do post não existe")
        }
    }
  })

  test("deve disparar um erro se o post não for do usuário nem ele um admin", async () => {
    expect.assertions(2)
    try {
        const input = DeletePostSchema.parse({
            id: "id-mock-post2",
            token: "token-mock-fulano",
        })
  
        await postBusiness.deletePosts(input)
    } catch (error) {
        if(error instanceof ForbiddenError) {
            expect(error.statusCode).toBe(403)
            expect(error.message).toBe("Somente admins e o dono do post podem deleta-lo")
        }
    }
  })
})