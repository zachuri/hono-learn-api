import { Config } from '@/config/config'
import { getDBClient } from '@/config/db/db'
import { products } from '@/config/db/schema';

export const getAllProducts = async (databaseConfig: Config['database']) => {
  const db = getDBClient(databaseConfig)
	const allProducts = await db.select().from(products);
	return allProducts;
}