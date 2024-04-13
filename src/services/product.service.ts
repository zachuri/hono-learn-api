import { Config } from '@/config/config'
import { getDBClient } from '@/config/db/db'
import { products } from '@/config/db/schema';
import { Product } from '@/models/product.model';

export const getAllProducts = async (databaseConfig: Config['database']): Promise<Product[]> => {
  const db = getDBClient(databaseConfig)
	const allProducts = await db.select().from(products);
	return allProducts;
}