// import { AppContext } from "@/context";
// import * as authController from "@/controller/auth.controller";
// import { Hono } from "hono";

// export const route = new Hono<AppContext>();

// route.post("/:provider", authController.provider);

// const twoMinutes = 120;
// const oneRequest = 1;
// route.post("/refresh-tokens", authController.refreshTokens);
// route.post("/register", authController.register);
// route.post('/forgot-password', authController.forgotPassword)
// route.post('/reset-password', authController.resetPassword)
// route.post(
//   '/send-verification-email',
//   auth(),
//   rateLimit(twoMinutes, oneRequest),
//   authController.sendVerificationEmail
// )
// route.post('/verify-email', authController.verifyEmail)
// route.get('/authorisations', auth(), authController.getAuthorisations)
