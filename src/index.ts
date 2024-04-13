import { errorHandler } from "@/middlewares/error";
import { defaultRoutes } from "@/routes";
import { Environment } from "@/types/bindings";
import { ApiError } from "@/utils/ApiError";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import httpStatus from "http-status";

const app = new Hono<Environment>();

app.use("*", sentry());
app.use("*", cors());

app.notFound(() => {
	throw new ApiError(httpStatus.NOT_FOUND, "Not found");
});

app.onError(errorHandler);

app.get("/", c => {
	return c.text("Hello Hono!");
});

defaultRoutes.forEach(route => {
	app.route(`${route.path}`, route.route);
});

export default app;
