export type PackageEstimate = PackageEstimateLifted | PackageEstimateNotLifted;

export interface PackageEstimateBase {
	name: string;
}

export interface PackageEstimateLifted extends PackageEstimateBase {
	lifted: true;
}

export interface PackageEstimateNotLifted extends PackageEstimateBase {
	estimatedMoney: number;
	lifted: false;
}

interface PackageEstimateData {
	estimated_money: string;
	lifted: boolean;
	name: string;
	platform: "npm";
}

export async function getPackageEstimates(
	packageNames: string[],
): Promise<PackageEstimate[]> {
	const response = await fetch(
		"https://tidelift.com/api/depci/estimate/bulk_estimates",
		{
			body: JSON.stringify({
				packages: packageNames.map((packageName) => ({
					name: packageName,
					platform: "npm",
				})),
			}),
			headers: {
				"content-type": "application/json",
			},
			method: "POST",
		},
	);
	const json = (await response.json()) as PackageEstimateData[];

	return json.map((data) => ({
		estimatedMoney: parseFloat(data.estimated_money),
		lifted: data.lifted,
		name: data.name,
	}));
}
