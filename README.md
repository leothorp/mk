# mk

Project-level task automation with less typing.

### What is this?

Essentially this is a more terse version of npm scripts or Make tasks-
a quick way to define arbitrary commands, shortcuts, and script aliases
that are useful in the current directory/project. Like with Make, there's no assumption about what language is being used. an mk.yml file in the project root is the only requirement.

### Installation

via npm (recommended):

```
  npm i -g @leothorp/mk
```

Or for a binary installation that doesn't require Node/npm to already be installed:

```
bash <(curl -sSL https://raw.githubusercontent.com/leothorp/mk/main/scripts/path-install.sh)
```

that runs the `scripts/path-install.sh` script and adds `mk` under `/usr/local/bin`, which
is likely already in your PATH.

### Basic Tasks

Add a file called `mk.yml` at the project root.

This should contain, at minimum, a `tasks` object, a mapping of task names to shell commands.

_Example:_

```
tasks:
  dinner: echo "tomato"
  cra: npx create-react-app new-one
  save-work: git add . && git commit -m
```

Now in the terminal, I can type
`mk dinner`

and see the output `tomato`- as if I'd manually typed `echo "tomato"`.

Any additional arguments are forwarded along to the end of the command.
If I do
`mk save-work "typo"`

It'll be as if I'd typed
`git add . && git commit -m "typo"`
These "partial command" tasks can be useful for repetitive tasks that still have a small manual/unpredictable component.

### External Scripts

Sometimes you have a script that is more involved than a
shell one-liner, so you put it in its own file in in the project. `mk` will automatically detect any .py, .js, or .sh files in a `scripts` directory at the porject root and make those available as tasks, without anything needing to be added to `mk.yml`.
(this script directory path is configurable- see the "Configuration" section below.)

_Example:_
If I create the file `scripts/build.sh`, I can run that script by typing `mk build`.

It's equivalent to if I had added something like this the following to mk.yml. The same goes
for .py and .js scripts.

```
tasks:
  build: bash ./scripts/build.sh
```

### Configuration

`mk.yml` can optionally include a `settings` object, with the
following possible keys.

-`scripts_dir:` Default: `./scripts`
Path to a directory in the project containing script files that should be automatically defined as mk tasks.

-`auto_scripts_enabled:` Default: `true`
This is used to enable/disable the scripts_dir/automatic task functionality.

_Example:_

```
settings:
  auto_scripts_enabled: true
  scripts_dir: "./tools/my-scripts"
```

### CLI commands

-`mk <task> <...args>` Run the given mk task, optionally forwarding
one or more arguments.

-`mk -v, --version` Print version number.
