import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { CommentsPostsBusiness } from "../../../src/business/CommentsPostsBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { GetCommentLikeSchema } from "../../../src/dtos/getLikeComment.dto"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testando getLikeComment", () => {
    const commentBusiness = new CommentsPostsBusiness(
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve retornar se o usuario já deu like ou dislike no comment", async () => {
        const input = GetCommentLikeSchema.parse({
            comment_id: "id-mock-comment1",
            token: "token-mock-astrodev"
        })

        const output = await commentBusiness.getCommentsLikes(input)

        expect(output).toEqual([
            {
                user_id: "id-mock-astrodev",
                comment_id: "id-mock-comment1",
                like: 1
            }
        ])
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = GetCommentLikeSchema.parse({
                comment_id: "id-mock-comment1",
                token: "token-mock-fulan",
            })
            await commentBusiness.getCommentsLikes(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400),
                expect(error.message).toBe("Token inválido")
            }
        }
    })

    test("deve disparar um erro se o comment não existir", async () => {
        expect.assertions(2)
        try {
            const input = GetCommentLikeSchema.parse({
                comment_id: "id-mock-comment5",
                token: "token-mock-fulano",
            })
            await commentBusiness.getCommentsLikes(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404),
                expect(error.message).toBe("'comment' não encontrado")
            }
        }
    })

})