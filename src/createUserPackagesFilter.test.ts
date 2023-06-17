import { describe, expect, it } from "vitest";

import { createUserPackagesFilter } from "./createUserPackagesFilter.js";
import { createFakePackageData } from "./fakes.js";

const username = "abc123";

describe("createUserPackagesFilter", () => {
	it("filters a package when its date predates since", () => {
		const filter = createUserPackagesFilter({
			ownership: ["author"],
			since: new Date(Date.now() - 10_000),
			username,
		});

		const actual = filter(
			createFakePackageData({
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
			createFakePackageData({
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
			createFakePackageData({
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
			createFakePackageData({
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
			createFakePackageData({
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
			createFakePackageData({
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
			createFakePackageData({
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
			createFakePackageData({
				publisher: { email: "", username },
			})
		);

		expect(actual).toBe(true);
	});
});
