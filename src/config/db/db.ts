import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Config } from "../config";

export const getDBClient = (databaseConfig: Config["database"]) => {
	const client = neon(databaseConfig.url);
	const dbClient = drizzle(client);
	return dbClient;
};
