import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { products } from "../config/db/schema";
import { Env } from "../types";

const product = new Hono<{ Bindings: Env }>();

product.get("/", async c => {
	const DATABASE_URL = c.env.DATABASE_URL;
	const sql = neon(DATABASE_URL); // Pass DATABASE_URL directly to env function

	const db = drizzle(sql);

	const allProducts = await db.select().from(products);

	return c.json(allProducts);
});

export default product;
