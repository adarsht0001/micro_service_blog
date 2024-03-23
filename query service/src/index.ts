import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

const posts: Record<string, Post> = {};

function eventHandler(type: EventData["Type"], data: EventData["Data"]) {
    if (type === "PostCreated") {
        const { ID, Title } = data;

        posts[ID] = { id: ID, title: Title, comments: [] };
    }

    if (type === "CommentCreated") {
        const { ID, Content, PostID } = data;

        const post = posts[PostID];
        post.comments.push({ id: ID, content: Content });
    }
}

(async function getAllEvents(): Promise<void> {
    const res = await fetch("http://localhost:4000/events");
    const data: [EventData] = await res.json();

    data.forEach((event) => {
        const { Data, Type } = event;
        eventHandler(Type, Data);
    });
})();

app.get("/posts", (c) => {
    return c.json(posts);
});

app.post("/events", async (c) => {
    const body: EventData = await c.req.json();
    const { Data, Type } = body;
    eventHandler(Type, Data);

    return c.json({});
});

export default app;
