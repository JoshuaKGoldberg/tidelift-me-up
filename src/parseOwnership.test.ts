import { describe, expect, test } from "vitest";

import { parseOwnership } from "./parseOwnership.ts";

describe(parseOwnership, () => {
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
