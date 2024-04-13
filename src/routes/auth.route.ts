import * as authController from "@/controller/product.controller";
import { Environment } from "@/types/bindings";
import { Hono } from "hono";

export const route = new Hono<Environment>()

const twoMinutes = 120
const oneRequest = 1

route.post('/register', authController.register)
// route.post('/login', authController.login)
