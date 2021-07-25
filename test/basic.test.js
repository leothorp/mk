const { testExec, invariant } = require("../src/util");

const checkStdout = (received, expected) => {
  const finalExpected = `${expected}\n`;

  invariant(
    received === finalExpected,
    "\nexpected: ",
    JSON.stringify(finalExpected),
    "\nreceived: ",
    JSON.stringify(received)
  );
  console.log("Passed");
};

//check .py script
const result1 = testExec("mk indeed");
console.log(result1.stderr);
checkStdout(result1.stdout, "sure");

//check stdout is there, extra arg
const result2 = testExec("mk exec newer");
console.log(result2.stderr);
checkStdout(result2.stdout, "orig newer");

//check scripts dir

const result3 = testExec("mk implicit newest");
console.log(result3.stderr);

checkStdout(result3.stdout, "node arg: newest");
