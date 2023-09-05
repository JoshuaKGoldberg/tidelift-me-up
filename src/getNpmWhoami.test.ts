import { describe, expect, it, vi } from "vitest";

import { getNpmWhoami } from "./getNpmWhoami.js";

const mockNpmWhoami = vi.fn();

vi.mock("npm-whoami", () => ({
	get default() {
		return mockNpmWhoami;
	},
}));

describe("getNpmWhoami", () => {
	it("returns the result when npmWhoami calls its callback with a result", async () => {
		const username = "abc123";

		mockNpmWhoami.mockImplementation(
			(callback: (error: Error | null, username: null | string) => void) => {
				callback(null, username);
			},
		);

		const result = await getNpmWhoami();

		expect(result).toBe(username);
	});

	it("returns undefined when npmWhoami calls its callback with an error", async () => {
		mockNpmWhoami.mockImplementation(
			(callback: (error: Error | null) => void) => {
				callback(new Error("Oh no!"));
			},
		);

		const result = await getNpmWhoami();

		expect(result).toBe(undefined);
	});
});
