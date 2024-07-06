import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import type { Context } from "hono";

import { AppContext } from "@/context";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { NeonDatabase } from 'drizzle-orm/neon-serverless';

export const initalizeDB = (c: Context<AppContext>) => {
	const client = neon(c.env.DB);
	return drizzle(client, { schema });
};

export type Database = NeonDatabase<typeof schema>;
