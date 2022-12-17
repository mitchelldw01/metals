import { Test } from "./test.js";
import { initHooks, initStats, State, Stats } from "./types.js";

export class Suite {
  desc: string;
  cb: () => void;
  tests: Test[] = [];
  children: Suite[] = [];
  state: State = "passed";
  hooks = initHooks();
  stats = initStats();

  constructor(desc: string, cb: () => void) {
    this.desc = desc;
    this.cb = cb;
  }

  inheritHooks(parent: Suite, child: Suite): void {
    child.hooks.befores = [...parent.hooks.befores, ...child.hooks.befores];
    child.hooks.beforeEaches = [...parent.hooks.beforeEaches, ...child.hooks.beforeEaches];
    child.hooks.afters = [...parent.hooks.afters, ...child.hooks.afters];
    child.hooks.afterEaches = [...parent.hooks.afterEaches, ...child.hooks.afterEaches];
  }

  async execChildren(depth: number): Promise<void> {
    for (const child of this.children) {
      this.inheritHooks(this, child);
      const result = await child.exec(depth + 1);

      this.stats.time += result.time;
      this.stats.tests.passed += result.tests.passed;
      this.stats.tests.failed += result.tests.failed;
      this.stats.suites.passed += result.suites.passed;
      this.stats.suites.failed += result.suites.failed;
    }
  }

  async exec(depth: number = 0): Promise<Stats> {
    if (depth === 0) {
      console.log();
    }

    console.log(`${" ".repeat(depth * 2)}${this.desc}`);

    for (const before of this.hooks.befores) {
      await before();
    }

    for (const test of this.tests) {
      const { state, time } = await test.exec(depth, this.hooks.beforeEaches, this.hooks.afterEaches);
      this.stats.time += time;

      if (state === "passed") {
        this.stats.tests.passed++;
      } else {
        this.stats.tests.failed++;
        this.state = "failed";
      }
    }

    this.state === "passed" ? this.stats.suites.passed++ : this.stats.suites.failed++;

    await this.execChildren(depth);

    return this.stats;
  }
}
