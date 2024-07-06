import { AppContext } from "@/context";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { InferInsertModel } from "drizzle-orm";
import { Context } from "hono";
import { env } from "hono/adapter";
import { Lucia } from "lucia";
import { sessionTable, userTable } from "./db/schema";

// @ts-ignore
export const initializeLucia = (c: Context<AppContext>) => {
	let lucia = c.get("lucia");

	if (lucia) {
		return lucia;
	}

	const adapter = new DrizzlePostgreSQLAdapter(
		c.get("db"),
		sessionTable,
		userTable
	);

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
				emailVerified: attributes.emailVerified,
				image: attributes.image,
			};
		},
	});
	c.set("lucia", lucia);
	return lucia;
};

export type DatabaseUserAttributes = InferInsertModel<typeof userTable>;
