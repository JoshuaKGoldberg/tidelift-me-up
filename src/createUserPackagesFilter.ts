import { PackageData } from "./getNpmUserPackages.js";
import { PackageOwnership } from "./types.js";

export interface FilterSettings {
	ownership: PackageOwnership[];
	since: Date;
	username: string;
}

export type UserPackageData = Pick<
	PackageData,
	"author" | "date" | "maintainers" | "publisher"
>;

export function createUserPackagesFilter({
	ownership,
	since,
	username,
}: FilterSettings) {
	return (userPackage: UserPackageData) => {
		if (new Date(userPackage.date) < since) {
			return false;
		}

		if (
			!ownership.some((ownershipForm) => {
				switch (ownershipForm) {
					case "author":
						return userPackage.author?.username === username;

					case "maintainer":
						return userPackage.maintainers.some(
							(maintainer) => maintainer.username === username,
						);

					case "publisher":
						return userPackage.publisher.username === username;
				}
			})
		) {
			return false;
		}

		return true;
	};
}
