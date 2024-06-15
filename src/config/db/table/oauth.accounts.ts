import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const oauthAccount = pgTable(
	"oauth_account",
	{
		provider: text("provider").notNull(),
		providerUserId: text("provider_user_id").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	table => ({
		pk: primaryKey({ columns: [table.provider, table.providerUserId] }),
	})
);
