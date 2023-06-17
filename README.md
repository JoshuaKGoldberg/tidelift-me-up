<h1 align="center">tidelift-me-up</h1>

<p align="center">Finds your npm packages that are eligible for Tidelift funding. 💸</p>

<p align="center">
	<a href="#contributors" target="_blank">
<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<img alt="All Contributors: 1" src="https://img.shields.io/badge/all_contributors-1-21bb42.svg" />
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- prettier-ignore-end -->
	</a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/tidelift-me-up" target="_blank">
		<img alt="Codecov Test Coverage" src="https://codecov.io/gh/JoshuaKGoldberg/tidelift-me-up/branch/main/graph/badge.svg?token=eVIFY4MhfQ"/>
	</a>
	<a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank">
		<img alt="Contributor Covenant" src="https://img.shields.io/badge/code_of_conduct-enforced-21bb42" />
	</a>
	<a href="https://github.com/JoshuaKGoldberg/tidelift-me-up/blob/main/LICENSE.md" target="_blank">
	    <img alt="License: MIT" src="https://img.shields.io/github/license/JoshuaKGoldberg/tidelift-me-up?color=21bb42">
    </a>
	<a href="https://github.com/sponsors/JoshuaKGoldberg" target="_blank">
    	<img alt="Sponsor: On GitHub" src="https://img.shields.io/badge/sponsor-on_github-21bb42.svg" />
    </a>
	<img alt="Style: Prettier" src="https://img.shields.io/badge/style-prettier-21bb42.svg" />
    <img alt="TypeScript: Strict" src="https://img.shields.io/badge/typescript-strict-21bb42.svg" />
</p>

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

- `--ownership` _(default: `["author", "publisher"]`)_: If provided, any filters user packages must match one of based on username: `"author"`, `"maintainer"`, and/or `"publisher"`
- `--since` _(default: 2 years ago)_: A date that packages need to have been updated since to be considered
  - This will be provided as a string to the `Date` constructor
- `--username` _(default: result of `npm whoami`)_: The npm username to search for packages maintained by
  - The search is done by [`npm-user-packages`](https://github.com/kevva/npm-user-packages), which fetches from [npm.io](https://npm.io)

```shell
npx tidelift-me-up --ownership author --ownership publisher --since 2020 --username your-username
```

## Node API

This package also exports a `tideliftMeUp` function you can call to receive an array of results:

```js
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

It takes in the same options as the CLI:

```js
import { tideliftMeUp } from "tidelift-me-up";

await tideliftMeUp({
	ownership: ["author", "publisher"],
	since: new Date("2020"),
	username: "your-username",
});
```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 💖

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

<!-- You can remove this notice if you don't want it 🙂 no worries! -->

> 💙 This package is based on [@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg)'s [template-typescript-node-package](https://github.com/JoshuaKGoldberg/template-typescript-node-package).
