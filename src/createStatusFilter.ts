import { PackageEstimate } from "./getPackageEstimates.ts";
import { PackageStatus } from "./types.ts";

export type PackageFilter = (packageEstimate: PackageEstimate) => boolean;

export function createStatusFilter(status: PackageStatus): PackageFilter {
	switch (status) {
		case "all":
			return () => true;

		case "available":
			return (packageEstimate) =>
				!packageEstimate.lifted && packageEstimate.estimatedMoney > 0;

		case "lifted":
			return (packageEstimate) => packageEstimate.lifted;

		case "needs-subscribers":
			return (packageEstimate) =>
				!packageEstimate.lifted && packageEstimate.estimatedMoney === 0;
	}
}
