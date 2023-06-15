import {
	PackageOwnershipForm,
	packageOwnershipForms,
} from "./packageOwnershipForms.js";

export function assertValidOwnership(
	ownership: string[] | undefined
): asserts ownership is PackageOwnershipForm[] | undefined {
	if (ownership) {
		for (const ownershipForm of ownership) {
			if (!["author", "maintainer", "publisher"].includes(ownershipForm)) {
				throw new Error(
					`Unknown --ownership: ${ownershipForm} (must be one of: ${packageOwnershipForms.join(
						", "
					)})`
				);
			}
		}
	}
}
