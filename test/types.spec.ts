import { initHooks, initStats } from "../build/types.js";
import assert from "assert";

describe("Types", function () {
  describe("initHooks", function () {
    const hooks = initHooks();

    it("returns at empty array for befores", function () {
      assert.deepEqual(hooks.befores, []);
    });

    it("returns at empty array for beforeEaches", function () {
      assert.deepEqual(hooks.beforeEaches, []);
    });

    it("returns at empty array for afters", function () {
      assert.deepEqual(hooks.afters, []);
    });

    it("returns at empty array for afterEaches", function () {
      assert.deepEqual(hooks.afterEaches, []);
    });
  });

  describe("initStats", function () {
    const stats = initStats();

    it("returns 0 for time", function () {
      assert.equal(stats.time, 0);
    });

    it("returns 0 for passed suites", function () {
      assert.equal(stats.suites.passed, 0);
    });

    it("returns 0 for failed suites", function () {
      assert.equal(stats.suites.failed, 0);
    });

    it("returns 0 for passed tests", function () {
      assert.equal(stats.tests.passed, 0);
    });

    it("returns 0 for failed tests", function () {
      assert.equal(stats.tests.failed, 0);
    });
  });
});
