import chalk from "chalk";
import { parseArgs } from "node:util";

import { getNpmWhoami } from "./getNpmWhoami.js";
import { tideliftMeUp } from "./tideliftMeUp.js";

export async function tideliftMeUpCli(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			username: { type: "string" },
		},
		tokens: true,
	});

	const { username = await getNpmWhoami() } = values;
	if (!username) {
		throw new Error(
			"Either log in to npm or provide a username with --username."
		);
	}

	const packageEstimates = await tideliftMeUp({ username });

	for (const packageEstimate of packageEstimates) {
		if (packageEstimate.lifted) {
			console.log(
				chalk.gray(
					`✅ ${packageEstimate.name} is already lifted for $${packageEstimate.estimatedMoney}/mo.`
				)
			);
		} else {
			console.log(
				[
					chalk.cyan(`👉 `),
					chalk.cyanBright(packageEstimate.name),
					` is not yet lifted, but is estimated for `,
					chalk.cyanBright(`$${packageEstimate.estimatedMoney}/mo`),
					`.`,
				].join("")
			);
		}
	}
}
