# mk

Project-level task automation for those who don't want to type.

### What is this?

Essentially this is a more terse version of npm scripts or Make tasks-
a quick way to define arbitrary commands, shortcuts, and script aliases
that are useful in the current directory/project. Like with Make, there's no assumption about what language is being used. an mk.yml file in the project root is the only requirement.

### Installation

```
  npm i -g @leothorp/mk
```

### Basic Tasks

Add an mk.yml file at your project root.

This should contain a `tasks` key, an object of task names mapped to shell input strings. For example:

```
tasks:
  dinner: echo "tomato"
  cra: npx create-react-app new-one
  save-work: git add . && git commit -m
```

Now in the terminal, I can type
`mk dinner`

and see the output `tomato`- as if I'd manually typed `echo "tomato"`.

Any additional arguments will be forwarded along to the end of the command.
So if I do
`mk save-work "typo"`

It'll be as if I'd typed git add . && git commit -m "typo".
These "partial command" tasks can be handy for the really repetitive stuff that still has a manual/unpredictable component.

### External Scripts

Sometimes you have a script that is more involved than a
shell oneliner, and put it in its own file in a scripts directory. `

mk`will automatically detect .py, .js, and .sh files in a`scripts` directory at root and make those available as tasks- you don't need to add anything to mk.yml. (this script directory path is configurable- see the "Configuration" section)

_Example:_
If I create the file `scripts/build.sh` with this (arbitrary) content:

```
rm -rf node_modules;
npx nexe bin/mk.js -t mac-x64-10.14.0 -o dist/mk;
```

I can already trigger it with `mk build`.

It's equivalent to if I had added something like this to mk.yml (which you can still do if you like, but it isn't needed for it to work). The same goes
for .py and .js scripts.
`mk.yml`

```
tasks:
  build: bash ./scripts/build.sh
```

### Configuration

`mk.yml` can optionally include a `settings` object, with the
following possible keys.

```
settings:
  auto_scripts_enabled: false #enable/disable reading from the scripts dir. defaults to true.
  scripts_dir: "./tools/my-scripts"      #relative path to the auto-detected 'scripts' directory. defaults to './scripts'.
```

### CLI

`mk <task> <...args>` Run the given mk task, optionally forwarding
one or more arguments.
`mk -v, --version` Print version number.
