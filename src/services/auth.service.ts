import { Config } from "@/config";
import { getDBClient } from "@/config/db";
import { users } from "@/config/db/schema";
import { Role } from "@/config/roles";
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import { Register } from "@/validations/auth.validation";
import { CreateUser } from "@/validations/user.validation";
import { eq } from "drizzle-orm";
import httpStatus from "http-status";

import { tokenTypes } from "@/config/tokens";
import { TokenResponse } from "@/models/token.model";
import * as tokenService from "@/services/token.service";
import * as userService from "@/services/user.service";

export const register = async (
	body: Register,
	databaseConfig: Config["database"]
): Promise<User> => {
	// * Body takes in email, password, name
	// * Set default values
	const registerBody = {
		...body,
		role: "user" as Role,
		is_email_verified: null,
		image: "",
		username: "",
		phone_number: "",
	};

	const newUser = await createUser(registerBody, databaseConfig);

	return newUser;
};

export const loginUserWithEmailAndPassword = async (
	email: string,
	password: string,
	databaseConfig: Config["database"]
): Promise<User> => {
	const user = await userService.getUserByEmail(email, databaseConfig);
	// If password is null then the user must login with a social account
	if (user && !user.password) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"Please login with your social account"
		);
	}
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
	}
	return user;
};

export const refreshAuth = async (
	refreshToken: string,
	config: Config
): Promise<TokenResponse> => {
	try {
		const refreshTokenDoc = await tokenService.verifyToken(
			refreshToken,
			tokenTypes.REFRESH,
			config.jwt.secret
		);
		const user = await userService.getUserById(
			String(refreshTokenDoc.sub),
			config.database
		);
		if (!user) {
			throw new Error();
		}
		return tokenService.generateAuthTokens(user, config.jwt);
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
	}
};

export const createUser = async (
	userBody: CreateUser,
	databaseConfig: Config["database"]
): Promise<User> => {
	const db = getDBClient(databaseConfig);
	let result;
	try {
		result = await db
			.insert(users)
			.values(userBody)
			.returning({ userId: users.id })
			.then(res => res[0] ?? null);
	} catch (error) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
	}
	const user = (await getUserById(result.userId, databaseConfig)) as User;
	return user;
};

export const getUserById = async (
	id: string,
	databaseConfig: Config["database"]
): Promise<User | undefined> => {
	const db = getDBClient(databaseConfig);

	const user = await db.query.users.findFirst({
		where: eq(users.id, id),
	});

	return user ? new User(user) : undefined;
};
