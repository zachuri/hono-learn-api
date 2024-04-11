import { Hono } from "hono";

export type Env = {
	DATABASE_URL: string;
	MY_VAR: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", c => {
	return c.text("Hello Hono!");
});

app.get("/customers", c => {
	const secret = c.env.MY_VAR;
	return c.json([{ id: 1, name: secret }]);
});

app.get("/customers/:id", c => {
	const customerId = c.req.param("id");

	return c.json([{ id: customerId, name: `Customer: ${customerId}` }]);
});

export default app;
