import { PackageEstimate } from "../types.js";

export function jsonReporter(packageEstimates: PackageEstimate[]) {
	console.log(JSON.stringify(packageEstimates));
}
