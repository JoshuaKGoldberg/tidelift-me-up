import chalk from "chalk";
import { parseStandardArgv } from "parse-standard-args";
import { z } from "zod";

import { getNpmWhoami } from "../getNpmWhoami.js";
import { parseOwnership } from "../parseOwnership.js";
import { jsonReporter } from "../reporters/jsonReporter.js";
import { textReporter } from "../reporters/textReporter.js";
import { tideliftMeUp, TideliftMeUpError } from "../tideliftMeUp.js";
import { packageOwnerships, packageStatuses } from "./choices.js";

const reporters = {
	json: jsonReporter,
	text: textReporter,
};

function formatChoices(choices: readonly string[], quote: string, or = "or") {
	const quoted = choices.map((choice) => `${quote}${choice}${quote}`);
	return `${quoted.slice(0, -1).join(", ")}, ${or} ${quoted[quoted.length - 1]}`;
}

const settings = {
	description: "Checks if your npm packages are eligible for Tidelift funding.",
	name: "tidelift-me-up",
	options: z.object({
		ownership: z
			.array(z.string())
			.transform(parseOwnership)
			.pipe(
				z.array(
					z.enum(packageOwnerships, {
						error: (issue) =>
							`Expected ${formatChoices(packageOwnerships, '"')}, received ${JSON.stringify(issue.input)}.`,
					}),
				),
			)
			.optional()
			.describe(
				`Any filters user packages must match one of based on username: ${formatChoices(packageOwnerships, "'", "and/or")}.`,
			)
			.meta({
				defaultDescription: "author and publisher",
				placeholder: "author|maintainer|publisher",
			}),
		reporter: z
			.enum(["json", "text"])
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
		status: z
			.enum(packageStatuses)
			.optional()
			.describe(
				`If provided, a filter on package lifting status: ${formatChoices(packageStatuses, "'")}.`,
			)
			.meta({ defaultDescription: "all" }),
		username: z
			.string()
			.optional()
			.describe("The npm username to search for packages owned by.")
			.meta({ defaultDescription: "result of npm whoami" }),
	}),
};

export async function tideliftMeUpCli(args: string[]) {
	const parsed = parseStandardArgv(args, settings);

	if (parsed.type === "error") {
		console.error(chalk.red(parsed.text));
		process.exitCode = 1;
		return;
	}

	if (parsed.type !== "values") {
		console.log(parsed.text);
		return;
	}

	const { ownership, reporter, since, status } = parsed.values;

	const username = parsed.values.username ?? (await getNpmWhoami());
	if (!username) {
		console.error(
			chalk.red("Either log in to npm or provide a username with --username."),
		);
		process.exitCode = 1;
		return;
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
			console.error(chalk.red(error.message));
		} else {
			console.error(chalk.red(`Unexpected error occurred:`), error);
		}

		process.exitCode = 1;
	}
}
