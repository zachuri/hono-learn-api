import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const ALL_ROLES = ["user", "admin"] as const;
export const roleEnum = pgEnum("role", ALL_ROLES);

export const userTable = pgTable(
	"user",
	{
		id: text("id").notNull().primaryKey().$defaultFn(nanoid),
		name: text("name"),
		email: text("email").notNull(),
		isEmailVerified: timestamp("is_email_verified", { mode: "date" }),
		image: text("image"),
		role: roleEnum("role").notNull().default("user"),
		username: varchar("username", { length: 60 }),
		phoneNumber: varchar("phone_number", { length: 20 }),
		createdAt: timestamp("created_at", { mode: "string" })
			.notNull()
			.defaultNow(),
	},
	t => ({
		phoneNumberIdx: index("phone_number_idx").on(t.phoneNumber),
		emailIdx: index("email_idx").on(t.email),
	})
);

// export const users = pgTable(
// 	"user",
// 	{
// 		id: text("id").notNull().primaryKey().$defaultFn(nanoid),
// 		name: text("name"),
// 		email: text("email").notNull(),
// 		isEmailVerified: timestamp("is_email_verified", { mode: "date" }),
// 		image: text("image"),
// 		role: roleEnum("role").notNull().default("user"),
// 		password: varchar("password", { length: 510 }),
// 		username: varchar("username", { length: 60 }),
// 		phoneNumber: varchar("phone_number", { length: 20 }),
// 		created_at: timestamp("created_at", { mode: "string" })
// 			.notNull()
// 			.defaultNow(),
// 	},
// 	t => ({
// 		phoneNumberIdx: index("phone_number_idx").on(t.phoneNumber),
// 		emailIdx: index("email_idx").on(t.email),
// 	})
// );

export type UserTable = typeof userTable.$inferSelect;
