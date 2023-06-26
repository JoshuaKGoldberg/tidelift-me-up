import { PackageData } from "npm-user-packages";

export interface EstimatedPackage {
	data: PackageData;
	estimatedMoney: number;
	lifted: boolean;
	name: string;
}
