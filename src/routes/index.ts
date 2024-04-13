import { route as authRoute } from "@/routes/auth.route";
import { route as productRoute } from "@/routes/product.route";

const base_path = "v1";

export const defaultRoutes = [
	{
		path: `${base_path}/products`,
		route: productRoute,
	},
	{
		path: `${base_path}/auth`,
		route: authRoute,
	},
	// {
	//   path: `/${base_path}/users`,
	//   route: userRoute
	// }
];
