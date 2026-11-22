import { describe, expect, it, vi } from "vitest";

import { createFakePackageData } from "../fakes.ts";
import { EstimatedPackage } from "../types.ts";
import { jsonReporter } from "./jsonReporter.ts";

describe(jsonReporter, () => {
	it("directly logs from JSON.stringify", () => {
		const logger = vi.spyOn(console, "log").mockImplementation(() => undefined);
		const estimatedPackages = [
			{
				data: createFakePackageData(),
				estimatedMoney: 12.34,
				lifted: false,
				name: "abc123",
			},
		] satisfies EstimatedPackage[];

		jsonReporter(estimatedPackages);

		expect(logger).toHaveBeenCalledWith(JSON.stringify(estimatedPackages));
	});
});
