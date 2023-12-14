import { describe, expect, it, test } from "vitest";

import { parseOwnership } from "./parseOwnership.js";

describe("parseOwnership", () => {
	test.each([
		[undefined, undefined],
		[[], []],
		[["abc"], ["abc"]],
		[
			["abc,def", "ghi"],
			["abc", "def", "ghi"],
		],
		[
			[" abc , def ", "ghi"],
			["abc", "def", "ghi"],
		],
	])("%j", (input, expected) => {
		expect(parseOwnership(input)).toEqual(expected);
	});
});
