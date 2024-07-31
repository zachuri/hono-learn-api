import { config } from "dotenv";

config({
	path: ".dev.vars",
});

// export default {
// 	schema: "./src/config/db/schema.ts", //separate the schemas
// 	driver: "pg",
// 	verbose: true,
// 	dbCredentials: {
// 		connectionString: process.env.DATABASE_URL!,
// 	},
// 	out: "./src/server/drizzle",
// 	// tablesFilter: ["t3-drzl_*"],
// } satisfies Config;

import { defineConfig } from "drizzle-kit";
export default defineConfig({
	dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
	schema: "./src/db/schema.ts", //separate the schemas
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
