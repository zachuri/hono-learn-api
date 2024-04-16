import { config } from "dotenv";
import { type Config } from "drizzle-kit";

config({
	path: ".dev.vars",
});

export default {
	schema: "./src/config/db/schema.ts", //separate the schemas
	driver: "pg",
	verbose: true,
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
	out: "./src/server/drizzle",
	// tablesFilter: ["t3-drzl_*"],
} satisfies Config;
