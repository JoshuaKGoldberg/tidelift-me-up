#!/usr/bin/env node
import { tideliftMeUpCli } from "../lib/cli/tideliftMeUpCli.js";

await tideliftMeUpCli(process.argv.slice(2));
