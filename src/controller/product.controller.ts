import { Environment } from "@/types/bindings";
import { Handler } from "hono";

export const register: Handler<Environment> = async c => {
	// const config = getConfig(c.env)
	return c.json({ text: "got products" });
};
