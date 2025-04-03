import { describe, expect, it, vi } from "vitest";

import { createStatusFilter } from "./createStatusFilter.js";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

describe("createStatusFilter", () => {
	describe.each([
		["all", true, true],
		["available", false, true],
		["lifted", true, false],
	] as const)("when status is %s", (status, lifted, notLifted) => {
		it(`returns ${lifted.toString()} when lifted is true`, () => {
			const filter = createStatusFilter(status);

			const actual = filter({ lifted: true, name: "" });

			expect(actual).toBe(lifted);
		});

		it(`returns ${notLifted.toString()} when lifted is false`, () => {
			const filter = createStatusFilter(status);

			const actual = filter({ estimatedMoney: 10, lifted: false, name: "" });

			expect(actual).toBe(notLifted);
		});
	});
});
