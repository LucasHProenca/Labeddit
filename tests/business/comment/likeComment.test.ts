import { BadRequestError } from "../../../src/errors/BadRequestError"
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
import { PutLikeCommentSchema } from "../../../src/dtos/putLikeCommentPost.dto"

describe("Testando likeComment", () => {
    const commentBusiness = new CommentsPostsBusiness(
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve inserir um like ou um dislike no comment", async () => {
        const input = PutLikeCommentSchema.parse({
            comment_id: "id-mock-comment1",
            token: "token-mock-astrodev",
            like: true
        })

        const output = await commentBusiness.likeDislikeComment(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(1)
        try {
            const input = PutLikeCommentSchema.parse({
                comment_id: "id-mock-comment1",
                token: "token-mock-astrode",
                like: true
            })

            await commentBusiness.likeDislikeComment(input)
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                expect(error.statusCode).toBe(401)
            }
        }
    })

    test("deve disparar um erro se o id do comment não existir", async () => {
        expect.assertions(1)
        try {
            const input = PutLikeCommentSchema.parse({
                comment_id: "id-mock-comment10",
                token: "token-mock-astrodev",
                like: true
            })
      
            await commentBusiness.likeDislikeComment(input)
        } catch (error) {
            if(error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
            }
        }
      })

      test("deve disparar um erro caso quem criou o comment tente dar like", async () => {
        expect.assertions(1)
        try {
            const input = PutLikeCommentSchema.parse({
                comment_id: "id-mock-comment2",
                token: "token-mock-astrodev",
                like: true
            })
      
            await commentBusiness.likeDislikeComment(input)
        } catch (error) {
            if(error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403)
            }
        }
      })

      test("deve inserir um like num post que já tenha dado like", async () => {
        const input = PutLikeCommentSchema.parse({
            comment_id: "id-mock-comment1",
            token: "token-mock-astrodev",
            like: true
        })

        const output = await commentBusiness.likeDislikeComment(input)

        expect(output).toBe(undefined)
    })

    test("deve inserir um dislike num post que já tenha dado like", async () => {
        const input = PutLikeCommentSchema.parse({
            comment_id: "id-mock-comment1",
            token: "token-mock-astrodev",
            like: false
        })

        const output = await commentBusiness.likeDislikeComment(input)

        expect(output).toBe(undefined)
    })

    test("deve inserir um dislike num post que já tenha dado dislike", async () => {
        const input = PutLikeCommentSchema.parse({
            comment_id: "id-mock-comment2",
            token: "token-mock-fulano",
            like: false
        })

        const output = await commentBusiness.likeDislikeComment(input)

        expect(output).toBe(undefined)
    })

    test("deve inserir um dislike num post que já tenha dado dislike", async () => {
        const input = PutLikeCommentSchema.parse({
            comment_id: "id-mock-comment2",
            token: "token-mock-fulano",
            like: true
        })

        const output = await commentBusiness.likeDislikeComment(input)

        expect(output).toBe(undefined)
    })

    test("deve inserir um dislike num post que já tenha dado dislike", async () => {
        const input = PutLikeCommentSchema.parse({
            comment_id: "id-mock-comment3",
            token: "token-mock-fulano",
            like: true
        })

        const output = await commentBusiness.likeDislikeComment(input)

        expect(output).toBe(undefined)
    })
})