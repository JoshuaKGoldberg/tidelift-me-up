import chalk from "chalk";
import { createCli } from "parse-standard-args";
import { z } from "zod";

import { getNpmWhoami } from "../getNpmWhoami.js";
import { parseOwnership } from "../parseOwnership.js";
import { jsonReporter } from "../reporters/jsonReporter.js";
import { textReporter } from "../reporters/textReporter.js";
import { tideliftMeUp, TideliftMeUpError } from "../tideliftMeUp.js";

const reporters = {
	json: jsonReporter,
	text: textReporter,
};

const cli = createCli({
	description: "Checks if your npm packages are eligible for Tidelift funding.",
	name: "tidelift-me-up",
	options: z.object({
		ownership: z
			.array(z.string())
			.transform(parseOwnership)
			.pipe(z.array(choice(["author", "maintainer", "publisher"])))
			.optional()
			.describe(
				"Any filters user packages must match one of based on username: 'author', 'maintainer', and/or 'publisher'.",
			)
			.meta({
				defaultDescription: "author and publisher",
				placeholder: "author|maintainer|publisher",
			}),
		reporter: choice(["json", "text"])
			.default("text")
			.describe(
				"Either 'json' to output a raw JSON string, or 'text' for human-readable output.",
			),
		since: z
			.string()
			.optional()
			.describe(
				"A date that packages need to have been updated since to be considered.",
			)
			.meta({ defaultDescription: "2 years ago", placeholder: "date" }),
		status: choice(["all", "available", "lifted", "needs-subscribers"])
			.optional()
			.describe(
				"If provided, a filter on package lifting status: 'all', 'available', 'lifted', or 'needs-subscribers'.",
			)
			.meta({ defaultDescription: "all" }),
		username: z
			.string()
			.optional()
			.describe("The npm username to search for packages owned by.")
			.meta({ defaultDescription: "result of npm whoami" }),
	}),
});

export async function tideliftMeUpCli(args: string[]) {
	const parsed = await cli.run(args, {
		error: (text) => {
			console.error(chalk.red(text));
		},
	});
	if (!parsed) {
		return;
	}

	const { ownership, reporter, since, status } = parsed.values;

	const username = parsed.values.username ?? (await getNpmWhoami());
	if (!username) {
		throw new Error(
			"Either log in to npm or provide a username with --username.",
		);
	}

	try {
		const packageEstimates = await tideliftMeUp({
			ownership,
			since,
			status,
			username,
		});

		reporters[reporter](packageEstimates);
	} catch (error) {
		if (error instanceof TideliftMeUpError) {
			console.log(chalk.red(error.message));
		} else {
			console.log(chalk.red(`Unexpected error occurred:`), error);
		}

		process.exitCode = 1;
	}
}

function choice<const Values extends readonly [string, ...string[]]>(
	values: Values,
) {
	const expected = new Intl.ListFormat("en", { type: "disjunction" }).format(
		values.map((value) => JSON.stringify(value)),
	);

	return z.enum(values, {
		error: (issue) =>
			`Expected ${expected}, received ${JSON.stringify(issue.input)}.`,
	});
}
