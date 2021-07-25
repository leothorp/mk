# mk

Project-level task automation for those who don't want to type.

### What is this?

Essentially this is a more terse form of npm scripts or Make tasks-
a quicker way to define arbitrary commands, shortcuts, and script aliases
that are useful in the current directory/project.

### Installation

```
  npm i -g @leothorp/mk
```

### Getting Started

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

This library provides a way to exclude packages in a yarn monorepo when running `yarn install`, only installing dependencies for the desired workspaces. The main intended use case is for easily deploying a single workspace to a CI environment.

This is accomplished by temporarily modifying package.json to only contain the non-excluded workspaces before running `yarn install` (essentially simulating what would happen if the excluded packages were never present in the first place).

### Usage

If we have the following `workspaces` config:

```
  "workspaces": {
    "packages": [
      "packages/one",
      "packages/two",
      "packages/three"
    ],
    "nohoist": ["react"]
  },
```

And we run:

```
//bypass interactive prompt for CI
NPM_CONFIG_YES=true npx yarn-exclude --exclude one,two
```

The result is equivalent to having a `workspaces` config of:

```
  "workspaces": {
    "packages": [
      "packages/three"
    ],
    "nohoist": ["react"]
  },
```

and running `yarn install`.

Glob and array notation for `workspaces` will also work.

```
  "workspaces": [
      "packages/*"
  },
```

### CLI Options

`-e --exclude <excluded packages>` Comma separated list of excluded package
dirnames. (Required)

`--cwd <directory>` workspace root directory. (Default:
current working directory)

`--modify` Leave yarn.lock and package.json modifications in place after the operation completes. May be useful in some CI environments.

`-V, --version` output the version number

`-h, --help` display help for command options

### Caveats

- This package isn't actively maintained- you probably shouldn't use it for anything other than experimenting.
- Passing additional CLI options to the underlying `yarn install` is not currently supported.
- `yarn-exclude` will not check if the excluded workspace is actually depended upon or not by any of the included ones; you'll have to make sure of that yourself before running this.
