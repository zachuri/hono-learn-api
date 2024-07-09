import authRoute from "@/routes/auth/index";

const base_path = "v1";

export const defaultRoutes = [
	{
		path: `${base_path}/auth`,
		route: authRoute,
	},
	// {
	// 	path: `${base_path}/products`,
	// 	route: productRoute,
	// },
	// {
	//   path: `/${base_path}/users`,
	//   route: userRoute
	// }
];
