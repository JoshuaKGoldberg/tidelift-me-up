#!/usr/bin/env node
import { tideliftMeUpCli } from "./tideliftMeUpCli.js";

await tideliftMeUpCli(process.argv.slice(2));
