import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { CommentsPostsBusiness } from "../../../src/business/CommentsPostsBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"
import { DeleteCommentPostSchema } from "../../../src/dtos/deleteCommentPost.dto"

describe("Testando deleteComment", () => {
    const commentBusiness = new CommentsPostsBusiness(
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve deletar um comment", async () => {
        const input = DeleteCommentPostSchema.parse({
            id: "id-mock-comment2",
            token: "token-mock-astrodev"
        })

        const output = await commentBusiness.deleteComment(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(1)
        try {
            const input = DeleteCommentPostSchema.parse({
                id: "id-mock-post1",
                token: "token-mock-fulan"
            })
      
            await commentBusiness.deleteComment(input)
        } catch (error) {
            if(error instanceof UnauthorizedError) {
                expect(error.statusCode).toBe(401)
            }
        }
      })

      test("deve disparar um erro se o id do comment não existir", async () => {
        expect.assertions(2)
        try {
            const input = DeleteCommentPostSchema.parse({
                id: "id-mock-comment5",
                token: "token-mock-fulano"
            })
      
            await commentBusiness.deleteComment(input)
        } catch (error) {
            if(error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404),
                expect(error.message).toBe("'id' do comentário não existe")
            }
        }
      })

      test("deve disparar um erro se o comentário não for do usuário nem ele um admin", async () => {
        expect.assertions(2)
        try {
            const input = DeleteCommentPostSchema.parse({
                id: "id-mock-comment2",
                token: "token-mock-fulano",
            })
      
            await commentBusiness.deleteComment(input)
        } catch (error) {
            if(error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403),
                expect(error.message).toBe("Somente admins e o dono do comentário podem deleta-lo")
            }
        }
      })
})