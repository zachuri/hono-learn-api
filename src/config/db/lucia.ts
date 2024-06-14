import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { getDBClient } from ".";
import { Config } from "..";
import { users, UserTable } from "./schema";
import { sessions } from "./table/session";

export const initializeLucia = (databaseConfig: Config["database"]) => {
	const db = getDBClient(databaseConfig);

	const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

	return new Lucia(adapter, {
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
};

declare module "lucia" {
	interface Register {
		Lucia: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: UserTable;
	}
}
