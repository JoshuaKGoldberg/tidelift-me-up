import { ParseArgsConfig } from "node:util";

export type DescribedParseArgsConfig = Record<
	string,
	DescribedParseArgsOptionConfig
>;

export interface DescribedParseArgsOptionConfig extends ParseArgsOptionConfig {
	description: string;
}

export type ParseArgsOptionConfig = ParseArgsOptionsConfig[string];

export type ParseArgsOptionsConfig = NonNullable<ParseArgsConfig["options"]>;

export const argsOptions = {
	help: {
		description: "Print this help text.",
		short: "h",
		type: "boolean",
	},
	ownership: {
		description:
			"(default: ['author', 'publisher']) Any filters user packages must match one of based on username: 'author', 'maintainer', and/or 'publisher'.",
		multiple: true,
		type: "string",
	},
	reporter: {
		description:
			"(default: 'text') Either 'json' to output a raw JSON string, or 'text' for human-readable output.",
		type: "string",
	},
	since: {
		description:
			"(default: 2 years ago) A date that packages need to have been updated since to be considered.",
		type: "string",
	},
	status: {
		description:
			"(default: 'all') If provided, a filter on package lifting status: 'all', 'available', or 'lifted'.",
		type: "string",
	},
	username: {
		description:
			"(default: result of npm whoami) The npm username to search for packages owned by.",
		type: "string",
	},
} satisfies DescribedParseArgsConfig;
