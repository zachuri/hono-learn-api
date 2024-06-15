import { getConfig } from "@/config";
// import * as productService from "@/services/product.service";
import { Environment } from "@/types/bindings";
import { Handler } from "hono";

export const getAllProducts: Handler<Environment> = async c => {
	const config = getConfig(c.env);
	// const products = await productService.getAllProducts(config.database);

	// return c.json(products, httpStatus.OK as StatusCode);
};
