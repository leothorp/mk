const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const version = require("../package.json").version;
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

  const {
    auto_scripts_enabled: autoScriptsEnabled = true,
    scripts_dir: scriptsDir = path.resolve(process.cwd(), "scripts"),
  } = settings;

  if (!autoScriptsEnabled) {
    return tasks;
  }

  const getExecutor = (ext) => {
    return {
      ".js": "/usr/bin/env node",
      ".sh": "/usr/bin/env bash",
      ".py": "/usr/bin/env python3",
    }[ext];
  };

  const foundScripts = getFiles(scriptsDir);
  const asTasks = toObj(
    foundScripts,
    (k) => path.basename(k, path.extname(k)),
    (k) => `${getExecutor(path.extname(k))} ${k}`
  );
  //TODO(lt): revert below
  console.error(asTasks, tasks, "72");
  return { ...tasks, ...asTasks };
};

const printVersion = () => {
  console.log(version);
};

const cli = (processArgs) => {
  const args = processArgs.slice(2);
  const additionalArgs = args.slice(1);
  const rawTask = args[0];
  console.error(84);

  //temp
  if (["-v", "--version"].includes(rawTask)) {
    printVersion();
    return;
  }
  invariant(!!rawTask, `No task name specified.`);
  const taskName = rawTask.trim();
  const config = fetchConfigFile();
  const tasks = normalizeTasks(config);

  const definedTasks = Object.keys(tasks);

  invariant(definedTasks.includes(taskName), "Undefined task:", taskName);
  const taskVal = tasks[taskName];

  //incorporates additional ones added after
  const compositeTaskVal = taskVal.split(" ").concat(additionalArgs).join(" ");
  console.log("cc", compositeTaskVal);
  mkExec(compositeTaskVal);
};

module.exports = cli;
