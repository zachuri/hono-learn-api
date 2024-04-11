import { Hono } from "hono";

const app = new Hono();

app.get("/", c => {
	return c.text("Hello Hono!");
});

app.get("/customers", c => {
	return c.json([{ id: 1, name: "hi" }]);
});

app.get("/customers/:id", c => {
	const customerId = c.req.param("id");

	return c.json([{ id: customerId, name: `Customer: ${customerId}` }]);
});

export default app;
