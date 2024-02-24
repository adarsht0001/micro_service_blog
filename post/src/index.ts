import { Elysia } from "elysia";
import { randomBytes } from "crypto";

type Post = {
    [id: string]: {
        id: string;
        title: string;
    };
};
const posts: Post = {};

const app = new Elysia()
    .get("/posts", () => posts)
    .post("/posts", ({ body }: { body: { title: string } }) => {
        const id = randomBytes(4).toString("hex");
        const { title } = body;

        posts[id] = {
            id,
            title,
        };
        return posts[id];
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
