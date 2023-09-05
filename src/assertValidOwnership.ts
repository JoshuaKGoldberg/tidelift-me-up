import { PackageOwnership } from "./types.js";

const packageOwnerships = ["author", "maintainer", "publisher"];

export function assertValidOwnership(
	ownerships: string[] | undefined,
): asserts ownerships is PackageOwnership[] | undefined {
	if (ownerships) {
		for (const ownership of ownerships) {
			if (!packageOwnerships.includes(ownership)) {
				throw new Error(
					`Unknown --ownership: ${ownership} (must be one of: ${packageOwnerships.join(
						", ",
					)})`,
				);
			}
		}
	}
}
