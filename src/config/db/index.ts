import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";

import { AppContext } from "@/context";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const initalizeDB = (c: Context<AppContext>) => {
	let db = c.get("db");
	const client = neon(c.get("db"));
	return drizzle(client, { schema });
};

export type Database = DrizzleD1Database<typeof schema>;
