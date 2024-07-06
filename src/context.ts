import type { Lucia, Session, User } from "lucia";

import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { DatabaseUserAttributes, initializeLucia } from "./config/db/lucia.js";
import { UserTable } from "./config/db/schema.js";
import type { Env } from "./env.ts";

type Variables = {
	db: NeonDatabase;
	user: (User & DatabaseUserAttributes) | null;
	session: Session | null;
	lucia: Lucia<DatabaseUserAttributes>;
};

export interface AppContext {
	Bindings: Env;
	Variables: Variables;
}

declare module "lucia" {
	interface Register {
		Lucia: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: UserTable;
	}
}
