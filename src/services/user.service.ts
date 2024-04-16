import { Config } from "@/config";
import { getDBClient } from "@/config/db";
import { users } from "@/config/db/schema";
import { User } from "@/models/user.model";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (
	email: string,
	databaseConfig: Config["database"]
): Promise<User | undefined> => {
	const db = getDBClient(databaseConfig);

	const user = await db.query.users.findFirst({
		where: eq(users.email, email),
	});

	return user ? new User(user) : undefined;
};

export const getUserById = async (
	id: string,
	databaseConfig: Config["database"]
): Promise<User | undefined> => {
	const db = getDBClient(databaseConfig);

	const user = await db.query.users.findFirst({
		where: eq(users.id, id),
	});

	return user ? new User(user) : undefined;
};
