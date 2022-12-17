import { Registry } from "./registry.js";
import { Suite } from "./suite.js";
import { Test } from "./test.js";
import { State } from "./types.js";

const registry = new Registry();

export function suite(desc: string, cb: () => void | Promise<void>): void {
  registry.registerSuite(new Suite(desc, cb));
}

export function test(desc: string, cb: () => void | Promise<void>): void {
  registry.registerTest(new Test(desc, cb));
}

export function before(cb: () => void | Promise<void>): void {
  registry.registerBefore(cb);
}

export function beforeEach(cb: () => void | Promise<void>): void {
  registry.registerBeforeEach(cb);
}

export function after(cb: () => void | Promise<void>): void {
  registry.registerAfter(cb);
}

export function afterEach(cb: (state?: State) => void | Promise<void>): void {
  registry.registerAfterEach(cb);
}

export function describe(desc: string, cb: () => void | Promise<void>): void {
  suite(desc, cb);
}

export function it(desc: string, cb: () => void | Promise<void>): void {
  test(desc, cb);
}

export default {
  suite,
  test,
  before,
  beforeEach,
  after,
  afterEach,
  describe,
  it,
};
