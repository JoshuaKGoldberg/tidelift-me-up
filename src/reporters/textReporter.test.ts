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
				estimatedMoney: 12.34,
				lifted: true,
				name: "abc123",
			},
		]);

		expect(logger).toHaveBeenCalledWith(
			chalk.gray(`✅ abc123 is already lifted for $12.34/mo.`),
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
