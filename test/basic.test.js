const { testExec, invariant } = require("../src/util");



//check stdout is there
const result = testExec("mk exec newer");
invariant(
  result.stdout === "orig newer",
  "unexpected output:",
  result.stdout,
  "stderr",
  result.stderr
);

// p.stdout.on("data", (data) => {
//   console.log(data.toString());
// });

//try the inner one, check it can be piped to file w output
