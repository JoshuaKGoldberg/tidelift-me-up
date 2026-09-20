import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createFakePackageData } from "../fakes.js";
import { textReporter } from "./textReporter.js";

describe("textReporter", () => {
	it("logs a package as already lifted when it is", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		textReporter([
			{
				data: createFakePackageData(),
				lifted: true,
				name: "abc123",
			},
		]);

		expect(logger).toHaveBeenCalledWith(
			chalk.gray(`✅ abc123 is already lifted.`),
		);
	});

	it("logs a package as needing subscribers when it is not yet lifted and has no estimate", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		textReporter([
			{
				data: createFakePackageData(),
				estimatedMoney: 0,
				lifted: false,
				name: "abc123",
			},
		]);

		expect(logger).toHaveBeenCalledWith(
			[
				chalk.yellow(`⏳ `),
				chalk.yellowBright("abc123"),
				` is not yet lifted, and needs subscribers before it can be estimated.`,
			].join(""),
		);
	});

	it("logs a package as liftable when it is not yet lifted", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);

		textReporter([
			{
				data: createFakePackageData(),
				estimatedMoney: 12.34,
				lifted: false,
				name: "abc123",
			},
		]);

		expect(logger).toHaveBeenCalledWith(
			[
				chalk.cyan(`👉 `),
				chalk.cyanBright("abc123"),
				` is not yet lifted, but is estimated for `,
				chalk.cyanBright(`$12.34/mo`),
				`.`,
			].join(""),
		);
	});
});
