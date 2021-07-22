const yaml = require("js-yaml");
const fs = require("fs");
// const promiseSpawn = require("@npmcli/promise-spawn");
// source for inlining arbitrary shell commands: https://github.com/npm/cli/blob/1a2159d3cf2513e77e728e7feeaa04ad150d3812/lib/run-script.js#L128
const { spawnSync } = require("child_process");
const thr = (...msgs) => {
  console.error("ERROR:", ...msgs);
  if (process.env.NODE_ENV === "development") {
    throw new Error();
  }
  process.exit(1);
};
const invariant = (cond, msg) => {
  if (!cond) {
    thr(msg);
  }
};

//TODO(lt): vvv run multiple in sequence ?
const args = process.argv.slice(2);
const taskArgs = args.slice(1);
const rawTask = args[0];
invariant(!!rawTask, `No task name specified.`);
const task = rawTask.trim();
//TODO(lt): allow other file locations
//TODO(lt): allow running from anywhere in the parent dir, not just top level.
const getConfAt = (path) => yaml.load(fs.readFileSync(path, "utf8"));
let config;
const invalidFileErr = "No valid mk.yml configuration file found.";
try {
  config = getConfAt("./mk.yml");

  invariant(config && typeof config === "object", invalidFileErr);
} catch (e) {
  thr(invalidFileErr, e);
}
//TODO(lt): check out exec at
//https://github.com/npm/cli/blob/1a2159d3cf2513e77e728e7feeaa04ad150d3812/node_modules/%40npmcli/run-script/lib/run-script-pkg.js#L12

const definedTasks = Object.keys(config);
console.log(config, "cnf", task);
invariant(definedTasks.includes(task), "Undefined task.");
const taskVal = config[task];
//TODO(lt): other interpreters

//TODO(lt): vvv handle env vars, test w input
//TODO(lt): vvv set cwd?
const taskParts = taskVal.split(" ");
//TODO(lt): vvv args
//TODO(lt): vvv quote handling, "shell" features alongside passing additional args (taskArgs var)
spawnSync(taskParts[0], taskParts.slice(1), {
  stdio: "inherit",
  shell: "/bin/sh",
});
