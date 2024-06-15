import * as schema from "@/config/db/schema";
import { Environment } from "@/types/bindings";
import { neon } from "@neondatabase/serverless";
import {
	BuildQueryResult,
	DBQueryConfig,
	ExtractTablesWithRelations,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Context } from "hono";
import { Config } from "..";

export const initalizeDB = (c: Context<Environment>) => {
	const client = neon(c.env.DATABASE_URL);
	return drizzle(client, { schema });
};

export const getDBClient = (databaseConfig: Config["database"]) => {
	const client = neon(databaseConfig.url);
	return drizzle(client, { schema });
};

type Schema = typeof schema;
type TablesWithRelations = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TablesWithRelations> =
	DBQueryConfig<
		"one" | "many",
		boolean,
		TablesWithRelations,
		TablesWithRelations[TableName]
	>["with"];

export type IncludeColumns<TableName extends keyof TablesWithRelations> =
	DBQueryConfig<
		"one" | "many",
		boolean,
		TablesWithRelations,
		TablesWithRelations[TableName]
	>["columns"];

export type InferQueryModel<
	TableName extends keyof TablesWithRelations,
	Columns extends IncludeColumns<TableName> | undefined = undefined,
	With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
	TablesWithRelations,
	TablesWithRelations[TableName],
	{
		columns: Columns;
		with: With;
	}
>;

export type Database = NeonDatabase<typeof schema>;
