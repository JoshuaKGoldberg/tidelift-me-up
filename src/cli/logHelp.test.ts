import { describe, expect, it, test, vi } from "vitest";

import { logHelp } from "./logHelp.js";

test("logHelp", () => {
	const mockLog = vi.fn();

	console.log = mockLog;

	logHelp();

	expect(mockLog.mock.calls).toMatchInlineSnapshot(`
		[
		  [
		    "-h/--help Print this help text.
		--ownership (default: ['author', 'publisher']) Any filters user packages must match one of based on username: 'author', 'maintainer', and/or 'publisher'.
		--reporter (default: 'text') Either 'json' to output a raw JSON string, or 'text' for human-readable output.
		--since (default: 2 years ago) A date that packages need to have been updated since to be considered.
		--username (default: result of npm whoami) The npm username to search for packages owned by.",
		  ],
		]
	`);
});
