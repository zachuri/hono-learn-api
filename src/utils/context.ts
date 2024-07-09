import type { Lucia, Session, User } from "lucia";

import { Database } from "../db/index.js";
import { UserTable } from "../db/schema.js";
import type { Env } from "./env.ts";
import { DatabaseUserAttributes, initializeLucia } from "./lucia.js";

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
