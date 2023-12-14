export interface PackageAuthor {
	email?: string;
	name?: string;
	url?: string;
	username?: string;
}

export interface PackageMaintainer {
	email?: string;
	username?: string;
}

export interface PackagePublisher {
	email?: string;
	username?: string;
}

export interface PackageLinks {
	bugs?: string;
	homepage?: string;
	npm: string;
	repository?: string;
}

/**
 * @see https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#get-v1search
 */
export interface PackageData {
	author?: PackageAuthor;
	date: string;
	description: string;
	keywords: string[];
	links: PackageLinks;
	maintainers: PackageMaintainer[];
	name: string;
	publisher: PackagePublisher;
	scope: string;
	version: string;
}

interface ResponseResult {
	package: PackageData;
	score: {
		detail: {
			maintenance: number;
			popularity: number;
			quality: number;
		};
		final: number;
	};
	searchScore: number;
}

interface ResponseBody {
	objects: ResponseResult[];
	time: string;
	total: number;
}

/*
This is a re-implementation of the `npm-user-packages` package API for:
* https://github.com/JoshuaKGoldberg/tidelift-me-up/issues/26
* https://github.com/kevva/npm-user-packages/issues/1

If you still see this in November 2023 or later, it means that issue is stale
(or you need to pull the latest tidelift-me-up code/version).
In which case I (Josh) will want to publish my own get-npm-user-packages...

Status update (December 2023): I'll reach out to the maintainer directly.
Additional inconveniences:
* https://github.com/npm/types/issues/28: npm doesn't have search result types
* https://github.com/npm/npm-registry-fetch: neither does this!
*/

export async function getNpmUserPackages(maintainer: string) {
	const packages: PackageData[] = [];
	const size = 250;

	while (true) {
		const response = await fetch(
			`https://registry.npmjs.com/-/v1/search?from=${packages.length}size=${size}&text=maintainer:${maintainer}`,
			{
				headers: { "Content-Type": "application/json" },
			},
		);
		const body = (await response.json()) as ResponseBody;

		packages.push(...body.objects.map((result) => result.package));

		if (packages.length >= body.total) {
			return packages;
		}
	}
}
