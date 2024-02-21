import { PackageData } from "npm-username-to-packages";

export interface EstimatedPackageBase {
	data: PackageData;
	name: string;
}

export interface EstimatedPackageLifted extends EstimatedPackageBase {
	lifted: true;
}

export interface EstimatedPackageNotLifted extends EstimatedPackageBase {
	estimatedMoney: number;
	lifted: false;
}

export type EstimatedPackage =
	| EstimatedPackageLifted
	| EstimatedPackageNotLifted;

export type PackageOwnership = "author" | "maintainer" | "publisher";

export type PackageStatus = "all" | "available" | "lifted";
