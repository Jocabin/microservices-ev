import { Elysia } from "elysia";

const app = new Elysia().get("/api/ping", () => "pong").listen(4457);

console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
