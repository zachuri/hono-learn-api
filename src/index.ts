import { AuthMiddleware } from "@/middlewares/auth.middleware";
import { errorHandler } from "@/middlewares/error";
import { routes } from "@/routes";
import { ApiError } from "@/utils/ApiError";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import httpStatus from "http-status";
import { initalizeDB } from "./config/db";
import { initializeLucia } from "./config/lucia";
import { AppContext } from "./context";

const app = new Hono<AppContext>();

app
	.use("*", sentry())
	.use("*", cors())
	.use("*", logger())
	.notFound(() => {
		throw new ApiError(httpStatus.NOT_FOUND, "Not found");
	})
	.onError(errorHandler)
	.use(AuthMiddleware)
	.use((c, next) => {
		initalizeDB(c);
		initializeLucia(c);
		return next();
	})
	.get("/", c => {
		return c.json("My First Hono API");
	});

routes.forEach(route => {
	app.route(`/api/${route.path}`, route.route);
});

export type AppType = typeof routes;
export default app;
