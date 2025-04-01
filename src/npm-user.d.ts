declare module "npm-user" {
	export default function npmUser(username: string): Promise<{
		avatar?: string;
		email?: string;
		github?: string;
		name?: string;
		twitter?: string;
	}>;
}
