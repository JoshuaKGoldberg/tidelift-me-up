import { describe, expect, it } from "vitest";

import { assertValidOwnership } from "./assertValidOwnership.ts";

describe(assertValidOwnership, () => {
	it("does not throw an error when ownership is undefined", () => {
		expect(() => {
			assertValidOwnership(undefined);
		}).not.toThrow();
	});

	it("does not throw an error when ownership contains valid ownership", () => {
		expect(() => {
			assertValidOwnership(["author"]);
		}).not.toThrow();
	});

	it("throws an error when ownership contains invalid ownership", () => {
		expect(() => {
			assertValidOwnership(["abc"]);
		}).toThrow(
			`Unknown --ownership: abc (must be one of: author, maintainer, publisher)`,
		);
	});
});
