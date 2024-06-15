import { getConfig } from "@/config";
import { initializeLucia } from "@/config/db/lucia";
import { Environment } from "@/types/bindings";
import { JwtPayload } from '@tsndr/cloudflare-worker-jwt';
import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import httpStatus from "http-status";
import { Permission } from "../config/roles";
import { ApiError } from "../utils/ApiError";


export const auth =
	(...requiredRights: Permission[]): MiddlewareHandler<Environment> =>
	async (c, next) => {
		const config = getConfig(c.env);
		const lucia = initializeLucia(config.database);

		const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

		if (!sessionId) {
			c.set("payload", null);
      c.set('')
			return next();
		}

		const credentials = c.req.header("Authorization");

		if (!credentials) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
		}

		const parts = credentials.split(/\s+/);
		if (parts.length !== 2) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
		}
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
