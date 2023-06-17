import { UserPackageData } from "./createUserPackagesFilter.js";

export const createFakePackageData = (overrides?: Partial<UserPackageData>) =>
	({
		author: { name: "" },
		date: new Date().toString(),
		maintainers: [],
		publisher: { email: "", username: "" },
		...overrides,
	} satisfies UserPackageData);
