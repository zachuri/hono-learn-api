import authRoute from "@/routes/auth/index";

export const routes = [
	{
    apiVersion: process.env.API_VERSION,
		path: "/auth",
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
