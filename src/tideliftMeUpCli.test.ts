import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { tideliftMeUpCli } from "./tideliftMeUpCli.js";

const mockGetNpmWhoami = vi.fn();

vi.mock("./getNpmWhoami.js", () => ({
	get getNpmWhoami() {
		return mockGetNpmWhoami;
	},
}));

const mockTideliftMeUp = vi.fn();

vi.mock("./tideliftMeUp.js", () => ({
	get tideliftMeUp() {
		return mockTideliftMeUp;
	},
}));

describe("tideliftMeUpCli", () => {
	it("throws an error when --reporter is provided and not json or text", async () => {
		mockGetNpmWhoami.mockResolvedValue(undefined);

		const reporter = "invalid";
		await expect(() =>
			tideliftMeUpCli(["--reporter", reporter])
		).rejects.toEqual(
			new Error(`--reporter must be "json" or "text", not ${reporter}.`)
		);
	});

	it("throws an error when --username isn't provided and getNpmWhoami returns undefined", async () => {
		mockGetNpmWhoami.mockResolvedValue(undefined);

		await expect(() => tideliftMeUpCli([])).rejects.toEqual(
			new Error("Either log in to npm or provide a username with --username.")
		);
	});

	it("logs packages for a username when --username is provided", async () => {
		const username = "abc123";

		mockTideliftMeUp.mockResolvedValue([]);

		await tideliftMeUpCli(["--username", username]);

		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
	});

	it("logs packages for a username when --username is not provided and the user is logged in", async () => {
		const username = "abc123";

		mockGetNpmWhoami.mockResolvedValue(username);
		mockTideliftMeUp.mockResolvedValue([]);

		await tideliftMeUpCli([]);

		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
	});
});
