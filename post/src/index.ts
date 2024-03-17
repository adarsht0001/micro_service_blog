import { Elysia } from "elysia";
import { randomBytes } from "crypto";
import { cors } from "@elysiajs/cors";

type Post = {
    [id: string]: {
        id: string;
        title: string;
    };
};
const posts: Post = {};

const app = new Elysia()
    .use(cors())
    .get("/posts", () => posts)
    .post("/posts", ({ body }: { body: { title: string } }) => {
        const id = randomBytes(4).toString("hex");
        const { title } = body;

        posts[id] = {
            id,
            title,
        };
        fetch("http://localhost:4000/events", {
            method: "POST",
            body: JSON.stringify({
                type: "PostCreated",
                data: {
                    id,
                    title,
                },
            }),
            headers: { "Content-Type": "application/json" },
        });
        return posts[id];
    })
    .post("/events", ({ body }) => {
        console.log(body);
        return;
    })
    .listen(3002);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
