import { Environment } from "@/types/bindings";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Context } from "hono";
import { env } from "hono/adapter";
import { Lucia } from "lucia";
import { users, UserTable } from "./db/schema";
import { sessions } from "./db/table/session";

// Import the Lucia type with the UserTable generic parameter
import { InferInsertModel } from "drizzle-orm";
import type { Lucia as LuciaType } from "lucia";

export const initializeLucia = (
	c: Context<Environment>
): LuciaType<UserTable> => {
	let lucia = c.get("lucia") as LuciaType<UserTable> | undefined;
	if (lucia) {
		return lucia;
	}

	const adapter = new DrizzlePostgreSQLAdapter(c.get("db"), sessions, users);

	lucia = new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: env(c).WORKER_ENV !== "development",
			},
		},
		getUserAttributes: attributes => {
			return {
				id: attributes,
				username: attributes.username,
				email: attributes.email,
				isEmailVerified: attributes.isEmailVerified,
				image: attributes.image,
			};
		},
	});

	c.set("lucia", lucia);
	return lucia;
};

export type DatabaseUserAttributes = InferInsertModel<typeof users>;
