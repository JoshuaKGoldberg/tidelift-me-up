import { describe, expect, it, vi } from "vitest";

import { jsonReporter } from "./jsonReporter.js";

describe("jsonReporter", () => {
	it("directly logs from JSON.stringify", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);
		const packageEstimates = [
			{
				estimatedMoney: 12.34,
				lifted: false,
				name: "abc123",
			},
		];

		jsonReporter(packageEstimates);

		expect(logger).toHaveBeenCalledWith(JSON.stringify(packageEstimates));
	});
});
