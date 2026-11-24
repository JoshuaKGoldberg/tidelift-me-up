#!/usr/bin/env node
import { tideliftMeUpCli } from "../dist/cli/tideliftMeUpCli.js";

await tideliftMeUpCli(process.argv.slice(2));
