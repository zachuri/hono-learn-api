import { initializeDB } from "@/db";
import authRoute from "@/routes/auth/index";
// import { routes } from "@/routes";
import { ApiError } from "@/utils/ApiError";
import { AppContext } from "@/utils/context";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import httpStatus from "http-status";
import { errorHandler } from "./middlewares/error";
import { tasksRoute } from "./routes/tasks";
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
	// .use(AuthMiddleware)
	.use((c, next) => {
		initializeDB(c);
		initializeLucia(c);
		return next();
	});

app.get("/", async c => {
	try {
		const db = c.get("db");

		console.log("DB CALLED INSERT", db);
		const data = await db.query.taskTable.findMany();
		console.log(data);
		return c.json("My First Hono API");
	} catch (error) {
		console.log(error);
	}
});

const apiRoutes = app
	// .basePath("/api")
	.route("/tasks", tasksRoute)
	.route("/auth", authRoute);
export type ApiRoutes = typeof apiRoutes;

export default app;
