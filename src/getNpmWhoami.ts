import * as util from "node:util";
import npmWhoami from "npm-whoami";

export async function getNpmWhoami() {
	try {
		return await util.promisify(npmWhoami)();
	} catch {
		return undefined;
	}
}
