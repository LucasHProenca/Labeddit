import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { CommentsPostsBusiness } from "../../../src/business/CommentsPostsBusiness"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { CreateCommentPostSchema } from "../../../src/dtos/createCommentPost.dto"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { PostDB } from "../../../src/types"

describe("Testando createComments", () => {
    const commentBusiness = new CommentsPostsBusiness(
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve criar um novo comment", async () => {
        const input = CreateCommentPostSchema.parse({
            post_id: "id-mock-post1",
            content: "novo comment",
            token: "token-mock-astrodev"
        })

        const output = await commentBusiness.createComment(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(1)
        try {
            const input = CreateCommentPostSchema.parse({
                post_id: "id-mock-post1",
                content: "fulaninho",
                token: "token-mock-fulan"
            })
      
            await commentBusiness.createComment(input)
        } catch (error) {
            if(error instanceof UnauthorizedError) {
                expect(error.statusCode).toBe(401)
            }
        }
      })

      test("deve disparar um erro se o id não existir", async () => {
        expect.assertions(1)
        try {
            const input = CreateCommentPostSchema.parse({
                post_id: "id-mock-post10",
                content: "fulaninho",
                token: "token-mock-fulano"
            })
      
            await commentBusiness.createComment(input)
        } catch (error) {
            if(error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
            }
        }
      })

      test("deve adicionar 1 aos comentários deu m post", () => {
        const input = CreateCommentPostSchema.parse({
            post_id: "id-mock-post1",
            content: "novo comment",
            token: "token-mock-astrodev"
        })

        const postsMock: PostDB = 
    {
        id: "id-mock-post3",
        creator_id: "id-mock-fulano",
        content: "teste",
        comments: 1, 
        likes: 3,
        dislikes: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
}

        const output = {
        ...postsMock,
        comments: postsMock.comments + 1
        }

        expect(output).toEqual({
            id: "id-mock-post3",
            creator_id: "id-mock-fulano",
            content: "teste",
            comments: 2, 
            likes: 3,
            dislikes: 5,
            created_at: expect.any(String),
            updated_at: expect.any(String)
    })
    })
})