const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
var glob = require("glob");

const { spawnSync } = require("child_process");
const { mkExec, invariant, thr } = require("./util");

const getFiles = (dir) => {
  const results = glob.sync(`**/*.{sh,js,py}`, { cwd: dir });

  //rel to cwd
  return results.map((r) => path.resolve(process.cwd(), dir, r));
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




const fetchConfigFile = () => {
  const getConfAt = (path) => yaml.load(fs.readFileSync(path, "utf8"));
  let config;
  const invalidFileErr = "No valid mk.yml configuration file found.";
  try {
    config = getConfAt(path.join(process.cwd(), "mk.yml"));

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

  const { scripts_dir: scriptsDir = path.resolve(process.cwd(), "scripts") } =
    settings;

  const getExecutor = (ext) => {
    return {
      // ".js": "/usr/local/bin/node",
      // ".sh": "/bin/sh",
      ".js": "/usr/bin/env node",
      ".sh": "/usr/bin/env bash",
      //TODO(lt): vvv may not work on linux
      ".py": "/usr/bin/env python3",
    }[ext];
  };

  const foundScripts = getFiles(scriptsDir);
  const asTasks = toObj(
    foundScripts,
    (k) => path.basename(k, path.extname(k)),

    (k) => `${getExecutor(path.extname(k))} ${k}`
  );
  return { ...tasks, ...asTasks };
};

const cli = (processArgs) => {
  const args = processArgs.slice(2);
  const taskArgs = args.slice(1);
  const rawTask = args[0];
  invariant(!!rawTask, `No task name specified.`);
  const taskName = rawTask.trim();
  const config = fetchConfigFile();
  const tasks = normalizeTasks(config);

  const definedTasks = Object.keys(tasks);

  invariant(definedTasks.includes(taskName), "Undefined task:", taskName);
  const taskVal = tasks[taskName];

  const taskParts = taskVal.split(" ");
  //TODO(lt): vvv test
  // spawnSync(taskParts[0], taskParts.slice(1), {
  // spawnSync(taskVal, [], {
  //   stdio: "inherit",
  //   //TODO(lt): vvv test
  //   // shell: "/bin/sh",
  //   shell: true,
  // });
  mkExec(taskVal)
  
  //https://github.com/npm/cli/blob/1a2159d3cf2513e77e728e7feeaa04ad150d3812/node_modules/%40npmcli/run-script/lib/run-script-pkg.js#L12
};

module.exports = cli;
