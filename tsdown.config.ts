import { defineConfig } from "tsdown";

export default defineConfig({
	dts: true,
	entry: ["src/cli/tideliftMeUpCli.ts", "src/index.ts"],
	fixedExtension: false,
	unbundle: true,
});
