import { PackageOwnership } from "./types.js";

const packageOwnerships = ["author", "maintainer", "publisher"];

export function assertValidOwnership(
	ownership: string[] | undefined,
): asserts ownership is PackageOwnership[] | undefined {
	if (ownership) {
		for (const value of ownership) {
			if (!packageOwnerships.includes(value)) {
				throw new Error(
					`Unknown --ownership: ${value} (must be one of: ${packageOwnerships.join(
						", ",
					)})`,
				);
			}
		}
	}
}
