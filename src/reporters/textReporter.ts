import chalk from "chalk";

import { EstimatedPackage } from "../types.js";

export function textReporter(estimatedPackages: EstimatedPackage[]) {
	for (const estimatedPackage of estimatedPackages) {
		const currency = new Intl.NumberFormat("en-US", {
			currency: "USD",
			style: "currency",
		}).format(estimatedPackage.estimatedMoney);

		if (estimatedPackage.lifted) {
			console.log(
				chalk.gray(
					`✅ ${estimatedPackage.name} is already lifted for ${currency}/mo.`,
				),
			);
		} else {
			console.log(
				[
					chalk.cyan(`👉 `),
					chalk.cyanBright(estimatedPackage.name),
					` is not yet lifted, but is estimated for `,
					chalk.cyanBright(`${currency}/mo`),
					`.`,
				].join(""),
			);
		}
	}
}
