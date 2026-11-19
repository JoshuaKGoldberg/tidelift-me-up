import { PackageData } from "npm-username-to-packages";

export type EstimatedPackage =
	| EstimatedPackageLifted
	| EstimatedPackageNotLifted;

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

export const packageOwnerships = ["author", "maintainer", "publisher"] as const;

export type PackageOwnership = (typeof packageOwnerships)[number];

export const packageStatuses = [
	"all",
	"available",
	"lifted",
	"needs-subscribers",
] as const;

export type PackageStatus = (typeof packageStatuses)[number];
