import { describe, expect, it } from "vitest";

import { createStatusFilter } from "./createStatusFilter.js";

describe("createStatusFilter", () => {
	describe.each([
		["all", true, true, false],
		["available", false, true, false],
		["lifted", true, false, false],
		["needs-subscribers", false, false, true],
	] as const)(
		"when status is %s",
		(status, lifted, available, needsSubscribers) => {
			it(`returns ${lifted.toString()} when lifted is true`, () => {
				const filter = createStatusFilter(status);

				const actual = filter({ lifted: true, name: "" });

				expect(actual).toBe(lifted);
			});

			it(`returns ${available.toString()} when lifted is false and there is an estimate`, () => {
				const filter = createStatusFilter(status);

				const actual = filter({ estimatedMoney: 10, lifted: false, name: "" });

				expect(actual).toBe(available);
			});

			it(`returns ${needsSubscribers.toString()} when lifted is false and there is no estimate`, () => {
				const filter = createStatusFilter(status);

				const actual = filter({ estimatedMoney: 0, lifted: false, name: "" });

				expect(actual).toBe(needsSubscribers);
			});
		},
	);
});
