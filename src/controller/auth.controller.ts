import { getConfig } from "@/config";
import * as authService from "@/services/auth.service";
import * as tokenService from "@/services/token.service";
import { Environment } from "@/types/bindings";
import * as authValidation from "@/validations/auth.validation";
import { Handler } from "hono";
import { StatusCode } from 'hono/utils/http-status';
import httpStatus from 'http-status';

export const register: Handler<Environment> = async c => {
	const config = getConfig(c.env);
	const bodyParse = await c.req.json();
	const body = await authValidation.register.parseAsync(bodyParse);
	const user = await authService.register(body, config.database);
	const tokens = await tokenService.generateAuthTokens(user, config.jwt);
	return c.json({ user, tokens }, httpStatus.CREATED as StatusCode);
};
