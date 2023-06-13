// See https://github.com/DefinitelyTyped/DefinitelyTyped/pull/65786

declare module "npm-whoami" {
	export = NpmWhoami;

	declare function NpmWhoami(
		callback: NpmWhoami.NpmWhoamiCallback,
		opts?: NpmWhoami.NpmWhoamiOptions
	): void;

	declare namespace NpmWhoami {
		interface NpmWhoamiCallback {
			(err: Error, username: undefined): void;
			(err: null, username: string): void;
		}

		type NpmWhoamiOptions = NpmWhoamiBothOptions | number | string;

		interface NpmWhoamiBothOptions {
			registry?: string;
			timeout?: number;
		}

		function sync(opts: NpmWhoamiOptions): string | undefined;
	}
}
