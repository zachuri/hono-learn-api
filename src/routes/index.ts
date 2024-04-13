import { route as productRoute } from "./product.route";

const base_path = "v1";

export const defaultRoutes = [
	{
		path: `${base_path}/products`,
		route: productRoute,
	},
];
