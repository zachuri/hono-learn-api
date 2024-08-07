import { Google } from "arctic";
import type { Context } from "hono";
import { env } from "hono/adapter";
import { generateId } from "lucia";

import { oauthAccountTable } from "@/db/table/oauth.account";
import { userTable } from "@/db/table/users";
import type { AppContext } from "@/utils/context";
import type { DatabaseUserAttributes } from "@/utils/lucia";

const googleClient = (c: Context<AppContext>) =>
	new Google(
		env(c).GOOGLE_CLIENT_ID,
		env(c).GOOGLE_CLIENT_SECRET,
		`${env(c).API_DOMAIN}/auth/google/callback`
	);

export const getGoogleAuthorizationUrl = async ({
	c,
	state,
	codeVerifier,
}: {
	c: Context<AppContext>;
	state: string;
	codeVerifier: string;
}) => {
	const google = googleClient(c);
	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["profile", "email"],
	});
	return url.toString();
};

export const createGoogleSession = async ({
	c,
	idToken,
	codeVerifier,
	sessionToken,
}: {
	c: Context<AppContext>;
	idToken: string;
	codeVerifier: string;
	sessionToken?: string;
}) => {
	const google = googleClient(c);

	const tokens = await google.validateAuthorizationCode(idToken, codeVerifier);
	const response = await fetch(
		"https://openidconnect.googleapis.com/v1/userinfo",
		{
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		}
	);
	const user: {
		sub: string;
		name: string;
		email: string;
		email_verified: boolean;
		picture: string;
	} = await response.json();
	const existingAccount = await c.get("db").query.oauthAccountTable.findFirst({
		where: (account, { eq }) => eq(account.providerUserId, user.sub.toString()),
	});
	let existingUser: DatabaseUserAttributes | null = null;
	if (sessionToken) {
		const sessionUser = await c.get("lucia").validateSession(sessionToken);
		if (sessionUser.user) {
			existingUser = sessionUser.user as DatabaseUserAttributes;
		}
	} else {
		const response = await c.get("db").query.userTable.findFirst({
			where: (u, { eq }) => eq(u.email, user.email),
		});
		if (response) {
			existingUser = response;
		}
	}
	if (existingUser?.emailVerified && user.email_verified && !existingAccount) {
		await c.get("db").insert(oauthAccountTable).values({
			providerUserId: user.sub,
			provider: "google",
			userId: existingUser.id,
		});
		const session = await c.get("lucia").createSession(existingUser.id, {});
		return session;
	}

	if (existingAccount) {
		const session = await c
			.get("lucia")
			.createSession(existingAccount.userId, {});
		return session;
	} else {
		const userId = generateId(15);
		let username = user.name;
		const existingUsername = await c.get("db").query.userTable.findFirst({
			where: (u, { eq }) => eq(u.username, username),
		});
		if (existingUsername) {
			username = `${username}-${generateId(5)}`;
		}
		await c
			.get("db")
			.insert(userTable)
			.values({
				id: userId,
				username,
				email: user.email,
				emailVerified: user.email_verified ? 1 : 0,
				profilePictureUrl: user.picture,
			});
		await c.get("db").insert(oauthAccountTable).values({
			providerUserId: user.sub,
			provider: "google",
			userId,
		});
		const session = await c.get("lucia").createSession(userId, {});
		return session;
	}
};
