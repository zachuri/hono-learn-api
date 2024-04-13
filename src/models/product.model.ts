import { products } from '@/config/db/schema';

export type Product = typeof products.$inferSelect;