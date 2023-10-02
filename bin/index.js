#!/usr/bin/env node
import { tideliftMeUpCli } from "../lib/tideliftMeUpCli.js";

await tideliftMeUpCli(process.argv.slice(2));
