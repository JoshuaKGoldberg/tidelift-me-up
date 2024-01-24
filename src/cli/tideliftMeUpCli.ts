import { parseArgs } from "node:util";

import { assertValidOwnership } from "../assertValidOwnership.js";
import { getNpmWhoami } from "../getNpmWhoami.js";
import { parseOwnership } from "../parseOwnership.js";
import { jsonReporter } from "../reporters/jsonReporter.js";
import { textReporter } from "../reporters/textReporter.js";
import { tideliftMeUp } from "../tideliftMeUp.js";
import { PackageStatus } from "../types.js";
import { argsOptions } from "./argsOptions.js";
import { logHelp } from "./logHelp.js";

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
		status !== "lifted"
	) {
		throw new Error(
			`--status must be "all", "available", or "lifted", not ${status}.`,
		);
	}

	const username = usernameRaw ?? (await getNpmWhoami());
	if (!username) {
		throw new Error(
			"Either log in to npm or provide a username with --username.",
		);
	}

	const packageEstimates = await tideliftMeUp({
		ownership,
		since,
		status: status as PackageStatus,
		username,
	});

	reporters[reporter](packageEstimates);
}
