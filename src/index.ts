import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Hono } from "hono";
import { products } from './db/schema';

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

app.get("/products", async c => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);

	const allProducts = await db.select().from(products);

	return c.json(allProducts);
});

export default app;
