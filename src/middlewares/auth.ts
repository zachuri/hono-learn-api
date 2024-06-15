import type { Context } from "hono";
import { env } from "hono/adapter";
import type { User } from "lucia";
import { verifyRequestOrigin } from "lucia";

import { DatabaseUserAttributes } from "@/config/lucia";
import { Environment } from "@/types/bindings";

export const AuthMiddleware = async (
	c: Context<Environment>,
	next: () => Promise<void>
) => {
	if (c.req.path.startsWith("/auth")) {
		return next();
	}
	const lucia = c.get("lucia");

	const originHeader = c.req.header("Origin") ?? c.req.header("origin");
	const hostHeader = c.req.header("Host") ?? c.req.header("X-Forwarded-Host");
	if (
		(!originHeader ||
			!hostHeader ||
			!verifyRequestOrigin(originHeader, [hostHeader, env(c).WEB_DOMAIN])) &&
		env(c).WORKER_ENV === "production" &&
		c.req.method !== "GET"
	) {
		return new Response(null, {
			status: 403,
		});
	}

	const authorizationHeader = c.req.header("Authorization");
	const bearerSessionId = lucia.readBearerToken(authorizationHeader ?? "");
	const sessionId = bearerSessionId;
	if (!sessionId) {
		return new Response("Unauthorized", { status: 401 });
	}
	const { session, user } = await lucia.validateSession(sessionId);
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}
	if (session?.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		c.header("Set-Cookie", sessionCookie.serialize());
	}
	c.set("user", user as User & DatabaseUserAttributes);
	c.set("session", session);
	await next();
};
// import { getConfig } from "@/config";
// import { Environment } from "@/types/bindings";
// import jwt, { JwtPayload } from "@tsndr/cloudflare-worker-jwt";
// import { MiddlewareHandler } from "hono";
// import httpStatus from "http-status";
// import { Permission, Role, roleRights } from "../config/roles";
// import { tokenTypes } from "../config/tokens";
// import { getUserById } from "../services/user.service";
// import { ApiError } from "../utils/ApiError";

// type PayloadType = JwtPayload & { type: string };

// const authenticate = async (jwtToken: string, secret: string) => {
// 	let authorized = false;
// 	let payload: PayloadType | undefined;
// 	try {
// 		authorized = await jwt.verify(jwtToken, secret);
// 		const decoded = jwt.decode<PayloadType>(jwtToken); // Specify the type for decoded payload
// 		payload = decoded.payload;
// 		authorized = authorized && payload?.type === tokenTypes.ACCESS;
// 	} catch (e) {}
// 	return { authorized, payload };
// };

// export const auth =
// 	(...requiredRights: Permission[]): MiddlewareHandler<Environment> =>
// 	async (c, next) => {
// 		const credentials = c.req.header("Authorization");
// 		const config = getConfig(c.env);
// 		if (!credentials) {
// 			throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
// 		}

// 		const parts = credentials.split(/\s+/);
// 		if (parts.length !== 2) {
// 			throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
// 		}

// 		const jwtToken = parts[1];
// 		const { authorized, payload } = await authenticate(
// 			jwtToken,
// 			config.jwt.secret
// 		);

// 		if (!authorized || !payload) {
// 			throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
// 		}

// 		if (requiredRights.length) {
// 			const userRights = roleRights[payload.role as Role];
// 			const hasRequiredRights = requiredRights.every(requiredRight =>
// 				(userRights as unknown as string[]).includes(requiredRight)
// 			);

// 			if (!hasRequiredRights && c.req.param("userId") !== payload.sub) {
// 				throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
// 			}
// 		}

// 		if (!payload.isEmailVerified) {
// 			const user = await getUserById(String(payload.sub), config["database"]);
// 			if (!user) {
// 				throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
// 			}
// 			const url = new URL(c.req.url);
// 			if (url.pathname !== "/v1/auth/send-verification-email") {
// 				throw new ApiError(httpStatus.FORBIDDEN, "Please verify your email");
// 			}
// 		}
// 		c.set("payload", payload);
// 		await next();
// 	};
