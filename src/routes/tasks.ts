import { Hono } from "hono";

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

export const tasksRoute = new Hono()
	.get("/", c => {
		return c.json({ expenses: fakeTasks });
	})
	.post("/", async c => {
		const tasks = await c.req.json();
		return c.json(tasks);
	});
// .delete
// .put
