const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
var glob = require("glob");
// const promiseSpawn = require("@npmcli/promise-spawn");
// source for inlining arbitrary shell commands: https://github.com/npm/cli/blob/1a2159d3cf2513e77e728e7feeaa04ad150d3812/lib/run-script.js#L128
//xplat: https://shapeshed.com/writing-cross-platform-node/#cross-platform-if-you-want
const { spawnSync } = require("child_process");
const getFiles = (dir) => {
    console.log('dUR', dir)
  const results = glob.sync(`*.sh`, { cwd: dir });
  console.log(results);
  return results;
};
export const toObj = (arr, keySelector = identity, valSelector = identity) => {
  const toSelector = (arg) => (typeof arg === "function" ? arg : property(arg));
  keySelector = toSelector(keySelector);
  valSelector = toSelector(valSelector);

  return arr.reduce((acc, curr) => {
    acc[keySelector(curr)] = valSelector(curr);
    return acc;
  }, {});
};
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

const fetchConfigFile = () => {
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
  invariant(
    config.tasks || config.config,
    "Tasks or config must be present in config file."
  );

  return config;
};

const normalizeTasks = ({ settings, tasks }) => {
  settings = settings || {};
  tasks = tasks || {};
    const { scripts_dir: scriptsDir = process.cwd() } = settings;



//TODO(lt): vvv recursive
    const foundScripts = getFiles(scriptsDir);
    foundScripts.
path.basename()
  return {
    //TODO(lt): vvv handle when running from not same dir as mk.yml
    settings: { scriptsDir: scripts_dir },
    tasks,
  };
};

//TODO(lt): vvv run multiple in sequence ?
const args = process.argv.slice(2);
const taskArgs = args.slice(1);
const rawTask = args[0];
invariant(!!rawTask, `No task name specified.`);
const task = rawTask.trim();
const config = fetchConfigFile();
const { settings: { scriptsDir }, tasks } = normalizeTasks(config);


const definedTasks = Object.keys(tasks);
console.log(tasks, "cnf", task);
invariant(definedTasks.includes(task), "Undefined task:", task);
const taskVal = tasks[task];
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
//TODO(lt): check out exec at
//https://github.com/npm/cli/blob/1a2159d3cf2513e77e728e7feeaa04ad150d3812/node_modules/%40npmcli/run-script/lib/run-script-pkg.js#L12

