import chalk from "chalk";

import { EstimatedPackage } from "../types.js";

export function textReporter(estimatedPackages: EstimatedPackage[]) {
	const formatter = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});

	for (const estimatedPackage of estimatedPackages) {
		if (estimatedPackage.lifted) {
			console.log(chalk.gray(`✅ ${estimatedPackage.name} is already lifted.`));
			continue;
		}

		const currency = formatter.format(estimatedPackage.estimatedMoney);

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
