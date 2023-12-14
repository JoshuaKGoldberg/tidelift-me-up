import { describe, expect, it, vi } from "vitest";

import { getNpmUserPackages } from "./getNpmUserPackages.js";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

describe("getNpmUserPackages", () => {
	it("returns results when they are not paginated", async () => {
		const packageNames = ["abc", "def", "ghi"];

		mockFetch.mockResolvedValue({
			json: () => ({
				objects: packageNames.map((packageName) => ({ package: packageName })),
				total: 2,
			}),
		});

		const actual = await getNpmUserPackages("maintainer");

		expect(actual).toEqual(packageNames);
	});

	it("returns results when they are paginated", async () => {
		const total = 501;
		const packageNames = new Array(total).fill(undefined).map((_, i) => `${i}`);

		let calls = 0;
		mockFetch.mockImplementation(() => {
			const start = calls * 250;
			const end = (calls + 1) * 250;
			calls += 1;
			return {
				json: () => ({
					objects: packageNames.slice(start, end).map((responseName) => ({
						package: responseName,
					})),
					total,
				}),
			};
		});

		const actual = await getNpmUserPackages("maintainer");

		expect(actual).toEqual(packageNames);
	});
});
