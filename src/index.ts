import { initializeDB } from "@/db";
// import { routes } from "@/routes";
import { ApiError } from "@/utils/ApiError";
import { AppContext } from "@/utils/context";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import httpStatus from "http-status";
import { tasksRoute } from './routes/tasks';
import { initializeLucia } from "./utils/lucia";

const app = new Hono<AppContext>();

app
	.use("*", sentry())
	.use("*", cors())
	.use("*", logger())
	.notFound(() => {
		throw new ApiError(httpStatus.NOT_FOUND, "Not found");
	})
	// .onError(errorHandler)
	// .use(AuthMiddleware)
	.use((c, next) => {
		initializeDB(c);
		initializeLucia(c);
		return next();
	})
	.get("/", c => {
		return c.json("My First Hono API");
	})
  .route("/api/tasks", tasksRoute)

export default app;
