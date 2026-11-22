import { EstimatedPackage } from "../types.ts";

export function jsonReporter(estimatedPackages: EstimatedPackage[]) {
	console.log(JSON.stringify(estimatedPackages));
}
