import { Test } from "../build/test.js";
import assert from "assert";

describe("Test", function () {
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

  describe("exec", function () {
    it("should return 'passed' if there were no errors", async function () {
      const test = new Test("my test", () => undefined);
      const { state } = await test.exec(0, [], []);

      assert(state === "passed");
    });

    it("should return 'failed' if there was an error", async function () {
      const test = new Test("my test", function () {
        throw "Error";
      });

      const { state } = await test.exec(0, [], []);

      assert(state === "failed");
    });

    it("should return the time it took to run the test", async function () {
      const test = new Test("my test", () => undefined);
      const { time } = await test.exec(0, [], []);

      assert(time > 0);
    });

    it("should execute every beforeEach hook", async function () {
      let count = 0;
      const myBeforeEach = function () {
        count++;
      };

      const test = new Test("my test", () => undefined);
      await test.exec(0, [myBeforeEach, myBeforeEach], []);

      assert.equal(count, 2);
    });

    it("should execute every afterEach hook", async function () {
      let count = 0;
      const myAfterEach = () => {
        count++;
      };

      const test = new Test("my test", () => undefined);
      await test.exec(0, [], [myAfterEach, myAfterEach]);

      assert.equal(count, 2);
    });
  });
});
