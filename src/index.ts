import { errorHandler } from "@/middlewares/error";
import { defaultRoutes } from "@/routes";
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

app.use("*", sentry());
app.use("*", cors());
app.use("*", logger());
app.use((c, next) => {
	initalizeDB(c);
	initializeLucia(c);
	return next();
});

app.notFound(() => {
	throw new ApiError(httpStatus.NOT_FOUND, "Not found");
});

app.onError(errorHandler);

app.get("/", c => {
	return c.json("My First Hono API");
});

defaultRoutes.forEach(route => {
	app.route(`/api/${route.path}`, route.route);
});

export default app;
