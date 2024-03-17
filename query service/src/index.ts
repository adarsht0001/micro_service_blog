import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use("/*", cors());

interface Event {
    Type: "CommentCreated" | "PostCreated";
    Data: {
        ID: string;
        Title: string;
        Content: string;
        PostID: string;
    };
}

type Post = {
    id: string;
    title: string;
    comments: Comment[];
};

type Comment = {
    id: string;
    content: string;
};

const posts: Record<string, Post> = {};

app.get("/posts", (c) => {
    return c.json(posts);
});

app.post("/events", async (c) => {
    const body: Event = await c.req.json();
    const { Data, Type } = body;
    if (Type === "PostCreated") {
        const { ID, Title } = Data;

        posts[ID] = { id: ID, title: Title, comments: [] };
    }

    if (Type === "CommentCreated") {
        const { ID, Content, PostID } = Data;

        const post = posts[PostID];
        post.comments.push({ id: ID, content: Content });
    }

    console.log(posts);

    return c.json({});
});

export default app;
