<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

Scripts to help migrate [accessibility-insights-web](https://github.com/microsoft/accessibility-insights-web) to use strict null checks.

Based closely on the VS Code team's [vscode-strict-null-check-migration-tools](https://github.com/mjbvz/vscode-strict-null-check-migration-tools). See their excellent [migration write-up](https://code.visualstudio.com/blogs/2019/05/23/strict-null)!

## Usage

Use the `package.json` run-scripts in the root-level `package.json` (Note that if you have Hadoop YARN installed, you will need to replace `yarn` with `yarnpkg` in the commands below):

```bash
$ # Print out a markdown-checklist of files that would be good candidates to update for null-safety
$ yarn null:find

$ # For each file in the null:find list, automatically add it to tsconfig.strictNullChecks.json
$ # if-and-only-if doing so does not introduce any new "yarn null:check" violations.
$ yarn null:autoadd

$ # Keep this command running on the side while you're fixing up null:check issues
$ yarn null:check --watch
```
