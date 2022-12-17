#!/usr/bin/env ts-node

import { Runner } from "./runner.js";

const runner = new Runner();

await runner.run(process.argv.slice(2));
