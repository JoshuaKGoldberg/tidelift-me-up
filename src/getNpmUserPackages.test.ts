import { describe, expect, it, vi } from "vitest";

import { getNpmUserPackages } from "./getNpmUserPackages.js";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

describe("getNpmUserPackages", () => {
	it("returns results when they are not paginated", async () => {
		const packageNames = ["abc", "def", "ghi"];

		mockFetch.mockResolvedValue({
			json: () => ({
				results: packageNames.map((packageName) => ({ package: packageName })),
				total: 2,
			}),
		});

		const actual = await getNpmUserPackages("maintainer");

		expect(actual).toEqual(packageNames);
	});

	it("returns results when they are paginated", async () => {
		const packageNames = new Array(602).fill(undefined).map((_, i) => `${i}`);

		mockFetch.mockResolvedValue({
			json: () => ({
				results: packageNames.map((responseName) => ({
					package: responseName,
				})),
				total: 2,
			}),
		});

		const actual = await getNpmUserPackages("maintainer");

		expect(actual).toEqual(packageNames);
	});
});
