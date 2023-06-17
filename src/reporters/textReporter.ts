import chalk from "chalk";

import { PackageEstimate } from "../types.js";

export function textReporter(packageEstimates: PackageEstimate[]) {
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
