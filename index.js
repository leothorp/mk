const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
var glob = require("glob");
// const promiseSpawn = require("@npmcli/promise-spawn");
// source for inlining arbitrary shell commands: https://github.com/npm/cli/blob/1a2159d3cf2513e77e728e7feeaa04ad150d3812/lib/run-script.js#L128
//xplat: https://shapeshed.com/writing-cross-platform-node/#cross-platform-if-you-want
const { spawnSync } = require("child_process");
const getFiles = (dir) => {
  const results = glob.sync(`**/*.sh`, { cwd: dir });

  //rel to cwd
  return results.map((r) => path.join(path.relative(process.cwd(), dir), r));
};
const toObj = (arr, keySelector = identity, valSelector = identity) => {
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
  console.log(tasks);
  settings = settings || {};
  tasks = tasks || {};
  //TODO(lt): vvv handle when running from not same dir as mk.yml
  const { scripts_dir: scriptsDir = path.join(process.cwd(), "scripts") } =
    settings;
  console.log(scriptsDir);
  //TODO(lt): vvv recursive
  const foundScripts = getFiles(scriptsDir);
  const asTasks = toObj(
    foundScripts,
    (k) => path.basename(k, ".sh"),
    //TODO(lt): vvv sec. issue w executable chars in names
    (k) => `/bin/sh ${k}`
  );
  return { ...tasks, ...asTasks };
};

//TODO(lt): vvv run multiple in sequence ?
const args = process.argv.slice(2);
const taskArgs = args.slice(1);
const rawTask = args[0];
invariant(!!rawTask, `No task name specified.`);
const taskName = rawTask.trim();
const config = fetchConfigFile();
const tasks = normalizeTasks(config);
console.log("tn", taskName, tasks);

const definedTasks = Object.keys(tasks);
console.log(tasks, "cnf", taskName);
invariant(definedTasks.includes(taskName), "Undefined task:", taskName);
const taskVal = tasks[taskName];
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
