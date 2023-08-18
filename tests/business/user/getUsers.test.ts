import { UserBusiness } from "../../../src/business/UserBusiness"
import { GetUsersSchema } from "../../../src/dtos/getUser.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { USER_ROLES } from "../../../src/types"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando getUsers", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve gerar token ao logar", async () => {
    const input = GetUsersSchema.parse({
      token:"token-mock-astrodev"
    })

    const output = await userBusiness.getUsers(input)

    expect(output).toEqual([
        {
            id: "id-mock-fulano",
            nickname: "Fulano",
            email: "fulano@email.com",
            createdAt: expect.any(String),
            role: USER_ROLES.NORMAL
        },
        {
            id: "id-mock-astrodev",
            nickname: "Astrodev",
            email: "astrodev@email.com",
            createdAt: expect.any(String),
            role: USER_ROLES.ADMIN
        },
    ])
  })

  test("deve disparar um erro se o token não for de admin", async () => {
    expect.assertions(2)
    try {
        const input = GetUsersSchema.parse({
            token: "token-mock-fulano"
        })

        await userBusiness.getUsers(input)
    } catch (error) {
        if(error instanceof ForbiddenError) {
            expect(error.statusCode).toBe(403),
            expect(error.message).toBe("Somente admins podem ter acesso aos usuários")
        }
    }
})

test("deve disparar um erro se o token não for válido", async () => {
  expect.assertions(2)
  try {
      const input = GetUsersSchema.parse({
          token: "token-mock-fulan"
      })

      await userBusiness.getUsers(input)
  } catch (error) {
      if(error instanceof BadRequestError) {
          expect(error.statusCode).toBe(400),
          expect(error.message).toBe("Token inválido")
      }
  }
})


})