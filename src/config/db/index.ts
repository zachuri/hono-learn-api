import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { Config } from '..';
import * as schema from '@/config/db/schema'
import { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';

export const getDBClient = (
	databaseConfig: Config["database"]
)  => {
	const client = neon(databaseConfig.url);
	return drizzle(client, {schema});
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
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TablesWithRelations,
  TablesWithRelations[TableName],
  {
    columns: Columns;
    with: With;
  }
>;
