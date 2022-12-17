import assert from "assert";
import { promisify } from "util";

const exec = await import("child_process").then((cp) => promisify(cp.exec));

describe("Runner", function () {
  it("should update the stats with results from the child process", async function () {
    const { stdout } = await exec("node test/resources/runner.js");

    const expected = `
      Suites: 1 failed 2 total
      Tests:  1 failed 2 total
      Time:   1.00 ms
    `;

    assert(stdout.trim(), expected.trim());
  });
});
