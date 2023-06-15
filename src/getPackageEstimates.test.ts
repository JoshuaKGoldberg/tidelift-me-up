import { describe, expect, it, vi } from "vitest";

import { getPackageEstimates } from "./getPackageEstimates.js";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

describe("getPackageEstimates", () => {
	it("maps estimates data", async () => {
		mockFetch.mockResolvedValue({
			json: () => [
				{
					estimated_money: 12.34,
					lifted: false,
					name: "abc",
				},
				{
					estimated_money: 56.78,
					lifted: true,
					name: "def",
				},
			],
		});

		const result = await getPackageEstimates(["abc", "def"]);

		expect(result).toEqual([
			{
				estimatedMoney: 12.34,
				lifted: false,
				name: "abc",
			},
			{
				estimatedMoney: 56.78,
				lifted: true,
				name: "def",
			},
		]);
	});
});
