import { AuthController } from '@/controller/auth/auth.controller';
// import { route as authRoute } from "@/routes/auth.route";

const base_path = "v1";

export const defaultRoutes = [
	// {
	// 	path: `${base_path}/products`,
	// 	route: productRoute,
	// },
	{
		path: `${base_path}/auth`,
		route: AuthController,
	},
	// {
	//   path: `/${base_path}/users`,
	//   route: userRoute
	// }
];
