import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { Config } from "../config";

export const getDBClient = (
	databaseConfig: Config["database"]
): NeonHttpDatabase => {
	const client = neon(databaseConfig.url);
	return drizzle(client);
};
