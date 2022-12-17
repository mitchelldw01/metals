export type State = "passed" | "failed";

export type Hooks = {
  befores: Array<() => void | Promise<void>>;
  beforeEaches: Array<() => void | Promise<void>>;
  afters: Array<() => void | Promise<void>>;
  afterEaches: Array<() => void | Promise<void>>;
};

export function initHooks(): Hooks {
  return {
    befores: [],
    beforeEaches: [],
    afters: [],
    afterEaches: [],
  };
}

export type Stats = {
  time: number;
  suites: {
    passed: number;
    failed: number;
  };
  tests: {
    passed: number;
    failed: number;
  };
};

export function initStats(): Stats {
  return {
    time: 0,
    suites: {
      passed: 0,
      failed: 0,
    },
    tests: {
      passed: 0,
      failed: 0,
    },
  };
}
