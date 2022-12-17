import { Suite } from "./suite.js";
import { Test } from "./test.js";
import { initStats, State } from "./types.js";

export class Registry {
  suites: Suite[] = [];
  stats = initStats();
  depth = -1;

  constructor() {
    process.on("beforeExit", async () => {
      if (process.env.MODE === "test") {
        return;
      }

      for (const suite of this.suites) {
        const data = await suite.exec();

        this.stats.time += data.time;
        this.stats.suites.passed += data.suites.passed;
        this.stats.suites.failed += data.suites.failed;
        this.stats.tests.passed += data.tests.passed;
        this.stats.tests.failed += data.tests.failed;
      }

      await fetch(`http://localhost:${process.env.PORT ?? 5050}`, { method: "POST", body: JSON.stringify(this.stats) });
      process.exit(0);
    });
  }

  getCurrSuite(): Suite {
    let suite = this.suites[this.suites.length - 1];

    [...Array(this.depth)].forEach(() => {
      if (suite.children.length === 0) {
        return suite;
      }

      suite = suite.children[suite.children.length - 1];
    });

    return suite;
  }

  registerSuite(suite: Suite): void {
    this.depth++;

    if (this.depth === 0) {
      this.suites.push(suite);
    } else {
      this.getCurrSuite().children.push(suite);
    }

    suite.cb();

    this.depth--;
  }

  registerTest(test: Test): void {
    this.getCurrSuite().tests.push(test);
  }

  registerBefore(cb: () => void | Promise<void>): void {
    this.getCurrSuite().hooks.befores.push(cb);
  }

  registerBeforeEach(cb: () => void | Promise<void>): void {
    this.getCurrSuite().hooks.beforeEaches.push(cb);
  }

  registerAfter(cb: () => void | Promise<void>): void {
    this.getCurrSuite().hooks.afters.push(cb);
  }

  registerAfterEach(cb: (state?: State) => void | Promise<void>): void {
    this.getCurrSuite().hooks.afterEaches.push(cb);
  }
}
