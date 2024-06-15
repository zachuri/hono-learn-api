DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"is_email_verified" timestamp,
	"image" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"password" varchar(510),
	"username" varchar(60),
	"phone_number" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"price" double precision
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "phone_number_idx" ON "user" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "user" USING btree ("email");