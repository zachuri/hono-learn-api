import * as authController from "@/controller/auth.controller";
import { Environment } from "@/types/bindings";
import { Hono } from "hono";

export const route = new Hono<Environment>()

const twoMinutes = 120
const oneRequest = 1

route.get('/', c => {
  return c.json('hello')
})
route.post('/register', authController.register)
// route.post('/login', authController.login)
