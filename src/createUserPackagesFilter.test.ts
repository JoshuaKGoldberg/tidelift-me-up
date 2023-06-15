import { describe, expect, it } from "vitest";

import {
	UserPackageData,
	createUserPackagesFilter,
} from "./createUserPackagesFilter.js";

const username = "abc123";

const createPackageData = (overrides?: Partial<UserPackageData>) =>
	({
		author: { name: "" },
		date: new Date().toString(),
		maintainers: [],
		publisher: { email: "", username: "" },
		...overrides,
	} satisfies UserPackageData);

describe("createUserPackagesFilter", () => {
	it("filters a package when its date predates since", () => {
		const filter = createUserPackagesFilter({
			ownership: ["author"],
			since: new Date(Date.now() - 10_000),
			username,
		});

		const actual = filter(
			createPackageData({
				author: { name: "", username },
				date: new Date(Date.now() - 20_000).toString(),
			})
		);

		expect(actual).toBe(false);
	});

	it("allows a package when its date is after since", () => {
		const filter = createUserPackagesFilter({
			ownership: ["author"],
			since: new Date(Date.now() - 20_000),
			username,
		});

		const actual = filter(
			createPackageData({
				author: { name: "", username },
				date: new Date(Date.now() - 10_000).toString(),
			})
		);

		expect(actual).toBe(true);
	});

	it("filters a package when author ownership doesn't match", () => {
		const filter = createUserPackagesFilter({
			ownership: ["author"],
			since: new Date(0),
			username,
		});

		const actual = filter(
			createPackageData({
				author: { name: "", username: "other" },
			})
		);

		expect(actual).toBe(false);
	});

	it("allows a package when author ownership matches", () => {
		const filter = createUserPackagesFilter({
			ownership: ["author"],
			since: new Date(0),
			username,
		});

		const actual = filter(
			createPackageData({
				author: { name: "", username },
			})
		);

		expect(actual).toBe(true);
	});

	it("filters a package when maintainer ownership doesn't match", () => {
		const filter = createUserPackagesFilter({
			ownership: ["maintainer"],
			since: new Date(0),
			username,
		});

		const actual = filter(
			createPackageData({
				maintainers: [{ email: "", username: "other" }],
			})
		);

		expect(actual).toBe(false);
	});

	it("allows a package when maintainer ownership matches", () => {
		const filter = createUserPackagesFilter({
			ownership: ["maintainer"],
			since: new Date(0),
			username,
		});

		const actual = filter(
			createPackageData({
				maintainers: [{ email: "", username }],
			})
		);

		expect(actual).toBe(true);
	});

	it("filters a package when publisher ownership doesn't match", () => {
		const filter = createUserPackagesFilter({
			ownership: ["publisher"],
			since: new Date(0),
			username,
		});

		const actual = filter(
			createPackageData({
				publisher: { email: "", username: "other" },
			})
		);

		expect(actual).toBe(false);
	});

	it("allows a package when publisher ownership matches", () => {
		const filter = createUserPackagesFilter({
			ownership: ["publisher"],
			since: new Date(0),
			username,
		});

		const actual = filter(
			createPackageData({
				publisher: { email: "", username },
			})
		);

		expect(actual).toBe(true);
	});
});
