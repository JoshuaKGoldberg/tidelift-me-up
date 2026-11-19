import { PackageData } from "npm-username-to-packages";

import type { packageOwnerships, packageStatuses } from "./cli/choices.js";

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

export type PackageOwnership = (typeof packageOwnerships)[number];

export type PackageStatus = (typeof packageStatuses)[number];
