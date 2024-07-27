import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

type Task = {
	id: number;
	title: string;
	content: string;
};

const fakeTasks: Task[] = [
	{ id: 1, title: "Clean room 1", content: "now 1" },
	{ id: 2, title: "Clean room 2", content: "now 2" },
	{ id: 3, title: "Clean room 3", content: "now 3" },
];

const createTaskSchema = z.object({
	title: z.string(),
	content: z.string(),
});

export const tasksRoute = new Hono()
	.get("/", c => {
		return c.json({ expenses: fakeTasks });
	})
	.post("/", zValidator("json", createTaskSchema), async c => {
		const tasks = await c.req.valid("json");
		fakeTasks.push({ id: fakeTasks.length + 1, ...tasks });
		return c.json(tasks);
	});
// .delete
// .put
