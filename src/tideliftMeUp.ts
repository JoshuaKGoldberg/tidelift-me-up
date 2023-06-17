import npmUserPackages from "npm-user-packages";

import { createUserPackagesFilter } from "./createUserPackagesFilter.js";
import { getNpmWhoami } from "./getNpmWhoami.js";
import { getPackageEstimates } from "./getPackageEstimates.js";
import { PackageOwnershipForm } from "./packageOwnershipForms.js";

export interface TideliftMeUpSettings {
	ownership?: PackageOwnershipForm[];
	since?: Date | number | string;
	username?: string;
}

export async function tideliftMeUp({
	ownership = ["author", "publisher"],
	since = getTwoYearsAgo(),
	username,
}: TideliftMeUpSettings = {}) {
	username ??= await getNpmWhoami();
	if (!username) {
		throw new Error("Either log in to npm or provide a `username`.");
	}

	const userPackages = (await npmUserPackages(username)).filter(
		createUserPackagesFilter({ ownership, since: new Date(since), username })
	);

	return await getPackageEstimates(
		userPackages.map((userPackage) => userPackage.name)
	);
}

function getTwoYearsAgo() {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 2);
	return date;
}
