import { Suite } from "../build/suite.js";
import { Test } from "../build/test.js";
import assert from "assert";

describe("Suite", function () {
  let consoleLog = console.log;
  let consoleError = console.error;

  beforeEach(function () {
    console.log = () => undefined;
    console.error = () => undefined;
  });

  afterEach(function () {
    console.log = consoleLog;
    console.error = consoleError;
  });

  describe("inheritHooks", function () {
    it("should copy every hook from the parent to the child", function () {
      const parent = new Suite("my suite", () => undefined);
      const child = new Suite("my suite", () => undefined);

      const hook = () => undefined;
      parent.hooks.befores.push(hook);
      child.inheritHooks(parent, child);

      assert.deepEqual(child.hooks.befores[0], hook);
    });

    it("should not overwrite any of the child's hooks", function () {
      const parent = new Suite("my suite", () => undefined);
      const child = new Suite("my suite", () => undefined);

      const parentHook = () => undefined;
      parent.hooks.befores.push(parentHook);

      const childHook = () => undefined;
      child.hooks.befores.push(childHook);

      child.inheritHooks(parent, child);

      assert.deepEqual(child.hooks.befores, [parentHook, childHook]);
    });
  });

  describe("execChildren", async function () {
    it("should update the parent's stats with the data from its children", async function () {
      const parent = new Suite("my suite", () => undefined);
      const child = new Suite("my suite", () => undefined);
      parent.children.push(child);

      child.tests.push(new Test("my test", () => undefined));
      child.tests.push(
        new Test("my test", () => {
          throw "Error";
        }),
      );

      await parent.execChildren(0);

      assert(parent.stats.time > 0);
      assert.equal(parent.stats.tests.passed, 1);
      assert.equal(parent.stats.tests.failed, 1);
    });
  });

  describe("exec", async function () {
    it("should update the suite's stats with the data from itself and its children", async function () {
      const parent = new Suite("my suite", () => undefined);
      const child = new Suite("my suite", () => undefined);
      parent.children.push(child);

      parent.tests.push(new Test("my test", () => undefined));
      parent.tests.push(
        new Test("my test", () => {
          throw "Error";
        }),
      );

      child.tests.push(new Test("my test", () => undefined));
      child.tests.push(
        new Test("my test", () => {
          throw "Error";
        }),
      );

      await parent.exec();

      assert(parent.stats.time > 0);
      assert.equal(parent.stats.tests.passed, 2);
      assert.equal(parent.stats.tests.failed, 2);
    });
  });
});
