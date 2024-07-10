import { initializeDB } from "@/db";
import { AuthMiddleware } from "@/middlewares/auth.middleware";
import { errorHandler } from "@/middlewares/error";
import { routes } from "@/routes";
import { ApiError } from "@/utils/ApiError";
import { AppContext } from "@/utils/context";
import { sentry } from "@hono/sentry";
import { config } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import httpStatus from "http-status";
import { initializeLucia } from "./utils/lucia";

const app = new Hono<AppContext>();

app
	.use("*", sentry())
	.use("*", cors())
	.use("*", logger())
	.notFound(() => {
		throw new ApiError(httpStatus.NOT_FOUND, "Not found");
	})
	.onError(errorHandler)	.use(AuthMiddleware)
	.use((c, next) => {
		initializeDB(c);
		initializeLucia(c);
		return next();
	})
	.get("/", c => {
		return c.json("My First Hono API");
	});

const apiVersion = process.env.API_VERSION ?? "v1";

routes.forEach(route => {
	app.route(`/api/${route.path}`, route.route);
});

export type AppType = typeof routes;
export default app;

// import { Hono } from "hono";
// import { env } from "hono/adapter";
// import { cors } from "hono/cors";
// import { logger } from "hono/logger";

// import { initalizeDB } from "@/db/index";
// import { AuthMiddleware } from "@/middlewares/auth.middleware";
// import authRoute from "@/routes/auth/index";
// import { UserController } from "@/routes/user/index";
// import type { AppContext } from "@/utils/context";
// import { initializeLucia } from "@/utils/lucia";

// const app = new Hono<AppContext>();

// app
// 	.use(logger())
// 	.use((c, next) => {
// 		const handler = cors({ origin: env(c).WEB_DOMAIN });
// 		return handler(c, next);
// 	})
// 	.use((c, next) => {
// 		initalizeDB(c);
// 		initializeLucia(c);
// 		return next();
// 	})
// 	.get("/health", c => {
// 		return c.json({ status: "ok" });
// 	})
// 	.use(AuthMiddleware);

// const routes = app.route("/auth", authRoute).route("/user", UserController);

// export type AppType = typeof routes;
// export default app;
