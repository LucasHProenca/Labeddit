import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { CommentsPostsBusiness } from "../../../src/business/CommentsPostsBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { GetCommentSchema } from "../../../src/dtos/getCommentPost.dto"

describe("Testando getComments", () => {
    const commentBusiness = new CommentsPostsBusiness(
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve retornar lista de todos comments", async () => {
        const input = GetCommentSchema.parse({
            post_id: "id-mock-post1",
            token: "token-mock-astrodev"
        })

        const output = await commentBusiness.getComments(input)

        expect(output).toHaveLength(1)
        expect(output).toEqual([
            {
                id: "id-mock-comment1",
                content: "comentário 1",
                likes: 5,
                dislikes: 3,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator: {
                    id: "id-mock-fulano",
                    nickname: "Fulano"
                },
                post: {
                    id: "id-mock-post1",
                    nickname: "Fulano"
                }
            }
        ])
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = GetCommentSchema.parse({
                post_id: "id-mock-post1",
                token: "token-mock-fulan",
            })
            await commentBusiness.getComments(input)
        } catch (error) {
            if(error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400),
                expect(error.message).toBe("Token inválido")
            }
        }
      })
    
})