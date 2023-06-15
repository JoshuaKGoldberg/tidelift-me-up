import npmUserPackages from "npm-user-packages";

import { getPackageEstimates } from "./getPackageEstimates.js";

export interface TideliftMeUpSettings {
	since?: Date | number | string;
	username: string;
}

export async function tideliftMeUp({
	since = getTwoYearsAgo(),
	username,
}: TideliftMeUpSettings) {
	const sinceDate = new Date(since);
	const userPackages = (await npmUserPackages(username)).filter(
		(userPackage) => new Date(userPackage.date) >= sinceDate
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
