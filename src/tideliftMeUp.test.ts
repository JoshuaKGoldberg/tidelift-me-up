import { describe, expect, it, vi } from "vitest";

import { createFakePackageData } from "./fakes.js";
import { tideliftMeUp } from "./tideliftMeUp.js";

const mockNpmUsernameToPackages = vi
	.fn()
	.mockResolvedValue([createFakePackageData()]);

vi.mock("npm-username-to-packages", () => ({
	get npmUsernameToPackages() {
		return mockNpmUsernameToPackages;
	},
}));

const mockGetNpmWhoami = vi.fn();

vi.mock("./getNpmWhoami.js", () => ({
	get getNpmWhoami() {
		return mockGetNpmWhoami;
	},
}));

vi.mock("./getPackageEstimates.js", () => ({
	getPackageEstimates: () => [],
}));

describe("tideliftMeUp", () => {
	it("throws an error when --username isn't provided and getNpmWhoami returns undefined", async () => {
		mockGetNpmWhoami.mockResolvedValue(undefined);

		await expect(() => tideliftMeUp()).rejects.toEqual(
			new Error("Either log in to npm or provide a `username`."),
		);
	});

	it("calls npmUserPackages with the npm name when the user is logged in", async () => {
		const username = "abc123";

		mockGetNpmWhoami.mockResolvedValue(username);

		await tideliftMeUp();

		expect(mockNpmUsernameToPackages).toHaveBeenCalledWith(username);
	});

	it("calls npmUserPackages with the provided username when it exists", async () => {
		const username = "abc123";

		mockNpmUsernameToPackages.mockResolvedValue([createFakePackageData()]);
		mockGetNpmWhoami.mockRejectedValue(new Error("Should not be called."));

		await tideliftMeUp({ username });

		expect(mockNpmUsernameToPackages).toHaveBeenCalledWith(username);
	});
});
