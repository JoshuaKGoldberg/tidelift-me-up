interface PackageEstimateData {
	estimated_money: string;
	lifted: boolean;
	name: string;
	platform: "npm";
}

export interface PackageEstimate {
	estimatedMoney: number;
	lifted: boolean;
	name: string;
}

export async function getPackageEstimates(
	packageNames: string[]
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
		}
	);
	const json = (await response.json()) as PackageEstimateData[];

	return json.map((data) => ({
		estimatedMoney: parseFloat(data.estimated_money),
		lifted: data.lifted,
		name: data.name,
	}));
}
