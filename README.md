<h1 align="center">Tidelift Me Up</h1>

<p align="center">
	CLI that checks if your npm packages are eligible for Tidelift funding.
	💸
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 5" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-5-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/tidelift-me-up" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/tidelift-me-up?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<a href="http://npmjs.com/package/tidelift-me-up" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/tidelift-me-up?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## What?

[Tidelift](https://tidelift.com) is a service for companies to sponsor their open source dependencies.
Through Tidelift, companies contribute to a fund that is distributed monthly to maintainers of eligible open-source packages in a process called "lifting".

Unfortunately, there's no easy way on the Tidelift website to search for which packages under a particular open source maintainer are eligible for lifting or currently being lifted.
This CLI does that!

> See it in action online at [tidelift-me-up-site.vercel.app](https://tidelift-me-up-site.vercel.app)!

## Usage

Run this with `npx`:

```shell
npx tidelift-me-up
```

...and your list of packages will log to the console:

```plaintext
👉 abc-def is not yet lifted, but is estimated for $25.0/mo.
✅ ghi-jkl is already lifted for $50.0/mo.
```

> Tip: add `| grep yet` to filter to only packages that are not yet lifted.
>
> ```shell
> npx tidelift-me-up | grep yet
> ```

### Options

- `-h`/`--help`: Print these options to the terminal
- `--ownership` _(default: `["author", "publisher"]`)_: If provided, any filters user packages must match one of based on username: `"author"`, `"maintainer"`, and/or `"publisher"`
- `--reporter` _(default: `"text"`)_: Either `"json"` to output a raw JSON string, or `"text"` for human-readable output
- `--since` _(default: 2 years ago)_: A date that packages need to have been updated since to be considered
  - This will be provided as a string to the `Date` constructor
- `--status` _(default: `'all'`)_: If provided, a filter on package lifting status: `'all'`, `"available"`, or `"lifted"`
- `--username` _(default: result of `npm whoami`)_: The npm username to search for packages owned by
  - The search is done by a network call to [https://registry.npmjs.org](https://https://registry.npmjs.org) (documented at [github.com/npm/registry](https://github.com/npm/registry))

```shell
npx tidelift-me-up --ownership author --ownership publisher --reporter json --since 2020 --username your-username
```

## Node API

This package also exports a `tideliftMeUp` function you can call to receive an array of results:

```ts
import { tideliftMeUp } from "tidelift-me-up";

await tideliftMeUp();
/*
[
	{
		estimatedMoney: 25,
		lifted: false,
		name: 'your-eligible-package'
	}
]
*/
```

It takes in the same options as the CLI, except for `reporter`:

```ts
import { tideliftMeUp } from "tidelift-me-up";

await tideliftMeUp({
	ownership: ["author", "publisher"],
	since: new Date("2020"),
	username: "your-username",
});
```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 💸

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/ljharb"><img src="https://avatars.githubusercontent.com/u/45469?v=4?s=100" width="100px;" alt="Jordan Harband"/><br /><sub><b>Jordan Harband</b></sub></a><br /><a href="#ideas-ljharb" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/issues?q=author%3Aljharb" title="Bug reports">🐛</a></td>
      <td align="center"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a></td>
      <td align="center"><a href="https://github.com/maggienegm"><img src="https://avatars.githubusercontent.com/u/8771586?v=4?s=100" width="100px;" alt="Maggie"/><br /><sub><b>Maggie</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/commits?author=maggienegm" title="Documentation">📖</a> <a href="#tool-maggienegm" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/issues?q=author%3Amaggienegm" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/commits?author=maggienegm" title="Code">💻</a> <a href="#ideas-maggienegm" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://sindresorhus.com/apps"><img src="https://avatars.githubusercontent.com/u/170270?v=4?s=100" width="100px;" alt="Sindre Sorhus"/><br /><sub><b>Sindre Sorhus</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/issues?q=author%3Asindresorhus" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/StyleShit"><img src="https://avatars.githubusercontent.com/u/32631382?v=4?s=100" width="100px;" alt="StyleShit"/><br /><sub><b>StyleShit</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/commits?author=StyleShit" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo engine](https://create.bingo).
