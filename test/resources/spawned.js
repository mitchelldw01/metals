await fetch("http://localhost:5050", {
  method: "POST",
  body: JSON.stringify({
    time: 1,
    suites: {
      passed: 1,
      failed: 1,
    },
    tests: {
      passed: 1,
      failed: 1,
    },
  }),
});
