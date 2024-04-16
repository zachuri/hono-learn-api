import { eq } from 'drizzle-orm';
import { Config } from "@/config";
import { getDBClient } from "@/config/db";
import { User } from "@/models/user.model";
import { users } from '@/config/db/schema';

export const getUserByEmail = async (
	email: string,
	databaseConfig: Config["database"]
): Promise<User | undefined> => {
	const db = getDBClient(databaseConfig);

	const user = await db.query.users.findFirst({
    where: (eq(users.email, email))
  })

	return user ? new User(user) : undefined;
};
