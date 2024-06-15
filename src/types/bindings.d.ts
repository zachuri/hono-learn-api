import { Database } from "@/config/db";
import { UserTable } from "@/config/db/schema";
import { DatabaseUserAttributes, initializeLucia } from "@/config/lucia";
import type { JwtPayload } from "@tsndr/cloudflare-worker-jwt";
import { Lucia, Session, User } from "lucia";
import type { Toucan } from "toucan-js";

export type Environment = {
	Bindings: {
		ENV: string;
		JWT_SECRET: string;
		JWT_ACCESS_EXPIRATION_MINUTES: number;
		JWT_REFRESH_EXPIRATION_DAYS: number;
		JWT_RESET_PASSWORD_EXPIRATION_MINUTES: number;
		JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: number;
		DATABASE_URL: string;
		DATABASE_NAME: string;
		DATABASE_USERNAME: string;
		DATABASE_PASSWORD: string;
		DATABASE_HOST: string;
		RATE_LIMITER: DurableObjectNamespace;
		SENTRY_DSN: string;
		AWS_ACCESS_KEY_ID: string;
		AWS_SECRET_ACCESS_KEY: string;
		AWS_REGION: string;
		EMAIL_SENDER: string;
		OAUTH_GITHUB_CLIENT_ID: string;
		OAUTH_GITHUB_CLIENT_SECRET: string;
		OAUTH_GOOGLE_CLIENT_ID: string;
		OAUTH_GOOGLE_CLIENT_SECRET: string;
		OAUTH_GOOGLE_REDIRECT_URL: string;
		OAUTH_DISCORD_CLIENT_ID: string;
		OAUTH_DISCORD_CLIENT_SECRET: string;
		OAUTH_DISCORD_REDIRECT_URL: string;
		OAUTH_SPOTIFY_CLIENT_ID: string;
		OAUTH_SPOTIFY_CLIENT_SECRET: string;
		OAUTH_SPOTIFY_REDIRECT_URL: string;
		OAUTH_FACEBOOK_CLIENT_ID: string;
		OAUTH_FACEBOOK_CLIENT_SECRET: string;
		OAUTH_FACEBOOK_REDIRECT_URL: string;
		OAUTH_APPLE_CLIENT_ID: string;
		OAUTH_APPLE_CLIENT_SECRET: string;
		OAUTH_APPLE_REDIRECT_URL: string;
	};
	Variables: {
		db: Database;
		user: (User & UserTable) | null;
		session: Session | null;
		lucia: Lucia<DatabaseUserAttributes>;
		payload: JwtPayload;
		sentry: Toucan;
	};
};
declare module "lucia" {
	interface Register {
		// Lucia: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: UserTable;
	}
}
