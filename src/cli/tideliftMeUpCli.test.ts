import chalk from "chalk";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

const username = "abc123";

const fakePackage = {
	data: createFakePackageData(),
	lifted: true,
	name: "package1",
};

describe("tideliftMeUpCli", () => {
	let mockError: ReturnType<typeof vi.spyOn>;
	let mockLog: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		mockError = vi.spyOn(console, "error").mockImplementation(() => undefined);
		mockLog = vi.spyOn(console, "log").mockImplementation(() => undefined);
		mockTideliftMeUp.mockResolvedValue([fakePackage]);
	});

	afterEach(() => {
		process.exitCode = undefined;
		vi.restoreAllMocks();
	});

	it("logs help when args include --help", async () => {
		await tideliftMeUpCli(["--help"]);

		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).not.toHaveBeenCalled();
		expect(mockError).not.toHaveBeenCalled();
		expect(process.exitCode).toBeUndefined();
		expect(mockLog.mock.calls).toMatchInlineSnapshot(`
		[
		  [
		    "Usage: tidelift-me-up [options]

		Checks if your npm packages are eligible for Tidelift funding.

		Options:
		      --ownership <author|maintainer|publisher>          Any filters user packages must match one of based on username: 'author', 'maintainer', and/or 'publisher'. (default: author and publisher, repeatable)
		      --reporter <json|text>                             Either 'json' to output a raw JSON string, or 'text' for human-readable output. (default: text)
		      --since <date>                                     A date that packages need to have been updated since to be considered. (default: 2 years ago)
		      --status <all|available|lifted|needs-subscribers>  If provided, a filter on package lifting status: 'all', 'available', 'lifted', or 'needs-subscribers'. (default: all)
		      --username <string>                                The npm username to search for packages owned by. (default: result of npm whoami)
		  -h, --help                                             Show this help message",
		  ],
		]
	`);
	});

	it("logs the same help when args include -h", async () => {
		await tideliftMeUpCli(["--help"]);
		const helpCalls = [...mockLog.mock.calls];
		mockLog.mockClear();

		await tideliftMeUpCli(["-h"]);

		expect(mockLog.mock.calls).toEqual(helpCalls);
		expect(mockTideliftMeUp).not.toHaveBeenCalled();
	});

	it("passes no settings other than username when no flags are provided", async () => {
		mockGetNpmWhoami.mockResolvedValue(username);

		await tideliftMeUpCli([]);

		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			ownership: undefined,
			since: undefined,
			status: undefined,
			username,
		});
		expect(mockLog).toHaveBeenCalledWith(
			chalk.gray(`✅ package1 is already lifted.`),
		);
	});

	it("passes all flags to tideliftMeUp when they're provided", async () => {
		await tideliftMeUpCli([
			"--ownership",
			"maintainer",
			"--since",
			"2020",
			"--status",
			"needs-subscribers",
			"--username",
			username,
		]);

		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			ownership: ["maintainer"],
			since: "2020",
			status: "needs-subscribers",
			username,
		});
	});

	it.each([
		[["--ownership", "author"], ["author"]],
		[
			["--ownership", "author", "--ownership", "publisher"],
			["author", "publisher"],
		],
		[
			["--ownership", " author , maintainer ", "--ownership", "publisher"],
			["author", "maintainer", "publisher"],
		],
	])("parses --ownership from %j", async (args, ownership) => {
		await tideliftMeUpCli([...args, "--username", username]);

		expect(mockTideliftMeUp).toHaveBeenCalledWith(
			expect.objectContaining({ ownership }),
		);
	});

	it.each(["all", "available", "lifted", "needs-subscribers"])(
		"parses --status %s",
		async (status) => {
			await tideliftMeUpCli(["--status", status, "--username", username]);

			expect(mockTideliftMeUp).toHaveBeenCalledWith(
				expect.objectContaining({ status }),
			);
		},
	);

	it("uses the json reporter when --reporter is json", async () => {
		await tideliftMeUpCli(["--reporter", "json", "--username", username]);

		expect(mockLog).toHaveBeenCalledWith(JSON.stringify([fakePackage]));
	});

	it("uses the text reporter when --reporter is text", async () => {
		await tideliftMeUpCli(["--reporter", "text", "--username", username]);

		expect(mockLog).toHaveBeenCalledWith(
			chalk.gray(`✅ package1 is already lifted.`),
		);
	});

	it.each([
		[
			["--reporter", "invalid"],
			`--reporter: Expected "json" or "text", received "invalid".`,
		],
		[
			["--status", "invalid"],
			`--status: Expected "all", "available", "lifted", or "needs-subscribers", received "invalid".`,
		],
		[
			["--ownership", "invalid"],
			`--ownership[0]: Expected "author", "maintainer", or "publisher", received "invalid".`,
		],
		[
			["--ownership", "author,invalid"],
			`--ownership[1]: Expected "author", "maintainer", or "publisher", received "invalid".`,
		],
		[["--reporter"], `--reporter requires a value.`],
		[
			["--reporters", username],
			`Unknown flag: --reporters (did you mean --reporter?)`,
		],
		[["extra"], `Unexpected argument: extra`],
	])("logs a friendly error for %j", async (args, message) => {
		await tideliftMeUpCli(args);

		expect(mockError).toHaveBeenCalledWith(
			chalk.red(`${message}\nRun 'tidelift-me-up --help' for usage.`),
		);
		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
	});

	it("throws an error when --username isn't provided and getNpmWhoami returns undefined", async () => {
		mockGetNpmWhoami.mockResolvedValue(undefined);

		await expect(() => tideliftMeUpCli([])).rejects.toEqual(
			new Error("Either log in to npm or provide a username with --username."),
		);
		expect(mockTideliftMeUp).not.toHaveBeenCalled();
	});

	it("logs message when an invalid --username is provided", async () => {
		const username = "#JI*#@%OjSL";

		mockTideliftMeUp.mockImplementation(() => {
			throw new TideliftMeUpError(
				`No packages found for npm username: ${username}.`,
			);
		});

		await tideliftMeUpCli(["--username", username]);

		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
		expect(mockLog).toHaveBeenCalledWith(
			chalk.red(`No packages found for npm username: ${username}.`),
		);
		expect(process.exitCode).toBe(1);
	});

	it("logs message when valid --username is provided and user has no packages", async () => {
		mockTideliftMeUp.mockImplementation(() => {
			throw new TideliftMeUpError(
				`No packages found for npm username: ${username}.`,
			);
		});

		await tideliftMeUpCli(["--username", username]);

		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
		expect(mockLog).toHaveBeenCalledWith(
			chalk.red(`No packages found for npm username: ${username}.`),
		);
		expect(process.exitCode).toBe(1);
	});

	it("logs message when --username is not provided, user is logged in and user has no packages", async () => {
		mockGetNpmWhoami.mockResolvedValue(username);
		mockTideliftMeUp.mockImplementation(() => {
			throw new TideliftMeUpError(
				`No packages found for npm username: ${username}.`,
			);
		});

		await tideliftMeUpCli([]);

		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
		expect(mockLog).toHaveBeenCalledWith(
			chalk.red(`No packages found for npm username: ${username}.`),
		);
		expect(process.exitCode).toBe(1);
	});

	it("logs error message for unexpected errors", async () => {
		mockTideliftMeUp.mockImplementation(() => {
			throw new Error(`Error: some unexpected error`);
		});

		await tideliftMeUpCli(["--username", username]);

		expect(mockGetNpmWhoami).not.toHaveBeenCalled();
		expect(mockTideliftMeUp).toHaveBeenCalledWith({
			username,
		});
		expect(mockLog).toHaveBeenCalledWith(
			chalk.red(`Unexpected error occurred:`),
			new Error(`Error: some unexpected error`),
		);
		expect(process.exitCode).toBe(1);
	});
});
