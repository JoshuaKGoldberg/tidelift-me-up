export interface PackageEstimate {
	estimatedMoney: number;
	lifted: boolean;
	name: string;
}

export type PackageOwnership = "author" | "maintainer" | "publisher";
