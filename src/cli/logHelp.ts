import { argsOptions } from "./argsOptions.js";

export function logHelp() {
	console.log(
		Object.entries(argsOptions)
			.map(([longOption, optionConfig]) => {
				let line = "";

				if ("short" in optionConfig) {
					line += `-${optionConfig.short}/`;
				}

				line += `--${longOption}`;
				line += ` ${optionConfig.description}`;

				return line;
			})
			.join("\n"),
	);
}
