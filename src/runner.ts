import { spawn } from "child_process";
import { createServer, Server } from "http";
import path from "path";
import { initStats, Stats } from "./types.js";

export class Runner {
  stats = initStats();
  server: Server;
  resolver?: (value: Stats | PromiseLike<Stats>) => void;

  constructor() {
    this.server = createServer((req, res) => {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        res.end();

        if (this.resolver !== undefined) {
          this.resolver(JSON.parse(body));
        }
      });
    });

    this.server.listen(process.env.PORT ?? 5050);
  }

  async run(filepaths: string[]) {
    for (const filepath of filepaths) {
      const command = path.parse(filepath).ext === ".ts" ? "npx" : "node";
      const args = command === "npx" ? ["ts-node", filepath] : [filepath];

      const data = await new Promise<Stats>((resolve) => {
        const child = spawn(command, args, { stdio: "inherit", env: { ...process.env, NODE_NO_WARNINGS: "1" } });

        child.on("error", (error) => {
          console.log(error);
        });

        this.resolver = resolve;
      });

      this.stats.suites.passed += data.suites.passed;
      this.stats.suites.failed += data.suites.failed;
      this.stats.tests.passed += data.tests.passed;
      this.stats.tests.failed += data.tests.failed;
      this.stats.time += data.time;
    }

    this.printResults();
    this.server.close();
  }

  printResults() {
    const numSuites = this.stats.suites.passed + this.stats.suites.failed;
    const numTests = this.stats.tests.passed + this.stats.tests.failed;

    if (this.stats.suites.failed === 0) {
      process.stdout.write("\nSuites: ");
      console.log("\x1b[32m%s\x1b[39m", `${this.stats.suites.passed} passed`, `${numSuites} total`);
      process.stdout.write("Tests:  ");
      console.log("\x1b[32m%s\x1b[39m", `${this.stats.tests.passed} passed`, `${numTests} total`);
    } else {
      process.stdout.write("\nSuites: ");
      console.log("\x1b[31m%s\x1b[39m", `${this.stats.suites.failed} failed`, `${numSuites} total`);
      process.stdout.write("Tests:  ");
      console.log("\x1b[31m%s\x1b[39m", `${this.stats.tests.failed} failed`, `${numTests} total`);
    }

    let displayTime = `${(this.stats.time / 1000).toFixed(2)} s`;

    if (displayTime === "0.00 s") {
      displayTime = `${this.stats.time.toFixed(2)} ms`;
    }

    console.log(`Time:   ${displayTime}\n`);
  }
}
