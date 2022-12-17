import { Runner } from "../../build/runner.js";

const runner = new Runner();

await runner.run(["test/resources/spawned.js"]);
