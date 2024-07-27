import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const taskSchema = z.object({
	id: z.number().int().positive().min(1),
	title: z.string().min(3).max(100),
	content: z.string().min(3).max(200),
});

type Task = z.infer<typeof taskSchema>;

const createTaskSchema = taskSchema.omit({ id: true });

const fakeTasks: Task[] = [
	{ id: 1, title: "Clean room 1", content: "now 1" },
	{ id: 2, title: "Clean room 2", content: "now 2" },
	{ id: 3, title: "Clean room 3", content: "now 3" },
];

export const tasksRoute = new Hono()
	.get("/", c => {
		return c.json({ expenses: fakeTasks });
	})
	.post("/", zValidator("json", createTaskSchema), async c => {
		const tasks = await c.req.valid("json");
		fakeTasks.push({ id: fakeTasks.length + 1, ...tasks });
		return c.json(tasks);
	})
	// Regex to make sure its number
	.get("/:id{[0-9]+}", c => {
		const id = Number.parseInt(c.req.param("id"));

		const task = fakeTasks.find(task => task.id === id);

		if (!task) {
			return c.notFound();
		}

		return c.json({ task });
	});
// .delete
// .put
