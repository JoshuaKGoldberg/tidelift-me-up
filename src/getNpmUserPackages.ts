/*
This is a re-implementation of the `npm-user-packages` package API for:
* https://github.com/JoshuaKGoldberg/tidelift-me-up/issues/26
* https://github.com/kevva/npm-user-packages/issues/1

If you still see this in August 2023 or later, it means that issue is stale
(or you need to pull the latest tidelift-me-up code/version).
In which case I (Josh) will want to publish my own get-npm-user-packages...
*/

export interface PackageData {
	author: {
		email?: string | undefined;
		name: string;
		url?: string | undefined;
		username?: string | undefined;
	};
	date: string;
	description: string;
	keywords: string[];
	links: {
		bugs?: string | undefined;
		homepage?: string | undefined;
		npm: string;
		repository?: string | undefined;
	};
	maintainers: {
		email: string;
		username: string;
	}[];
	name: string;
	publisher: {
		email: string;
		username: string;
	};
	scope: string;
	version: string;
}

interface ResponseBody {
	results: ResponseResult[];
	total: number;
}

interface ResponseResult {
	package: PackageData;
}

export async function getNpmUserPackages(maintainer: string) {
	const packages: PackageData[] = [];
	const size = 250;

	while (true) {
		const response = await fetch(
			`https://api.npms.io/v2/search?q=maintainer:${maintainer}&size=${size}&from=${packages.length}`,
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		const body = (await response.json()) as ResponseBody;

		packages.push(...body.results.map((result) => result.package));

		if (packages.length >= body.total) {
			return packages;
		}
	}
}
