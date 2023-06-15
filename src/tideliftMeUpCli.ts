import chalk from "chalk";
import { parseArgs } from "node:util";

import { assertValidOwnership } from "./assertValidOwnership.js";
import { getNpmWhoami } from "./getNpmWhoami.js";
import { tideliftMeUp } from "./tideliftMeUp.js";

export async function tideliftMeUpCli(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			ownership: {
				multiple: true,
				type: "string",
			},
			since: { type: "string" },
			username: { type: "string" },
		},
		tokens: true,
	});

	const { ownership, since, username = await getNpmWhoami() } = values;

	assertValidOwnership(ownership);

	if (!username) {
		throw new Error(
			"Either log in to npm or provide a username with --username."
		);
	}

	const packageEstimates = await tideliftMeUp({ ownership, since, username });

	for (const packageEstimate of packageEstimates) {
		const currency = new Intl.NumberFormat("en-US", {
			currency: "USD",
			style: "currency",
		}).format(packageEstimate.estimatedMoney);

		if (packageEstimate.lifted) {
			console.log(
				chalk.gray(
					`✅ ${packageEstimate.name} is already lifted for ${currency}/mo.`
				)
			);
		} else {
			console.log(
				[
					chalk.cyan(`👉 `),
					chalk.cyanBright(packageEstimate.name),
					` is not yet lifted, but is estimated for `,
					chalk.cyanBright(`${currency}/mo`),
					`.`,
				].join("")
			);
		}
	}
}
