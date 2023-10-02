import { createUserPackagesFilter } from "./createUserPackagesFilter.js";
import { getNpmUserPackages } from "./getNpmUserPackages.js";
import { getNpmWhoami } from "./getNpmWhoami.js";
import { getPackageEstimates } from "./getPackageEstimates.js";
import { EstimatedPackage, PackageOwnership } from "./types.js";

export interface TideliftMeUpSettings {
	ownership?: PackageOwnership[];
	since?: Date | number | string;
	username?: string;
}

export async function tideliftMeUp({
	ownership = ["author", "publisher"],
	since = getTwoYearsAgo(),
	username,
}: TideliftMeUpSettings = {}): Promise<EstimatedPackage[]> {
	username ??= await getNpmWhoami();
	if (!username) {
		throw new Error("Either log in to npm or provide a `username`.");
	}

	const userPackages = (await getNpmUserPackages(username)).filter(
		createUserPackagesFilter({ ownership, since: new Date(since), username }),
	);
	const userPackagesByName = Object.fromEntries(
		userPackages.map((userPackage) => [userPackage.name, userPackage]),
	);

	const packageEstimates = await getPackageEstimates(
		userPackages.map((userPackage) => userPackage.name),
	);

	return packageEstimates.map((packageEstimate) => ({
		...packageEstimate,
		data: userPackagesByName[packageEstimate.name],
	}));
}

function getTwoYearsAgo() {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 2);
	return date;
}
