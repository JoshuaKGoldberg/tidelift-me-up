import { describe, expect, it, vi } from "vitest";

import { tideliftMeUp } from "./tideliftMeUp.js";

const mockNpmUserPackages = vi.fn();

vi.mock("npm-user-packages", () => ({
	get default() {
		return mockNpmUserPackages;
	},
}));

const mockGetPackageEstimates = vi.fn();

vi.mock("./getPackageEstimates.js", () => ({
	get getPackageEstimates() {
		return mockGetPackageEstimates;
	},
}));

describe("tideliftMeUp", () => {
	it("defaults since to two years ago when not provided", async () => {
		const packageNameNew = "package-name-new";
		const packageNameOld = "package-name-old";

		mockNpmUserPackages.mockResolvedValue([
			{ date: new Date(), name: packageNameNew },
			{ name: new Date(Date.now() - 1000), packageNameOld },
		]);

		await tideliftMeUp({ username: "abc123" });

		expect(mockGetPackageEstimates).toHaveBeenCalledWith([packageNameNew]);
	});

	it("filters to packages to since when provided", async () => {
		const packageNameNew = "package-name-new";
		const packageNameOld = "package-name-old";

		mockNpmUserPackages.mockResolvedValue([
			{ date: new Date(Date.now()), name: packageNameNew },
			{ date: new Date(Date.now() - 10_000), name: packageNameOld },
		]);

		await tideliftMeUp({
			since: new Date(Date.now() - 20_000),
			username: "abc123",
		});

		expect(mockGetPackageEstimates).toHaveBeenCalledWith([
			packageNameNew,
			packageNameOld,
		]);
	});
});
