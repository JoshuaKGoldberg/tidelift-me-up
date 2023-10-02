import { PackageData } from "./getNpmUserPackages.js";

export interface EstimatedPackage {
	data: PackageData;
	estimatedMoney: number;
	lifted: boolean;
	name: string;
}

export type PackageOwnership = "author" | "maintainer" | "publisher";
