const { spawnSync, spawn } = require("child_process");
const { exec } = require("shelljs");
const isDev = () => process.env.NODE_ENV === "development";

const mkExec = (cmd) => {
  // spawn(cmd, [], { stdio: "inherit", shell: true });
  exec(cmd);
};
const testExec = (cmd) => {
  return spawnSync(cmd, [], {
    encoding: "utf8",
    shell: true,
  });
};

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
