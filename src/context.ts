import type { Lucia, Session, User } from "lucia";

import { DatabaseUserAttributes } from "./config/db/lucia.js";
import type { Env } from "./env.ts";

type Variables = {
	db: string;
	user: (User & DatabaseUserAttributes) | null;
	session: Session | null;
	lucia: Lucia<DatabaseUserAttributes>;
};

export interface AppContext {
	Bindings: Env;
	Variables: Variables;
}
