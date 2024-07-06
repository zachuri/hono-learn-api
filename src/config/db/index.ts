import type { Context } from "hono";

import { AppContext } from "@/context";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export const initalizeDB = (c: Context<AppContext>) => {
	const client = neon(c.env.DATABASE_URL);
	return drizzle(client, { schema });
};

export type Database = NeonDatabase<typeof schema>;
