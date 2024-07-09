import type { Lucia, Session, User } from "lucia";

import { Database } from "./config/db/index.js";
import { UserTable } from "./config/db/schema.js";
import type { Env } from "./env.ts";
import { DatabaseUserAttributes, initializeLucia } from "./utils/lucia.js";

type Variables = {
	db: Database;
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
		// @ts-ignore
		Lucia: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: UserTable;
	}
}
