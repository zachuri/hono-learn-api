import { Config } from '@/config';
import { getDBClient } from "@/config/db";
import { Product, products } from "@/models/product.model";

export const getAllProducts = async (
	databaseConfig: Config["database"]
): Promise<Product[]> => {
	const db = getDBClient(databaseConfig);
	return await db.select().from(products);
};
