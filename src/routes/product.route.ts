import * as productController from "@/controller/product.controller";
import { Environment } from "@/types/bindings";
import { Hono } from "hono";

export const route = new Hono<Environment>();

route.get("/", productController.getAllProducts);
