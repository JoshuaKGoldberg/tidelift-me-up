import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createFakePackageData } from "../fakes.js";
import { TideliftMeUpError } from "../tideliftMeUp.js";
import { tideliftMeUpCli } from "./tideliftMeUpCli.js";

const mockGetNpmWhoami = vi.fn();

vi.mock("../getNpmWhoami.js", () => ({
	get getNpmWhoami() {
		return mockGetNpmWhoami;
	},
}));

const mockTideliftMeUp = vi.fn();

vi.mock("../tideliftMeUp.js", async () => {
	const actual = await vi.importActual("../tideliftMeUp.js");
	return {
		get tideliftMeUp() {
			return mockTideliftMeUp;
		},
		TideliftMeUpError: actual.TideliftMeUpError,
	};
});

const mockLogHelp = vi.fn();

vi.mock("./logHelp.js", () => ({
	get logHelp() {
		return mockLogHelp;
	},
}));

describe("tideliftMeUpCli", () => {
	it("logs help when args include --help", async () => {
		await tideliftMeUpCli(["--help"]);

		expect(mockLogHelp).toHaveBeenCalled();
		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).not.toHaveBeenCalled();
	});

	it("throws an error when --reporter is provided and not json or text", async () => {
		mockGetNpmWhoami.mockResolvedValue(undefined);

		const reporter = "invalid";
		await expect(() =>
			tideliftMeUpCli(["--reporter", reporter]),
		).rejects.toEqual(
			new Error(`--reporter must be "json" or "text", not ${reporter}.`),
		);
	});

	it("throws an error when --status is provided and not all, available, or lifted", async () => {
		mockGetNpmWhoami.mockResolvedValue(undefined);

		const reporter = "invalid";
		await expect(() => tideliftMeUpCli(["--status", reporter])).rejects.toEqual(
			new Error(
				`--status must be "all", "available", or "lifted", not ${reporter}.`,
			),
		);
	});

	it("throws an error when --username isn't provided and getNpmWhoami returns undefined", async () => {
		mockGetNpmWhoami.mockResolvedValue(undefined);

		await expect(() => tideliftMeUpCli([])).rejects.toEqual(
			new Error("Either log in to npm or provide a username with --username."),
		);
	});

	it("logs packages when a valid --username is provided and user has packages", async () => {
		const username = "user123";

		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		mockTideliftMeUp.mockResolvedValue([
			{
				data: createFakePackageData(),
				lifted: true,
				name: "package1",
			},
		]);

		await tideliftMeUpCli(["--username", username]);

		expect(mockLogHelp).not.toHaveBeenCalled();
		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});

		expect(logger).toHaveBeenCalledWith(
			chalk.gray(`✅ package1 is already lifted.`),
		);
	});

	it("logs message when an invalid --username is provided", async () => {
		const username = "#JI*#@%OjSL";

		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		mockTideliftMeUp.mockImplementation(() => {
			throw new TideliftMeUpError(
				`No packages found for npm username: ${username}.`,
			);
		});

		await tideliftMeUpCli(["--username", username]);

		expect(mockLogHelp).not.toHaveBeenCalled();
		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
		expect(logger).toHaveBeenCalledWith(
			chalk.red(`No packages found for npm username: ${username}.`),
		);

		logger.mockRestore();
	});

	it("logs message when valid --username is provided and user has no packages", async () => {
		const username = "abc123";

		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		mockTideliftMeUp.mockImplementation(() => {
			throw new TideliftMeUpError(
				`No packages found for npm username: ${username}.`,
			);
		});

		await tideliftMeUpCli(["--username", username]);

		expect(mockLogHelp).not.toHaveBeenCalled();
		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
		expect(logger).toHaveBeenCalledWith(
			chalk.red(`No packages found for npm username: ${username}.`),
		);

		logger.mockRestore();
	});

	it("logs message when --username is not provided, user is logged in and user has no packages", async () => {
		const username = "abc123";

		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		mockGetNpmWhoami.mockResolvedValue(username);
		mockTideliftMeUp.mockImplementation(() => {
			throw new TideliftMeUpError(
				`No packages found for npm username: ${username}.`,
			);
		});

		await tideliftMeUpCli([]);

		expect(mockLogHelp).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
		expect(logger).toHaveBeenCalledWith(
			chalk.red(`No packages found for npm username: ${username}.`),
		);

		logger.mockRestore();
	});

	it("logs error message for unexpected errors", async () => {
		const username = "abc123";

		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		mockTideliftMeUp.mockImplementation(() => {
			throw new Error(`Error: some unexpected error`);
		});

		await tideliftMeUpCli(["--username", username]);

		expect(mockLogHelp).not.toHaveBeenCalled();
		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
		expect(logger).toHaveBeenCalledWith(
			chalk.red(`Unexpected error occurred:`),
			new Error(`Error: some unexpected error`),
		);

		logger.mockRestore();
	});
});
