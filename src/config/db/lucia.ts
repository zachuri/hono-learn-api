import { AppContext } from "@/context";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { InferInsertModel } from "drizzle-orm";
import { Context } from "hono";
import { env } from "hono/adapter";
import { Lucia } from "lucia";
import { sessionTable, UserTable, userTable } from "./schema";

export const initializeLucia = (c: Context<AppContext>) => {
	let lucia = c.get("lucia");

	if (lucia) {
		return lucia;
	}

	const adapter = new DrizzlePostgreSQLAdapter(
		c.env.DB,
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
				isEmailVerified: attributes.isEmailVerified,
				image: attributes.image,
			};
		},
	});
	c.set("lucia", lucia);
	return lucia;
};

export type DatabaseUserAttributes = InferInsertModel<typeof userTable>;


declare module "lucia" {
	interface Register {
		Lucia: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: UserTable;
	}
}