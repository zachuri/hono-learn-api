import { getConfig } from "@/config";
// import * as authService from "@/services/auth.service";
// import * as tokenService from "@/services/token.service";
import { Environment } from "@/types/bindings";
import * as authValidation from "@/validations/auth.validation";
import { Handler } from "hono";
import { StatusCode } from "hono/utils/http-status";
import httpStatus from "http-status";

export const register: Handler<Environment> = async c => {
	const config = getConfig(c.env);
	const bodyParse = await c.req.json();
	const body = await authValidation.register.parseAsync(bodyParse);
	// const user = await authService.register(body, config.database);
	// const tokens = await tokenService.generateAuthTokens(user, config.jwt);
	// return c.json({ user, tokens }, httpStatus.CREATED as StatusCode);
};

export const login: Handler<Environment> = async c => {
	const config = getConfig(c.env);
	const bodyParse = await c.req.json();
	const { email, password } = authValidation.login.parse(bodyParse);
	// const user = await authService.loginUserWithEmailAndPassword(
	// 	email,
	// 	password,
	// 	config.database
	// );
	// const tokens = await tokenService.generateAuthTokens(user, config.jwt);
	// return c.json({ user, tokens }, httpStatus.OK as StatusCode);
};

export const refreshTokens: Handler<Environment> = async c => {
	// const config = getConfig(c.env);
	// const bodyParse = await c.req.json();
	// const { refresh_token } = authValidation.refreshTokens.parse(bodyParse);
	// const tokens = await authService.refreshAuth(refresh_token, config);
	// return c.json({ ...tokens }, httpStatus.OK as StatusCode);
};

// export const sendVerificationEmail: Handler<Environment> = async c => {
// 	const config = getConfig(c.env);
// 	const payload = c.get("payload");
// 	const userId = String(payload.sub);
// 	// Don't let bad actors know if the email is registered by returning an error if the email
// 	// is already verified
// 	try {
// 		const user = await userService.getUserById(userId, config.database);
// 		if (!user || user.is_email_verified) {
// 			throw new Error();
// 		}
// 		const verifyEmailToken = await tokenService.generateVerifyEmailToken(
// 			user,
// 			config.jwt
// 		);
// 		await emailService.sendVerificationEmail(
// 			user.email,
// 			{ name: user.name || "", token: verifyEmailToken },
// 			config
// 		);
// 	} catch (err) {}
// 	c.status(httpStatus.NO_CONTENT as StatusCode);
// 	return c.body(null);
// };
