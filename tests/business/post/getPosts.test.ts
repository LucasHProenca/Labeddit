import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import {PostBusiness} from "../../../src/business/PostBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock} from "../../mocks/IdGeneratorMock"
import { GetPostSchema } from "../../../src/dtos/getPost.dto"

describe("Testando getPosts", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new TokenManagerMock(),
    new IdGeneratorMock()
  )

  test("deve retornar lista de todos os posts", async () => {
    const input = GetPostSchema.parse({
      token: "token-mock-astrodev"
    })

    const output = await postBusiness.getPosts(input)

    expect(output).toHaveLength(3)
    expect(output).toEqual([
        {
            id: "id-mock-post1",
            content: "teste",
            comments: 1, 
            likes: 3,
            dislikes: 5,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator: {
                id: "id-mock-fulano",
                name: "Fulano"
            }
        },
        {
            id: "id-mock-post2",
            content: "teste",
            comments: 1, 
            likes: 3,
            dislikes: 5,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator: {
                id: "id-mock-astrodev",
                name: "Astrodev"
            }
        },
        {
          id: "id-mock-post3",
          content: "teste",
          comments: 1, 
          likes: 3,
          dislikes: 6,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          creator: {
            id: "id-mock-astrodev",
            name: "Astrodev"
          }
        }
    ])
  })

  test("deve disparar um erro se o token não for válido", async () => {
    expect.assertions(2)
    try {
        const input = GetPostSchema.parse({
            token: "token-mock-fulan",
        })
  
        await postBusiness.getPosts(input)
    } catch (error) {
        if(error instanceof BadRequestError) {
            expect(error.statusCode).toBe(400),
            expect(error.message).toBe("Token inválido")
        }
    }
  })

//   test("deve disparar um erro se o criador do post não existir", async () => {
//     expect.assertions(1)
//     try {
//         const input = GetPostSchema.parse({
//             token: "token-mock-fulano"
//         })
  
//         await postBusiness.getPosts(input)
//     } catch (error) {
//         if(error instanceof BadRequestError) {
//             expect(error.statusCode).toBe(400)
//         }
//     }
//   })
})