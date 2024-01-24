import { PackageEstimate } from "./getPackageEstimates.js";
import { PackageStatus } from "./types.js";

export type PackageFilter = (packageEstimate: PackageEstimate) => boolean;

export function createStatusFilter(status: PackageStatus): PackageFilter {
	switch (status) {
		case "all":
			return () => true;

		case "available":
			return (packageEstimate) => !packageEstimate.lifted;

		case "lifted":
			return (packageEstimate) => packageEstimate.lifted;
	}
}
