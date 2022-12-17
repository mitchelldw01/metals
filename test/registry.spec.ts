import { Registry } from "../build/registry.js";
import { Suite } from "../build/suite.js";
import { Test } from "../build/test.js";
import assert from "assert";

describe("Registry", function () {
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

  describe("getCurrSuite", function () {
    it("should return the last suite if depth is 0", function () {
      const registry = new Registry();
      const suite = new Suite("my suite", () => undefined);

      registry.depth++;
      registry.suites.push(suite);

      assert.deepEqual(registry.getCurrSuite(), suite);
    });

    it("should return the last nested suite if depth is greater than 0", function () {
      const registry = new Registry();
      const parent = new Suite("my suite", () => undefined);
      const child = new Suite("my suite", () => undefined);

      parent.children.push(child);
      registry.depth += 2;
      registry.suites.push(parent);

      assert.deepEqual(registry.getCurrSuite(), child);
    });
  });

  describe("registerSuite", function () {
    it("should append a test suite to the current suite", function () {
      const registry = new Registry();
      const suite = new Suite("my suite", () => undefined);

      registry.registerSuite(suite);

      assert.deepEqual(registry.suites[0], suite);
    });
  });

  describe("registerTest", function () {
    it("should append a test to the current suite", function () {
      const registry = new Registry();
      const test = new Test("my test", () => undefined);
      const suite = new Suite("my suite", () => {
        registry.registerTest(test);
      });

      registry.registerSuite(suite);
      assert.deepEqual(suite.tests[0], test);
    });
  });

  describe("registerBefore", function () {
    it("should append a before hook to the current suite", function () {
      const registry = new Registry();
      const hook = () => undefined;
      const suite = new Suite("my suite", () => {
        registry.registerBefore(hook);
      });

      registry.registerSuite(suite);
      assert.deepEqual(suite.hooks.befores[0], hook);
    });
  });

  describe("registerBeforeEach", function () {
    it("should append a beforeEach hook to the current suite", function () {
      const registry = new Registry();
      const hook = () => undefined;
      const suite = new Suite("my suite", () => {
        registry.registerBeforeEach(hook);
      });

      registry.registerSuite(suite);
      assert.deepEqual(suite.hooks.beforeEaches[0], hook);
    });
  });

  describe("registerAfter", function () {
    it("should append an after hook to the current suite", function () {
      const registry = new Registry();
      const hook = () => undefined;
      const suite = new Suite("my suite", () => {
        registry.registerAfter(hook);
      });

      registry.registerSuite(suite);
      assert.deepEqual(suite.hooks.afters[0], hook);
    });
  });

  describe("registerAfterEach", function () {
    it("should append an afterEach hook to the current suite", function () {
      const registry = new Registry();
      const hook = () => undefined;
      const suite = new Suite("my suite", () => {
        registry.registerAfterEach(hook);
      });

      registry.registerSuite(suite);
      assert.deepEqual(suite.hooks.afterEaches[0], hook);
    });
  });
});
