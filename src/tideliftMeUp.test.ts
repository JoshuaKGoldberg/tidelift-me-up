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

const { mockNpmUser } = vi.hoisted(() => {
	return { mockNpmUser: vi.fn() };
});

vi.mock("npm-user", () => {
	return { default: mockNpmUser };
});

describe("tideliftMeUp", () => {
	it("throws an error when --username isn't provided and getNpmWhoami returns undefined", async () => {
		mockGetNpmWhoami.mockResolvedValue(undefined);

		await expect(() => tideliftMeUp()).rejects.toEqual(
			new Error("Either log in to npm or provide a `username`."),
		);
	});

	it("throws an error when an invalid --username is provided", async () => {
		const username = "#JI*#@%OjSL";

		mockNpmUsernameToPackages.mockResolvedValue([]);
		mockGetNpmWhoami.mockRejectedValue(new Error("Should not be called."));
		mockNpmUser.mockRejectedValue(new TypeError("Username required"));

		await expect(() => tideliftMeUp({ username })).rejects.toThrowError(
			`Invalid npm username: ${username}.`,
		);
	});

	it("throws an error when user is logged in but has no packages", async () => {
		const username = "abc123";
		const npmUserData = {
			avatar: "",
			email: "",
			github: "",
			name: "",
			twitter: "",
		};

		mockNpmUsernameToPackages.mockResolvedValue([]);
		mockGetNpmWhoami.mockResolvedValue(username);
		mockNpmUser.mockResolvedValue(npmUserData);

		await expect(() => tideliftMeUp()).rejects.toThrowError(
			`No packages found for npm username: ${username}.`,
		);
	});

	it("throws an error when provided --username is valid but has no packages", async () => {
		const username = "abc123";
		const npmUserData = {
			avatar: "",
			email: "",
			github: "",
			name: "",
			twitter: "",
		};

		mockNpmUsernameToPackages.mockResolvedValue([]);
		mockGetNpmWhoami.mockRejectedValue(new Error("Should not be called."));
		mockNpmUser.mockResolvedValue(npmUserData);

		await expect(() => tideliftMeUp({ username })).rejects.toThrowError(
			`No packages found for npm username: ${username}.`,
		);
	});

	it("throws an error when provided --username is valid but doesn't exist", async () => {
		const username = "nonexistent-user";

		mockNpmUsernameToPackages.mockResolvedValue([]);
		mockGetNpmWhoami.mockRejectedValue(new Error("Should not be called."));
		mockNpmUser.mockRejectedValue(
			Object.assign(new Error(`User \`${username}\` could not be found`), {
				code: "ERR_NO_NPM_USER",
			}),
		);

		await expect(() => tideliftMeUp({ username })).rejects.toThrowError(
			`Npm user not found: ${username}.`,
		);
	});

	it("calls npmUserPackages with the npm name when the user is logged in and user has packages", async () => {
		const username = "abc123";

		mockNpmUsernameToPackages.mockResolvedValue([createFakePackageData()]);
		mockGetNpmWhoami.mockResolvedValue(username);

		await tideliftMeUp();

		expect(mockNpmUsernameToPackages).toHaveBeenCalledWith(username);
	});

	it("calls npmUserPackages with the provided username when it exists and user has packages", async () => {
		const username = "abc123";

		mockNpmUsernameToPackages.mockResolvedValue([createFakePackageData()]);
		mockGetNpmWhoami.mockRejectedValue(new Error("Should not be called."));

		await tideliftMeUp({ username });

		expect(mockNpmUsernameToPackages).toHaveBeenCalledWith(username);
	});
});
