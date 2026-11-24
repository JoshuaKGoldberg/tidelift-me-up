import chalk from "chalk";
import { parseArgs } from "node:util";

import { assertValidOwnership } from "../assertValidOwnership.ts";
import { getNpmWhoami } from "../getNpmWhoami.ts";
import { parseOwnership } from "../parseOwnership.ts";
import { jsonReporter } from "../reporters/jsonReporter.ts";
import { textReporter } from "../reporters/textReporter.ts";
import { tideliftMeUp, TideliftMeUpError } from "../tideliftMeUp.ts";
import { PackageStatus } from "../types.ts";
import { argsOptions } from "./argsOptions.ts";
import { logHelp } from "./logHelp.ts";

const reporters = {
	json: jsonReporter,
	text: textReporter,
};

export async function tideliftMeUpCli(args: string[]) {
	const { values } = parseArgs({
		args,
		options: argsOptions,
		tokens: true,
	});

	if (values.help) {
		logHelp();
		return;
	}

	const {
		reporter: reporterRaw,
		since,
		status,
		username: usernameRaw,
	} = values;

	const ownership = parseOwnership(values.ownership);

	assertValidOwnership(ownership);

	const reporter = reporterRaw ?? "text";
	if (reporter !== "json" && reporter !== "text") {
		throw new Error(`--reporter must be "json" or "text", not ${reporter}.`);
	}

	if (
		status &&
		status !== "all" &&
		status !== "available" &&
		status !== "lifted" &&
		status !== "needs-subscribers"
	) {
		throw new Error(
			`--status must be "all", "available", "lifted", or "needs-subscribers", not ${status}.`,
		);
	}

	const username = usernameRaw ?? (await getNpmWhoami());
	if (!username) {
		throw new Error(
			"Either log in to npm or provide a username with --username.",
		);
	}

	try {
		const packageEstimates = await tideliftMeUp({
			ownership,
			since,
			status: status as PackageStatus,
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
