//TODO(lt): vvv explore sync vs. async more here
const { spawnSync, spawn } = require("child_process");

const isDev = () => process.env.NODE_ENV === "development";
const mkExec = (cmd) => {
  if (isDev()) {
    console.debug("executing:", cmd);
  }
  return spawn(cmd, [], { stdio: "inherit", shell: true });
};
const testExec = (cmd, { inherit = false } = {}) => {
  return spawnSync(cmd, [], {
    ...(inherit ? { stdio: "inherit" } : { encoding: "utf8" }),
    shell: true,
  });
};
testExec;
const thr = (...msgs) => {
  console.error("ERROR:", ...msgs);
  if (isDev()) {
    throw new Error();
  }
  process.exit(1);
};

const invariant = (cond, ...msgs) => {
  if (!cond) {
    thr(...msgs);
  }
};
module.exports = {
  mkExec,
  testExec,
  invariant,
  thr,
};
