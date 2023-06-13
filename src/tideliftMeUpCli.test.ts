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
		expect(mockTideliftMeUp).toHaveBeenCalledWith({ username });
	});

	it("logs packages for a username when --username is not provided and the user is logged in", async () => {
		const username = "abc123";

		mockGetNpmWhoami.mockResolvedValue(username);
		mockTideliftMeUp.mockResolvedValue([]);

		await tideliftMeUpCli([]);

		expect(mockTideliftMeUp).toHaveBeenCalledWith({ username });
	});

	it("logs a package as already lifted when it is", async () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		mockTideliftMeUp.mockResolvedValue([
			{
				estimatedMoney: "12.34",
				lifted: true,
				name: "abc123",
			},
		]);

		await tideliftMeUpCli(["--username", "abc123"]);

		expect(logger).toHaveBeenCalledWith(
			chalk.gray(`✅ abc123 is already lifted for $12.34/mo.`)
		);
	});

	it("logs a package as liftable when it is not yet lifted", async () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		mockTideliftMeUp.mockResolvedValue([
			{
				estimatedMoney: "12.34",
				lifted: false,
				name: "abc123",
			},
		]);

		await tideliftMeUpCli(["--username", "abc123"]);

		expect(logger).toHaveBeenCalledWith(
			[
				chalk.cyan(`👉 `),
				chalk.cyanBright("abc123"),
				` is not yet lifted, but is estimated for `,
				chalk.cyanBright(`$12.34/mo`),
				`.`,
			].join("")
		);
	});
});
