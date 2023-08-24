import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { CommentsPostsBusiness } from "../../../src/business/CommentsPostsBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { EditCommentPostSchema } from "../../../src/dtos/editCommentPost.dto"
import { EditPostSchema } from "../../../src/dtos/editPost.dto"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"

describe("Testando editComment", () => {
    const commentBusiness = new CommentsPostsBusiness(
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve editar um comment", async () => {
        const input = EditCommentPostSchema.parse({
            id: "id-mock-comment2",
            content: "novo comment",
            token: "token-mock-astrodev"
        })

        const output = await commentBusiness.editComment(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(1)
        try {
            const input = EditCommentPostSchema.parse({
                id: "id-mock-post1",
                content: "fulaninho",
                token: "token-mock-fulan"
            })
      
            await commentBusiness.editComment(input)
        } catch (error) {
            if(error instanceof UnauthorizedError) {
                expect(error.statusCode).toBe(401)
            }
        }
      })

      test("deve disparar um erro se o id do comment não existir", async () => {
        expect.assertions(2)
        try {
            const input = EditPostSchema.parse({
                id: "id-mock-comment5",
                content: "fulaninho",
                token: "token-mock-fulano"
            })
      
            await commentBusiness.editComment(input)
        } catch (error) {
            if(error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404),
                expect(error.message).toBe("'comentário' não encontrado")
            }
        }
      })

      test("deve disparar um erro se o usuário não for o dono do comment", async () => {
        expect.assertions(2)
        try {
            const input = EditCommentPostSchema.parse({
                id: "id-mock-comment1",
                content: "fulaninho",
                token: "token-mock-astrodev"
            })
      
            await commentBusiness.editComment(input)
        } catch (error) {
            if(error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403),
                expect(error.message).toBe("Somente quem criou o comentário pode editá-lo")
            }
        }
      })
})