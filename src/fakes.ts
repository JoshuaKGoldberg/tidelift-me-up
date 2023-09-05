import { PackageData } from "npm-user-packages";

export const createFakePackageData = (overrides?: Partial<PackageData>) =>
	({
		author: {
			name: "",
		},
		date: "",
		description: "",
		keywords: [],
		links: {
			npm: "",
		},
		maintainers: [],
		name: "",
		publisher: {
			email: "",
			username: "",
		},
		scope: "",
		version: "",
		...overrides,
	}) satisfies PackageData;
