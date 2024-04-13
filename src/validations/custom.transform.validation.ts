export const hashPassword = async (value: string): Promise<string> => {
	const hashedPassword = await Bun.password.hash(value);
	return hashedPassword;
};
