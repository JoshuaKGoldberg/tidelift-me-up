import { parseArgs } from "node:util";

import { assertValidOwnership } from "./assertValidOwnership.js";
import { getNpmWhoami } from "./getNpmWhoami.js";
import { jsonReporter } from "./reporters/jsonReporter.js";
import { textReporter } from "./reporters/textReporter.js";
import { tideliftMeUp } from "./tideliftMeUp.js";

const reporters = {
	json: jsonReporter,
	text: textReporter,
};

export async function tideliftMeUpCli(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			ownership: {
				multiple: true,
				type: "string",
			},
			reporter: { type: "string" },
			since: { type: "string" },
			username: { type: "string" },
		},
		tokens: true,
	});

	const {
		ownership,
		reporter: reporterRaw,
		since,
		username: usernameRaw,
	} = values;

	assertValidOwnership(ownership);

	const reporter = reporterRaw ?? "text";
	if (reporter !== "json" && reporter !== "text") {
		throw new Error(`--reporter must be "json" or "text", not ${reporter}.`);
	}

	const username = usernameRaw ?? (await getNpmWhoami());
	if (!username) {
		throw new Error(
			"Either log in to npm or provide a username with --username.",
		);
	}

	const packageEstimates = await tideliftMeUp({ ownership, since, username });

	reporters[reporter](packageEstimates);
}
