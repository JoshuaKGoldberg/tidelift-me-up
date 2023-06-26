import { EstimatedPackage } from "../types.js";

export function jsonReporter(estimatedPackages: EstimatedPackage[]) {
	console.log(JSON.stringify(estimatedPackages));
}
