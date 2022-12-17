import { State } from "./types.js";

export class Test {
  desc: string;
  cb: () => void | Promise<void>;
  state: State = "passed";
  error: any = null;

  constructor(desc: string, cb: () => void | Promise<void>) {
    this.desc = desc;
    this.cb = cb;
  }

  printResults(depth: number, time: number): void {
    const displayTime = time > 50 ? Number(time.toFixed(2)) : "";

    if (process.env.MODE !== "test") {
      process.stdout.write(`${" ".repeat((depth + 1) * 2)}`);
    }

    this.state === "passed"
      ? console.log(...["\x1b[32m%s\x1b[39m", "✓"], this.desc, displayTime)
      : console.log(...["\x1b[31m%s\x1b[39m", "✗"], this.desc, displayTime);

    if (this.error) {
      console.error(this.error);
    }
  }

  async exec(
    depth: number,
    beforeEaches: Array<() => void | Promise<void>>,
    afterEaches: Array<(state?: State) => void | Promise<void>>,
  ): Promise<{ state: State; time: number }> {
    for (const beforeEach of beforeEaches) {
      await beforeEach();
    }

    const start = performance.now();

    try {
      await this.cb();
    } catch (err) {
      this.state = "failed";
      this.error = err;
    }

    const time = performance.now() - start;

    for (const afterEach of afterEaches) {
      await afterEach(this.state);
    }

    this.printResults(depth, time);

    return { state: this.state, time };
  }
}
