import npmUserPackages from "npm-user-packages";

import { getPackageEstimates } from "./getPackageEstimates.js";

export interface TideliftMeUpSettings {
	username: string;
}

export async function tideliftMeUp({ username }: TideliftMeUpSettings) {
	const userPackages = await npmUserPackages(username);

	return await getPackageEstimates(
		userPackages.map((userPackage) => userPackage.name)
	);
}
