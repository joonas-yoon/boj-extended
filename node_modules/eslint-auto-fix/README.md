# eslint-auto-fix

![example usage with a text editor](https://raw.githubusercontent.com/Pilatch/eslint-auto-fix/master/readme-stuff/text-editor-example.png)

Watches your files for changes, runs them through ESLint's fix function, then overwrites them if they have been fixed.

Uses your existing ESLint configuration.

It's good for productivity, helping your team conform to whatever JS style guide you choose without worrying about text editor plugins or additional setup. Heck, you could have different projects using totally different style guides, and your developers won't care whether they have to write semicolons or not.

## Installation

```bash
npm i --save-dev eslint-auto-fix
```

## Usage

```bash
npx eslint-auto-fix
```

Or add it to your package.json

```json
{
  "scripts": {
    "fix-js": "eslint-auto-fix"
  }
}
```

Next time you save a file with code like this:

    function qux (foo,bar){
    return foo+bar}

It will be automatically converted into code that adheres to your style guide, so it could become this:

    function qux(foo, bar) {
      return foo + bar;
    }

## Command Line Options

`--verbose` to report whenever a file is fixed.

`--fix-on-startup` to fix all matching files when this task starts. The default is to only fix files when they are changed.

`[globs-to-watch]` are all the file globs you want eslint-auto-fix to watch. You can pass multiple globs.

Example:

```bash
npx eslint-auto-fix "src/**/*.js" "cli.js" "bin/*.js"
```

## Quote 'em!

Because your shell loves to expand `*` characters, you'll probably want to put these in quotes. Otherwise it'll feed a limited number of file paths to eslint-auto-fix, and should you add new files that would match that initial glob, they won't be fixed.

Example:

```bash
npx eslint-auto-fix "lib/*.js"
```

The above will probably do what you want. If a new file is added in the `lib` folder, eslint-auto-fix will watch it and fix it automatically without requiring you to restart the process.

However:

```bash
npx eslint-auto-fix lib/*.js
```

Without the quotes this will only watch the `.js` files that are present in the `lib` folder at the time this process starts.

## Defaults

If you don't provide the file globs to watch, it will watch all files in your project ending in `.js`.

## Peer Dependency

This module has a peer dependency on [ESLint](https://www.npmjs.com/package/gulp-eslint). If you don't already have that installed in your project, add it to your "devDependencies" in package.json. If anything weird is going on, check the version requirements and let me know.

## Limitations

What can be fixed is limited by what ESLint can fix. See their [rules page](https://eslint.org/docs/rules/) for all the fixable rules.
