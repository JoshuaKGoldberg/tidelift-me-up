import { PackageData } from "npm-username-to-packages";

export interface EstimatedPackage {
	data: PackageData;
	estimatedMoney: number;
	lifted: boolean;
	name: string;
}

export type PackageOwnership = "author" | "maintainer" | "publisher";

export type PackageStatus = "all" | "available" | "lifted";
