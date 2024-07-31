import { initializeDB } from "@/db";
import { ApiError } from "@/utils/ApiError";
import { AppContext } from "@/utils/context";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import httpStatus from "http-status";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error";
import { authRoute } from "./routes/auth";
import { tasksRoute } from "./routes/tasks";
import { userRoute } from "./routes/user";
import { initializeLucia } from "./utils/lucia";

const app = new Hono<AppContext>();

app
	.use("*", sentry())
	.use("*", cors())
	.use("*", logger())
	.notFound(() => {
		throw new ApiError(httpStatus.NOT_FOUND, "Not found");
	})
	.onError(errorHandler)
	.use((c, next) => {
		initializeDB(c);
		initializeLucia(c);
		return next();
	})
	.use(AuthMiddleware);

app.get("/", async c => {
	return c.json("My First Hono API");
});

const apiRoutes = app
	// .basePath("/api")
	.route("/tasks", tasksRoute)
	.route("/auth", authRoute)
	.route("/user", userRoute);

export type ApiRoutes = typeof apiRoutes;

export default app;
