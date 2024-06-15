import { errorHandler } from "@/middlewares/error";
import { defaultRoutes } from "@/routes";
import { Environment } from "@/types/bindings";
import { ApiError } from "@/utils/ApiError";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import httpStatus from "http-status";
import { initalizeDB } from "./config/db";
import { initializeLucia } from "./config/lucia";

const app = new Hono<Environment>();

app
	.use("*", sentry())
	.use("*", cors())
	.use("*", logger())
	.notFound(() => {
		throw new ApiError(httpStatus.NOT_FOUND, "Not found");
	})
	.onError(errorHandler)
	.use((c, next) => {
		initalizeDB(c);
		initializeLucia(c);
		return next();
	});

app.get("/", c => {
	return c.json("My First Hono API");
});

defaultRoutes.forEach(route => {
	app.route(`/api/${route.path}`, route.route);
});

export default app;
