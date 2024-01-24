import { npmUsernameToPackages } from "npm-username-to-packages";

import { createStatusFilter } from "./createStatusFilter.js";
import { createUserPackagesFilter } from "./createUserPackagesFilter.js";
import { getNpmWhoami } from "./getNpmWhoami.js";
import { getPackageEstimates } from "./getPackageEstimates.js";
import { EstimatedPackage, PackageOwnership, PackageStatus } from "./types.js";

export interface TideliftMeUpSettings {
	ownership?: PackageOwnership[];
	since?: Date | number | string;
	status?: PackageStatus;
	username?: string;
}

export async function tideliftMeUp({
	ownership = ["author", "publisher"],
	since = getTwoYearsAgo(),
	status = "all",
	username,
}: TideliftMeUpSettings = {}): Promise<EstimatedPackage[]> {
	username ??= await getNpmWhoami();
	if (!username) {
		throw new Error("Either log in to npm or provide a `username`.");
	}

	const allUserPackages = await npmUsernameToPackages(username);

	const relevantUserPackages = allUserPackages.filter(
		createUserPackagesFilter({ ownership, since: new Date(since), username }),
	);
	const userPackagesByName = Object.fromEntries(
		relevantUserPackages.map((userPackage) => [userPackage.name, userPackage]),
	);

	const packageEstimates = await getPackageEstimates(
		relevantUserPackages.map((userPackage) => userPackage.name),
	);

	return packageEstimates
		.filter(createStatusFilter(status))
		.map((packageEstimate) => ({
			...packageEstimate,
			data: userPackagesByName[packageEstimate.name],
		}));
}

function getTwoYearsAgo() {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 2);
	return date;
}
