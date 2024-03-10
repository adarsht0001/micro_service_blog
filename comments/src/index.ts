import { Elysia } from "elysia";
import { randomBytes } from "crypto";
import { cors } from "@elysiajs/cors";

type Comments = {
    [postId: string]: [
        {
            id: string;
            content: string;
        }
    ];
};

const commentsByPostId: Comments = {};

const app = new Elysia()
    .use(cors())
    .get(
        "/post/:id/comments",
        ({ params }: { params: { id: string } }) =>
            commentsByPostId[params.id] || []
    )
    .post(
        "/post/:id/comments",
        ({
            params,
            body,
        }: {
            params: { id: string };
            body: { content: string };
        }) => {
            const commentId = randomBytes(4).toString("hex");
            const comments = commentsByPostId[params.id] || [];
            comments.push({ id: commentId, content: body.content });
            commentsByPostId[params.id] = comments;

            return comments;
        }
    )
    .listen(3001);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
