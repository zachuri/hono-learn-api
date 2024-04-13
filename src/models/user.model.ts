import { UserTable } from "@/config/db/table/users";
import { BaseModel } from "./base.model";

export class User extends BaseModel implements UserTable {
	id: string;
	name: string | null;
	email: string;
	is_email_verified: Date | null;
	image: string | null;

	role: "user" | "admin";

	password: string | null;
	username: string | null;
	phone_number: string | null;
	created_at: string;

	private_fields = ["password"];

	constructor(user: UserTable) {
		super();
		this.id = user.id;
		this.name = user.name || null;
		this.email = user.email;
		this.is_email_verified = user.is_email_verified;

		this.image = user.image || null;

		this.role = user.role;

		this.password = user.password;
		this.username = user.username || null;
		this.phone_number = user.phone_number;
		this.created_at = user.created_at;
	}

	isPasswordMatch = async (userPassword: string): Promise<boolean> => {
		if (!this.password) throw "No password connected to user";
		return await Bun.password.verify(userPassword, this.password);
	};

	canAccessPrivateFields(): boolean {
		return this.role === "admin";
	}
}
